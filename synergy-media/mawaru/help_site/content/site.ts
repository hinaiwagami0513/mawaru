/* サイト全体の定義。カテゴリの並び順がそのままヘルプの情報設計になる。 */

import type { Category, TopConfig } from './types';

import start from './start';
import create from './create';
import editor from './editor';
import manage from './manage';
import analytics from './analytics';
import learning from './learning';
import growth from './growth';
import settings from './settings';
import contract from './contract';
import faq from './faq';

export const SITE = {
  name: 'マワル ヘルプセンター',
  owner: 'CHANGE株式会社',
  appUrl: 'https://mawaru-sns.jp/',
  year: 2026,
  updated: '2026-08-16',
};

export const categories: Category[] = [
  start,
  create,
  editor,
  manage,
  analytics,
  learning,
  growth,
  settings,
  contract,
  faq,
];

export const top: TopConfig = {
  /** ヒーロー下の検索キーワード。実際に問い合わせが多い言葉を並べる。 */
  chips: [
    '予約投稿',
    'アカウント連携',
    'リーチ',
    '画像を作る',
    '動画を作る',
    '確認待ち',
    'プラン変更',
    '投稿できない',
  ],

  /** はじめての人が踏む4ステップ。ここを外すと以降が全部ズレるので最上部に置く。 */
  start: [
    {
      title: 'プロジェクト設定',
      desc: 'サービスの情報をマワルに覚えさせます。ここの精度が投稿の質を決めます。',
      to: 'start/project',
    },
    {
      title: 'SNSアカウント登録',
      desc: 'どのアカウントを、どんな方針で運用するかを登録します。',
      to: 'start/account',
    },
    {
      title: 'SNSアカウント連携',
      desc: '連携すると予約投稿と自動分析が使えるようになります。',
      to: 'start/integration',
    },
    {
      title: '投稿をつくる',
      desc: '画像・動画・完成品の3つの作り方から選んで、1本作ってみます。',
      to: 'create/overview',
    },
  ],

  popular: [
    'create/overview',
    'start/integration',
    'manage/schedule',
    'analytics/overview',
    'editor/image-basic',
    'manage/approval',
    'faq/troubleshooting',
    'contract/plan-change',
  ],
};
