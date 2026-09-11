# component-procurement

> 部品は2系統。汎用はshadcnからそのまま(A)、マワル固有だけ作り方ルールを書く(B)。

（源泉: DESIGN.md）

## A: shadcnからそのまま
トークンで自動テーマ。一覧は [[shadcn-ui]]。手で再実装しない（DESIGN.mdがプロンプトに入ると再発明しがち）。

## B: マワル固有（ルールだけ規定）
AIチャット(🦊) / 投稿カード / Attachment / ファイルアップロード(ReUI) / フォルダツリー(shadcnblocks)。
ファイル種別に新色を割り当てない（アイコン+mutedで区別。色は状態だけ）。

## 実際に再発明が起きた例（2026-08-20）
アラート系ダイアログ（確認・警告・破壊操作）は `mawaru_board/sonner.js` の `window.alertDialog()` が
**唯一の実装**。なのに `.cfbox` という自作ダイアログが2画面（シーン削除・SNS連携解除）に生えていた。
原因は共有部品に**「何が起きるか」の箇条書きブロックが無かった**こと。必要な機能が無いと自作が始まる。
→ 共有部品側に `points` を足し、`.cfbox` 2つを撤去。仕様は DESIGN.md §Components の alert-dialog が正。

同時に、移植したままの shadcn 既定値（角丸6px・18pxタイトル・ほぼ黒のCTA・system-uiフォント）が
トークンから外れていた。**A系をそのまま置くだけでは足りず、トークンでテーマするまでが「調達」**。

## 禁止
- A系を手で再実装しない。
- 左カラーライン(border-left色帯装飾)を使わない。区切りは面の色差・ボーダー・余白で。

関連: [[shadcn-ui]] / [[tabler-icons]] / [[marker-loading-unification]]
