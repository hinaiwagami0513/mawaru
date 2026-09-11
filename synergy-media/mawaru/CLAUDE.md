# CLAUDE.md — マワル

マワル = SNS投稿管理 + AI生成 SaaS（Instagram / X / TikTok / YouTube）。
Stack: Next.js + Tailwind CSS v4 + shadcn/ui + Tabler icons。`DESIGN.md` から globals.css を生成、手で触らない。
ワイヤーHTML群は `mawaru_board/`（`board.html` がエントリ、`flow_*_wire.html` が各フロー）。

すべて `synergy-media/mawaru/` 配下で完結する。他グループ（honeytouch / smart-lottery / green-upcycle / ship-inc）のファイルは読まない・流用しない（ルート `CLAUDE.md` の跨ぎ参照禁止）。

## 中身

```
DESIGN.md               デザインの唯一の源泉
mawaru-vault/          設計・仕様ナレッジ（INDEX.md が入口）
mawaru_board/             ワイヤーHTML群
tools/                  作業用スクリプト（collect-worklog.sh = 日次ログの素材集め）
mawaru-knowledge.md    旧ナレッジ（852行・vault化済み / 単体参照しない）
```

## 日次の作業ログ

その日やったことは `mawaru-vault/raw/worklog-YYYY-MM.md` に**新しい日を上に**足す。取引先共有の原本。
素材は `tools/collect-worklog.sh [YYYY-MM-DD]` でその日のコミット・差分・未コミット変更を出してから書く。
**公開リポジトリなので報酬・請求・契約と社外秘の議題は書かない。**

## 知識の引き方

- 設計・仕様の詳細は `mawaru-vault/` にある。まず `mawaru-vault/INDEX.md` を読み、必要なページだけ開く。全読みしない。
- 画面/機能 → `mawaru-vault/entities/`、判断/パターン → `mawaru-vault/concepts/`、一次情報 → `mawaru-vault/raw/`。
- ※ 旧 `mawaru-knowledge.md` は vault 化済み。古い値が残っているので単体で参照しない。

## 裁定ルール（矛盾したらこれ）

- デザイン（色・角丸・タイポ・トークン・部品）は `DESIGN.md` が唯一の源泉。
- プロダクト仕様は最新の会議 / worklog が正。
- 迷ったら `mawaru-vault/concepts/superseded.md`。旧仕様（Tailwind禁止・C.pr短縮名・絵文字SNS・角丸28・weight800 等）を復活させない。

## vault の更新手順（議事録を渡されたとき）

1. 議事録は `mawaru-vault/raw/mtg-YYYY-MM-DD-〇〇.md` に原文尊重で追加（raw は書き換えない）。
2. そこで刷新・変更・廃止された点を洗い出し、波及する `entities/` `concepts/` を更新。
3. 旧方針をひっくり返した箇所は `concepts/superseded.md` に「旧 → 新」で追記。
4. 新規ページを作ったら `INDEX.md` に1行追加。
5. 最後に「どのファイルをどう変えたか」の差分サマリを出す。

## 書き込みルール

1ファイル1トピック・先頭に1行サマリ / 重複を作らず既存を更新 / 間違いは消すか superseded へ /
`raw/` は書き換えない / compiled ページは必ず raw のソースにリンクで裏取り。
