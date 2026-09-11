/** ヘルプ記事のデータ型。表示側（components/）はこの形しか知らない。 */

export type IconKey =
  | 'rocket'
  | 'sparkles'
  | 'photo'
  | 'list'
  | 'chart'
  | 'book'
  | 'ad'
  | 'settings'
  | 'receipt'
  | 'help';

export type NoteKind = 'point' | 'caution' | 'ref' | 'danger';

export type Block =
  | { t: 'h2'; id: string; text: string }
  | { t: 'h3'; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'steps'; items: { title: string; body: string | string[] }[] }
  | { t: 'note'; kind?: NoteKind; title?: string; body: string | string[] }
  | { t: 'table'; head: string[]; rows: string[][]; rowhead?: boolean }
  | { t: 'fig'; shot: string; caption?: string }
  | { t: 'faq'; items: { q: string; a: string | string[] }[] }
  | { t: 'mini'; items: { title: string; body: string }[] };

export type Article = {
  slug: string;
  title: string;
  desc: string;
  updated?: string;
  /** 新機能。トップの「新しく追加された機能」と一覧のバッジに出る */
  isNew?: boolean;
  /** 対象プラン。未指定なら全プラン扱いで表示しない */
  plan?: string;
  /** 必要な権限 */
  role?: string;
  /** 画面のどこにあるか */
  where?: string;
  /** 検索で拾わせたい語。本文に無い言い回しを足す用 */
  keywords?: string[];
  /** 「このページでできること」 */
  can?: string[];
  blocks: Block[];
  /** `カテゴリid/slug` の配列 */
  related?: string[];
};

export type Category = {
  id: string;
  title: string;
  icon: IconKey;
  desc: string;
  articles: Article[];
};

export type TopConfig = {
  chips: string[];
  start: { title: string; desc: string; to: string }[];
  popular: string[];
};
