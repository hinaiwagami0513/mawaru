---
version: alpha
name: マワル
description: >
  SNS投稿管理 + AI生成 SaaS。親しみやすくポップ、かつ信頼感のある UI。
  生成りニュートラルを土台に、オレンジ(primary)をインタラクションの主役、青(secondary)を情報の色に据える。
  このファイルが唯一の源泉。globals.css は `export --format css-tailwind` で生成し、手で触らない。
colors:
  # --- Brand（唯一のインタラクション駆動色） ---
  primary: "#fe7235"          # ブランドオレンジ。CTA・アクティブ・リング・サイドバー地は全部これ
  primary-hover: "#d54101"    # ホバー / primary上の文字用（白地に4.58）
  primary-light: "#fea735"    # グラデ相方（= パレットの山吹）
  primary-subtle: "#fff5f1"   # 極薄オレンジ（アクティブ背景・選択中背景）OKLCH彩度0.012
  primary-border: "#ffd6c4"   # primary-subtle と対で使う枠 OKLCH彩度0.052
  primary-deep: "#d54101"     # 塗り面に白文字を乗せるとき（4.62）
  # --- Secondary（情報・補助。押せるものには使わない） ---
  secondary: "#0077ff"        # 青。塗り・アイコン
  secondary-light: "#00c3ff"  # シアン
  secondary-deep: "#0070f0"   # 文字用（白地に4.59）
  secondary-subtle: "#f1f7ff"
  secondary-border: "#c4e0ff"
  on-primary: "#ffffff"       # primary上の文字（※大字/太字前提。後述）
  # --- Neutrals（暖色。純黒・寒色グレー禁止） ---
  background: "#fcf5ef"       # ベースキャンバス（生成り）
  surface: "#fffdfb"         # 薄い浮き背景（旧 bg2）
  card: "#ffffff"            # カード・入力・ポップオーバーの面
  foreground: "#2a2826"      # メインテキスト（純黒ではなく暖色寄り）
  muted-foreground: "#757575" # サブテキスト
  border: "#efe7df"          # 通常ボーダー
  border-strong: "#ddd0c4"   # 強めボーダー（旧 outline）
  input: "#ffffff"           # 入力欄背景
  ring: "#fe7235"            # フォーカスリング
  # --- Semantic states（状態は必ずこの4系統から。新色を作らない） ---
  success: "#008a24"          # 文字・白文字を乗せる地（白地に4.51）
  success-vivid: "#00ac2f"    # 塗り・アイコン（色相145°/輝度0.297/OKLCH彩度0.203）
  success-subtle: "#f3fcf6"
  success-border: "#cff4dc"
  warning: "#ad6201"          # 文字
  warning-vivid: "#fea735"    # 塗り・アイコン
  warning-border: "#ffe6c4"
  warning-subtle: "#fff9f1"
  info: "#0070f0"            # = secondary-deep。情報・作成中ステータス
  info-subtle: "#f1f7ff"
  destructive: "#e90c2a"     # 削除・危険
  on-destructive: "#ffffff"
  destructive-subtle: "#feeef1" # エラー背景
  destructive-border: "#ffd0d8" # エラー面と対で使う枠。他の border と輝度0.71/彩度差0.18で揃えた
  like: "#ef3a58"            # いいね・好調エンゲージメント
  like-subtle: "#feeef1"
  # --- IG アクセント紫 ---
  accent-purple: "#9724ba"
  accent-purple-subtle: "#f5e7f8"
  # --- Chart（データ可視化専用。shadcn Chart の --chart-N に対応） ---
  # primary(#fe7235) を軸にしたオレンジの単一色相ランプ（陽菜指定で 8/22 にオレンジへ再確定）。
  # 1つの量の内訳を「多い順＝濃い順」で見せる。系列ごとに違う色相を割り当てない。
  chart-1: "#fe7235"    # = primary。最大の系列
  chart-2: "#fea735"    # = primary-light
  chart-3: "#ffc276"    # primary-light と primary-border の輝度中間
  chart-4: "#ffd6c4"    # = primary-border
  chart-5: "#fff5f1"    # = primary-subtle。最小の系列
  # --- SNS ブランド（バッジ専用。色は必ず Tabler アイコンとセットで使う） ---
  sns-instagram: "#b02a78"
  sns-instagram-subtle: "#fce7f3"
  sns-x: "#2a2826"
  sns-x-subtle: "#fcf5ef"
  sns-tiktok: "#0a6f66"        # ティール。旧値 #854f0b は warning(#ad6201) と近く警告に見えた（8/24修正）
  sns-tiktok-subtle: "#e5fbf7" # 旧値 #fef3c7 も warning-border(#ffe6c4) と近かった
  sns-youtube: "#c4302b"
  sns-youtube-subtle: "#fcebeb"
  # --- エディタ（ダーク）テーマ：画像/動画エディタ専用。実測から確定 ---
  editor-bg: "#1e1a17"          # 最暗・キャンバス
  editor-surface: "#272320"     # パネル面
  editor-elevated: "#3a3530"    # カード/入力/ホバー（最頻の暖色ダーク）
  editor-stage: "#000000"       # 動画プレビュー背景（純黒）
  editor-foreground: "#f5f3f0"  # 暖色オフホワイト文字（slate #e2e8f0 は使わない）
  editor-muted: "#a8a29e"       # 暖色サブ文字
  editor-border: "#403a34"      # 暗背景の境界
typography:
  # Noto Sans JP の静的ウェイトは 400/500/700/900 のみ（600/800 は存在せず使わない）。
  # サイズは本番実装の実測（10/12/14/16/20/30/36px）を正規化した確定値。8px は廃止（小さすぎ）。
  display:
    fontFamily: "Noto Sans JP"
    fontSize: 2.25rem      # 36px
    fontWeight: 900
    lineHeight: 1.15
  h1:
    fontFamily: "Noto Sans JP"
    fontSize: 1.875rem     # 30px
    fontWeight: 900
    lineHeight: 1.2
  h2:
    fontFamily: "Noto Sans JP"
    fontSize: 1.25rem      # 20px
    fontWeight: 700
    lineHeight: 1.4
  h3:
    fontFamily: "Noto Sans JP"
    fontSize: 1rem         # 16px
    fontWeight: 700
    lineHeight: 1.5
  body-lg:
    fontFamily: "Noto Sans JP"
    fontSize: 1rem         # 16px
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Noto Sans JP"
    fontSize: 0.875rem     # 14px
    fontWeight: 400
    lineHeight: 1.6
  body-strong:
    fontFamily: "Noto Sans JP"
    fontSize: 0.875rem     # 14px
    fontWeight: 700
    lineHeight: 1.6
  label:
    fontFamily: "Noto Sans JP"
    fontSize: 0.75rem      # 12px
    fontWeight: 500
    lineHeight: 1.4
  meta:
    fontFamily: "Noto Sans JP"
    fontSize: 0.625rem     # 10px（実装で最多。密なメタ情報用。可読性要注意）
    fontWeight: 500
    lineHeight: 1.5
rounded:
  # preset の --radius: 1rem(16px) を実測確認済み。これが基準＝lg に一致。
  # §3 の 12/16/20/28 と prose の「ボタン8-10/カード12-14」のブレを正規化した確定スケール。
  # これ以外の任意 radius を手打ちしない。
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  full: 9999px
spacing:
  # 4px グリッド。
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  "2xl": 32px
  "3xl": 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 12px
    typography: "{typography.body-strong}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 12px
  button-ghost:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.on-destructive}"
    rounded: "{rounded.md}"
  alert-destructive:
    backgroundColor: "{colors.destructive-subtle}"
    textColor: "{colors.destructive}"
    rounded: "{rounded.md}"
    padding: 12px
  input-default:
    backgroundColor: "{colors.input}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: 10px
  input-focus:
    backgroundColor: "{colors.primary-subtle}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: 16px
  badge-success:
    backgroundColor: "{colors.success-subtle}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
  badge-warning:
    backgroundColor: "{colors.warning-subtle}"
    textColor: "{colors.warning}"
    rounded: "{rounded.full}"
  badge-info:
    backgroundColor: "{colors.info-subtle}"
    textColor: "{colors.info}"
    rounded: "{rounded.full}"
  badge-like:
    backgroundColor: "{colors.like-subtle}"
    textColor: "{colors.like}"
    rounded: "{rounded.full}"
  badge-sns-instagram:
    backgroundColor: "{colors.sns-instagram-subtle}"
    textColor: "{colors.sns-instagram}"
    rounded: "{rounded.full}"
  badge-sns-x:
    backgroundColor: "{colors.sns-x-subtle}"
    textColor: "{colors.sns-x}"
    rounded: "{rounded.full}"
  badge-sns-tiktok:
    backgroundColor: "{colors.sns-tiktok-subtle}"
    textColor: "{colors.sns-tiktok}"
    rounded: "{rounded.full}"
  badge-sns-youtube:
    backgroundColor: "{colors.sns-youtube-subtle}"
    textColor: "{colors.sns-youtube}"
    rounded: "{rounded.full}"
  accent-chip-ig:
    backgroundColor: "{colors.accent-purple-subtle}"
    textColor: "{colors.accent-purple}"
    rounded: "{rounded.full}"
---

## Overview

マワル は「SNS運用を誰でも超効率化できる」ことを売りにした投稿管理 + 生成 SaaS。
トーンは**親しみやすい・ポップ・信頼感**。🦊きつねマスコットがアシスタント兼案内役。

見た目の芯は2つだけ覚えればいい:

1. **暖色ニュートラルの上に、オレンジ1色をインタラクションの主役に据える。** 面は白〜暖色グレー、
   押せるもの・選ばれているもの・進む先だけがオレンジ。色をばら撒くと安っぽくなる。
2. **状態は色ではなく「色 + 形/グリフ」のセットで伝える。** アクセシビリティのためでもあり、
   ブランドの一貫性のためでもある。

コピーの声: 機能の主語を「AI」にしない。「AIが企画します」ではなく「企画を作る」のように
**結果を語る**（AI色を前面に出さない、が確定方針）。マスコットのヒントは一度消したら再表示しない。

## Colors

パレットは **生成りニュートラル + オレンジ(primary) + 青(secondary) + 状態色 + SNSブランド色**で構成する。
2026-08-21 に全面刷新した（旧: `#ef6108` 基調の暖色オンリー）。

### 基準になった5色

| 役割 | 値 |
|---|---|
| 生成り（ベース背景） | `#FCF5EF` |
| 山吹（warning・primary-light） | `#FEA735` |
| 橙（**primary**） | `#FE7235` |
| シアン（secondary-light） | `#00C3FF` |
| 青（**secondary**） | `#0077FF` |

### 中核トークン

- **Primary（#fe7235）**: 唯一のインタラクション駆動色。CTA・アクティブ枠・フォーカスリング・
  選択中マーカー・**サイドバーの地**は全部これ。機能ごとに新しいアクセント色を足さない。
  - **サイドバーは 180deg のグラデーション**（`#fe7235 → #e85513 → #d54101`）。
    白文字はベタの `#fe7235` 上では **2.74** で AA を割る。上を鮮やかなまま残して下だけ沈める。
  - サイドバー内のボタン（投稿作成・アップグレード）は**白地 + `#d54101` の文字**に反転する。
    オレンジ地にオレンジのボタンを置かない。
- **Secondary（#0077ff）**: 情報・補助。primary と役割が競合しないよう、**押せるものには使わない**。
  文字に使うときは `secondary-deep(#0070f0)`。
- **Neutrals**: `background(#fcf5ef)` がベースキャンバス、`card(#ffffff)` が乗せる面。
  テキストは `foreground(#2a2826)`。**純黒 #000 や寒色グレーは使わない**——暖色を保つ。
- **状態色は success / warning / info(=secondary) / destructive / like**。

### 塗りと文字で色を分ける（重要）

**同じ状態色を「塗り」と「文字」で兼用しない。** 文字は 4.5:1、塗り・アイコンは 3:1 と
必要な条件が違うため、1色で兼ねると必ずどちらかが破綻する。

| 状態 | 塗り・アイコン | 文字・白文字を乗せる地 |
|---|---|---|
| success | `#00ac2f` | `#008a24` |
| primary | `#fe7235` | `#d54101` |
| secondary/info | `#0077ff` | `#0070f0` |
| warning | `#fea735` | `#ad6201` |
| destructive | `#e12d19` | `#e90c2a` |

- **塗りの明るさは色相をまたいで揃える。** HSL の彩度・明度を揃えても知覚は揃わない
  （緑を青と同じ `S100% L50%` にしたら輝度が **3.6倍** になり蛍光色になった）。
  **相対輝度**で合わせる。secondary `#0077ff`(0.204) が基準。
  - ただし**緑は例外**。sRGB の緑は色相ごとに使える輝度の幅が狭く、青の輝度(0.204)まで下げると
    彩度が 0.10 前後まで落ちて「くすんだ緑」になる。success は鮮やかさを優先して
    3:1 の上限（輝度 0.297）まで使う。**緑だけ他より明るいのは意図的**。
- **面（-subtle）の彩度も色相をまたいで揃える。** OKLCH 彩度 **0.012** 前後、枠は **0.050** 前後。
  暖色は放っておくと寒色の3〜4倍濃くなり、橙と黄のカードだけ手前に出る。
- **面の基準は白（`card`）であって背景ではない。** 状況カード・吹き出しは白いカードの上に乗る。
  生成りの背景を基準に濃さを決めると必ず濃くなりすぎる。

### success の色相を 145° にした理由

色相ごとに「白アイコン 3:1 を満たす中で最も鮮やかな緑」を総当たりで出すと、**H140〜145 が頂点**になる。

| 色相 | OKLCH彩度 | 系統 |
|---|---|---|
| 120 | 0.158 | 黄緑 |
| 130 | 0.179 | 黄緑 |
| **145** | **0.203** | **緑（採用）** |
| 155 | 0.160 | 青緑 |
| 194 | 0.095 | 青緑（旧 `#329d9c`） |

黄緑側に振ると緑らしくはなるが彩度が落ちる。青緑側は「緑に見えない」うえに彩度も落ちる。
**H145 が「緑と読める」と「鮮やか」の両立点**。青(0.221)の92%まで届く。

### 状態色の subtle / border

| 状態 | 面（-subtle） | 枠 |
|---|---|---|
| success | `#f3fcf6` | `#cff4dc` |
| primary | `#fff5f1` | `#ffd6c4` |
| secondary/info | `#f1f7ff` | `#c4e0ff` |
| warning | `#fff9f1` | `#ffe6c4` |

- **SNSブランド色**は Instagram/X/TikTok/YouTube のバッジ専用。**色単独で使わず、必ず Tabler アイコン
  （`ti-brand-instagram` / `ti-brand-x` / `ti-brand-tiktok` / `ti-brand-youtube`）とセット**にする。色だけで媒体を区別しない。
  Instagram は**マゼンタ寄り**（`#b02a78`）にして YouTube の赤・primary のオレンジと明確に分離する（赤3兄弟にしない）。
- **紫（#9724ba）**は Instagram 文脈のアクセント限定。汎用アクセントに昇格させない。

### 色を変えるときの手順（踏んだ地雷）

1. **`:root` の値だけ変えても終わらない。** `var(--color-x, #旧値)` のフォールバックや、
   トークンと**ペアで直書きされた相方**（`background:var(--color-success-subtle);border-color:#c3e0bf`）が残る。
   置換後に「トークン値に無い16進」を全ファイル走査して確認する。
2. **`:root` に同じトークンを二重宣言しない。** 追記を繰り返すと後勝ちで動くが、
   読むと嘘になる。追記は**末尾**に置き、作業後に重複を潰す。
3. **触らないもの**: 画像/動画エディタのカラーピッカー見本色、写真プレースホルダの
   グラデーション（`.ph1`〜`.ph6` 等）。これらは配色ではなく「中身」。

### グラフの色（chart-1 〜 chart-5）

グラフは**専用トークン `chart-1..5` からしか色を取らない**。パレットに無い青紫（`#9c6bd8` 等）をその場で足さない。

- **単一色相のランプ**。`primary(#fe7235)` を軸に濃橙→淡橙へ振る5段
  （`#fe7235 / #fea735 / #febb6b / #fdd0a0 / #fde4d6`）で、**多い系列ほど濃い**。
  chart-1 = `primary`、chart-2 = `primary-light`、chart-5 は `primary-subtle` と同系の最も薄い段。
  chart-3 / chart-4 は chart-2 と chart-5 の間を等分した中間色。
  「今月の作業時間」のように **1つの量を分け合う** グラフは、色相を分けるより濃淡で並べたほうが
  順位がそのまま読める。色覚特性がある人も明度差で追える。
- **グラフはオレンジランプにする**（2026-08-21 陽菜指定）。
  経緯: 8/19 に「青は他所で面として使われておらず画面から浮く」としてオレンジに確定 →
  8/21 に一度「secondary を青に据えたので例外は不要」として青ランプへ書き換えられたが、
  **同日に陽菜がオレンジへ戻す判断をしたのでこちらが最新**。青ランプ（`#0058c4` 〜 `#8fe4ff`）は失効。
- **グラフは [オレンジは押せるものだけ] の唯一の例外**。オレンジは本来「押せる/選ばれてる/進む先」専用だが、
  グラフだけこの例外に入る。「押せない」ことは色ではなく形で担保する:
  グラフ面に枠・影・`cursor:pointer` を付けない。
  ボタン/チップは従来どおりオレンジ**枠**か塗り + ラベルなので、面だけのグラフとは読み分けられる。
- **意味色（success / warning / like）を系列色に流用しない。** 緑＝好調・赤＝いいね の意味が
  人名やカテゴリに漏れる。状態バッジと同じ色がグラフに出ると「これは good/bad の話か」と誤読される。
- **色だけに頼らない。** 円グラフは①円の外に系列名を直接置く ②凡例に実数と割合を出す
  ③凡例の下に構成比バーを敷く、の3点で色以外の手がかりを必ず持たせる。
- **引き出し線（リーダーライン）は引かない**（2026-08-19 試作のうえ不採用）。円のまわりに線が増えると
  盤面が重くなる。名前はスライスの中心角の外側に直置きで足りる。
- **ドーナツの端は丸める**（`stroke-linecap: round`）。角丸スケール（8/12/16/20）と手触りを揃える。
  丸めたぶんだけ描画長を `stroke-width` 引いて詰める（詰めないと隣とくっつく）。
- 系列が **5を超えるなら円グラフをやめる**（横棒＋「その他」にまとめる）。ランプが破綻する。
- shadcn の `ChartContainer` / `ChartTooltip` / `ChartLegend` をそのまま使い、`chartConfig` の
  `color` に `var(--chart-N)` を渡す。Recharts に色をベタ書きしない。

コントラスト注意: `on-primary`（白）× `primary`（#fe7235）は約 2.7:1 で、WCAG AA の**大字（太字18.66px以上
相当）は満たすが通常文字サイズは割る**。だから白文字は button-primary 等の**大きめ・太字ラベル限定**。
本文サイズの文字をオレンジ地に白で置かない。lint の contrast-ratio 警告はこの1件を想定内として扱う。

### エディタ（ダーク）テーマ

**画像/動画エディタは通常画面と別世界のダークUI**（制作ツールは映像の色を正しく見るため暗くする）。
通常画面のライトと2枚看板で運用する。ダークの面は暖色3段＋純黒ステージ:

- **キャンバス最暗** `editor-bg (#1e1a17)` → **パネル面** `editor-surface (#272320)` → **カード/入力/ホバー** `editor-elevated (#3a3530)` の3段で階層を作る。
- **動画プレビューのステージだけ `editor-stage (#000000)` の純黒**（映像の見え方を正しくするため。ここは暖色にしない例外）。
- 文字は暖色オフホワイト `editor-foreground (#f5f3f0)`、サブは `editor-muted (#a8a29e)`。**slate系（`#e2e8f0`/`#020817`）は使わない**＝ダークでも暖色を保つ（実測でここに漏れが出ていた＝fix対象）。
- **primary は通常と同じ `#fe7235`**。`#ff5c35` 等のセカンドオレンジは使わない（primary に統一）。
- **タイムラインのトラック色分けは既存の意味色を流用**：テキスト＝マゼンタ系、ナレーション＝`accent-purple`、音楽＝`success`、図形＝`primary`。新色を作らない。
- **タイムラインの構造は必ずこの4点を満たす**（実物準拠）：① 上部に時間ルーラー（0s〜末尾の目盛り）② 現在位置を示す**赤い再生ヘッド**の縦線 ③ 左に固定のトラックアイコン列（動画/画像/テキスト/図形/ナレーション/音楽＋各行に `+`）④ **全トラックが同一時間軸で整列**（クリップは秒数に比例した位置・幅）。色バーを並べただけの表現は不可。
- **ダークの選択/アクティブ状態は「透過 primary（`rgba(254,114,53,.14)`）＋ primary 枠」**を使う。ライトの `primary-subtle (#fff5f1)` はダーク上で浮くため使わない。
- Elevation はダークでは影が効かないので、**面の明度差（3段）＋ `border` で階層を表現**する。

（この節のトークンは実測値。目視で拾わず DevTools 抽出から確定した。）

**エディタ共通レイアウト則（画像/動画で揃える）**：
- **プレビュー/ステージ背景は純黒 `editor-stage (#000000)` で統一**（画像エディタも動画に揃える。素材が主役なので黒で締める）。
- **AIアシスト(🦊)は右ペイン固定**（画像・動画とも。左ツールの下に置かない）。上部に `AIアシスト ● 利用可能`、下に composer。
- **右ペインは `プロパティ` / `AIアシスト` のタブ切替**（画像・動画で共通の確定仕様）。ツール選択時は自動で `プロパティ` を表示。
  これで右ペインが選択ツールのプロパティで埋まっても、AIアシストと衝突しない。
- **画像生成の導線は右上の「AI画像」ボタン**（動画エディタ）＝既存を使う。新規に生成ボタンを増やさない。
- **左＝ツール、中央＝プレビュー、右＝AIアシスト or 選択ツールのプロパティ**、の3ペインを共通の骨格にする。
  動画は下にタイムライン、画像はタイムライン無し（静止画）が唯一の差。
- これで片方の操作を覚えればもう片方も迷わない（学習コストを共有する）。

## Typography

### 文字サイズの下限（2026-08-21 決定）

**14px より小さい文字を置かない。** バッジ・チップ・履歴・補助ラベルまで含めて例外なし。
ターゲットは40〜50代の未経験者（[[target-first]]）で、10〜12px は「読めるが読まない」サイズになる。

- `--text-meta` **10px → 14px**、`--text-label` **12px → 14px** に引き上げた（旧値には戻さない）。
- **14px で使うときは太字**（`--font-weight-body-strong`）にする。下限のサイズは字面が弱くなるので、
  重さで補う。本文（`--text-body` も14px）は通常ウェイトのままでよい ── 下限で使う
  **ラベル・バッジ類**が対象。
- 直書きの `font-size:10px`〜`13px` も禁止。既存分は 14px に寄せ済み（449箇所）。
- 引き上げでバッジが大きくなるぶん、`padding` を詰めて高さを吸収する。文字を小さく戻さない。


フォントは **`Inter` + `Noto Sans JP` の2段**（フォールバック: Hiragino Sans, Meiryo, sans-serif）。
2026-08-21 に `Noto Sans JP` 単独からこの組に変更した。

```css
--font-body: Inter, "Noto Sans JP";
font-family: var(--font-body), 'Hiragino Sans', 'Meiryo', sans-serif;
```

- **Inter は日本語グリフを持たない**ので、英数字・記号だけ Inter が拾い、日本語は自動で `Noto Sans JP` に落ちる。
  順番が逆（Noto を先）だと Latin も Noto で描かれてしまうため、**Inter を必ず先に置く**。
- 効くのは数字・英語まわり（フォロワー数・表示回数・料金・SNS名・`@handle`・日付）。
  日本語の見た目は従来と変わらない＝環境差も出ない。
- **エディタのテロップ用フォント（`.fontpv` / `.fsel` / `.csel-opt`）は対象外。**
  あれはユーザーが投稿に使う書体を選ぶ**コンテンツ側**で、UIの書体ではない。Noto Serif JP・M PLUS Rounded 1c
  などの選択肢はそのまま残す。

- **ウェイトは 400 / 500 / 700 / 900 の4段だけ使う。** Noto Sans JP の静的ウェイトがこれしか無いため、
  600・800 を指定しても近い値にスナップして意図通り出ない。
  Inter 側は 600・800 も持っているが**使わない**。同じ行の英数字だけ 600 になって日本語が 700 のままだと、
  「フォロワー 1,240人」のような混在テキストで太さが揃わず段差に見える。4段の制約は Inter 導入後も維持する。見出しは 900、強調・見出し小は 700、
  本文は 400、ラベル/メタは 500。
- **900(Black) は display / h1（30px以上）専用。** 16px以下の小さい文字（ロゴ・ヘッダー・ピル・バッジ等）に
  900 を当てない＝潰れて黒く重くなる。ヘッダー系の太字は 700 までに留める。
- サイズスケールは実測ベースの偶数刻み: display 36 / h1 30 / h2 20 / h3・body-lg 16 / body 14 / label 12 / meta 10。
  中間サイズ（13/15/18/22/28 等）や 8px を手打ちしない。
- 階層は主にウェイトと余白で作る（サイズ段は少なめに保つ）。
- `meta` / `label` はどちらも **14px**（2026-08-21 に下限を引き上げ。旧 10px / 12px は使わない）。
  サイズで差が付かないぶん、`meta` は太字・`label` は通常ウェイトで区別する。

## Writing（UIの文言）

**画面に出る日本語もデザインシステムの一部**として、ここで決める（2026-08-19 会議タスク「言語の統一」）。
ターゲットは40-50代の未経験者（§Overview）。基準は**中学生が読んで分かること**。
ただし**砕きすぎない** ── 全部を噛み砕くと、慣れた人には回りくどく、初見にも要点がぼやける。

### 置き場所で言い方を変える

| 場所 | 書き方 | 例 |
|---|---|---|
| 設問・見出し | **口語でよい**。何を決めるのかを伝える文なので、砕けているほうが効く | 「この広告は、なんのために出しますか？」 |
| 表・フォームのラベル | **短い一般語**。縦に並ぶ項目名が口語だと目が滑って読み比べにくい | 目的 / 期間 / 予算 |
| 状態バッジ | **業務語のまま**。意味がずれると事故になる | 承認済み / 確認待ち / 下書き |
| 決断のボタン | **口語でよい**。短さより意思が伝わることが優先 | 「この内容で出す」 |
| 補助説明 | **カードの中には置かない**（下の原則4）。画面全体にかかる注意だけキツネアラート1つに寄せる | ─ |

### 4つの原則

1. **動詞で伸ばさない。** ラベルは名詞で言い切る。`投稿する日` → `投稿日`。
2. **意味がずれる語は開かない。** `承認` `NG表現` `投稿日` はそのまま。開くと何の操作か分からなくなる。
3. **機能名と動作名を分ける。** 機能＝`AI読み取り資料`、動作＝`読み込む`。
   機能名をそのまま状態にしない（✕「AI読み取り資料済み」→ ○「読み込み済み」）。
4. **カードの中に説明文と使い方を置かない（2026-08-24 決定）。**
   見出しとラベルで伝わらないなら、書き足すのではなく**名前を直す**。カードが8枚並ぶ画面で
   1枚ずつ説明が付くと、読む量が中身より多くなって主役が埋もれる。
   消すもの: 「〜するときに使います」（使い方）／「〜を入れてください」（手順）／
   「書き方の例」（見本）／見出し直下の言い換え。
   残すもの: **選択肢を見分けるための一文**（`やさしい`/`ていねい` の口調例など。消すと選べない）、
   データ、ラベル、状態。
   画面全体にかかる注意（「ここはAIが毎回読む」等）は**キツネアラート1つ**に寄せる。

### 語彙の対応表（決定済み。ここに無い言い換えを新しく作らない）

| ✕ 使わない | ○ 使う | 理由 |
|---|---|---|
| 投稿する日 / 投稿予定を決める | **投稿日** / **投稿日を決める** | 動詞で伸ばさない |
| なんのために / どこに / だれに / いつ / かかるお金 | **目的** / **出すSNS** / **届ける相手** / **期間** / **予算** | 表のラベルは短い一般語 |
| 変える | **変更** | 同上 |
| 下書きのまま置く | **下書きに保存** | 同上 |
| 学習 | **AI読み取り資料** | 「自分が勉強する教材」と読まれる |
| 学習済み | **読み込み済み** | 機能名を状態にしない |
| プロジェクト管理 | **運用目的** | 何を書く場所か名前で分かる |
| SNSアカウント（設定項目名） | **SNS設定** | |
| 言ってはいけない表現 | **NG表現** | 開きすぎ。短い業務語で通じる |
| 確認をお願いする（承認の意味で） | **承認する** | 「承認」は開かない |
| つながっています / まだつないでいません | **連携済み** / **未連携** | 状態バッジは名詞で言い切る（動詞文にしない） |
| つなぐ / つなぎ直す / つなげる | **連携する** / **再連携** / **連携できる** | SNS接続の語は「連携」で統一 |
| つないでいるSNS / つないだSNS | **連携中のSNS** / **連携SNS** | 見出しは「連携中の」、表のラベルは短く「連携SNS」 |

### AIに書かせるときの注意

AIに文言を作らせると最初は難しい語を出してくる。「もっとレベル下げて」で毎回調整すると**塩梅がぶれる**ので、
上の対応表を先に渡す。表に無い言い換えを増やすときは、まずここに1行足してから使う。

英字ラベル（`POINT` / `CHECK` / `DONE` 等）はアラート専用。§Alert（キツネアラート）の5語だけ。

## Layout

- 余白は 4px グリッド（spacing トークン）。カード内パディングは `md`〜`lg`、セクション間は `xl`〜`2xl`。
- **トップバー**（全画面共通）: 高さ56px（SP 48px）、`border-bottom` で区切り。
  左に**ページタイトル**（Tabler アイコン + `h3` テキスト）、右に**ヘルプボタン**（32px丸・`primary` 枠・`?`）+
  **一覧ボタン**（36px角丸・`border` 枠・`list-details` アイコン）。
  **ロゴはトップバーに置かない**（サイドバー上部に配置）。**いいねポイント表示は廃止**（リミット制に移行）。
  参考実装: `flow_image_v3_wire.html` のトップバー。
- PC はサイドバー固定（約235px）+ メイン。順序のある手続き（投稿作成・動画フロー）は**左カラム縦ステッパー**が
  マワルの標準レイアウト。行き来自由でロックしない。
- 詳細表示は **PC = 右スライドインsheet（約360px）/ SP = 全画面遷移**。
- フィルターUIは **PC = チップ（複数選択・状態常時可視）/ SP = 折りたたみドロップダウン**。並び替えは単一選択
  なので常にドロップダウン。SNSの複数選択をドロップダウンでやらない。

## Elevation & Depth

影は暖色・低コントラスト・控えめ。曖昧語を残さないため具体値を確定する:

- **card**: `0 1px 2px rgb(0 0 0 / 0.06)` — 一覧カード・入力の常時影。
- **raised**: `0 2px 8px rgb(0 0 0 / 0.08)` — ホバー時カード・ドロップダウン。
- **overlay**: `0 8px 24px rgb(0 0 0 / 0.12)` — sheet・モーダル・ポップオーバー。

グラデーションは2つだけ:
- メインCTA/装飾: `linear-gradient(135deg, {colors.primary}, {colors.primary-light})`
- ヒーロー: `linear-gradient(135deg, {colors.primary-subtle} 0%, {colors.card} 100%)`
（旧 maneku_ds のピンク→黄グラデは廃止。使わない。）

**AI生成系ボタンは必ずこのメインCTAグラデを使う**（「AIで画像を生成」「画像台本再生成」「投稿文を再生成」等）。
ベタ塗り primary は通常アクション、グラデは「AIが作る」アクション、と役割で塗り分ける（生成感を出す）。

## Shapes

角丸は `rounded` スケール（sm 8 / md 12 / lg 16 / xl 20 / full）に固定。

- ボタン・入力・小カード = `md`
- 大きめカード・sheet = `lg`
- バッジ・チップ・アバター縁 = `full`
- 任意の中間 radius を手打ちしない（ブレの温床）。

## Components

shadcn/ui のコンポーネントを土台にし、上のトークンでテーマするのが原則。**手でコンポーネントを
再発明しない**（design.md がプロンプトに入ると再実装しがち、が既知の癖。既存の shadcn 部品を使う）。

- **button-primary**: オレンジ地 + 白太字ラベル + `rounded.md`。ホバーで `primary-hover`。
- **button-secondary / ghost**: 白地 + `foreground` 文字。一覧内の破壊操作は常時 ghost の赤字で、
  赤塗り（button-destructive）は確認ダイアログの最終ボタンだけに使う。
- **alert-dialog（確認・警告ダイアログ）**: shadcn AlertDialog 準拠。**実装は1つだけ**（`mawaru_board/sonner.js` の
  `window.alertDialog()`）。画面ごとにダイアログを自作しない。呼び出しは
  `alertDialog({title, description, points, cancelLabel, actionLabel, destructive}, onConfirm)`。
  - **面** = `card` 背景 + `border` + `rounded.lg` + `overlay` 影 + padding 24。幅は最大440px（SPは `100vw - 32px`）。
  - **マスク** = `rgba(0,0,0,.45)`。クリックで閉じる。**Esc でも閉じる**。開いたら取り消し側にフォーカスを置く。
  - **タイトル** = `h3`(16px)/`weight 700`。`destructive` のときは頭に警告アイコン（色 + 形のセット。色だけで表さない）。
  - **説明** = `body`(14px) / `muted-foreground`。1〜2行に収める。
  - **points**（任意）= 「何が起きるか」の箇条書き。`surface` 面 + `border` + `rounded.md` + `label`(14px)。
    ⚠️ これが無いと各画面が独自の詳細ブロックを作り始める（`.cfbox` 再発明の原因だった）。
  - **ボタン** = 右寄せ2つ。高さ44・`rounded.md`・`body-strong`。取り消しは ghost（`border` 枠）。
    実行は `destructive` なら赤塗り、そうでなければ **`primary`（オレンジ）**。ほぼ黒のCTAは使わない。
  - **赤塗りにするのは削除・解除だけ。** 「取り下げる」のように何も消えない操作は通常アクション。
- **input**: 白背景固定。フォーカスで**オレンジ枠 + primary-subtle 背景**。
- **セレクト**: ReUI Select 準拠。ネイティブ `<select>` は使わない。
  トリガー = `input` と同じスタイル（`card` 背景 + `border` + `rounded.md`）+ 右に chevron（`ti-chevron-down`）。
  ドロップダウン = `card` 背景 + `border` + `overlay` 影 + `rounded.md`。
  選択肢 = `body` サイズ + ホバーで `surface` 背景 + 選択中はチェックアイコン（`ti-check`）+ `primary` テキスト。
  フォーカスで `primary` 枠 + `primary-subtle` 背景（input-focus と統一）。
- **スライダー**: ReUI Slider 準拠。トラック = `primary` 色の塗りつぶし + `muted` 色の残り。
  サム（つまみ）= 白丸 + `border` + 影。値表示は右端にテキスト（`primary` 色 `body-strong`）。
  ラベル + スライダー + 値を1行に並べる構成が標準。`accent-color` ではなく Radix/ReUI の見た目に揃える。
- **検索バー**: ReUI InputGroup（`@reui/c-input-group-4`）準拠。`InputGroupAddon` に検索アイコン（`ti-mood-search`）+
  `InputGroupInput` の構成。アイコンは `muted-foreground`、入力欄は `input` スタイル準拠。placeholder は日本語（「素材を検索」等）。
- **インライン編集（タイトル等）**: 通常はテキスト表示 + 小さい `ti-edit` アイコン。ホバーで `border` の薄枠を出して
  「編集できる」を示唆。クリックでその場が input に切り替わり、`primary` 枠 + `primary-subtle` 背景（input-focus と同じ）。
  Enter or blur で確定。**モーダルや別画面に飛ばさない**＝ステップ最小のインライン編集が標準。
- **card**: 白面 + `border` + `rounded.lg` + card 影。
- **アイコン**: すべて Tabler。**Tabler に無い形を自作しない。**
  ただしワイヤーHTMLに埋め込んでいるのは Tabler の**サブセット**フォントなので、Tabler には在るのに
  グリフが入っていない字がある（`ti-script`＝台本の巻物、`ti-user`＝人 など）。
  その場合は **Tabler 本体と同じ描き味のインライン SVG で入れる**（24グリッド・`stroke-width:2`・round cap・
  `stroke="currentColor"` で親の `color` に追従）。フォント側を差し替えない（巨大な base64 の打ち替えになる）。
  同じ字を3個以上並べるときは `<symbol>` + `<use>` にする（10個ぶん SVG を書くと読めなくなる）。
- **選択カードのアイコン（`.method .mi`）**: **64px の丸ベタ + アイコン 32px**（`padding:16px`）。
  - **選択中** = `primary(#fe7235)` 塗り + **白アイコン**。白は 2.7:1 だが 32px は大字側なので
    §コントラスト注意の「想定内の1件」と同じ扱い。`primary-deep(#d54101)` には落とさない（重くなる）。
  - **未選択** = `border(#efe7df)` 塗り + `muted-foreground(#757575)` アイコン（3.75:1）。
    **未選択をグレーのベタ塗り + 白アイコンにしない**（`muted-foreground` 地は濃すぎて未選択が主役になる）。
  丸サイズはカードの大小に関わらず 64px で統一（ファイル間で径を変えない）。
  アイコンの `font-size` / `margin` はインライン style で上書きしない（丸チップが崩れる）。
  参考実装: `flow_video_script_wire.html`。
- **badge（状態）**: `success/warning/info/like` の subtle 背景 + solid 文字。形は full。
- **badge（SNS）**: 媒体色 subtle 背景 + 媒体色文字 + **Tabler ブランドアイコン必須**（絵文字は使わない）。
- **alert（キツネアラート）**: 据え置きの通知・注意・結果は緑/黄/赤の3変種だけ。§Alert（キツネアラート）参照。
- **ローディング画面（全画面ロード）**: キツネマスコットが走るCSSアニメーション + シンプルテキスト構成。
  上段: `.fox-track` 内でキツネが左右に走り（`foxRun` 2.4s alternate）、上下にバウンド（`foxBounce` 0.4s）。
  足元に地面ライン（`.fox-ground`）と影（`.fox-shadow`）。画像は `assets/mawaru-fox-run.png`（透過PNG）。
  下段: タイトル（`h2` 太字）+ 説明文（`body`/`muted-foreground`、2行程度）+ キャンセルボタン（枠線のみ、塗りなし）。
  **プログレスバー・ドットパルス・残り時間表示は使わない**。参考実装: `flow_video_material_wire.html#sc_generate`。
- **完成画面（投稿の準備ができました！）**: お祝いキツネイラスト（`assets/mawaru-fox-celebrate.png`）を使用。
  左にイラスト + タイトル + 説明文、右にスマホ風プレビュー（実際のSNS投稿が見えるモックアップ）。
  ボタンは「一覧へ戻る」（ghost）+「投稿を予約する」（primary）。
- **大ステッパー（メインステップ）**: 投稿作成フローの全体工程を示す。縦配置（番号上・ラベル下）。
  数字丸 = 28px / `border:2px solid` / `rounded.full`。done = `success` 塗り + チェック、now = `primary` 塗り、todo = `border` のみ。
  接続線 = `height:2px` / `min-width:40px` / `margin-bottom:20px`（ラベルの上に浮く）。
  `stepbar` は `max-width:600px;margin:0 auto`、`border-bottom` + `card` 背景で区切る。
  参考実装: `flow_image_v3_wire.html`。
- **小ステッパー（サブステップ）**: メインステップ内の細分工程。**大ステッパーと差別化**するため、ドット+テキストの横並び。
  ドット = 8px 無地丸（`rounded.full`）。now = 10px + `primary` 色 + テキスト太字、done = `success` 色、todo = `border` 色。
  テキスト = `label` サイズ。接続線 = `width:20px;height:1px`（細線）。
  `#subnav` は `padding:10px 24px`、`border-bottom` + `card` 背景。数字・チェックアイコンは入れない。
  参考実装: `flow_video_script_wire.html`。
- **AIアシストパネル**: 初期は折りたたみ、ヘッダークリックで展開が標準。
  ヘッダーのマスコットアバターは**丸枠で囲まない**（`border-radius:full` の丸トリミング不要。角丸 `rounded.md` まで）。

リンクは**専用のリンク色を持たない**。既定の `foreground` のまま、ホバーで下線を出すだけ。
**例外: インラインアクションリンク**（ドロップゾーン内の「ファイルを選択」等、文中に埋め込まれた操作トリガー）は
`primary` 色 + 常時下線（`underline-offset:3px`）。ボタンではなくテキストリンクとして表現する。
緑/青/グレーのリンク色分裂を持ち込まない。

### Alert（キツネアラート）

**マワルのアラートはこの3変種だけ。他の見た目のアラートを作らない。**

画面内に据え置きで出す通知・注意・結果表示は、すべてキツネの表情 + 色のセットで表す。
`info` の青も `primary` のオレンジも、アラートには使わない。

| 変種 | 意味 | 背景 | 枠 | キツネ |
|---|---|---|---|---|
| `.fox-alert.ok` | できた・うまくいっている | `success-subtle` | `success` 30% | `mawaru-fox-happy.png`（笑顔） |
| `.fox-alert.care` | 気をつけて・確認して | `warning-subtle` | `warning` 30% | `mawaru-fox-worried.png`（注意顔） |
| `.fox-alert.err` | 失敗した・エラー | `destructive-subtle` | `destructive` 30% | `mawaru-fox-sad.png`（泣き顔） |

**箱そのものがキツネの吹き出し。** キツネは吹き出しの外に立ち、しっぽがキツネの顔を指す。
`.fox-alert` は背景を持たない透明なラッパで、**直下の1枚（`div` か `p`）が吹き出し本体**になる。

```html
<div class="fox-alert care">
  <img src="./assets/mawaru-fox-worried.png" alt="">
  <div>                                    <!-- ← これが吹き出し -->
    <span class="lb">ATTENTION</span>
    <div class="t">ここに書いたことは、AIが投稿を作るとき毎回かならず読みます</div>
    <div class="d">セール期間のように変わることは書かないのがコツです。</div>
  </div>
</div>
```

- しっぽは**三角を2枚重ねて**作る。外側（`::before`）が枠線色、内側（`::after`）が地色で1px内側。
  枠のある吹き出しのしっぽに枠線を通すには、この2枚重ねが要る。
- **出っぱりより上下を小さく取る**（既定 = 出っぱり8px・高さ10px、`.sm` = 6px・8px）。
  上下を出っぱりと同値にすると鈍い二等辺三角形になり、しっぽが太く見える。
- しっぽの縦位置は `top:calc(var(--fox) / 2)` でキツネの顔の中心に合わせる。
  キツネのサイズを変えてもしっぽが自動で追従する（既定 40px、`.sm` は 30px）。
- 余白は `margin:16px 0 20px`（`.sm` は `8px 0 0`）。**上下とも持たせる**のは、見出しに
  `margin-bottom` が無い画面で吹き出しが見出しにくっつくため。隣が余白を持つ場合は
  兄弟間のマージン相殺で大きい方だけが効くので、足し算で開きすぎない（実測 0→16 / 20→20 / 40→40）。
- ラベルは標準サイズで `display:table`（幅が中身に縮む block）にして**必ず単独行**に置く。
  `inline-block` だと、後ろが素の inline テキストの画面だけラベルが本文と同じ行に回り込む。
- 地・枠・しっぽ・ラベルは**すべて変種の CSS 変数から引く**（`--bb-bg` / `--bb-bd` / `--lb-bg`）。
  1箇所直せば4つが揃って動くので、色がずれない。
- 吹き出しの**外**に出していいのは、キツネと右端のボタン（`.sp`）だけ。
  本文・ラベルは必ず吹き出しの中に置く。
- **閉じるボタン（`.x`）は吹き出しの中の右上に `float:right` で浮かせる**（2026-08-30 変更）。
  兄弟として外に出すと 28px + gap 12px が本文から丸ごと引かれ、SPでは吹き出しが
  306→266px まで痩せてドライブの `ATTENTION` が1行増える。中に浮かせれば幅を譲るのは
  ×の高さに掛かる行だけで、ラベルの行の右余白に収まる。下の行は満幅に戻る。

**アラートは×で閉じられる（2026-08-30 決定）。**
据え置きのアラートは一度読んだ人にも毎回同じ文が居座る。読み終わった人が自分で片付けられる
逃げ道を1つ置く。**HTMLに×を書く必要はない** — `fox-alert.js` を1行読み込めば、その画面の
全部の `.fox-alert` に×が付き、押されたら `localStorage`（`mawaru.foxalert.v1`）に覚える。

| 対象 | 挙動 |
|---|---|
| `.ok` / `.care` | ×で閉じる。次に開いても出ない（据え置きの説明・注意なので覚えてよい） |
| `.err` | ×で閉じるが**覚えない**。失敗の報せは「いま起きていること」で、次も失敗していれば出るべき |
| `data-keep` を付けた箱 | ×を付けない。消させたくない箱を書き手が明示するための逃げ道 |

**箱を持たない一言は `.fox-say` を付ける。** AIレポートのスライド下の「リーチが課題やな！」のように、
吹き出しの枠を持たずキツネ + テキストだけで喋っている形。`.fox-alert` と同じ扱いで×が付く
（×は行の右端に絶対配置。中に float すると中央寄せの一言が左へずれる）。

**×を付ける／付けないの線引きは「キツネが話しかけているか」。**
数値の横に表情アイコンとして顔が付いているだけのもの（`analysis_metrics` の `.summary-fox` /
`.mc-fox`、`analysis_account` の `.trend-row`）は喋っていないので対象外。
ローディングの走るキツネと完成画面のお祝いキツネもメッセージではないので対象外。

鍵は「ページ名 + 本文のハッシュ」。何番目の箱かで持つと、後から上に1つ足したときに番号が
ずれて別の箱が消えたまま出なくなる。固定したいときは `data-fa="名前"` を書く。
出し直しは `foxAlertReset()`（製品では設定画面の「案内をまた表示する」がこれを呼ぶ）。

**英字ラベル（`.lb`）は次の6語だけ。** 何の話なのかを一目で示す `meta`(14px 太字) の一言。
しっぽは吹き出し本体が持つので、**ラベルはしっぽなしの無地ピル**にとどめる（吹き出しの中に
もう1つ吹き出しを作らない）。

地の色は各変種の色を **78% に暗くして** 作る（`color-mix(in srgb, var(--color-success) 78%, #000)`）。
生の状態色に白文字を置くと `success-vivid`(#00ac2f) が 3.03:1 で AA を割るため。
薄い地に小さい色文字を置く案も 3.4:1 前後で割るので採らない。**新しいパレット色は足さず、
既存トークンから導出する。**

| 変種 | 吹き出しの地 | 文字 | コントラスト |
|---|---|---|---|
| `ok` | `#0e7508`（success 78%） | 白 | 5.89:1 |
| `care` | `#6c550c`（warning 78%） | 白 | 7.14:1 |
| `err` | `#ac1e1e`（destructive 78%） | 白 | 7.10:1 |

`.sm` ではラベルと本文を1行に詰める（しっぽがキツネの真横に来て、喋っているのがより伝わる）。

| ラベル | 使うとき | よく合う変種 |
|---|---|---|
| `DONE` | やり終わった（送った・予約した・出した） | `ok` |
| `GOOD` | うまくいっている・この路線で続けてよい | `ok` |
| `POINT` | できること・仕組みの説明（注意ではない） | `ok` |
| `ATTENTION` | 気をつけてほしい・勘違いしやすい点 | `care` |
| `CHECK` | 手を動かす必要がある（未入力・未設定） | `care` |
| `ADVICE` | こう直すとよくなる、という提案 | `err` / `ok` |

語をその場で増やさない。日本語ラベル（「ポイント」等）と混ぜない。ラベルは**変種に固定ではなく
内容で選ぶ**（`ok` に `ADVICE` を載せてよい）。短い1文だけの箱ではラベルを省いてよい。

- **本文は `foreground` のまま。** 色を持つのは背景・枠・キツネだけ（Toast と同じ考え方）。
  黄地に黄文字、赤地に赤文字を置くと本文が読みにくくなる。
- **キツネは飾りではなく状態表示の本体。** 表情が「形」を担うので、
  §Do's and Don'ts「状態は色だけで表さない」を色だけに頼らず満たせる。
  だから Tabler のアイコン（`ti-alert-triangle` 等）は**併記しない**。記号が二重になる。
- **キツネ画像は3枚とも同じ顔アップの構図**で、`object-fit:contain` の 32px。
  密なカード内は `.fox-alert.sm`（24px + 詰めた余白）。全身のキツネ（`run` / `celebrate`）は
  ローディングと完成画面の担当で、アラートには使わない。
- 枠は「solid 色の 30%」で作る（Toast の枠と同じ式）。`#ffd8b0` のような**生の16進を書かない**。
- `alt=""` で装飾扱いにし、意味は本文テキストが持つ。読み上げでキツネの説明は不要。



**なぜアラートからオレンジを外したか。**
オレンジは [[orange-only-interaction]] のとおり「押せる・選ばれてる・進む先」の色で、
アラートは押すものではない。オレンジのアラートは主役（CTA）と同じ色で鳴るので、
画面上でどちらを見ればいいか分からなくなる。アラートを緑/黄/赤に寄せると
オレンジの純度が上がり、同時に黄色が「オレンジと近すぎて2色に見えない」問題も消える
（隣にオレンジのアラートがもう無いため）。

### Toast（sonner）の配色

**既定はオレンジ。赤はエラーだけ。**
sonner 既定の rich-colors（緑 / 赤 / 青 / 黄）はマワルの配色ではないので使わない。
青い成功トーストが混ざると、そこだけ別プロダクトの顔になる。

| 種類 | 背景 | 枠 | アイコン | 文字 |
|---|---|---|---|---|
| 既定 / `info` / `success` / `warning` | `primary-subtle` | `primary` 30% | ✓ / `primary` | `foreground` |
| `error` | `destructive-subtle` | `destructive` 30% | ✓ / `destructive` | `foreground` |

- **色を持つのは背景・枠・アイコンだけ。本文は `foreground` のまま。**
  オレンジ文字にすると本文が読みにくくなるうえ、[[orange-only-interaction]] の
  「オレンジ = 押せる」と衝突する。トーストは押すものではない。
- **アイコンは種類を問わずチェックマーク1種に統一する**（sonner 既定の i / ⚠ / ✕ は使わない）。
  形を4つに散らすと、右下に一瞬出るだけのトーストで4種の記号を読み分けさせることになる。
  トーストは読み分けるものではなく、本文を読ませるもの。記号は「通知が来た」の目印にとどめる。
  区別が要るのは**エラーだけ**で、それは赤が担う（オレンジ = ふつうの通知 / 赤 = エラー）。
- 種類を付けずに `toast('保存しました')` と呼んでもオレンジ + ✓ になる。既定がオレンジという意味。
- 実装: 実プロダクトは shadcn の sonner に `toastOptions.classNames` でトークンを当てる。
  配布用スタンドアロンHTMLは `mawaru_board/sonner.js` が同じ配色を持つ。

⚠️ 黄（`warning`）を warning トーストに使わない。オレンジと近すぎて2色に見えず、
かえって「注意」が伝わらない。強く止めたい警告はトーストではなく Dialog / Alert で出す。
※ここでの Alert は §Alert（キツネアラート）の `.fox-alert.care`。**トーストとアラートで配色が違うのは意図的**で、
トーストは一瞬出る通知（オレンジ既定 + 赤だけエラー）、アラートは据え置きで読ませるもの（緑/黄/赤）。
片方に合わせて片方を塗り替えない。

> **§ Do's and Don'ts「状態は色だけで表さない」に対する唯一の意図的な例外。**
> トーストは一時表示で操作対象でもないため、形の読み分けより本文の可読性を優先した。
> バッジ・ステータス・SNS媒体表示は従来どおり色 + 形のセットを守る。

### コンポーネント調達方針（DESIGN.md はコンポーネントを再発明しない）

部品は2系統で調達する。DESIGN.md が持つのは B のルールだけで、A は列挙にとどめる。

**A. shadcn/ui からそのまま（トークンで自動テーマ・作り込まない）**
汎用プリミティブは `npx shadcn add <name>` で追加。globals.css(=このファイルの生成物)を読むので
色・角丸・タイポが勝手に揃う。対象:
Accordion / Dialog / Sheet / Tabs / Select / DropdownMenu / Tooltip / Popover / Switch /
Textarea / Progress / Avatar / Toast(sonner) / Alert / Checkbox / Radio / Skeleton /
**MessageScroller / Message / Bubble / Attachment / AttachmentGroup / Marker（チャット一式・2026/06 追加）** /
**Tree（shadcnblocks/tree・2026/07 追加）** /
**InputGroup（ReUI `@reui/c-input-group-4`・2026/07 追加）** /
**Slider（ReUI Slider・2026/07 追加）** /
**Select（ReUI Select・2026/07 追加）**。

**B. マワル 固有（shadcn に無い＝ここで「作り方ルール」を規定。フルスペックは書かない）**
- **AIチャット（🦊アシスタント）**: shadcn MessageScroller + Message + Bubble をベースに構成。
  DESIGN.md が持つのは**テーマ規定だけ**:
  ・**コンテナ** = `border` + `rounded.lg`。チャットストリーム背景はベージュ系（`#f0ede9` 等）。
    ヘッダーは `card`（白）背景 + `border-bottom` + **マスコット顔アイコン（`mawaru-fox-face.png`・`rounded.md`・
    `object-fit:contain`・丸トリミング不可）+ タイトル（`body-strong`）+ サブテキスト（`label`/`muted`）+
    右にリフレッシュアイコン**。**マスコットアイコンはヘッダーに必ず残す**（AIアシストの識別子として）。
  ・**AI発話** = プレーンテキスト（吹き出し無し・アイコン無し）。`body` サイズ + `line-height:1.7`。
    **チャット内にキツネアイコンや吹き出し枠を入れない**（ヘッダーにだけアイコン表示。発話行にアイコンを繰り返すと冗長）。
  ・**ユーザー発話** = 右寄せ + `primary` 背景 + 白文字。`rounded.lg` + `border-top-right-radius: sm`（吹き出し形状）。
    `max-width:88%`。アバターなし。
  ・**コンポーザー**（shadcn AI chat 準拠）= `card`（白）背景 + `border-top` の帯。
    内側に `.chatcomposer-inner`（`muted` 背景 + `border` + `rounded.lg`）のカード型コンテナ。
    上段＝`textarea`（枠なし・背景透過・全幅・`min-height:44px`・`resize:none`）、
    下段＝左に `+` ボタン（32px丸・`background` 色・`muted-foreground`）、
    右に送信ボタン（32px丸・`primary`（オレンジ）塗り + 白の↑矢印SVG）。
    **入力とボタンを同じ高さに横並びにしない**（上下2段構成）。
    `+` クリックでポップオーバーメニュー（上方向・白背景 + `border` + 影）。メニュー外クリックで閉じる。
    メニュー項目は Tabler アイコン + ラベル（例: 写真・ファイルの追加 / マワルドライブから追加）。
  ・**空状態** = 中央にローディングインジケータ + 挨拶テキスト（`h3` + `label`/`muted`）。
  ・**予測変換チップ** = 既存のまま維持（`border` + `rounded.full` + `body` サイズ、ホバーで `primary` 枠）。
  ・生成中/状態通知 = `Marker` に統一（shimmer + `role=status`）。**待ち・進行・完了・システム通知・
    日付区切りは全て Marker で表現する**。待ち系UIを個別に自作しない＝ローディング色の分裂を防ぐ
  ・AI分析 = Bubble 内に `info-subtle` の callout として入れる（Marker ではなく本文内）
  ・案の提示 = Bubble 内に選択カードを composed（選択=`primary` 枠 + `primary-subtle`、画面共通の選択UIと一致）
- **投稿カード（一覧）**: サムネ + SNSバッジ + 更新日時(`meta`) + タイトル(`body-strong`)。Card + Badge の合成。
- **Attachment（写真入りカード・ファイル表示）**: shadcn Attachment 一式（Attachment / AttachmentMedia / AttachmentContent /
  AttachmentTitle / AttachmentDescription / AttachmentActions / AttachmentAction / AttachmentTrigger / AttachmentGroup）をそのまま使う。
  マワル 固有のテーマ規定:
  ・**写真入りカード**（投稿サムネ・ドライブ素材等）= `orientation=vertical` + `AttachmentMedia variant=image` で画像を上に配置。
    角丸は `rounded.lg`、面は `card` 背景 + `border`。選択中は `primary` 枠 + `primary-subtle` 背景。
  ・**ファイルカード**（PDF・動画ファイル等）= `orientation=horizontal` + `AttachmentMedia variant=icon`（Tabler アイコン）。
    ファイル種別ごとのアイコン: PDF=`ti-file-type-pdf` / 動画=`ti-video` / 画像=`ti-photo` / その他=`ti-file`。
    **ファイル種別に新色を割り当てない**（アイコン + `muted-foreground` で区別。色は状態だけに使う）。
  ・**アップロード状態**: `state=uploading` のシマーは `primary-subtle` ベース。`state=error` は `destructive-subtle` 背景 + `destructive` 文字。
    `state=done` が既定。進行中の表示は Marker と併用可（チャット内なら Marker、カード単体なら Attachment の state）。
  ・**サイズ使い分け**: `default`=ドライブ・投稿詳細等の標準表示、`sm`=チャット Bubble 内の添付、`xs`=コンポーザー入力欄の添付プレビュー。
  ・**AttachmentGroup**: 複数添付はスクロール可能グループで横並べ。エッジフェード付き。
  ・**AttachmentAction**: 削除=`ti-x`、ダウンロード=`ti-download`、プレビュー=`ti-eye`。必ず `aria-label` を付ける。
- **ファイルアップロード（素材アップ等）**: ReUI file-upload-9（`@reui/c-file-upload-9`）準拠。カード型グリッド方式。
  ・**ドロップゾーン** = 破線枠（`muted-foreground/25` dashed、ドラッグ中は `primary` + `primary/5` 背景）+ `rounded.lg` +
    中央にアップロードアイコン（`muted` 丸背景48px）+ テキスト2行（「ここにドロップまたはファイルを選択」+ ファイル形式・上限）。
  ・**ファイルリストヘッダー** = 「Files(N)」+ 右に「Add files」「Remove all」ボタン（outline/sm）。
  ・**ファイルカード** = カード型グリッド（`grid-cols-3〜6`）。各カード: `card` 背景 + `border` + `rounded.lg`。
    上部 = 正方形エリア（`aspect-square` + `muted` 背景 + 下 `border`）。画像はカバー表示、非画像はアイコン中央表示。
    下部 = `p-3` にファイル名（`body` truncate）+ サイズ（`meta`/`muted`）。
    削除 = ホバーで右上に `×` 丸ボタン（`outline` + `rounded-full` 6px）が出現。
  ・**アップロード中** = サムネ/アイコン上に円形プログレス（SVG ring）をオーバーレイ。画像は半透明黒オーバーレイ付き。
  ・ファイル種別アイコン: 画像=`ti-photo` / 動画=`ti-video` / 音声=`ti-headphones` / PDF=`ti-file-text` / ZIP=`ti-file-text` / その他=`ti-file`。
- **フォルダツリー（マワルドライブ等）**: shadcnblocks/tree をそのまま使う。
  ・Tabler フォルダアイコン（`ti-folder`）+ ノード名。展開/折りたたみは chevron。
  ・選択中ノード = `primary` テキスト + `primary-subtle` 背景 + `rounded.sm`。
  ・コネクタライン（`showLines`）は ON にして階層を明示。インデントは左 padding で段階表現。
  ・新色やカスタムアイコン色を足さない（`muted-foreground` のアイコン + `foreground` のテキストが既定）。
- **画像スロット/カルーセル**: 正方形スロット + 状態ドット + 追加(+)。選択中スロットは `primary` 枠。
- **画像台本アコーディオン**: shadcn Accordion + 各スライドに状態バッジ + コメント数 + ⋯(DropdownMenu)。
- **ポイントピル**: **廃止**（ヘッダーから所持ポイント表示を削除。2026/07 決定）。
- **相談パネル（編集画面の右ペイン）**: `AIアシスト` / `メンバー` の2タブ切替。**横に折りたたみ可能**
  （折ると細い縦バー化、ヘッダー/バークリックで再展開）。デフォルトは折りたたみ。
  ・AIアシスト = 上記チャット規定
  ・メンバー = **投稿単位のチーム相談**（同じ Message/Bubble 構造。相手が人間なのでアバターは各メンバーのイニシャル/画像、
    AI発話でない側は `card` 面）。各スライドの `💬` コメント数と地続き。
- **マスコット**: キャラ表示は画像アセットを使う（絵文字 🦊 は廃止）。**2種を用途で使い分ける**:
  ・顔アイコン `mawaru-fox-face.png`（正方形・顔が枠いっぱい）= チャットヘッダー・アバター（小）。`rounded.md` + `object-fit:contain`（丸トリミング不可）。
    **チャットバブル横にキツネアイコンは入れない**（ヘッダーにだけ表示。チャット内の発話行にアイコンを繰り返すと冗長）。
  ・全身版 `mawaru-fox-full.png`（正方形1:1・余白多めの全身）= フキダシ横・空状態・FAB等の大きめ表示。
  ・探偵版 `mawaru-fox-looking.png`（正方形・虫眼鏡を持つ全身）= **エンプティステート専用**（データ0件・検索無結果など「探してる/まだ無い」文脈）。
  ・お祝い版 `mawaru-fox-celebrate.png`（正方形1:1・クラッカーと紙吹雪の全身）= **完了/成功の祝い専用**（投稿完成・生成完了・オンボ達成など「やったね」文脈）。`object-fit:contain`。
  **アスペクト比は絶対に変えない（歪ませ厳禁）。全身版は丸く切り取らず `object-fit:contain` で全身を見せる**
  （小さい丸枠に全身版を cover で入れると顔が切れる＝禁止）。背景が要る場合は `primary-subtle`。
  **マスコット画像は必ず `object-fit` を明示する（顔版=cover / 全身版=contain）。素材は非正方形（顔版は約1.18:1）なので、
  未指定だと正方形枠で横に潰れる。** 画像バイナリは repo の `/public` 等に置き、DESIGN.md はパスのみ管理。
- **ロゴ**: サービスロゴは**画像アセット `iine-ai-logo.png`（2階調オレンジのワードマーク）を使う。テキストで組まない**。
  ロゴの2色は `primary`(濃#fe7235) と `primary-light`(明#fea735) に一致＝ブランドの芯とトークンが揃っている。
  暗背景が必要な箇所用に白抜き版を別途用意してもよいが、原則このカラー版。画像実体は repo に置き DESIGN.md はパスのみ。
- **🦊マスコット FAB**: `primary` 円形、右下固定。中身はマスコット画像。右下コーナーは「バックグラウンド処理の定位置」。

- **ヘッダー（全画面共通）**: 高さ56px、下に `border` の1pxライン。
  ・左＝ページアイコン（Tabler・`muted-foreground`）+ ページ名（`body-strong`〜`h3`）。
  ・右＝**ToDo**（丸ボタン + 未完了数バッジ）+ **チャット**（丸ボタン + 未読数バッジ）+ ヘルプ `?`（`primary` テキスト + `primary` 1.5px outline 丸ボタン・「困ったらここ」）+ サイドバートグル `≡`（`border` 1px 角丸 `sm` 正方形 36px・`muted-foreground`）。
  ・**現在のプラン**は ToDo の左に枠線チップで常時表示。**押すと料金一覧（`plan_wire.html`）へ飛ぶ**（2026-08-19 決定）。
  枠は `border-strong` 1px + `muted-foreground` 文字のまま＝**塗りをオレンジにしない**。押せる合図はホバー時の枠オレンジだけに留める
  （常時オレンジにすると、隣の CTA と同じ強さになって主役が2つになる）。いま料金一覧にいるときはリンクにせず現在地として出す。
  ・画面固有ボタンがある場合はヘルプの左に追加。
  **所持ポイント表示は置かない（廃止）。アカウントメニューはヘッダーに作らない**（アカウント導線は下部スイッチャーに集約＝重複回避）。
- **ToDo（旧「タスク」は廃止し、この概念に一本化）**: 名前は **ToDo** で統一する（「タスク」表記は使わない）。
  ToDoの**本体はヘッダーのパネル**。どの画面からでも同じ位置で開ける。ホームのカードは抜粋（上位数件）で、
  「すべて見る」で同じパネルを開く。同じリストを2箇所で別々に持たない。
  ・**自動ToDo**＝システムが状態から作る。承認待ち・投稿日時が未定 など。
  **チェックボックスを付けない**（手で消せると未承認のまま消えて実態とずれる）。代わりに「確認する →」のように
  その状態を解消できる画面へ飛ばすボタンだけを置き、元の状態が解けたら自動で消える。
  ・**手動ToDo**＝ユーザーがその場で書くもの。パネル上部の「＋追加」からその場で1行追加でき、チェックで完了、ゴミ箱で削除。
  ・2種類は見出し（`自動で入ったもの` / `自分で追加したもの`）で分ける。チェックの有無が種類の目印になる。
  ・バッジの数＝**自動ToDo + 未完了の手動ToDo**。0件のときバッジは消す。
- **サイドバーのナビ項目（確定・これ以上増やさない）**: 上から `ホーム / 投稿 / カレンダー / 分析 / ドライブ` ―区切り線―
  `設定`（折りたたみ・初期は閉。中身＝運用目的 / SNS設定 / メンバー管理 / AIレビュー）―区切り線― `その他`。
  ・**「ダッシュボード」は名前を廃止し「ホーム」に統一**（40〜50代未経験者にはカタカナ業界語が壁になる。SPの下部タブも同じ並び）。
  ・「NEWS / チャット / ToDo / プラン / 広告作成 / 発注相談 / 出張撮影」は**サイドバーの第一階層に置かない**。行き先は下表のとおり。
  項目が多すぎるサイドバーは「どこを押せばいいか分からない」を生むので、**第一階層は7項目まで**を上限とする。

  | もの | 頭（気づく場所） | 本体（全部ある場所） |
  |---|---|---|
  | NEWS | ホームのカード（最新1件のみ） | `その他 > NEWS` |
  | ToDo | ホームのカード（上位数件） | ヘッダーのToDoパネル |
  | チャット | ヘッダーの未読バッジ + ホームのカード | チャット画面 |
  | プラン | ホームヘッダのチップ（押すと料金一覧へ） | 下部スイッチャー > プラン・支払い |
  | 広告作成 / 発注相談 / 出張撮影 | ホームのフッター3ボタン | 各申し込み画面 |

- **NEWS画面**: 種類は `機能アップデート / お知らせ / メンテナンス / TIPS` の4つ。上にキーワード検索と「すべて既読にする」、
  その下に絞り込みチップ（すべて / 未読 / 各種類）。未読チップには件数バッジを出し、0件で消す。
  ・**未読は点だけで示さない**。行の背景も `primary-subtle`（薄いオレンジ）にする。点は小さく、40〜50代には見落とされるため。
  ・**サムネイルは TIPS（読みもの）にだけ付ける**。お知らせ・メンテナンス・機能アップデートは要件の告知なので、絵は情報を足さずに行を重くするだけ。
  ・**本文はアコーディオンで開かない**。一覧と本文は別ページとして入れ替え、ヘッダーのページ名も記事名に変える。
  長い本文が一覧に割り込むと「どこまでが1件か」が分からなくなるため。行を開いた時点で既読にする。
  ・「投稿タイプ一覧（台本テンプレート）」は廃止。過去投稿の参照は**投稿生成時のAIとのチャット**から行う。
  ・旧「学習」は**ドライブに統合**（PDF / 画像(JPEG,PNG) / 動画(MP4,MOV) / Office(PPTX,DOCX,XLSX) / お気に入り画像を1箇所で扱う）。
- **設定（確定・これ以上増やさない）**: `プロジェクト管理` / `SNSアカウント` / `AIレビュー` / `メンバー管理` の4つ。
  ・**`プラン一覧` は設定から外した**（2026-08-19 決定）。料金は設定の中を探させず、ヘッダーのプランチップから直接**料金一覧**へ行かせる。
  **サイドバーのサブ項目がそのまま画面の切替になる**（画面の中にもう一段ナビを置かない。同じ並びが2つあると迷う）。
  ヘッダーのページ名は `設定 / ◯◯` にして、いまどこにいるかを出す。
  ・**外した項目**：`学習`（→[[マワルドライブ]]の学習タブに統合）、`お気に入り画像`（不要）、`台本テンプレート`（廃止済み）。
  ・**プロジェクト管理**＝`もとになる資料` → `AIが作った内容（5項目）` → `書きぶりのプレビュー` の3段。
  **URLとPDFを入れて「読み込んで作る」を押すと、AIがそれを読んで5項目を作る**（現行の挙動を踏襲）。
  資料は[[マワルドライブ]]の学習タブと同じものを指す（置き場は1つ、入口は2つ）。
  ・5項目は `概要 / 主な特徴 / 料金 / お客様 / 言葉づかい`。**全体を1つの編集モードにせず、項目ごとに読み書きする**
  （全体編集だと「どこを直したか分からない」「保存が怖い」が起きる）。
  ・各項目に**AIがそれをどう使うか**を1行で添える（例：料金→「値段を書くとき、この数字をそのまま使います」）。
  設定の意味が分からないまま埋めさせない。
  ・AIが作った項目には**「AIが資料から作りました」の印**を出す。直してよいものだと分かるようにするため。
  ・進み具合は**「4/5」の数字だけにしない**。5項目を全部ならべ、埋まっているものに `check`、
  まだのものは**破線の枠 + warning色 +「（まだ）」**で出す（数字だけでは、何が何で、どれが空なのか分からない）。
  押すとその項目へ飛び、飛んだ先を一瞬光らせる。
  ・空の項目は**書き方の例**と、空のままだとどうなるか（「みんな向けの当たりさわりのない文章になります」）を出す。
  ・画面の先頭で「ここに書いた内容はAIが毎回かならず読む。**いつ見ても変わらないことだけ**書く」と言い切る
  （セール期間のような変わることを書くと、古い情報のまま投稿される）。
  ・**設定に保存バーは置かない**。プロジェクト管理は項目ごとの保存、それ以外は押した時点で反映（その旨を画面の先頭に書く）。
  画面の下に浮く保存バーは、どのカードに効くのか分からない。
  ・**料金一覧（設定の外・独立ページ）**＝いまのプラン + 使用量（SNS数 / 今月の投稿数 / ドライブ容量）+ プラン比較。
  上限に達している項目があれば、その場で理由を出す（「SNSが上限3つ。YouTubeを足すにはプラン変更が必要」）。
  入口は**ヘッダーのプランチップ**と**下部スイッチャー > プラン・支払い**の2つ。中身は同じものを2つ作らない。
  ・**メンバー管理**は「投稿を出す前に、承認をもらう」のオン/オフが先頭。オフ＝一人運用で、承認者ゼロの運用を正式に許す。
  役割は `オーナー / 承認者 / 作成者` の3つで、それぞれ何ができるかを画面内に置く（権限名だけでは伝わらない）。
  ・**AIレビュー**は観点ごとに `必ず直す / 教えてもらうだけ / 見ない` を選ばせる。
  全部を必須にすると出せなくなり、全部を任意にすると誤字が出る。誤字・数字・言ってはいけない表現だけ既定で「必ず直す」。
  自社ルールを文章で足せるようにする。
- **広告**: 一覧 + 作成（3ステップ）を1画面で切り替える。**投稿作成のモーダルを流用しない**（別のものを同じ形で出すと、いま何を作っているのか分からなくなる）。
  ・ステップは**ユーザーが決めることだけ**にする。`なんのために / だれに・いくら / できた広告を見る` の3つ。
  それ以外（見出し5案・説明5案などの媒体仕様）は**AIが埋めて折りたたむ**。どこに出る文字か分からない欄を並べない。
  ・**予算と期間は必ず聞く**。`1日あたり × 日数 = 合計` をその場で計算して大きく出す（総額が分からないまま決めさせない）。
  予算が未設定の広告は、一覧で**出せない理由として警告**を出す（「未設定」とだけ書いて放置しない）。
  ・目的は業界用語を使わず `お店を知ってもらう / 来てもらう / フォローしてもらう` の3つ。
  ・広告にするものは、**反応がよかった投稿を先に見せる**（いちばん失敗しない道を既定にする）。
  ・生成待ちは**黒い箱で待たせない**。いま何をしているか（お店の情報を読む→過去の反応を見る→文を書く→画像を選ぶ）を段階で出し、
  閉じても続くことと、終わったら知らせることを明記する。**生成前の空フォームは出さない**。
  ・できあがりは**実際に出たときの見え方**を主役にする。直せるのは「はじめの一文」と「ボタンの文字」だけに絞り、
  合わないときは「別の案を見る」。最後に `目的 / 出す先 / 相手 / 期間 / かかるお金` を確認してから出す。
  ・一覧では**お金の使いぐあいをバー**で出し、結果は `見られた回数 / 反応された回数 / プロフィールを見た人` の3つに絞る。
- **発注相談 / 出張撮影**: 広告作成と並ぶ「プロに頼む」3つ。上のタブで行き来できるようにする（別々のページに散らさない）。
  ・**送ったあと何が起きるかを、送る前に見せる**（相談→見積り→OKしたら制作→ドライブに納品）。
  相手が見えない依頼は送るのが怖いので、日数の目安も出す。
  ・**「相談だけならお金はかかりません」を最初に言い切る**。ここで止まる人がいちばん多いところ。
  ・依頼の返事は**チャットにスレッドを立てる**（[[チャット]]）。メールを探させない。
  ・納品は**ドライブに入る**（[[マワルドライブ]]）。渡した参考素材もドライブから選ぶ。
  ・住所や店舗情報は**プロジェクト管理から自動で入れる**。同じことを二度書かせない。
  ・送ったら**何を送ったのかをそのまま見せる**（送信して終わりの画面にしない）。過去の依頼も同じ画面に置く。
- **カレンダー**: `月 / 週 / 日` を切り替えられる（Googleカレンダーと同じ並び・同じ位置に置く。見慣れた形から動かさない）。
  ・**カレンダーは「予定を見る」だけでなく「日を決める」画面**。日・時間の枠を押すと、
  **その日時が入った状態**で追加のポップオーバーが開く。あとから日付を選び直す手間をなくすため。
  ・追加は2つ出す。**新しく作る**（投稿作成フローへ）と、**できている下書きから置く**。
  日時未定の下書きは[[ToDo]]の「投稿する日が決まっていません」と同じものを指す。置いた時点で予約済みになる。
  ・**日にちが決まっていない投稿は、カレンダーの右に「未確定」の欄を作って置いておく**。
  カレンダーの日・時間の枠へ**ドラッグして置くと、その日時で予約**される。「どこに置くか決める」作業がそのまま操作になる。
  月の枠に落としたときは時間が決まらないので、**その曜日のおすすめ時間**（無ければ19:00）を入れる。
  ・未確定の欄とポップオーバーの「下書きから置く」は**同じものを見せる**。片方で置いたら両方から消す。
  ・置いたら**トーストで「◯月◯日 ◯◯:◯◯ に予約しました」**と短く出す。置けたのかどうかを推測させない。
  ・未確定が0件のときは「すべて日にちが決まっています」と言い切る（空の欄だけ残さない）。欄はたためる。
  ・**おすすめの投稿時間**（分析の上位3枠）は週・日でも示す。日付を決める場所に出すという方針([[おすすめ投稿時間]])に合わせる。
  その曜日に該当する枠が無い日は光らせない（関係ない時間を勧めない）。日ビューの一覧から押したときは、
  **次にその曜日が来る日**に置く。
  ・承認待ちの投稿は**破線の枠**で出す。出るかどうかまだ決まっていないものを、確定した予定と同じ見た目にしない。
- **チャット**: 3ペイン（アプリのサイドバー / 会話リスト / 会話）。**サイドバーの第一階層には置かず、ヘッダーの吹き出しから入る**。
  表示中はヘッダーの吹き出しを選択状態にして、いまどこにいるか分かるようにする。
  ・会話リストは `グループ` / `ダイレクトメッセージ` / **`投稿のスレッド`** の3区分。
  投稿の相談は投稿から始まるので、投稿単位のスレッドは独立して並べ、行にその投稿の状態（予約済み・確認待ちなど）も出す。
  ・**自分の発言も塗りは `primary-subtle` まで**。濃いオレンジは押せるものの色なので、吹き出しには使わない。
  ・未読は**「ここから未読」の区切り線**で示し、開いたらその位置まで送る。リストの未読バッジは開いた時点で消す。
  ・本文中で投稿を引用できる（サムネ＋タイトル＋状態）。どの投稿の話か、さかのぼらずに分かるようにするため。
  ・送信欄には画像添付とあわせて**「ドライブから」**を置く（[[マワルドライブ]]と同じ素材をそのまま使えるようにする）。
- **マワルドライブ**: 3ペイン（ツリー / ファイル一覧 / ファイル詳細ドロワー）。
  ・統合した「学習」は**フォルダで混ぜず、画面上部のタブで分ける**（`素材` / `学習`）。
  役割が違うものを同じ階層に置くと、投稿に貼る写真とAIに読ませる資料が混ざるため。
  **素材＝投稿にそのまま貼るもの／学習＝AIが読んで参考にするもの**。この違いは学習タブの先頭で必ず文章で言い切る。
  ・学習の各資料には**読み込み状態**（学習済み / 読み込み中 / 読み込み失敗）を必ず出す。入れただけで効いていると誤解されるため。
  ・ファイル詳細には「この素材で投稿を作る」（→投稿作成フローへ）と**この素材を使った投稿の逆引き**を置く。
  同じ写真の使い回しに自分で気づけるようにするため。
  ・**投稿作成フローの「マワルドライブから選択」は、この画面と同じ階層・同じフォルダ名で見せる**。
  別物に見えると「さっき入れた写真がない」と探しに戻ることになる。フローのピッカーには
  「学習に入れた資料はここには出ません」と明記し、ドライブ本体への導線も置く。
  ・「台本テンプレ」フォルダは作らない（[[投稿タイプ一覧の廃止]]に合わせる）。
  ・容量表示とアップグレード導線はツリー下部の1箇所だけ。ファイル一覧側には出さない。
- **サイドバー下部スイッチャー（プロジェクト＋アカウント複合）**: 最下部の1枠に「現プロジェクト名 + アカウント名」を2段表示、
  クリックで**上にポップオーバー展開**。中身＝検索付きクライアント一覧（現在のものに `check`）+ 「新しいクライアントを追加」+ 区切り +
  アカウント操作（設定 / プラン・支払い / ログアウト）。代行・多数クライアント運用が前提。
  ・**クライアント識別はアイコン + カラーで行う**（名前だけだと「A社/A商事」を誤認＝誤爆の元）。各クライアントに固定の識別色/アイコンを持たせる。
  ・右上メニューにあったナビ系はサイドバー本体に吸収（ホームはロゴクリックでも可）。
- **生成トレイ（右下・バックグラウンド処理の集約）**: 動画生成/画像生成/解析などの進行は**ヘッダーに置かない**（複数並走で破綻するため）。
  Google ドライブのアップロード進捗と同型で、**右下に集約トレイ**として積み上げ表示（複数並走可・最小化可・全画面で追跡可）。
  各行は `Marker`（shimmer + `role=status`）で表現し、クリックで該当投稿へ遷移。**完了時は sonner トーストで通知**（右下は見落とされやすいため）。
  マスコット FAB と同じ右下コーナーに同居し、そこが非同期処理の定位置になる。

**禁止**: A系の部品を手で再実装しない（Atlassian の DESIGN.md 教訓＝再発明はトークン浪費と実装ブレの元）。

### Directory からの調達ポリシー（拡張時）

不足部品は自作より shadcn Registry Directory を優先。ただし**「全部入れ」は禁止**（＝方言の逆流。
このプロジェクトで駆逐した slate 乗っ取り・色分裂を別registryが再持ち込みする）。採用チェック:

1. **トークン駆動か**：CSS変数でテーマできるか。色をハードコードしてる品は不採用。
2. **実際の穴を埋めるか**：機能重複・装飾目的だけなら見送り（公式で足りるものは公式で）。
3. **公式(shadcn/ui)を最優先**。コミュニティ製は第三者製ゆえ install 時に必ずコード確認。
4. **見た目特化系は原則不採用**（glassmorphism / 8bit / Tron 等＝独自の見た目でブランド一貫性を壊す）。

採用したら globals.css(=DESIGN.md生成物)のトークンで塗り直し、マワル固有の使い方があれば B系に1行追記。
現状の採用候補: 音声波形/試聴プレイヤー ◎、画像アップロード(Dropzone) ◎、日時ピッカー ◎(公式)、
リッチエディタ ○、AIプロンプト/提案 ○(公式chat一式と重複注意)、データテーブル ○。

## Do's and Don'ts

**Do**
- オレンジは「押せる・選ばれてる・進む先」だけに使う。**装飾・見出しアイコン・補助バッジ・非対話の要素にオレンジを使わない**（塗りすぎると主役が埋もれる）。迷ったらニュートラル（`foreground`/`muted-foreground`/`border`）に落とす。
- **色は役割で分ける**：オレンジ`primary`＝インタラクション（押せる/選択中/現在地）、赤`destructive`＝**警告系（必須・エラー・未入力・危険）に統一**。「必須」バッジや未入力の注意はオレンジではなく `destructive` を使う（オレンジの純度を保ち、赤で"止まれ/直せ"を一貫させる）。
- 状態は色 + 形/アイコンのセットで表す（SNSバッジ = 色 + Tabler アイコン、状態バッジ = subtle背景 + solid文字）。
- **`info`（水色）は状態バッジ専用**。「作成中」「下書き」など**状態を言うとき**だけに使い、それ以外の面に撒かない（2026-08-19 決定）。
  ~~「この情報をAIがどこで使うか」のような説明・ヒントのチップは `primary-subtle` + `primary` で出す~~
  → **2026-08-24 失効。説明・ヒントのチップ自体を置かない**（§Writing 原則4）。色を選ぶ前に、その一文が要るかを疑う。
  記録・推し情報のチップ（`テンプレート「◯◯」を使用` 等）を出すときだけ `primary-subtle` + `primary`、
  かつ**チップ止まり**にする（ボタン形にしない・枠を付けない・カード全体をオレンジにしない）。
- **チップの色は「状態か / それ以外か」で決める。** 状態＝`success`(できた) / `warning`(気をつけて) /
  `destructive`(必須・エラー) / `info`(作成中・下書き)。それ以外（何を使ったかの記録・推し情報）は
  **オレンジ**に寄せる。判断に迷ったら「これは状態を言っているか？」だけを見る。
  ※ 説明・ヒントのチップは色を選ぶ前に消す（§Writing 原則4）。
  ・例: `反応いちばん`（推し情報）を `success` にしない＝緑は「好調」の意味を持つため。
  ・例: `テンプレート「◯◯」を使用`（記録）を `info` にしない＝水色は「作成中」の意味を持つため。
- **青い注意バナー（`info-subtle` の帯）を作らない。** 画面に据え置く通知・注意・案内は
  すべて[キツネアラート](#alert キツネアラート)の3変種に寄せる。`.note` のような自前バナーを増やさない。
- **アイコンは全て Tabler Icons（`ti-*`）から。絵文字はUIに使わない**（🦊マスコット等の意匠を除く）。
- **配布用ワイヤーHTML はアイコンフォントを woff2 ごと埋め込む（CDN直リンク禁止）**＝再現性が壊れる/豆腐化を防ぐ。
  ※これはスタンドアロンのワイヤーHTML限定。実プロダクト（Next+shadcn）は npm で `@tabler/icons-react` を使う。
- 白文字は primary/success/destructive の**大字・太字ラベル限定**。
- 選択UIは役割で使い分ける（タブ/ピル/セグメント/チェック）。無理に1種類へ統一しない。
- radius・色・サイズは必ずトークンから引く。globals.css は DESIGN.md からの生成物として扱う。
- 待ち・進行・完了・システム通知は `Marker` に統一（チャット外の解析待ち等も含む）。個別の自作ローディングを作らない。
- **選択中の枠は太さを変えずに `box-shadow: inset 0 0 0 1px` で太く見せる**。`border:1px → 2px` にすると中身が1pxずれて跳ねる。padding で相殺できる部品（`.goal` 等）だけ border を太らせてよい。
- **`<button>` の中身を `<span>` で組んだら、必ず `display:block` / `flex` を当てる**。span は inline のままだと `aspect-ratio` も `overflow:hidden` も縦 padding も効かず、サムネの高さが 0 になって中の絶対配置バッジが1文字ずつ縦に折れる。実例と直し方は vault の `wire-checklist`。

**Don't**
- 純黒 #000・寒色グレーを使わない（暖色ニュートラルを保つ）。
- 機能ごとに新しいアクセント色や状態色をその場で足さない。
- SNSを色だけで区別しない（必ず Tabler アイコンを添える）。
- 本文サイズの白文字をオレンジ地に乗せない（コントラスト不足）。
- 専用リンク色を導入しない（ホバー下線で表現）。
- shadcn 部品を無視して同等コンポーネントを手で再実装しない。
- 汎用部品（Accordion/Sheet/Select 等）を DESIGN.md でフルスペック化しない（調達方針A参照。列挙どまり）。
- **カードの中に説明文・使い方・見本を置かない**（§Writing 原則4）。「〜するときに使います」「〜を入れてください」
  「書き方の例」は書かず、見出しとラベルの名前で伝える。足りないのは説明ではなく名前だと考える。
- **左カラーライン（border-left で色帯を付ける装飾）を使わない**。セクション区切りは面の色差・ボーダー・余白で表現する。色帯はノイズになり、primary の役割（押せる・選ばれてる）を侵食する。

**Superseded（旧ナレッジからの明示的な失効）**
- 「React + インラインスタイルのみ / Tailwind禁止 / position:fixed禁止」は Builder.io・プレビューHTML時代の
  制約であり、**shadcn + Tailwind v4 + Next 採用に伴い失効**。今後は Tailwind ユーティリティ + shadcn 部品 +
  上記トークンで実装する。short-form の `C.pr` 命名も廃止し、shadcn 準拠のセマンティック名（primary 等）に一本化。
