# brand-mawaru（サービス名は「マワル」。マネクと2本立ての型）

> 9/8: サービス名が **いいねAI → マワル（MAWARU）** に決まった。姉妹サービス **マネク（MANEKU）** と2本立て。
> 8/28 からの [[brand-rename-pending]] は名前については解除。**メインカラーはまだ確定していない**。

## 決まったこと（9/8 社内説明スライド）
- サービス名: **マワル / MAWARU**。タグライン「**全店、止まらない。だから、伸びる。**」
- ドメイン: **mawaru-sns.jp**
- サポーターの呼び名: **マワルサポーター**（支援メニュー名「マワルサポート」は**仮**）
- 姉妹サービス: **マネク / MANEKU**（[[maneku]]）
- 会社の立ち位置を「SNS運用ツールの会社」→「**止まらない店を増やす会社**」に置き換える

## なぜ「マワル」なのか（この論理を崩さない）
1. **3〜4文字のカタカナ**が中小企業向けで通る形（カンリー／サキヨミ／スマレジ）。造語は覚えさせるのに広告費がかかる。
2. **意味の分かる日本語のまま3音**。「マ・ワ・ル」。
3. **口に出したとき指示になる**。「マワルに画像アップしといて」で通じ、電話でも聞き返されない。
4. 「回る」が現場で**3つの意味を同時に**指す — 運用が回る / 動画が回る / 店舗が回る。
   止まらないから回りはじめ、回るから見られ、見られるから店が回る。

## 2ブランドの型（3本目もこの型で足す）
| | マワル | マネク |
|---|---|---|
| 意味 | 回る | 招く |
| 売っているもの | 運用が止まらない | 客が来た数が見える |

どちらも**3音**、どちらも**「マ」から始まる**。営業では「マワルとマネク」で済む。
→ 新サービスを足すときはこの制約（3音・マ始まり・意味の分かる日本語）に合わせる。

## まだ確定していないもの
- **メインカラー**。スライド本文にプロダクトの色の記述は無い。資料が紺地なのは SYNERGY MEDIA の**社内資料テンプレの色**であって、UIのメインカラーを決めたものではない。
  → DESIGN.md の primary（オレンジ `#fe7235`）は**引き続き現行値**として扱う（[[design-tokens]]）。
- **ロゴ / キャラクター**。名前が決まったので着手条件は片方クリア。色が決まれば動ける（[[brand-rename-pending]] の解除順: ロゴ → キャラクター → サービスサイト）。
  ⚠️ 現行の狐はお腹に「いいねAI」の文字入り。**この時点で作り直し確定**。

## 波及（9/10に本文リネーム実施）
**済**: UIコピー（`mawaru_board/` 全ワイヤー）・ヘルプ本文（`help_site/` ソース）・`DESIGN.md`・
`mawaru-knowledge.md`・`tools/`・vault の entities / concepts / INDEX / CLAUDE.md。計75ファイル。

**意図的に据え置き**:
- `raw/` — 一次情報。会議タイトル「岩上さん×いいねAI」や当時の発言をそのまま保つ（vault ルール#4）。
- `superseded.md` の失効記録と、狐の腹の文字の記述 — 「旧名が何だったか」の記録なので残す。
- `SYNERGY.md` の代理店フッター引用と旧ドメイン `iine-ai.com` — 改名前の観察記録。

## 9/11に完了したぶん
ディレクトリ名（`iine-ai/`→`mawaru/`）・画像ファイル名・ページ名 `[[mawaru]]` は 9/10 に済み。
9/11 に残りを片付けた。

- **GitHub リポジトリ名** `iineai` → `mawaru`。公開URLも `github.io/iineai/` → **`github.io/mawaru/`**。
  Pages はプロジェクトサイトなので旧パスへのリダイレクトが張られない。**旧URLは404**。
  `help-pages.yml` の `BASE_PATH` も `/mawaru/help` に追従済み。
- **launchd ジョブ名** `jp.shipinc.iineai.worklog` → `jp.shipinc.mawaru.worklog`（`.catchup` も）。
  マーカーも `~/Library/Logs/.mawaru-worklog-refreshed`。
- **JS グローバル名** `IineOnboarding` → `MawaruOnboarding`、`IineTour` → `MawaruTour`
  （`onboarding.js` `tour.js` と呼び出し側 HTML 3枚）。
- ヘルプ用語集の見出しアンカー `id: 'iine'` → `'mawaru'`。

**未処理**: `iineAI/` ディレクトリ（**別リポジトリ**。worktree が張られているので単独では動かせない）、
`/iine-ai-cursor/`（`~/dev` 直下のローカル作業フォルダ）、
`green-upcycle` 側の CSS クラス `.sns_iineAI`（別グループなので越境しない）。

関連: [[mawaru]] / [[maneku]] / [[selling-the-unstopped-state]] / [[brand-rename-pending]] / [[design-tokens]] / [[service-website]]
出典: [[raw/slide-2026-09-08-mawaru-naming]]
