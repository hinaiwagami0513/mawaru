# marker-loading-unification

> 待ち・進行・完了・システム通知・日付区切りは全部 Marker に統一。自作しない。

（源泉: DESIGN.md）

## 教訓
- チャット内も、チャット外の解析待ちも Marker(shimmer + role=status)で表現。個別自作は色分裂の元。

## 右下 生成トレイ
- 動画/画像生成・解析の進行はヘッダーに置かない（複数並走で破綻）。右下集約トレイに積む（並走可・最小化可）。
- 各行はMarker、完了はsonnerトースト。マスコットFABと同じ右下=非同期処理の定位置。

## 全画面ロード（例外演出）
キツネが走るCSSアニメ+シンプルテキスト。プログレスバー・残り時間は使わない。

関連: [[editor-dark-theme]] / [[component-procurement]]
