import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CategoryNav } from '@/components/category-nav';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { cn } from '@/lib/utils';

export type Crumb = { label: string; href?: string };

/** カテゴリページ・記事ページ共通の3カラム（左ナビ / 本文 / 目次） */
export function DocShell({
  crumbs,
  aside,
  children,
}: {
  crumbs: Crumb[];
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />

      <div className="border-b bg-secondary">
        <div className="mx-auto max-w-[1240px] px-4 py-2.5 sm:px-6">
          <Breadcrumb>
            <BreadcrumbList className="text-[13px]">
              {crumbs.map((crumb, i) => (
                <span key={i} className="contents">
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {i < crumbs.length - 1 ? <BreadcrumbSeparator /> : null}
                </span>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div
        className={cn(
          'mx-auto grid max-w-[1240px] items-start gap-10 px-4 pb-16 pt-6 sm:px-6',
          aside
            ? 'md:grid-cols-[264px_minmax(0,1fr)] xl:grid-cols-[264px_minmax(0,1fr)_224px]'
            : 'md:grid-cols-[264px_minmax(0,1fr)]'
        )}
      >
        {/* Radix の ScrollArea Root は inline style で position:relative を当てるので、
            sticky は外側の div に持たせる（Root に sticky を書いても効かない） */}
        <div className="sticky top-24 hidden md:block">
          <ScrollArea className="h-[calc(100svh-9rem)] pr-2">
            <CategoryNav />
          </ScrollArea>
        </div>

        <main className="min-w-0">{children}</main>

        {aside ? <aside className="hidden xl:block">{aside}</aside> : null}
      </div>

      <SiteFooter />
    </>
  );
}
