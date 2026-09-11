# wire-checklist（ワイヤーHTML新規作成時のチェックリスト）

> 新しい画面のワイヤーを作るたびにヘッダーとサイドバーがブレる問題への対策。

## 必ず確認: ヘッダーとサイドバー

新規ワイヤーHTML作成時、**ヘッダーとサイドバーは `shell_header_sidebar_wire.html` から正確にコピーする**。
自前で書き直さない。以下が毎回ズレやすいポイント:

### ヘッダー（DESIGN.md Components > ヘッダー）
- 高さ **56px**（SP 48px）
- 左: ページアイコン（Tabler・**`muted-foreground`** 色・20px）+ ページ名（`h3`・`font-weight-h3`）
- 右: ヘルプ `?`（**32px** 丸・`primary` 1.5px outline）+ サイドバートグル `≡`（**36px** 角丸sm・`border` 1px・`muted-foreground`）
- ロゴはヘッダーに置かない（サイドバー上部）

### サイドバー（DESIGN.md Layout + shell_header_sidebar_wire.html）
- 幅 **250px**、背景 **`surface`**（`card` ではない）
- ロゴ: 高さ24px、`margin-bottom:14px`
- 投稿作成ボタン: `primary` 背景、`radius-md`
- ナビ: `radius-md`、テキスト色 `foreground`、アイコン色 `#6b6864`、アクティブ= `primary-subtle` bg + `primary` 色
- chevron: マワルドライブ・その他・設定に `ti-chevron-down`
- footer: アップグレード（グラデーションボタン）+ スイッチャー（`border-strong` 枠・`radius-md`）

### `.ti` アイコンの `:before` ルール
font-face の woff2 だけでは表示されない。使う全アイコンの `:before{content:"\xxxx"}` ルールを書くこと。
既存ワイヤーからコピーするか、Tabler Icons のコードポイント表を参照。

## `<button>` の中身を `<span>` で組んだら display を必ず当てる

カードを `<button>` にして中身を `<span>` で並べる書き方をよくやるが、**span は inline のまま**なので
`aspect-ratio` / `overflow:hidden` / `width` / 縦の `padding` が効かない。
サムネの高さが 0 になり、中の絶対配置バッジが極細の箱に押し込まれて**1文字ずつ縦に折れる**。

実例: `ads_wire.html` の「なにを広告にしますか？」の投稿カード（2026-08-18 指摘）。
`.pick .th` が `aspect-ratio:16/10` を持っていたのに span だったのでサムネが消え、
「反応 いちばん」バッジがタイトルに重なって縦書きになっていた。

- 親（`.pick`）に `display:flex; flex-direction:column`
- 子（`.th` `.bd` `.t`）に `display:block`
- バッジには `white-space:nowrap`
- **潰れていたサムネが復活すると1列レイアウトで高さが爆発する**。`@media` 側で横並びの行に組み替える
  （`.pick{flex-direction:row}` + `.th{width:120px;aspect-ratio:1}`）。潰れている間は誰も気づかないので一緒に直す。

選択中の枠を `border:1px → 2px` で太らせると中身が1pxずれて跳ねる。
padding で相殺できない部品は **`box-shadow: inset 0 0 0 1px`** で太く見せる。

## コピー元
- CSS + HTML の正規版: **`shell_header_sidebar_wire.html`**（ダッシュボード）
- DESIGN.md の Layout / Components > ヘッダー 節

関連: [[design-tokens]] / DESIGN.md
