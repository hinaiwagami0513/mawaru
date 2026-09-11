import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { ArticleList } from '@/components/article-list';
import { DocShell } from '@/components/doc-shell';
import { allArticles, getCategory } from '@/lib/content';
import { categories } from '@/content/site';

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const found = getCategory(category);
  return found ? { title: found.title, description: found.desc } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const found = getCategory(category);
  if (!found) notFound();

  const articles = allArticles.filter((a) => a.category.id === found.id);

  return (
    <DocShell crumbs={[{ label: 'ヘルプセンター', href: '/' }, { label: found.title }]}>
      <div className="mb-7 border-b pb-5">
        <h1 className="mb-2.5 text-[25px] font-black sm:text-3xl">{found.title}</h1>
        <p className="mb-3 text-base text-muted-foreground sm:text-[17px]">{found.desc}</p>
        <p className="text-[13px] text-muted-foreground">
          全 <strong className="font-bold text-foreground">{articles.length}</strong> 記事
        </p>
      </div>

      <ArticleList articles={articles} marker="number" showNewBadge />
    </DocShell>
  );
}
