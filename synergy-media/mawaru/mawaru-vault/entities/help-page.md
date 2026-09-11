# help-page（ヘルプページ）

> 現行 mawaru-sns.jp/help を freee流IAに作り直した静的プロトタイプが `help_site/` にある（2026-08-16）。文字を読まないユーザー前提の方針は継続。

## 方針（6/19確定・継続）
- テキストより**動画**を優先。図解教材も活用。
- 文字を読まないユーザーが多い現状に対応（40-50代未経験者ターゲット・[[target-first]]）。
- 複雑な機能の使用方法を説明する目的。

## 現行サイト（Next.js / mawaru-sns.jp/help）
- サイドバー + カード羅列。8カテゴリ / 26記事。検索なし・パンくずなし。
- 記事は「STEP 1/2/3」の羅列 + 末尾に目次。
- **内容がワイヤーの現行仕様に追いついていない**（投稿一覧の3タブ・承認フロー・分析3レポート・エディタ・新投稿フローが未記載）。

## 作り直し版（`help_site/` 2026-08-16）
- freee ヘルプセンター流のIA: 検索ファースト → カテゴリ → 記事。10カテゴリ / 51記事。
- 記事の型: 対象プラン・権限・場所 → できること → 手順 → 注意 → FAQ → 役に立ったか → 関連記事。
- **スタックは本番と同じ**: Next.js 15 + Tailwind v4 + [[shadcn-ui]] + [[tabler-icons]]。`output:'export'` で静的書き出し。
- 記事は `content/*.ts` のデータ、描画は `components/article-blocks.tsx`。表示と原稿を分けてある。
- ⌘K の Command パレット検索（かな/カナ・全半角を吸収する自前スコアリング）。
- デザインは [[design-tokens]] 準拠。globals.css で DESIGN.md のトークンを shadcn のトークン名に写している。
- ワイヤー（`mawaru_board/analysis_*` `image_editor_dark` `video_editor_dark` `flow_*` `post_list` `approval_list`）を出典に新機能ヘルプを新規執筆。

### shadcn に入れた手当て（他プロジェクトでも同じ判断をする）
- shadcn CLI が入れる **lucide を Tabler に置換**する（accordion / sheet / dialog / breadcrumb / command の5ファイル）。`iconLibrary: "tabler"` を components.json に書いても CLI は lucide を吐く。
- `CommandDialog` は cmdk の props を通さないので、`commandProps` を足して `shouldFilter:false` にする。日本語検索は自前スコアのほうが当たる。
- Radix の `ScrollArea` Root は inline style で `position:relative` を当てる。**sticky は外側の div に持たせる**（Root に `sticky` を書いても効かない）。
- shadcn の `TableCell/TableHead` は既定が `whitespace-nowrap`。長文の比較表では `whitespace-normal` に戻さないと横にはみ出す。
- **アイコンを自作しない。**若葉マーク（初心者マーク）を自前SVGで描いたが形が安定せず作り直しになった。
  Tabler に無いモチーフは、**同じ意味を持つ既存アイコンに置き換える**（若葉マーク → `IconSeedlingFilled`）。
  例外として画像アセットを持つのはマスコット（🦊）だけ。

## アプリのヘッダー「?」からヘルプに飛ばす（2026-08-16）

各画面のヘッダー右にある **`?` はその画面を説明している記事に直接飛ばす**。トップに落とさない。
迷った人がもう一度探し直す手間をなくすのが目的なので、文脈つきのディープリンクにする。

- 実装は `<a>`。`<button>` + onclick にしない（中クリック・右クリックで新規タブが使えなくなる）。
- `target="_blank" rel="noopener"`。作業中の画面を失わせない。
- `title="このページのヘルプ（画面名）"` / `aria-label="このページのヘルプ"`。
- ベースURLは `https://mawaru-sns.jp/help`。公開先が変わったらここだけ差し替える。
- **ホバーで枠線→塗りつぶし**（`background:primary` / `color:on-primary`、transition .15s）。
  枠線だけだと押せると分からない。[[orange-only-interaction]] のとおりオレンジは押せる合図に使う。

### ヘッダーは共通コンポーネントを使う
`?` が無い画面があったら、それは**ヘッダーが共通化できていない証拠**。個別に `?` を足して回らず、
共通ヘッダー（`.topbar` > `.hdr-left` + `.hdr-right`）に寄せる。右側に `?` が自然と出る。

```html
<div class="topbar">
  <div class="hdr-left"><span class="hdr-page"><i class="ti ti-…"></i> 画面名</span></div>
  <div class="hdr-right">
    <a class="helpbtn" href="…" target="_blank" rel="noopener" …>?</a>
    <button class="close-btn"><i class="ti ti-list-details"></i></button>
  </div>
</div>
```

実例: `analysis_posts_wire` だけ `.topbar` 直下に `.pgic`/`.pgnm` を置く独自シェルで `?` が無かった。
共通ヘッダーに差し替えて解消（2026-08-16）。

| ワイヤー | 画面 | 飛び先 |
|---|---|---|
| `analysis_visual_wire` | 分析 > ビジュアルレポート | `/analytics/visual/` |
| `analysis_report_wire` | 分析 > AIレポート | `/analytics/ai-report/` |
| `analysis_account_wire` | 分析 > アカウント推移 | `/analytics/account-trend/` |
| `analysis_metrics_wire` | 分析 > 数値変化（導入効果） | `/analytics/effect/` |
| `analysis_posts_wire` | 分析 > 投稿レポート | `/analytics/post-report/` |
| `flow_image_v3_wire` / `flow_image_material_wire` | 投稿作成 > 画像 | `/create/image/` |
| `flow_video_script_wire` / `flow_video_material_wire` | 投稿作成 > 動画 | `/create/video/` |
| `flow_manual_wire` | 投稿作成 > 完成品から作る | `/create/upload/` |
| `post_editor_wire` / `post_editor_image_wire` | 投稿詳細・編集 | `/manage/detail/` |
| `post_list_wire` | 投稿一覧 | `/manage/list/` |
| `shell_header_sidebar_wire` | 共通シェル | `/`（トップ） |

## ヘルプアシスタント（2026-08-16）

右下常駐。**3段で答える**。段を飛ばさないのが要点で、いきなりAIに答えさせない。

**非モーダルの浮きカード**にすること（shadcn Popover + `modal={false}`）。
Sheet/Dialog はモーダルなので背面が触れなくなる。ヘルプを読みながら画面を操作するのが
普通の使い方なので、開いたままスクロール・クリックできないと使われない。
外側クリックでは閉じない（`onInteractOutside` を握りつぶす）。閉じるのは × のみ。

1. **該当箇所を出す** — 見出し単位のインデックスで「記事のこの節」まで案内。
   用語を聞かれたら用語集から定義を先に言い切る（探させない）。
2. **原因と対処** — 各記事の「症状→対処」表とFAQから組み立てる。同じ症状は寄せる。
3. **問い合わせ** — 下書きを生成。1〜2で案内した内容が「試したこと」に自動で入るので、
   サポートが同じ確認を繰り返さずに済む。

生成AIの接続点は `lib/assistant.ts` の `registerLlm()` ひとつ。**現時点は未接続**
（Pages はサーバーが無く、ブラウザから直接APIを叩くとキーが露出するため）。
本番に載せるとき Route Handler 経由で繋ぐ。繋がっていなければヘルプ由来の回答に自動で落ちる。

### 日本語検索でハマったこと
- 素朴な n-gram だと「って」「です」まで語になって意味のある語が埋もれる。
  **カタカナ語・漢字語・英数字を主要語として抜く**方式にしたら当たるようになった。
- 「〜されない」「〜できない」は症状語として別に拾う。
- 上位スコアとの**相対しきい値**で足切りしないと、語尾だけ当たった無関係な候補が混ざる。

## ヘルプセンターへの導線を文字で出す（8/19）
設定の「その他」を削除した結果、ヘルプセンターの入口が上部の `?` だけになる。
**`?` アイコンだけでヘルプセンターと分かるか**が疑問視された（奥澤「ヘルプセンターって書いといた方がいいのかな」）。
- 上部（ベル / `?` の並び）に**ヘルプセンターと文字で分かる導線**を足す。
- ただし右上は要素が増えやすい。ニュース（ベル）とお知らせ系は統合して数を抑える（[[settings-page]]）。
- 既存の画面別ディープリンク（下記）はそのまま維持する。
- 別件: 現行ヘルプページに**リンク切れ**がある。確認して修正をプッシュする（8/19タスク）。
- 出典: [[raw/mtg-2026-08-19-iwagami]]

## 用語の注意
投稿一覧の3タブ目は「**予約完了**」（旧「投稿準備完了」から改称）。[[post-list-page]] と表記を揃える。

## 未定・未対応
- スクリーンショット/動画は未挿入（`fig` ブロックの枠だけ用意済み）。ヘルプ動画の制作フローも未定。
- Next.js 実装への移植は未着手。

出典: [[raw/mtg-2026-06-19-iwagami]] / 作り直し版は `help_site/README.md`
