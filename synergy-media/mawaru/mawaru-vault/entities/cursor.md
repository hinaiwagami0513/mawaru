# cursor（開発環境）

> Cursorユーザー（VS Codeではない）。コードベース直接アクセス不可。URL+スクショのみで作業。

## 前提・制約
- URLからトークン抽出→スクショ検証→DESIGN.md確定のワークフロー。
- コードベースに触れない前提だから「何を読ませるか」の設計が余計に効く。

## この vault との接続
- [[CLAUDE]] の内容を Cursor の Project Rules / `.cursor/rules/` に写す（役割は同じ）。
- 各作業ルールに「作業前に該当 entities/concepts を読む」を入れる。

## 既知のハマり
- 画像貼り付け400エラー = 会話履歴の蓄積が原因 → New Chatで解決。
- Auto-Run（旧YOLO）設定は設定内。
