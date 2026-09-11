import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArticleBlocks } from '@/components/article-blocks';
import { ArticleList } from '@/components/article-list';
import { DocShell } from '@/components/doc-shell';
import { Helpful } from '@/components/helpful';
import { Toc } from '@/components/toc';
import { IconCheck } from '@/components/icons';
import { Inline } from '@/components/inline';
import { allArticles, getArticle } from '@/lib/content';
import { SITE } from '@/content/site';

export function generateStaticParams() {
  return allArticles.map((a) => ({ category: a.category.id, slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(`${category}/${slug}`);
  return article ? { title: article.title, description: article.desc } : {};
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = getArticle(`${category}/${slug}`);
  if (!article) notFound();

  const headings = article.blocks.flatMap((b) => (b.t === 'h2' ? [{ id: b.id, text: b.text }] : []));
  const related = (article.related ?? [])
    .map((key) => allArticles.find((a) => `${a.category.id}/${a.slug}` === key))
    .filter((a) => a !== undefined);

  const target = [
    article.plan && { label: '対象プラン', value: article.plan },
    article.role && { label: '対象の権限', value: article.role },
    article.where && { label: '画面の場所', value: article.where },
  ].filter((row) => row !== undefined && row !== '');

  return (
    <DocShell
      crumbs={[
        { label: 'ヘルプセンター', href: '/' },
        { label: article.category.title, href: `/${article.category.id}/` },
        { label: article.title },
      ]}
      aside={<Toc items={headings} />}
    >
      {/* 見出し部 -------------------------------------------------------- */}
      <div className="mb-6 border-b pb-5">
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-muted-foreground">
            {article.category.title}
          </Badge>
          {article.isNew ? (
            <Badge className="border-primary/30 bg-primary-subtle text-primary">新機能</Badge>
          ) : null}
          {article.plan ? (
            <Badge className="border-info/25 bg-info-subtle text-info">{article.plan}</Badge>
          ) : null}
        </div>

        <h1 className="mb-3 text-[25px] font-black leading-snug sm:text-[32px]">{article.title}</h1>
        <p className="mb-4 text-base text-muted-foreground sm:text-[17px]">
          <Inline>{article.desc}</Inline>
        </p>
        <p className="text-[13px] text-muted-foreground">
          最終更新: <strong className="font-bold text-foreground">{article.updated ?? SITE.updated}</strong>
        </p>
      </div>

      {/* 対象（プラン・権限・場所） --------------------------------------- */}
      {target.length ? (
        <dl className="mb-6 grid overflow-hidden rounded-md border bg-border text-[15px] sm:grid-cols-[112px_1fr] sm:gap-px">
          {target.map((row) => (
            <div key={row.label} className="contents">
              <dt className="bg-muted px-3.5 pb-0.5 pt-2.5 font-bold sm:py-2.5">{row.label}</dt>
              <dd className="bg-card px-3.5 pb-2.5 pt-0 sm:py-2.5">
                <Inline>{row.value}</Inline>
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {/* このページでできること ------------------------------------------- */}
      {article.can?.length ? (
        <Card className="mb-7 gap-0 py-5">
          <CardContent className="px-5">
            <p className="mb-2 flex items-center gap-1.5 text-base font-bold">
              <IconCheck className="size-[18px] text-primary" />
              このページでできること
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {article.can.map((item, i) => (
                <li key={i} className="text-base leading-relaxed">
                  <Inline>{item}</Inline>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <ArticleBlocks blocks={article.blocks} />

      {/* 記事フッター ----------------------------------------------------- */}
      <div className="mt-12 border-t pt-7">
        <Helpful />
        {related.length ? (
          <div>
            <p className="mb-3 text-[17px] font-bold">あわせて読みたい</p>
            <ArticleList articles={related} marker="dot" />
          </div>
        ) : null}
      </div>
    </DocShell>
  );
}
