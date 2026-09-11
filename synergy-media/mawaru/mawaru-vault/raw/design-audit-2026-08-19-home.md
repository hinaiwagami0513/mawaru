# デザイン監査 — いいねAI ホーム画面

> 一次情報。/design-review を監査モードで回した生の結果。**書き換えない。**
> 整理結果や判断は DESIGN.md / concepts 側に書く。
> 修正は未実施（この時点のコードは commit cb7056d）。

- 対象: `http://localhost:5173/shell_header_sidebar_wire.html`
- 日付: 2026-08-19
- 基準: `iine_ai/synergy-media/iine-ai/DESIGN.md`
- モード: 監査のみ（修正・コミットなし）
- 受けている指摘: 「デザインが全体的にAIっぽく単調」「もっとぱっと見でわかる感じがいい」

## First Impression

画面は**手際のよさ**を伝えている。情報は整っていて、日本語も平易で、迷う言葉がない。

目が最初に行く3つ: ①オレンジの「投稿を作る」ボタン ②「12」の大きな数字 ③キツネのイラスト。
このうち意図どおりなのは①だけ。②は4つ並んだ数字のうち左端が偶然大きく見えているだけで、
**一番見てほしい「確認待ち 2件」には最後まで目が行かない**。

ひとことで言うと: **平ら**。

### Page Area Test

| 領域 | 2秒で用途が言えるか |
|---|---|
| あいさつ + CTA | ○ 「今日何をするか」 |
| NEWS / ToDo / チャット | ○ 「お知らせ3種」 |
| 今の状況 | △ 「数字4つ」だが、どれが重要か言えない |
| 今週の投稿予定 | ○ 「カレンダー」 |
| 今月の作業時間 | ○ |

## 実測データ

### カード（12コンテナ）

| クラス | 寸法 | 角丸 | 枠 | 影 | 背景 |
|---|---|---|---|---|---|
| db-hello | 936×136 | 20px | 1px #e9e8e6 | **なし** | 純白 |
| db-mini ×3 | ~300×186 | 16px | 1px #e9e8e6 | **なし** | 純白 |
| db-stat ×4 | 224×136 | 16px | 1px #e9e8e6 | **なし** | 純白 |
| db-week | 936×156 | 16px | 1px #e9e8e6 | **なし** | 純白 |
| db-work | 936×266 | 16px | 1px #e9e8e6 | **なし** | 純白 |
| db-help | 936×86 | 16px | 1px #e9e8e6 | **なし** | 純白 |

**影を持つカード: 0 / 6。背景が純白でないコンテナ: 0 / 12。**

### セクション間の余白

| セクション | 高さ | 次との間隔 |
|---|---|---|
| db-hello | 136 | 22px |
| db-tri | 186 | 22px |
| db-sec（今の状況） | 178 | 22px |
| db-sec（投稿予定） | 198 | 22px |
| db-sec（作業時間） | 308 | 22px |
| db-sec（ヘルプ） | 86 | 22px |

**6セクション全部が同じ22px。**

### タイポグラフィ

| クラス | 内容 | サイズ / ウェイト |
|---|---|---|
| hi | こんにちは、犬カフェOne さん | 20px / 700 |
| tt | NEWS・ToDo・チャット | 16px / 700 |
| tt | 今の状況 | **20px / 700** |
| nm | 今週 投稿した | 14px / 700 |
| val | 12件 | 30px / 900 |

フォントは `Noto Sans JP` のみ（+アイコンフォント）。DESIGN.md 準拠。

---

## findings

### F1 — 影スケールが3段とも完全に未使用（HIGH / elevation）

DESIGN.md §Elevation & Depth は具体値まで確定している:

> **card**: `0 1px 2px rgb(0 0 0 / 0.06)` — 一覧カード・入力の**常時影**

実測は `box-shadow: none` が 6/6。**「常時影」と書かれた影が一箇所も出ていない。**
`raised` と `overlay` も同様に未使用。

これが「単調」の一番大きな原因。面が浮いていないので、12個のコンテナが
すべて同じ紙の上の同じ高さに並んで見える。

**直し方**: `.db-card` と `.db-hello` に `card` の影を当てる。ホバーする要素は `raised` へ。

### F2 — ヒーローのグラデーションが定義済みなのに未使用（HIGH / hierarchy）

DESIGN.md §Elevation & Depth:

> ヒーロー: `linear-gradient(135deg, {colors.primary-subtle} 0%, {colors.card} 100%)`

実測 `background-image: none`。あいさつ枠は**ただの白いカード**で、下の NEWS カードと
見分けがつかない。

ページの主役が主役に見えていない。これは「ぱっと見でわかる」に直接効く。

**直し方**: `.db-hello` に定義済みのヒーローグラデを当てる。1行で済む。

### F3 — セクションのリズムが無い（HIGH / spacing）

6セクションの間隔が全部 **22px**。DESIGN.md §Layout は:

> 余白は 4px グリッド。**リズム: related items closer together, distinct sections further apart**

22px は 4px グリッドから外れている（20 か 24 が正）。さらに全部同値なので、
「あいさつ」と「今の状況」の間と、「今の状況」と「投稿予定」の間が同じ重みに見える。

AI slop blacklist #10「cookie-cutter section rhythm」に該当。

**直し方**: 大セクション間を 32px、セクション内の要素間を 16px に分ける。値は4pxグリッドから取る。

### F4 — ヒーローとセクション見出しが同じ階層（HIGH / typography）

`こんにちは、犬カフェOne さん` = 20px/700
`今の状況` = 20px/700

**まったく同じ。** ページの主役と、その下の一区画のラベルが同じ声量で喋っている。
DESIGN.md §Typography「階層は主にウェイトと余白で作る」に反する。

**直し方**: あいさつを `h1`(30px/900) 級に上げる、もしくはセクション見出しを `h3`(16px) に下げる。
DESIGN.md は 900 を「display / h1（30px以上）専用」としているので、上げる場合は30px以上にする。

### F5 — 3枚並び → 4枚並びの等幅カードグリッド（HIGH / AI slop）

`db-mini` 3枚（~300×186、寸法ほぼ同一）→ `db-stat` 4枚（224×136、寸法完全同一）。
どちらもアイコン + 見出し + 本文の同じ構成が横に反復する。

AI slop blacklist #2「The 3-column feature grid: icon + bold title + description, repeated 3x
symmetrically. THE most recognizable AI layout」に直撃。

**直し方**: 均等分割をやめる。ToDo は件数が多いので広く、NEWS は1件だけなので狭く、
のように**中身の量で幅を変える**（`grid-template-columns: 1.2fr 1fr 1fr` など）。
KPI 4枚は「確認待ち」だけ広げる。

### F6 — 角丸の階層が潰れている（MEDIUM / shapes）

DESIGN.md §Shapes:

> ボタン・入力・**小カード = `md`**(12) / 大きめカード・sheet = `lg`(16)

実測: `db-stat`（224px の小カード）も `db-mini`（300px）も `db-card`（936px）も**全部 16px**。
小カードが `md` を使っていない。

角丸が全部同じだと、大小の区別が形からも消える。AI slop blacklist #5
「Uniform bubbly border-radius on every element」に該当。

**直し方**: `db-stat` / `db-mini` を 12px に落とす。936px 幅のカードは 16px のまま。

### F7 — `.tt` が同じクラス名で2つのサイズを持つ（MEDIUM / consistency）

`.tt` の実測サイズ = `["16px", "20px"]`。ミニカードでは16px、セクション見出しでは20px。
同じクラス名が2つの役割を兼ねているので、次に触る人が必ず踏む。

**直し方**: セクション見出しを `.sec-tt` のように分ける、もしくは `.db-mini .tt` / `.db-sec-h .tt`
のスコープを明示する（後者は既にそうなっているが、クラス名が同じままなので混乱は残る）。

### F8 — タッチターゲットが44px未満（MEDIUM / interaction）

| 要素 | 実測 |
|---|---|
| もっと見る / すべて見る / カレンダーを見る | 高さ **18px** |
| 開く | 39×18px |
| おすすめチップ ×2 | 高さ **30px** |

DESIGN.md のチェックリストは「タッチ領域 44px 以上」。18px は指で押せない。

**直し方**: リンクに縦 padding を足して 44px の当たり判定を作る（見た目は変えなくてよい）。

---

## スコア

| カテゴリ | 評点 | 理由 |
|---|---|---|
| Visual Hierarchy | **D** | F2・F4・F5。主役が主役に見えない |
| Spacing & Layout | **C** | F3。全部22pxでリズムなし。グリッド外の値 |
| Elevation | **F** | F1。定義済みの3段が一つも使われていない |
| Typography | **B** | フォントは1つ、スケールは概ね準拠。F4・F7が減点 |
| Color & Contrast | **A** | 直近で11系統→6系統に整理済み。残りは全部意味を持つ |
| Shapes | **C** | F6。角丸の階層が潰れている |
| Interaction | **C** | F8。cursor:pointer は全要素OK、hoverもあり |
| Content | **A** | 日本語が平易。happy talk なし。指示文なし |
| **AI Slop** | **D** | F5（3列グリッド）+ F3（等間隔）+ F6（一律角丸） |
| Performance | **A** | TTFB 3ms、domParse 30ms、consoleエラーなし |

**Design Score: C / AI Slop Score: D**

AI slop の正体は色ではなく**形の均質さ**。純白・1px枠・16px角丸・影なし・22px間隔が
12コンテナすべてに等しく当たっているので、どこを見ればいいかの手がかりが画面に無い。

## Quick Wins（各10分以内、この4つで印象が変わる）

1. **F2** — `.db-hello` に定義済みヒーローグラデを当てる（CSS 1行）
2. **F1** — `.db-card` に `card` の影を当てる（CSS 1行）
3. **F6** — `db-stat` / `db-mini` の角丸を 12px に（CSS 2行）
4. **F3** — セクション間を 22px → 32px、`db-tri` 内を 16px に（CSS 2行）

いずれも DESIGN.md に**すでに書かれている仕様を実装するだけ**で、新しい判断は要らない。

## 対象外にしたもの

- **レスポンシブ**: `.app{width:1240px}` の固定幅ワイヤーなので、モバイル評価は対象外。
  実プロダクト（Next+shadcn）側で別途評価が必要。
- **モーション**: ワイヤーにアニメーションがほぼ無い。実装段階の話。
- **キツネ素材**: `iine-fox-worried.png` が暫定（`顔だけ.png` のコピー）。
  顔アップの困り顔が1枚必要。仕様は `iine_board/assets/README-fox-worried.txt`。
