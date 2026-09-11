import { categories } from '@/content/site';
import type { Article, Category } from '@/content/types';

export type ArticleWithCategory = Article & { category: Category; href: string };

export const allArticles: ArticleWithCategory[] = categories.flatMap((category) =>
  category.articles.map((a) => ({ ...a, category, href: `/${category.id}/${a.slug}/` }))
);

const byKey = new Map(allArticles.map((a) => [`${a.category.id}/${a.slug}`, a]));

/** `カテゴリid/slug` から記事を引く */
export function getArticle(key: string) {
  return byKey.get(key);
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

/**
 * 本文中のリンク記法 `[表示](create/overview)` の宛先を実URLに直す。
 * 外部URL・アンカーはそのまま返す。
 */
export function resolveHref(target: string) {
  if (/^(https?:|mailto:|#|\/)/.test(target)) return target;
  return byKey.has(target) ? `/${target}/` : `/${target}/`;
}

/** インライン記法（**太字** / `code` / [表示](リンク)）を React に渡せる断片へ割る */
export type Inline =
  | { kind: 'text'; value: string }
  | { kind: 'strong'; value: string }
  | { kind: 'code'; value: string }
  | { kind: 'link'; value: string; href: string };

const INLINE = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of src.matchAll(INLINE)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ kind: 'text', value: src.slice(last, at) });
    if (m[1]) out.push({ kind: 'strong', value: m[1] });
    else if (m[2]) out.push({ kind: 'code', value: m[2] });
    else if (m[3]) out.push({ kind: 'link', value: m[3], href: resolveHref(m[4]) });
    last = at + m[0].length;
  }
  if (last < src.length) out.push({ kind: 'text', value: src.slice(last) });
  return out;
}

/** 記法を落として素のテキストにする（検索インデックス用） */
export function plain(src: string) {
  return src
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}
