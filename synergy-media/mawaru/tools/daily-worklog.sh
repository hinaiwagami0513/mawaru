#!/usr/bin/env bash
# その日の作業ログを md に書いてスプレッドシートに送る。毎日23:00に launchd から呼ばれる。
#
#   tools/daily-worklog.sh              # 今日
#   tools/daily-worklog.sh 2026-08-21   # 日付指定
#   tools/daily-worklog.sh --backfill   # md に無い過去の日を古い順に埋める（既定14日ぶん）
#   tools/daily-worklog.sh --backfill 30
#   DRY=1 tools/daily-worklog.sh        # 生成だけして書き込まない（標準出力に出す）
#
# 役割分担:
#   collect-worklog.sh … git から素材を集める
#   claude -p          … 素材を読んで md のセクションを書く。ツールは全部止めてあるので
#                        ファイルもネットも触らない（生成だけ）
#   insert-worklog.py  … md に差し込む
#   worklog-to-sheet.py… シートに送る
#
# ★なぜ --backfill が要るか（2026-08-28 に発覚）
#   23:00 の StartCalendarInterval は、その時刻に **電源が入っていないと発火しない**。
#   スリープなら起きた時に取り返すが、シャットダウンしていた日は取り返さず次の23:00に
#   再セットされるだけ。毎晩20〜21時に落としていたため 8/25〜8/28 が丸ごと欠けた
#   （launchctl print の runs=0 で確認）。
#   そこでログイン時に走る別ジョブ（jp.shipinc.mawaru.worklog.catchup）から --backfill を
#   呼び、md に無い日を後から埋める。insert-worklog.py も worklog-to-sheet.py も
#   「同じ日は差し替え」なので、二重に走っても行は増えない。
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"
VAULT_RAW="$ROOT/mawaru-vault/raw"
LOGDIR="$HOME/Library/Logs"
mkdir -p "$LOGDIR"
LOG="$LOGDIR/mawaru-worklog.log"
# 「昨日ぶんを書き直した日」を覚えておく印（backfill が1日に何度も走らないように）
REFRESH_MARK="$LOGDIR/.mawaru-worklog-refreshed"

# PATH は launchd から呼ばれると最小限になる。claude(volta) と git を通す
export PATH="$HOME/.volta/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

log() { printf '%s %s\n' "$(date '+%F %T')" "$*"; }

# md にその日のセクションが既にあるか
has_section() {
  local day="$1" file="$VAULT_RAW/worklog-${1:0:7}.md"
  [ -f "$file" ] && grep -q "^## ${day}（" "$file"
}

run() {
  local DAY="$1"
  log "start ${DAY}"

  MAT="$(mktemp)"; PROMPT="$(mktemp)"; SECTION="$(mktemp)"
  trap 'rm -f "$MAT" "$PROMPT" "$SECTION"' RETURN

  DIFF_LINES=400 "$DIR/collect-worklog.sh" "$DAY" > "$MAT"

  # コミットも未コミット変更も無い日は書かない。空セクションを積むと読みにくくなる。
  # 判定は collect 側が出す印を見る。日本語の文言を grep していると、素材の書式を
  # 変えたときに黙って「毎日書く」に倒れる（ワークスペースリポジトリを足したとき
  # 実際にそうなった）
  if grep -qx '<!-- WORKLOG:NO-MATERIAL -->' "$MAT"; then
    log "変更なし。何も書かない"
    return 0
  fi

  # 未コミット diff は「いつやったか」を持たないので、前日ぶんが残っていると
  # 今日の作業として二重に書かれる。既に書いた分を渡して避けさせる。
  ALREADY="$VAULT_RAW/worklog-$(echo "$DAY" | cut -c1-7).md"
  {
    cat "$DIR/worklog-prompt.md"
    if [ -f "$ALREADY" ]; then
      printf '\n---- すでに作業ログに書いてある分（重複させない）----\n\n'
      awk 'NR<=200' "$ALREADY"
    fi
    printf '\n---- ここから素材 ----\n\n'
    cat "$MAT"
  } > "$PROMPT"

  # 生成のみ。ツールを止めて「渡した素材だけで書く」状態にする
  if ! claude -p --model opus \
      --disallowedTools "Bash Edit Write Read Glob Grep Task WebFetch WebSearch NotebookEdit TodoWrite" \
      < "$PROMPT" > "$SECTION"; then
    log "ERROR claude の生成に失敗"
    return 1
  fi

  if [ ! -s "$SECTION" ]; then
    log "ERROR 生成結果が空"
    return 1
  fi

  if [ "${DRY:-0}" = "1" ]; then
    log "DRY=1 なので書き込まない。生成結果:"
    cat "$SECTION"
    return 0
  fi

  "$DIR/insert-worklog.py" "$DAY" "$SECTION" || { log "ERROR md への差し込みに失敗"; return 1; }
  "$DIR/worklog-to-sheet.py" "$DAY"          || { log "ERROR シートへの送信に失敗"; return 1; }

  log "done ${DAY}"
}

# この日より前は埋めない。自動化を入れる前の期間まで遡ると、当時のコミットを
# 今さら claude に書かせることになる（md に無いのは「取りこぼし」ではなく
# 「まだ仕組みが無かった」だけ）。自動化の初日を下限に置く。
BACKFILL_FLOOR="2026-08-22"

# md に無い過去の日（昨日まで）を古い順に埋める。今日は 23:00 のジョブに任せる。
# 素材が無い日（休んだ日）は run の中で打ち切られるので md に載らない。つまり
# 毎回 collect だけ走り直すが、git を1回舐めるだけなので放っておいてよい。
backfill() {
  local back="${1:-14}" i day yesterday failed=0 targets=""
  yesterday="$(date -j -v-1d +%F)"

  for (( i = back; i >= 1; i-- )); do
    day="$(date -j -v-"${i}"d +%F)"
    if [[ "$day" < "$BACKFILL_FLOOR" ]]; then continue; fi
    # 昨日だけは md にあっても書き直す。23:00 より前に一度書いた日は、その後の
    # 作業が入っていない途中の状態で固まる（md にある＝スキップ、になるため）。
    # 日が変わればその日はもう伸びないので、ここで1回だけ確定させる。
    # 「1回だけ」は印で担保する。1日に何度もログインすると、そのたび claude を
    # 走らせることになるため。
    if [ "$day" = "$yesterday" ]; then
      if [ "$(cat "$REFRESH_MARK" 2>/dev/null)" = "$yesterday" ]; then continue; fi
    elif has_section "$day"; then
      continue
    fi
    targets="$targets $day"
  done

  if [ -z "$targets" ]; then
    log "backfill: 直近${back}日に欠けている日はない"
    return 0
  fi

  log "backfill: 対象${targets}"
  for day in $targets; do
    if run "$day"; then
      [ "$day" = "$yesterday" ] && printf '%s\n' "$yesterday" > "$REFRESH_MARK"
    else
      failed=1
      log "backfill: ${day} で失敗。次の日に進む"
    fi
  done
  return "$failed"
}

main() {
  case "${1:-}" in
    --backfill) backfill "${2:-14}" ;;
    *)          run "${1:-$(date +%F)}" ;;
  esac
}

if [ "${DRY:-0}" = "1" ]; then
  main "$@"                 # 手で確かめるときは画面に出す
else
  main "$@" >> "$LOG" 2>&1  # 自動実行はログファイルへ
fi
