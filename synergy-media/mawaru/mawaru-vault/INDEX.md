# INDEX — マワル vault の玄関口

全ページを1行説明つきで列挙。AIはここで「何があるか」を把握し、必要なページだけ開く。
新ページを作ったら**必ずここに1行足す**。

> ⚖️ 裁定ルール: **デザインはDESIGN.mdが正**。プロダクト仕様は最新の会議が正。矛盾は [[superseded]] に集約。

## entities/ — 具体物（1個1ページ）

- [[mawaru]] — プロダクト本体。機能・連携SNS・コピーの声・スタック。★9/8「マワル」に改名（ファイル名は旧名のまま）。
- [[maneku]] — ★マネク（MANEKU・姉妹サービス）。コメント→DMクーポン→来店数。
- [[hina]] — 陽菜（デザイナー/クライアント）。担当・環境・応答ルール。
- [[resme]] — レスミー（混同注意の別プロダクト）。
- [[cursor]] — 開発環境。コード直接不可・URL+スクショ縛りの前提。
- [[shadcn-ui]] — 部品調達元。そのまま使う一覧+調達ポリシー。
- [[tabler-icons]] — 唯一のアイコン系。SNSブランドアイコン対応。
- [[design-tokens]] — トークン現行値。源泉はDESIGN.md。
- [[dev-environment]] — ビルド実行・成果物出力の定型。
- [[creation-flow]] — 投稿作成フロー（4作成方法・5ステップ・分岐）。
- [[post-list-page]] — 投稿一覧v16（3タブ・カードグリッド・承認フロー・詳細sheet）。
- [[video-flow]] — AI動画生成フロー（4ステップ縦ステッパー）。
- [[script-gen-page]] — AI台本生成ページ（2カラム+テスト動画）。
- [[mawaru-drive]] — マワルドライブ（3ペイン・逆引き連携・★8/21に素材/資料のタブ統合）。
- [[template-feature]] — テンプレ機能（一覧v2・チャット作成・5画面）。
- [[editing-surfaces]] — 画像編集/動画作成/投稿編集の各画面。
- [[analysis-pages]] — 分析画面群（3タブ+掘り下げ2枚・期間表示は上部集約・CSS後勝ちの罠）。
- [[help-page]] — ヘルプページ（現行26記事 / freee流に作り直した help_site 51記事）。
- [[settings-page]] — 設定画面（8/19確定の4項目・プランは上部バッジへ・8/21 SNS一括変更）。
- [[onboarding]] — 初回オンボーディング/チュートリアル/課題タスク（8/28実装・削除済みの旧「タスク機能」と別物）。
- [[service-website]] — サービスサイト（⛔8/28ペンディング → ★9/8 構成は着手可・配色だけ保留）。

## concepts/ — 判断・パターン・教訓（1個1ページ）

デザイン系（源泉=DESIGN.md）:
- [[orange-only-interaction]] — オレンジは押せる/選ばれてる/進む先だけ。
- [[warm-neutral-no-black]] — 暖色ニュートラル。純黒・寒色グレー禁止。
- [[state-color-plus-glyph]] — 状態は色+形/アイコンのセット（例外はトーストだけ）。
- [[editor-dark-theme]] — エディタは別世界のダークUI。暖色3段+純黒ステージ。
- [[marker-loading-unification]] — 待ち・進行・完了はMarkerに統一。
- [[component-procurement]] — 汎用はshadcnそのまま、固有だけルール化。
- [[toast-orange-default]] — トーストは既定オレンジ、赤はエラーだけ。アイコンは✓統一。
- [[chart-single-hue-ramp]] — グラフは chart-1..5 のオレンジ単一色相ランプ。端は丸める。orange-only の唯一の例外。
- [[depth-and-rhythm]] — 影3段を使う・角丸は大小で分ける・セクション間32/内16・等幅グリッドを避ける。
- [[no-in-card-help-text]] — カード内に説明文・使い方・見本を置かない。足りないのは説明ではなく名前（8/24決定）。

プロダクト系（源泉=会議/worklog）:
- [[flow-ui-decided]] — チャットvsフロー論争はフローUIで確定。
- [[room-concept-abolished]] — ルーム概念は廃止、投稿フロー統合。
- [[omakase-vs-craft]] — 作り込み派と効率化派の両立・おまかせ作法。
- [[test-video-vs-editor]] — テスト動画とエディタの役割分離。
- [[filter-chip-vs-dropdown]] — PCチップ/SPドロップダウンの使い分け。
- [[tab-phase-optimization]] — 3タブは主役情報を変える。
- [[ai-generation-two-patterns]] — AI生成2パターン・素材任意・即時反映。
- [[vertical-stepper-standard]] — 手続きは縦ステッパー・ロックしない。
- [[drive-vs-learning]] — 素材と資料の役割の違い。置き場所は1つ、違いは「できること」で出す（8/21転換）。
- [[target-first]] — ターゲット整理が全ての前提。
- [[wire-checklist]] — ワイヤーHTML新規作成時のヘッダー・サイドバー・アイコン確認リスト。
- [[wording-level]] — UI文言の決まった経緯。ルール本体は DESIGN.md §Writing（対応表・書き分け・3原則）。
- [[brand-mawaru]] — ★サービス名は「マワル（MAWARU）」に確定（9/8）。命名の論理とマネクとの2本立ての型。
- [[selling-the-unstopped-state]] — ★売るのは投稿ではなく「止まらない状態」（9/8）。止まる場所と7/14/30日の介入。
- [[brand-rename-pending]] — ★名前は確定、メインカラーは未確定（9/8で半分解除）。何が着手できて何が保留か。
- [[ship-separation]] — ★マワル と SHIP は絶対に混ぜない。参照も同一コミットも禁止。`git add` はパス明示（`~/dev` が公開リポジトリのルート）。
- [[superseded]] — 失効した旧仕様と矛盾の裁定（★迷ったらここ）。

## raw/ — 生素材（読み取り専用・書き換え禁止）

- [[raw/README]] — なぜrawを触らないか。
- [[raw/figma-screens]] — Figma画面一覧（fileKey/node ID）。
- [[raw/version-history]] — 投稿作成フロー v1→v15 の変遷。
- [[raw/mtg-2026-05-29-sato]] — 5/29佐藤MTG（論点提示）。
- [[raw/mtg-2026-05-31-keisuke]] — 5/31会議（多くの方針が確定）。
- [[raw/worklog-2026-06-03-04]] — 6/3-4作業進展ログ。
- [[raw/worklog-2026-08]] — ★8月の日次作業ログ（新しい日を上に追記）。取引先共有の原本。素材集めは `tools/collect-worklog.sh`。
- [[raw/mtg-2026-06-19-iwagami]] — ★6/19佐藤MTG（新体制・ターゲット40-50代確定・AI生成は支援程度へ転換）。
- [[raw/mtg-2026-07-17-iwagami]] — 7/17MTG（承認フロー・分析ページを画像/HTML2形式に）。
- [[raw/mtg-2026-07-24-iwagami]] — 7/24MTG（承認者は編集可・動画エディタをCapCut参考にアイコン化）。
- [[raw/mtg-2026-07-31-iwagami]] — 7/31MTG（タイムライン改修・トークリール・Synergy Media移行）。
- [[raw/mtg-2026-08-19-iwagami]] — ★8/19MTG（設定4項目・学習→AI読み取り資料・承認済みラベル/再承認・CapCut準拠・サイト作り直し）。
- [[raw/mtg-2026-08-21-iwagami]] — ★8/21MTG（「次へ」廃止・仮/本予約をフロー内・素材の入口統合・セーフティゾーン左右・**PRベース共同開発へ移行**）。グリーンアップサイクルの議題は意図的に除外。
- [[raw/mtg-2026-08-28-iwagami]] — ★8/28MTG（**ブランド名/メインカラーが変わるかも**・HPとキャラは保留・スマホ対応最優先・オンボーディング実装）。報酬/契約と他グループの議題は意図的に除外。
- [[raw/mtg-2026-09-11-iwagami]] — ★9/11MTG（**青系デザインを採用**・キャラ不在時はロゴのアニメーション・マネクは10月以降へ延期・ロゴデータ一式をドライブへ）。グリーンアップサイクルの議題は意図的に除外。
- [[raw/slide-2026-09-08-mawaru-naming]] — ★9/8 社内説明スライド全8枚（**マワル改名確定**・命名の論理・継続率の実データ・止まる場所・マネク）。CONFIDENTIAL。
- [[raw/design-audit-2026-08-19-home]] — ★8/19 ホーム画面デザイン監査。影スケール3段が全て未使用・ヒーローグラデ未使用・セクション間が全部22px・ヒーローと見出しが同階層。Design C / AI Slop D。→ F1〜F8 をホームに反映済み（[[depth-and-rhythm]]）。他ワイヤーは未対応。
