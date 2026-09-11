# state-color-plus-glyph

> 状態は色だけで表さない。必ず「色 + 形/アイコン」のセットで伝える。

（源泉: DESIGN.md）

## 教訓
- 状態色は success/warning/info/like の4系統に固定（各 solid + subtle）。新色をその場で作らない。
- SNSバッジは媒体色subtle + 媒体色文字 + **Tablerブランドアイコン必須**。色だけで媒体を区別しない。
- Instagramはマゼンタ寄り #b02a78（YouTube赤・primaryオレンジと分離、赤3兄弟にしない）。

## 理由
色覚に依存しないアクセシビリティ + ブランドの一貫性。
※旧仕様の絵文字SNSバッジは失効 → [[superseded]]。

## 例外: トースト（2026-08-17）
[[toast-orange-default]] のアイコンは全種類チェックマーク1種で、区別は色だけ（オレンジ/赤）。
一時表示で操作対象でもないトーストでは、形の読み分けより本文の可読性を優先した。
**この例外はトーストだけ。**バッジ・ステータス・SNS媒体表示は色+形のセットを守る。

関連: [[tabler-icons]] / [[orange-only-interaction]]
