# editor-dark-theme

> 画像/動画エディタは通常画面と別世界のダークUI。暖色3段+純黒ステージ。slate系は使わない。

（源泉: DESIGN.md）

## 教訓
- 3段: editor-bg #1e1a17 → editor-surface #272320 → editor-elevated #3a3530。
- 動画プレビューのステージだけ純黒#000（例外）。文字は暖色オフホワイト #f5f3f0 / muted #a8a29e。
- **slate(#e2e8f0等)は使わない**（ダークでも暖色を保つ）。primaryは通常と同じ #ef6108。
- 選択/アクティブは「透過primary rgba(239,97,8,.14)+primary枠」。影が効かないので明度差3段+borderで階層。

## 共通レイアウト（画像/動画で揃える）
左=ツール / 中央=プレビュー / 右=AIアシスト or 選択ツールのプロパティ（タブ切替）。
動画のみ下にタイムライン（時間ルーラー+赤い再生ヘッド+固定トラック列+同一時間軸整列）。
トラック色は意味色流用: テキスト=マゼンタ / ナレーション=accent-purple / 音楽=success / 図形=primary。

関連: [[editing-surfaces]] / [[warm-neutral-no-black]] / [[marker-loading-unification]]
