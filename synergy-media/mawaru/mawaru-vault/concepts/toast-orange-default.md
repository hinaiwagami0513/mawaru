# toast-orange-default

> トーストは既定オレンジ、赤はエラーだけ。アイコンは全種類チェックマーク1種。sonner 既定の緑/赤/青/黄は使わない。

（源泉: DESIGN.md「Toast（sonner）の配色」）

## 決めたこと（2026-08-17）

| 種類 | 背景 | 枠 | アイコン | 文字 |
|---|---|---|---|---|
| 既定 / `info` / `success` / `warning` | `primary-subtle` | `primary` 30% | ✓ / `primary` | `foreground` |
| `error` | `destructive-subtle` | `destructive` 30% | ✓ / `destructive` | `foreground` |

アイコンの形は全種類チェックマーク1種。変えるのは色だけ。

種類を付けずに `toast('保存しました')` と呼んでもオレンジ。**既定がオレンジ**という意味。

## なぜ

- sonner の rich-colors をそのまま使うと、成功が緑・情報が青になる。
  マワルの画面に青い通知が出ると、そこだけ別プロダクトの顔になる。
- 実際の使用比率は info 60 / success 41 / plain 24 / error 14 / warning 1。
  **大半が「うまくいった・お知らせ」**なので、それをブランド色で受けるほうが自然。

## 効かせ方の注意

- **色を持つのは背景・枠・アイコンだけ。本文は `foreground`。**
  オレンジ文字は読みにくいうえ [[orange-only-interaction]] の「オレンジ=押せる」と衝突する。
  トーストは押すものではない。
- **アイコンは全種類チェックマーク1種**（2026-08-17 変更。sonner 既定の i / ⚠ / ✕ は使わない）。
  形を4つに散らすと、右下に一瞬出るだけのトーストで4種の記号を読み分けさせることになる。
  トーストは記号を読み分けるものではなく本文を読ませるもの。記号は「通知が来た」の目印にとどめる。
  区別が要るのはエラーだけで、それは赤が担う。
  → [[state-color-plus-glyph]] の「色だけで状態を表さない」に対する**唯一の意図的な例外**。
    トーストは一時表示で操作対象でもないため、形の読み分けより本文の可読性を優先した。
    バッジ・ステータス・SNS媒体表示は従来どおり色+形のセットを守る。
- **黄を warning に使わない。**オレンジと近すぎて2色に見えず、注意が伝わらない。
  強く止めたい警告はトーストではなく Dialog / Alert で出す。

## 実装

- 実プロダクト（Next+shadcn）: sonner に `toastOptions.classNames` でトークンを当てる。
- 配布用スタンドアロンHTML: `mawaru_board/sonner.js` が同じ配色を持つ。全ワイヤーが読む。

関連: [[design-tokens]] / [[orange-only-interaction]] / [[state-color-plus-glyph]] / [[component-procurement]]
