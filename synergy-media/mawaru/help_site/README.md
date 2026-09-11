# help_site — マワル ヘルプセンター（作り直し版）

現行 https://mawaru-sns.jp/help/ を freee ヘルプセンター流の情報設計に作り直したもの。
分析・エディタ・投稿フローの新機能ヘルプを新規に書き足してある。

**スタックは本番と同じ**: Next.js 15（App Router）+ Tailwind CSS v4 + shadcn/ui + Tabler icons。
静的書き出し（`output: 'export'`）なので、`out/` を置くだけで公開できる。

## 見る

**`ヘルプを開く.command` をダブルクリック。**ビルドしてサーバーを立ててブラウザまで開く。
ターミナルのウィンドウを閉じると止まる。

ターミナル派はこちら。

```bash
npm install
npm run dev        # http://localhost:3000
npm run preview    # 本番ビルド → out/ を http://localhost:4321 で配信
npm run typecheck
```

> ⚠️ **`out/index.html` を Finder からダブルクリックしても開かない。**
> `/_next/...` が file:// では解決できないため。かならず上のどれかで見る。
> （以前あった `dist/` は shadcn 版への移行時に削除済み）

## 中身

```
app/
  layout.tsx                  Noto Sans JP / SearchProvider
  page.tsx                    トップ（ヒーロー・カテゴリ・人気・新機能）
  [category]/page.tsx         カテゴリ一覧（generateStaticParams）
  [category]/[slug]/page.tsx  記事
  globals.css                 DESIGN.md のトークンを shadcn のトークン名に写したもの
components/
  ui/*                        shadcn/ui（CLI で入れたもの。手で再実装しない）
  site-header / site-footer / doc-shell / category-nav / toc
  article-blocks              ブロックデータ → shadcn 部品への描画
  article-list / inline / helpful / icons
  search-provider             ⌘K の Command ダイアログ（アプリに1つ）
  help-assistant              右下の「わからないことを聞く」（3段で答えるアシスタント）
content/
  types.ts                    Block / Article / Category の型
  site.ts                     カテゴリの並び / 検索チップ / はじめの4ステップ / 人気記事
  start(6) create(8) editor(8) manage(6) analytics(7)
  learning(4) growth(3) settings(2) contract(4) faq(3)   ← 全51記事
lib/
  content.ts                  記事の平坦化・リンク解決・インライン記法のパース
  help-index.ts               見出し単位のインデックス。⌘K検索とアシスタントの共通土台
                              症状→対処 / FAQ / 用語集も別に索引する
  assistant.ts                アシスタントの中身（3段の流れ + LLM接続点）
public/img/
  logo-mawaru.png            本番の logotype_japanese.png
  fox-support.png             mawaru_board/assets/mawaru-fox-face.png（ヘッドセット付き）
```

## 使っている shadcn コンポーネント

Accordion（FAQ）/ Alert（注意・ポイント・参考）/ Badge（カテゴリ・新機能・プラン）/
Breadcrumb / Button / Card（カテゴリ・STEP・できること・関連）/ Collapsible（左ナビ）/
Command + Dialog（⌘K 検索）/ Input / Popover（アシスタントの浮きカード）/
ScrollArea（左ナビ・アシスタント）/ Separator / Sheet（SPナビ）/
Table（比較表）/ Tooltip

### shadcn に入れた手当て

- **アイコンを Tabler に差し替え**。CLI が入れる `lucide-react` を `@tabler/icons-react` に置換した
  （`accordion` `sheet` `dialog` `breadcrumb` `command` の5ファイル）。
  DESIGN.md / vault `tabler-icons` の「UIのアイコンは全て Tabler」に合わせている。
- **`CommandDialog` に `commandProps` を追加**。cmdk の `shouldFilter` を切って、
  日本語向けの自前スコアリング（`lib/search-index.ts`）で並べるため。

## 現行ヘルプから変えたこと

| | 現行 | この版 |
|---|---|---|
| 入口 | サイドバー + カード羅列 | 検索ファースト（⌘K の Command パレット）+ カテゴリカード |
| 現在地 | なし | パンくず + サイドバーのカテゴリ展開 |
| 記事の型 | STEP見出しの羅列 | 対象プラン/権限/場所 → できること → 手順 → 注意 → FAQ → 役に立ったか → 関連記事 |
| 検索 | なし | 全記事の本文まで含む全文検索 |
| 目次 | ページ末尾 | 右カラム固定 + スクロール追従 |
| カテゴリ | 8 / 26記事 | 10 / 51記事 |

## 新規に書き起こした記事（ワイヤーが実装済みでヘルプに無かったもの）

- 分析: 分析画面の見かた / ビジュアルレポート / AIレポート / アカウント推移 / 投稿レポート / 数値変化（導入効果） / 指標の用語集
- エディタ: エディタの選び方 / 画像編集ルームの基本 / AIで画像を生成する / テキストと素材 / 図形・グラフ・表 / 動画エディタの基本 / テキストとエフェクト / 音を入れる
- 投稿フロー: 投稿作成の全体像 / 画像を作成する / 動画を作成する / 画像台本の読み方 / 投稿文AIレビュー
- 管理: 確認・承認フロー / 投稿タイプ・テンプレート / グループチャット
- ほか: マワルでできること / 画面の見かた / マワルドライブ / 使い分け / うまくいかないときは / プラン別にできること

## 書くときのルール

- 記事は `content/*.ts` のデータだけを触る。表示は `components/article-blocks.tsx` が引き受ける。
- 1記事 = 1つの目的。`can`（このページでできること）を3つ書けないなら記事を割る。
- ブロックの型は `content/types.ts`。手順は `steps`、判断材料は `table`、例外は `note`（point / caution / ref / danger）。
- 記事間リンクは `[表示](カテゴリid/slug)`。`lib/content.ts` が実URLに直す。
- スクリーンショットは `{ t: 'fig', shot: '差し込む画面の説明' }` で枠だけ置ける。画像が用意でき次第 `<img>` に差し替える。
- 仕様の出どころは `mawaru-vault/` と `mawaru_board/*_wire.html`。ワイヤーに無い機能を書かない。
- **A系の shadcn 部品を手で再実装しない**（vault `component-procurement`）。
- **左カラーライン（border-left の色帯装飾）を使わない**。区切りは面の色差・ボーダー・余白で。

## ヘルプアシスタント

右下の「わからないことを聞く」。**非モーダルの浮きカード**（shadcn Popover / `modal={false}`）。
開いたまま背面のページをスクロール・クリックできる。外側クリックでは閉じない
（読みながら画面を触るのが普通の使い方なので）。閉じるのはヘッダーの × か右下のボタン。

聞かれたことに 3段で答える。

1. **該当箇所を出す** — 見出し単位で検索して、記事の「この節」まで案内する。
   用語（リーチ・CTA 等）を聞かれたときは、探させずに定義を先に言い切る。
2. **原因と対処を出す**（「解決しない」を押したとき）— 各記事の「症状 → 対処」表と
   FAQ から、考えられる原因を重複を除いて並べる。
3. **問い合わせへ** — お問い合わせ文の下書きを組み立てる。1〜2で案内した内容は
   「試したこと」として自動で入るので、サポート側が同じ確認を繰り返さずに済む。

### 生成AIを繋ぐとき

`lib/assistant.ts` の `registerLlm()` が唯一の接続点。**いまは未接続**。
GitHub Pages はサーバーが無く、ブラウザから直接 API を叩くとキーが露出するため。

本番（Next.js のサーバーあり）に載せるときは Route Handler を1本立てて、そこ経由で呼ぶ。
該当セクションを `context` として渡してあるので、ヘルプの記述に基づいて答えさせること。
繋がっていれば 2段目の回答が生成文に差し替わり、繋がっていなければヘルプ由来の回答に
自動で落ちる（`SolveResult.origin` で判別できる）。

## 未対応

- スクリーンショット未挿入（`fig` ブロックはまだどの記事にも入れていない）
- 「役に立ちましたか？」は表示のみでサーバー送信なし
- 検索インデックスをクライアントバンドルに同梱している（First Load JS 約280KB）。
  記事が増えて重くなったら別ファイル化して fetch する
