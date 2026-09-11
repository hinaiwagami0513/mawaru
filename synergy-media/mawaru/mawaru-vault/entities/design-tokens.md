# design-tokens（トークンの現行値）

> トークンの唯一の源泉は DESIGN.md。knowledge.md の旧値(短縮命名/角丸/weight)は失効。

## 源泉
- 現行の正は **DESIGN.md**（alpha・2026/07決定を含む＝knowledge.mdより新しい）。
- globals.css は DESIGN.md からの生成物。手で触らない。

## ⚠️ primary は差し替わる可能性がある（8/28）
メインカラーが変わるかもしれない（来週〜9月中旬に確定 / [[brand-rename-pending]]）。
岩上が佐藤に「デザインMDでプライマリーを変えるだけなので**デザイン全部は変わらない**」と回答している。
**この約束を守る**＝ 色はセマンティック名でしか参照しない。ワイヤーやコードに `#fe7235` 等を直書きしない。

## 主要トークン（現行）
- primary `#fe7235` / primary-light `#fea735` / primary-deep(文字用) `#d54101` / primary-subtle `#fff5f1`。
- secondary `#0077ff` / secondary-light `#00c3ff` / secondary-subtle `#f1f7ff`。**情報・補助専用。押せるものには使わない**。
- 面: background `#fcf5ef`（生成り）/ surface `#fffdfb` / card `#ffffff`。text `#2a2826` / muted `#757575`。
- 状態: success / warning / info / like / destructive（各 solid + subtle）。詳細は [[state-color-plus-glyph]]。
- 角丸: sm8 / md12 / lg16 / xl20 / full。**旧: 12/16/20/28 は失効**。
- タイポ: **Inter + Noto Sans JP**（英数字=Inter / 日本語=Noto。Interを先に置く）。weight 400/500/700/900 のみ。**旧: 800 は失効**。
- グラデ2種のみ（CTA / Hero）。maneku_dsのpink→yellowは廃止。
- グラフ: `chart-1..5`（`#fe7235` / `#fea735` / `#febb6b` / `#fdd0a0` / `#fde4d6`）。primary起点の単一色相ランプ。詳細は [[chart-single-hue-ramp]]。
- エディタのダークトークンは [[editor-dark-theme]]。

## 失効した旧表現
`C.pr` 等の短縮命名 / 絵文字SNSバッジ / 角丸28 / weight800 → まとめて [[superseded]]。

**旧パレット（2026-08-21 に全面刷新して失効）**: primary `#ef6108` / primary-light `#ff971e` /
primary-subtle `#fff2e2` / background `#f2f1f0` / surface `#fbfaf8`。
グラフの青ランプ（`#0058c4` 〜 `#8fe4ff`）も同日中に失効（オレンジへ戻した）。
