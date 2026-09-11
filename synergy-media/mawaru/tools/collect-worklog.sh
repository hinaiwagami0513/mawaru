#!/usr/bin/env bash
# その日の マワル の作業を素材として集める。worklog を書くときの入力。
#
#   tools/collect-worklog.sh              # 今日
#   tools/collect-worklog.sh 2026-08-21   # 日付指定
#
# 文章にはしない。コミット・差分・未コミットの変更をそのまま出すだけ。
# 日本語の要約は worklog-YYYY-MM.md 側で人（か自動化エージェント）が書く。
#
# 集める先は2種類ある。
#   1. メインリポジトリ（dev）の synergy-media/mawaru 配下
#   2. その直下にネストしたワークスペースリポジトリ
# どちらも linked worktree まで見る。Superset はワークスペースごとに空リポジトリと
# worktree を作るので、作業がそこに入ることがある。名前も場所も作り直すたびに変わる
# （前は iineAI、今は i）ため、固定で書かず毎回探す。
#
# 素材が1件も無い日は最後に <!-- WORKLOG:NO-MATERIAL --> を出す。呼び出し側は
# これを見て「何も書かない」を判断する。ワークスペースリポジトリの .gstack のような
# 作業ではない差分を数えると、毎日「変更あり」になって空のログが積まれる。
#
# /bin/bash が 3.2 なので、連想配列と空配列の素の展開は使わない。
set -euo pipefail

DAY="${1:-$(date +%F)}"
SCOPE="synergy-media/mawaru"
MAIN_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
PROJECT_DIR="$MAIN_ROOT/$SCOPE"
TODAY="$(date +%F)"
DIFF_LINES="${DIFF_LINES:-400}"

# macOS の date。翌日00:00を上限にしてその日ぶんだけ取る
NEXT="$(date -jf %F -v+1d "$DAY" +%F)"
WD="$(LC_ALL=ja_JP.UTF-8 date -jf %F "$DAY" +%a)"

# ワークスペースリポジトリ側の「作業ではないもの」。gstack/Superset が置く分。
NOISE=(
  ':(exclude).gstack'
  ':(exclude,glob).gstack/**'
  ':(exclude).superset'
  ':(exclude,glob)**/.DS_Store'
)

# BUF は「今どこに書くか」。セクション単位で一時ファイルに差し替えるので、
# 片付けは差し替えの影響を受けない MAIN_BUF 側で持つ
MAIN_BUF="$(mktemp)"
BUF="$MAIN_BUF"
trap 'rm -f "$MAIN_BUF"' EXIT
HAS_MATERIAL=0

# ---------- 探索 ----------

# PROJECT_DIR 直下のネストしたリポジトリを1行ずつ出す。深く潜ると node_modules で重い
nested_repos() {
  local d
  for d in "$PROJECT_DIR"/*/; do
    [ -d "$d" ] || continue
    [ -e "${d}.git" ] || continue
    git -C "$d" rev-parse --git-dir >/dev/null 2>&1 || continue
    ( cd "$d" && pwd )
  done
}

# リポジトリに紐づく working tree を1行ずつ出す（本体 + linked worktree）。
# worktree list には消えたパスが残ることがあるので存在確認する
repo_worktrees() {
  local p
  git -C "$1" worktree list --porcelain 2>/dev/null | sed -n 's/^worktree //p' | \
  while IFS= read -r p; do
    [ -n "$p" ] && [ -d "$p" ] && printf '%s\n' "$p"
  done
}

# ---------- 出力の部品 ----------

# その日のコミット。$1=リポジトリ, $2以降=pathspec（無しなら全体）
# 全 worktree のブランチを拾うため --all。重複コミットは git 側で1回にまとまる
commits_section() {
  local dir="$1"; shift
  local list first last
  list="$(git -C "$dir" log --all --since="$DAY 00:00" --until="$NEXT 00:00" \
            --format='%h' -- "$@" 2>/dev/null || true)"
  [ -n "$list" ] || return 1
  {
    echo "### コミット"
    echo
    git -C "$dir" log --all --since="$DAY 00:00" --until="$NEXT 00:00" \
      --format="#### %h %ad %s%n%n%b" --date=format:"%H:%M" -- "$@" 2>/dev/null || true
    echo
    first="$(printf '%s\n' "$list" | tail -1)"
    last="$(printf '%s\n' "$list" | head -1)"
    # 親が無い最初のコミットだと $first~1 が引けない。その時は統計を諦める
    if git -C "$dir" rev-parse --verify --quiet "$first~1" >/dev/null 2>&1; then
      echo "### 差分統計"
      echo
      git -C "$dir" diff --shortstat "$first~1" "$last" -- "$@" 2>/dev/null || true
      echo
      echo "### 変更ファイル"
      echo
      git -C "$dir" diff --name-only "$first~1" "$last" -- "$@" 2>/dev/null | sed "s|^$SCOPE/||" || true
      echo
    fi
  } >> "$BUF"
  return 0
}

# 未コミットの変更。$1=working tree, $2=見出しに出す名前, $3以降=pathspec
# 未コミットは「今の状態」なので当日を集めるときだけ意味がある。過去日に混ぜると
# その日にやっていない作業を書いてしまう
dirty_section() {
  local dir="$1" name="$2"; shift 2
  local out stat total
  [ "$DAY" = "$TODAY" ] || return 1
  out="$(git -C "$dir" status --porcelain -- "$@" 2>/dev/null || true)"
  [ -n "$out" ] || return 1
  {
    echo "### 未コミットの変更（${name} / この時点）"
    echo
    printf '%s\n' "$out"
    echo
    stat="$(git -C "$dir" diff --shortstat -- "$@" 2>/dev/null || true)"
    if [ -n "$stat" ]; then
      printf '%s\n' "$stat"
      echo
      # コミットしていない作業も作業ログに載せる。diff 全文は長すぎるので頭だけ。
      # ここを読んで「何をしたか」を起こす。切れている場合は切れた旨を書く。
      echo "#### 未コミット diff（先頭 ${DIFF_LINES} 行）"
      echo
      total="$(git -C "$dir" diff -- "$@" 2>/dev/null | wc -l | tr -d ' ')"
      # head だと git 側が SIGPIPE で死んで pipefail に拾われる。awk なら最後まで読む
      git -C "$dir" diff -- "$@" 2>/dev/null | awk -v n="$DIFF_LINES" 'NR<=n' || true
      if [ "$total" -gt "$DIFF_LINES" ]; then
        echo
        echo "（diff は全 ${total} 行。上は先頭 ${DIFF_LINES} 行だけ）"
      fi
    fi
  } >> "$BUF"
  return 0
}

# ---------- メインリポジトリ ----------

# ネストしたリポジトリはメイン側から見ると untracked ディレクトリ1個に見える。
# それを数えると作業ゼロの日も「変更あり」になるので、メイン側では除外して
# リポジトリとして別に見る
MAIN_EXCL=()
NESTED=""
while IFS= read -r r; do
  [ -n "$r" ] || continue
  NESTED="${NESTED}${r}
"
  MAIN_EXCL+=( ":(exclude)${r#$MAIN_ROOT/}" )
done < <(nested_repos)

NESTED_COUNT="$(printf '%s' "$NESTED" | grep -c . || true)"

{
  # 変数の直後に全角文字を置くと bash が変数名の一部と読むので必ずブレースで囲む
  echo "# ${DAY}（${WD}） マワル 作業素材"
  echo
  echo "メイン: $MAIN_ROOT / 対象: $SCOPE"
  echo "ワークスペースリポジトリ: ${NESTED_COUNT}件"
  echo
  echo "## メインリポジトリ（${SCOPE}）"
  echo
} >> "$BUF"

MAIN_FOUND=0
if commits_section "$MAIN_ROOT" "$SCOPE"; then MAIN_FOUND=1; fi
while IFS= read -r wt; do
  [ -n "$wt" ] || continue
  if [ "$wt" = "$MAIN_ROOT" ]; then
    label="$SCOPE"
  else
    label="worktree ${wt##*/}"
  fi
  if dirty_section "$wt" "$label" "$SCOPE" ${MAIN_EXCL[@]+"${MAIN_EXCL[@]}"}; then MAIN_FOUND=1; fi
done < <(repo_worktrees "$MAIN_ROOT")

if [ "$MAIN_FOUND" = "1" ]; then
  HAS_MATERIAL=1
else
  echo "（この日の変更なし）" >> "$BUF"
  echo >> "$BUF"
fi

# ---------- ワークスペースリポジトリ ----------

while IFS= read -r repo; do
  [ -n "$repo" ] || continue
  SEC="$(mktemp)"
  # 一旦別ファイルに書いて、中身があるときだけ本体に足す。空の見出しを積まない
  SAVE="$BUF"; BUF="$SEC"
  FOUND=0
  if commits_section "$repo"; then FOUND=1; fi
  while IFS= read -r wt; do
    [ -n "$wt" ] || continue
    if [ "$wt" = "$repo" ]; then
      label="本体"
    else
      label="worktree ${wt##*/}"
    fi
    if dirty_section "$wt" "$label" "${NOISE[@]}"; then FOUND=1; fi
  done < <(repo_worktrees "$repo")
  BUF="$SAVE"
  if [ "$FOUND" = "1" ]; then
    {
      echo "## ワークスペース: ${repo##*/}"
      echo
      echo "パス: $repo"
      echo
      cat "$SEC"
    } >> "$BUF"
    HAS_MATERIAL=1
  fi
  rm -f "$SEC"
done < <(printf '%s' "$NESTED")

# ---------- 仕上げ ----------

cat "$BUF"
if [ "$HAS_MATERIAL" = "0" ]; then
  echo
  echo "<!-- WORKLOG:NO-MATERIAL -->"
fi
