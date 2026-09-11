import Image from 'next/image';
import Link from 'next/link';
import { IconChevronRight, IconMail } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArticleList } from '@/components/article-list';
import { SearchChips, SearchTrigger } from '@/components/search-provider';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { BeginnerIcon, categoryIcon } from '@/components/icons';
import { allArticles } from '@/lib/content';
import { categories, top } from '@/content/site';
import { asset } from '@/lib/utils';

export default function HomePage() {
  const popular = top.popular
    .map((key) => allArticles.find((a) => `${a.category.id}/${a.slug}` === key))
    .filter((a) => a !== undefined);
  const fresh = allArticles.filter((a) => a.isNew).slice(0, 8);

  return (
    <>
      <SiteHeader showSearch={false} />

      <section className="border-b bg-[radial-gradient(900px_320px_at_50%_-60px,rgba(255,151,30,0.2),transparent_70%),linear-gradient(180deg,var(--primary-subtle)_0%,var(--secondary)_100%)] px-4 pb-12 pt-9 text-center sm:px-6 sm:pt-14">
        <Image
          src={asset('/img/fox-support.png')}
          alt=""
          width={132}
          height={112}
          priority
          className="mx-auto mb-1.5 h-auto w-24 drop-shadow-[0_6px_14px_rgba(42,40,38,0.12)] sm:w-33"
        />
        <h1 className="mb-5 text-[26px] font-black sm:text-[38px]">お困りごとを解決します</h1>
        <div className="mx-auto max-w-2xl">
          <SearchTrigger variant="hero" />
        </div>
        <SearchChips items={top.chips} />
      </section>

      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* はじめての方へ ------------------------------------------------- */}
        <section className="py-8 sm:py-11">
          <div className="mb-4 flex items-center gap-2.5">
            <BeginnerIcon className="size-7 text-success sm:size-8" />
            <h2 className="text-xl sm:text-2xl">はじめての方へ</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {top.start.map((step, i) => (
              <Link key={step.to} href={`/${step.to}/`} className="group">
                <Card className="h-full gap-0 py-4 transition-colors group-hover:border-primary">
                  <CardContent className="px-4">
                    <p className="text-xs font-bold tracking-wider text-primary">STEP {i + 1}</p>
                    <p className="mt-1 mb-1.5 text-[17px] font-bold leading-snug">{step.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* カテゴリ ------------------------------------------------------- */}
        <section className="py-8 sm:py-11">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="text-xl sm:text-2xl">カテゴリから探す</h2>
            <span className="text-sm font-medium text-muted-foreground">
              全 {allArticles.length} 記事
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = categoryIcon[category.icon];
              return (
                <Link key={category.id} href={`/${category.id}/`} className="group">
                  <Card className="h-full gap-3 transition-all group-hover:-translate-y-0.5 group-hover:border-primary group-hover:shadow-md">
                    <CardHeader className="gap-0">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 flex-none place-items-center rounded-md bg-primary-subtle text-primary">
                          <Icon className="size-5.5" />
                        </span>
                        <div>
                          <CardTitle className="text-lg leading-snug">{category.title}</CardTitle>
                          <p className="text-[13px] font-medium text-muted-foreground">
                            {category.articles.length} 記事
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                        {category.desc}
                      </p>
                      <Separator className="mb-2.5" />
                      <ul className="space-y-0.5">
                        {category.articles.slice(0, 3).map((article) => (
                          <li key={article.slug} className="truncate text-sm">
                            ・{article.title}
                          </li>
                        ))}
                      </ul>
                      <span className="mt-2.5 inline-flex items-center gap-1 text-sm font-bold text-primary">
                        すべて見る
                        <IconChevronRight className="size-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 人気 / 新機能 --------------------------------------------------- */}
        <section className="grid gap-8 py-8 sm:py-11 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl sm:text-2xl">よく見られているページ</h2>
            <ArticleList articles={popular} marker="number" showCategory />
          </div>
          <div>
            <h2 className="mb-4 text-xl sm:text-2xl">新しく追加された機能</h2>
            <ArticleList articles={fresh} marker="sparkle" showCategory />
          </div>
        </section>

        {/* 問い合わせ ------------------------------------------------------ */}
        <section className="py-8 sm:py-11">
          <Card className="border-border bg-[linear-gradient(135deg,var(--primary-subtle),var(--secondary))]">
            <CardContent className="flex flex-wrap items-center gap-6">
              <span className="grid size-13 flex-none place-items-center rounded-md bg-primary-subtle text-primary">
                <IconMail className="size-6.5" />
              </span>
              <div className="min-w-60 flex-1">
                <h2 className="mb-1.5 text-xl">解決しないときは</h2>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  画面右下のサポートボタン、またはお問い合わせフォームからご連絡ください。
                  <br />
                  症状・画面名・発生した日時を添えていただくと解決が早くなります。
                </p>
              </div>
              <Button asChild>
                <Link href="/faq/contact/">お問い合わせ方法を見る</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}
