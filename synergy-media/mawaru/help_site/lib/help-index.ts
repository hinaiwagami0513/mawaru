import { allArticles, plain } from './content';
import type { Block } from '@/content/types';

/* =========================================================================
   ヘルプ全体のインデックス。
   見出し（h2）単位で切っておくと、検索も「記事のどこか」ではなく
   「記事のこの節」まで返せる。アシスタントも ⌘K 検索もこれを使う。
   ========================================================================= */

export type Section = {
  /** 記事タイトル */
  title: string;
  /** 節の見出し。記事冒頭（h2 より前）は null */
  heading: string | null;
  /** 遷移先。節があれば #anchor 付き */
  href: string;
  cat: string;
  text: string;
};

export type Doc = {
  title: string;
  href: string;
  cat: string;
  desc: string;
  keywords: string;
  text: string;
};

/** 症状 → 対処。faq/troubleshooting の表から採る */
export type Remedy = { symptom: string; action: string; href: string; source: string };

/** よくあるご質問。全記事の faq ブロックから採る */
export type Faq = { q: string; a: string; href: string; title: string };

/** 用語 → 意味。用語集の表から採る。「リーチって何？」に直接答えるため */
export type Term = { term: string; meaning: string; href: string };

function blockText(b: Block): string {
  switch (b.t) {
    case 'h3':
    case 'p':
      return b.text;
    case 'ul':
    case 'ol':
      return b.items.join(' ');
    case 'steps':
      return b.items.map((s) => `${s.title} ${[s.body].flat().join(' ')}`).join(' ');
    case 'note':
      return `${b.title ?? ''} ${[b.body].flat().join(' ')}`;
    case 'table':
      return `${b.head.join(' ')} ${b.rows.flat().join(' ')}`;
    case 'faq':
      return b.items.map((f) => `${f.q} ${[f.a].flat().join(' ')}`).join(' ');
    case 'mini':
      return b.items.map((m) => `${m.title} ${m.body}`).join(' ');
    default:
      return '';
  }
}

const tidy = (s: string) => plain(s).replace(/\s+/g, ' ').trim();

export const sections: Section[] = [];
export const remedies: Remedy[] = [];
export const faqs: Faq[] = [];
export const glossary: Term[] = [];

for (const article of allArticles) {
  let heading: string | null = null;
  let anchor = '';
  let buffer: string[] = [];

  const flush = () => {
    const text = tidy(buffer.join(' '));
    if (text) {
      sections.push({
        title: article.title,
        heading,
        href: article.href + anchor,
        cat: article.category.title,
        text: text.slice(0, 900),
      });
    }
    buffer = [];
  };

  // 記事の説明文は冒頭セクションに入れておく（検索で拾えるように）
  buffer.push(article.desc, ...(article.can ?? []));

  for (const block of article.blocks) {
    if (block.t === 'h2') {
      flush();
      heading = block.text;
      anchor = `#${block.id}`;
      continue;
    }
    buffer.push(blockText(block));

    // 症状 → 対処の表を拾う（1列目が症状のもの）
    if (block.t === 'table' && /症状|うまくいかない|できない/.test(block.head[0] ?? '')) {
      for (const row of block.rows) {
        if (row.length >= 2) {
          remedies.push({
            symptom: tidy(row[0]),
            action: tidy(row[1]),
            href: article.href + anchor,
            source: article.title,
          });
        }
      }
    }

    // 用語集の表（1列目が「用語」）は定義として別に持つ
    if (block.t === 'table' && /^用語$/.test(block.head[0] ?? '')) {
      for (const row of block.rows) {
        if (row.length >= 2) {
          glossary.push({
            term: tidy(row[0]),
            meaning: tidy(row.slice(1).join(' / ')),
            href: article.href + anchor,
          });
        }
      }
    }

    if (block.t === 'faq') {
      for (const item of block.items) {
        faqs.push({
          q: tidy(item.q),
          a: tidy([item.a].flat().join(' ')),
          href: article.href + anchor,
          title: article.title,
        });
      }
    }
  }
  flush();
}

/** 記事単位のインデックス。セクションを束ねて作るので本文は二重に持たない */
export const docs: Doc[] = allArticles.map((a) => ({
  title: a.title,
  href: a.href,
  cat: a.category.title,
  desc: a.desc,
  keywords: (a.keywords ?? []).join(' '),
  text: sections
    .filter((s) => s.href.startsWith(a.href))
    .map((s) => `${s.heading ?? ''} ${s.text}`)
    .join(' ')
    .slice(0, 1200),
}));

/* ------------------------------------------------------------------ 照合 */

/** ひらがな/カタカナ・大小・全半角を吸収してゆるく当てる */
export function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[ァ-ヴ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[\s　]+/g, '');
}

/** 助詞や「〜できない」など、当たっても情報量の無い語は落とす */
const STOP = new Set([
  'の', 'が', 'を', 'に', 'は', 'で', 'と', 'も', 'や', 'から', 'まで', 'です', 'ます',
  'ください', 'したい', 'する', 'なる', 'こと', 'とき', ' どう', 'どう', 'なに', '何',
  'について', 'ですか', 'ますか',
]);

/**
 * 質問文を検索語に割る。
 * 日本語は空白で切れないので、カタカナ語・漢字語・英数字を「主要語」として抜く。
 * 素朴な n-gram だと「って」「です」まで語になって、意味のある語が埋もれる。
 */
export function terms(query: string): string[] {
  const out = new Set<string>();

  // カタカナ2文字以上 / 漢字2文字以上 / 英数2文字以上
  for (const w of query.match(/[ァ-ヴー]{2,}|[一-龥々]{2,}|[A-Za-zＡ-Ｚａ-ｚ0-9０-９]{2,}/g) ?? []) {
    const n = normalize(w);
    if (n && !STOP.has(n)) out.add(n);
  }

  // 「投稿されない」「連携できない」など、症状はここに出るので拾う
  for (const w of query.match(/[ぁ-ん]{2,}(?:ない|ません)/g) ?? []) {
    out.add(normalize(w));
  }

  // 主要語が取れない質問（ひらがなだけ等）は 3-gram でしのぐ
  if (!out.size) {
    const n = normalize(query);
    for (let i = 0; i + 3 <= n.length && i < 14; i++) out.add(n.slice(i, i + 3));
  }

  return [...out];
}

function score(hay: { strong: string; mid: string; weak: string }, ts: string[]) {
  const strong = normalize(hay.strong);
  const mid = normalize(hay.mid);
  const weak = normalize(hay.weak);
  let total = 0;
  let hits = 0;
  for (const t of ts) {
    const w = t.length; // 長い一致ほど効かせる
    if (strong.includes(t)) { total += 24 * w; hits++; }
    else if (mid.includes(t)) { total += 10 * w; hits++; }
    else if (weak.includes(t)) { total += 3 * w; hits++; }
  }
  return hits ? total * (1 + hits / ts.length) : 0;
}

/** 上位スコアとの相対で足切りする。「〜されない」だけ当たった候補を混ぜないため */
function cut<T>(ranked: { item: T; v: number }[], limit: number, ratio = 0.4) {
  if (!ranked.length) return [] as T[];
  const top = ranked[0].v;
  return ranked.filter((r) => r.v >= top * ratio).slice(0, limit).map((r) => r.item);
}

export function searchSections(query: string, limit = 3): Section[] {
  const ts = terms(query);
  if (!ts.length) return [];
  const ranked = sections
    .map((s) => ({
      item: s,
      // 定義や用語は節の冒頭に出るので、そこまでは強めに見る
      v: score({ strong: s.heading ?? s.title, mid: s.title + ' ' + s.text.slice(0, 140), weak: s.text }, ts),
    }))
    .filter((r) => r.v > 0)
    .sort((a, b) => b.v - a.v);
  return cut(ranked, limit, 0.3);
}

export function searchDocs(query: string, limit = 12): Doc[] {
  const ts = terms(query);
  if (!ts.length) return [];
  return docs
    .map((d) => ({ d, v: score({ strong: d.title, mid: d.keywords + ' ' + d.desc, weak: d.text }, ts) }))
    .filter((r) => r.v > 0)
    .sort((a, b) => b.v - a.v)
    .slice(0, limit)
    .map((r) => r.d);
}

export function searchRemedies(query: string, limit = 3): Remedy[] {
  const ts = terms(query);
  if (!ts.length) return [];
  const scored = remedies
    .map((r) => ({ item: r, v: score({ strong: r.symptom, mid: r.source, weak: r.action }, ts) }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);
  const ranked = cut(scored, limit * 3, 0.45).map((r) => ({ r }));

  // 同じ症状が複数の記事に載っている。並べても読み手には同じ話なので寄せる
  const seen = new Set<string>();
  const out: Remedy[] = [];
  for (const { r } of ranked) {
    const key = normalize(r.symptom);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
    if (out.length >= limit) break;
  }
  return out;
}

export function searchFaqs(query: string, limit = 2): Faq[] {
  const ts = terms(query);
  if (!ts.length) return [];
  return faqs
    .map((f) => ({
      f,
      // 質問文が当たっていることを必須にする。答えの側だけ当たっても出さない
      q: score({ strong: f.q, mid: '', weak: '' }, ts),
      v: score({ strong: f.q, mid: f.title, weak: f.a }, ts),
    }))
    .filter((x) => x.q > 0)
    .sort((a, b) => b.v - a.v)
    .slice(0, limit)
    .map((x) => x.f);
}

/**
 * 質問に含まれている用語を引く。「リーチって何ですか」→ リーチの定義。
 * 長い用語を優先する（「インプレッション」が「リーチ」より先に当たるように）。
 */
export function lookupTerm(query: string): Term | null {
  const q = normalize(query);
  const hit = glossary
    .filter((g) => {
      const t = normalize(g.term);
      return t.length >= 2 && q.includes(t);
    })
    .sort((a, b) => b.term.length - a.term.length)[0];
  return hit ?? null;
}

/** 一致箇所の周辺を切り出す */
export function snippet(text: string, query: string, len = 78) {
  const ts = terms(query).sort((a, b) => b.length - a.length);
  const n = normalize(text);
  for (const t of ts) {
    const at = n.indexOf(t);
    if (at >= 0) {
      const from = Math.max(0, at - 20);
      return (from > 0 ? '…' : '') + text.slice(from, from + len) + (text.length > from + len ? '…' : '');
    }
  }
  return text.slice(0, len) + (text.length > len ? '…' : '');
}
