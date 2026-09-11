'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconChevronRight } from '@tabler/icons-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { categoryIcon } from '@/components/icons';
import { categories } from '@/content/site';
import { cn } from '@/lib/utils';

/** 記事・カテゴリページの左ナビ。現在のカテゴリだけ開いた状態で出す */
export function CategoryNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="カテゴリ" className="space-y-0.5">
      {categories.map((category) => {
        const Icon = categoryIcon[category.icon];
        const isCurrent = pathname.startsWith(`/${category.id}/`);

        return (
          <Collapsible key={category.id} defaultOpen={isCurrent} className="group/nav">
            <CollapsibleTrigger
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-bold transition-colors hover:bg-card',
                isCurrent ? 'text-primary' : 'text-foreground'
              )}
            >
              <Icon className={cn('size-4.5', isCurrent ? 'text-primary' : 'text-muted-foreground')} />
              <span>{category.title}</span>
              <IconChevronRight className="ml-auto size-3.5 text-muted-foreground transition-transform group-data-[state=open]/nav:rotate-90" />
            </CollapsibleTrigger>

            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <ul className="my-1 ml-[18px] space-y-0.5 border-l pl-2.5">
                {category.articles.map((article) => {
                  const href = `/${category.id}/${article.slug}/`;
                  const active = pathname === href;
                  return (
                    <li key={article.slug}>
                      <Link
                        href={href}
                        onClick={onNavigate}
                        className={cn(
                          'block rounded-md px-2.5 py-1.5 text-sm leading-relaxed transition-colors',
                          active
                            ? 'bg-accent font-bold text-accent-foreground'
                            : 'text-muted-foreground hover:bg-card hover:text-foreground'
                        )}
                      >
                        {article.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </nav>
  );
}
