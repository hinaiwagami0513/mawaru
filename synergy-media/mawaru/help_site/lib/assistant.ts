import {
  lookupTerm,
  searchFaqs,
  searchRemedies,
  searchSections,
  snippet,
  type Faq,
  type Remedy,
  type Section,
  type Term,
} from './help-index';

/* =========================================================================
   ヘルプアシスタントの中身。
   聞かれたことに対して 3段で答える。

     1. suggest … ヘルプの該当箇所を出す（まずは公式の記述に当てる）
     2. solve   … それで解決しないとき、原因と対処を組み立てて出す
     3. contact … それでも駄目なら問い合わせ文の下書きを渡す

   ⚠️ 生成AIの接続点は askLlm ひとつだけ。詳しくは下の registerLlm を参照。
   ========================================================================= */

export type Suggestion = {
  label: string;
  heading: string | null;
  href: string;
  cat: string;
  excerpt: string;
};

export type Remediation = {
  /** 「連携が切れている可能性があります」のような、症状に対する見立て */
  cause: string;
  /** やること */
  action: string;
  href: string;
  source: string;
};

export type SolveResult = {
  /** 生成AIが答えたのか、ヘルプの記述から組み立てたのか */
  origin: 'llm' | 'help';
  answer: string;
  steps: Remediation[];
  refs: Suggestion[];
};

/* --------------------------------------------------------- LLM 接続点 */

export type LlmAsk = (input: {
  question: string;
  /** ヘルプから引いた関連箇所。そのまま根拠として渡す */
  context: { heading: string; href: string; text: string }[];
}) => Promise<string>;

let llm: LlmAsk | null = null;

/**
 * 生成AIを繋ぐときはここに登録する。
 *
 * いまの公開先（GitHub Pages）はサーバーが無く、ブラウザから直接 API を叩くと
 * キーが露出するので未接続。本番（Next.js のサーバーあり）に載せるときは
 * Route Handler を1本立てて、そこ経由で Claude API を呼ぶ:
 *
 *   // app/api/help-assistant/route.ts （サーバー側。キーは環境変数）
 *   export async function POST(req: Request) { ...anthropic.messages.create... }
 *
 *   // クライアント側の初期化で
 *   registerLlm(async ({ question, context }) => {
 *     const r = await fetch('/api/help-assistant', {
 *       method: 'POST',
 *       body: JSON.stringify({ question, context }),
 *     });
 *     return (await r.json()).answer;
 *   });
 *
 * context には該当セクションを渡してあるので、ヘルプの記述に基づいて
 * 答えさせること。ヘルプに無いことを断定させない。
 */
export function registerLlm(fn: LlmAsk) {
  llm = fn;
}

export function hasLlm() {
  return llm !== null;
}

/* ------------------------------------------------------- 1. 該当箇所を出す */

function toSuggestion(s: Section, query: string): Suggestion {
  return {
    label: s.title,
    heading: s.heading,
    href: s.href,
    cat: s.cat,
    excerpt: snippet(s.text, query),
  };
}

export function suggest(query: string): {
  hits: Suggestion[];
  faq: Faq | null;
  term: Term | null;
} {
  // 「◯◯って何？」は定義を先に返す。探させない
  const term = lookupTerm(query);
  const hits = searchSections(query, 3).map((s) => toSuggestion(s, query));
  const faq = searchFaqs(query, 1)[0] ?? null;
  return { hits, faq, term };
}

/* --------------------------------------------------- 2. 解決方法を組み立てる */

/** 「〜が切れている可能性があります」まで言い切れるよう、対処文から見立てを作る */
function toRemediation(r: Remedy): Remediation {
  // 「◯◯を確認してください → ◯◯が原因のことがあります」のように前段を補う
  const cause = r.symptom.replace(/^\*\*|\*\*$/g, '');
  return { cause, action: r.action, href: r.href, source: r.source };
}

export async function solve(query: string): Promise<SolveResult> {
  const sections = searchSections(query, 4);
  const refs = sections.map((s) => toSuggestion(s, query));
  const steps = searchRemedies(query, 4).map(toRemediation);
  const faq = searchFaqs(query, 1)[0] ?? null;

  // 生成AIが繋がっていればそちらを優先する（根拠としてヘルプの該当箇所を渡す）
  if (llm) {
    try {
      const answer = await llm({
        question: query,
        context: sections.map((s) => ({
          heading: s.heading ?? s.title,
          href: s.href,
          text: s.text,
        })),
      });
      if (answer?.trim()) return { origin: 'llm', answer: answer.trim(), steps, refs };
    } catch {
      // 落ちてもヘルプ由来の回答で続ける
    }
  }

  const answer = composeAnswer(query, { steps, faq, sections });
  return { origin: 'help', answer, steps, refs };
}

function composeAnswer(
  query: string,
  { steps, faq, sections }: { steps: Remediation[]; faq: Faq | null; sections: Section[] }
) {
  if (steps.length) {
    return steps.length === 1
      ? 'ヘルプの記述だと、次が原因のことが多いです。'
      : `ヘルプの記述だと、原因は ${steps.length} 通り考えられます。上から順に確認してみてください。`;
  }
  if (faq) return faq.a;
  if (sections.length) {
    const s = sections[0];
    return `「${s.heading ?? s.title}」に近い内容が書かれています。${snippet(s.text, query, 120)}`;
  }
  return '';
}

/* --------------------------------------------------------- 3. 問い合わせへ */

/** 問い合わせフォームにそのまま貼れる下書き。contact 記事の5項目に合わせている */
export function inquiryDraft(query: string, tried: string[] = []) {
  const lines = [
    '【お問い合わせ内容】',
    query.trim() || '（症状をご記入ください）',
    '',
    '【どの画面か】',
    '（例: 投稿作成 > 画像編集ルーム）',
    '',
    '【何をしたか】',
    '（例: 「4枚まとめて生成」を押した）',
    '',
    '【どうなったか】',
    '（例: 2枚目だけ生成されず、エラー表示も出ない）',
    '',
    '【いつ起きたか】',
    '（例: 2026年8月16日 14時ごろ）',
    '',
    '【対象のアカウント】',
    '（例: Instagram / @xxxxx）',
  ];
  if (tried.length) {
    lines.push('', '【試したこと】', ...tried.map((t) => `・${t}`));
  }
  return lines.join('\n');
}

/** 最初に出す質問の例。よく聞かれる形にしておく */
export const STARTERS = [
  '予約した時間に投稿されない',
  'リーチって何ですか？',
  '画像の枚数は何枚がいい？',
  'Instagramと連携できない',
  '確認待ちから進まない',
];
