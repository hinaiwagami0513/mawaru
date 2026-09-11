# mawaru（マワル / MAWARU）

> SNS投稿管理 + AI生成 SaaS。親しみやすくポップ、かつ信頼感。オレンジ1色をインタラクションの主役に。
> ★ **サービス名は「マワル」に変わった**（9/8確定 [[brand-mawaru]]）。9/10に本文の一括リネーム済み。
> ファイル名と `[[mawaru]]` リンクは旧名のまま（下の「未処理のリネーム」参照）。
> ⚠️ `raw/` は一次情報なので**意図的に「いいねAI」のまま**。過去の記録として読む。

## 基本情報
- 運営会社: CHANGE株式会社（佐藤正太郎が事業主導権、6/19〜）/ 製作・デザイン: ship Inc.（[[hina]]所属）
  ※ 9/8のスライドは **© SYNERGY MEDIA inc.** 名義（7/31の Synergy Media 移行と整合）。
- デザイン/UX決定権限: 真澤洋利・岩上案理に委譲（6/19確定）
- ドメイン: **mawaru-sns.jp**（★9/8。旧 iine-ai.com）/ Figma fileKey: `YP9jrVYzJe3kAyR3BtO5FA`（[[raw/figma-screens]]）
- 連携SNS: Instagram / X / TikTok / YouTube の4つ。
- 姉妹サービス: **マネク / MANEKU**（[[maneku]]）

## ターゲット（6/19確定 / 9/8に業種を明示）
**40代〜50代の未経験者**。設問なし・直感的操作・ボタン大型化。詳細は [[target-first]]。
業種はいま**美容室・サロン・パーソナルジム**、次に**宿泊・ウェディング・飲食**（9/8）。年齢層の変更はない。

## 主要機能
AI投稿作成（企画→台本→投稿文+画像）/ AI動画作成 / 複数企画一括生成 / 分析・カレンダー / **AI読み取り資料**（旧「学習」・8/19改名 [[drive-vs-learning]]）。
※AI生成は**支援程度**。実写撮影が軸、素材がない場合のみAI補完（6/19方針転換 [[raw/mtg-2026-06-19-iwagami]]）。

## 撮影サービスの位置づけ（8/19・検討中）
出張撮影は現在ラクスルに委託。今後は奥澤主導で「**撮り方を教える**」型に切り替える案が出ている。
綺麗に撮るだけではショート動画にならないため。関東圏外の費用対効果が論点で未確定。
出典: [[raw/mtg-2026-08-19-iwagami]]

## ★ブランド（9/8: 名前は確定、色は未確定）
サービス名は **マワル（MAWARU）**。タグライン「**全店、止まらない。だから、伸びる。**」
命名の論理と2ブランドの型は [[brand-mawaru]]、残っているペンディングの線引きは [[brand-rename-pending]]。
**メインカラーは未確定のまま**。primary オレンジ `#fe7235` は現行値として有効（[[design-tokens]]）。

## ★売っているもの（9/8転換）
「投稿を作れる道具」ではなく「**投稿が出続けている状態**」。店は素材だけ渡し、編集・企画・投稿はこちらで回す。
止まる場所（最初の30日/毎週/毎月）への介入とマワルサポーターは [[selling-the-unstopped-state]]。

## キャラ・コピーの声
- 🦊きつねマスコット＝AIアシスタント兼案内役（画像アセット表示、絵文字は廃止）。
  ⚠️ 現行の狐はお腹に「いいねAI」の文字入り。改名により**作り直し確定**（[[brand-rename-pending]]）。
- 機能の主語を「AI」にしない。「AIが企画します」でなく「企画を作る」＝**結果を語る**。
- マスコットのヒントは一度消したら再表示しない。

## 見た目の芯（詳細は concepts）
[[warm-neutral-no-black]] / [[orange-only-interaction]] / [[state-color-plus-glyph]] / [[editor-dark-theme]]

## 実装スタック（★最新）
Next.js / Tailwind CSS v4 / [[shadcn-ui]] / [[tabler-icons]]。トークンは [[design-tokens]]。
※旧「React+インラインスタイル/Tailwind禁止」は失効 → [[superseded]]。

## 主要画面
[[creation-flow]] / [[post-list-page]] / [[video-flow]] / [[script-gen-page]] / [[mawaru-drive]] / [[template-feature]] / [[editing-surfaces]] / [[settings-page]] / [[onboarding]]

## サービスサイト
[[service-website]]（8/19: LP的な現行構成をやめ、標準的なサービスホームページを作り直す）
