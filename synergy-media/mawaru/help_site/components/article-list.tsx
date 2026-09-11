import Link from 'next/link';
import { IconChevronRight, IconPointFilled, IconSparkles } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { ArticleWithCategory } from '@/lib/content';
import { cn } from '@/lib/utils';

type Marker = 'number' | 'sparkle' | 'dot';

/** カテゴリ一覧・人気記事・関連記事で共通に使う行リスト */
export function ArticleList({
  articles,
  marker = 'number',
  showCategory = false,
  showNewBadge = false,
}: {
  articles: ArticleWithCategory[];
  marker?: Marker;
  showCategory?: boolean;
  showNewBadge?: boolean;
}) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <ul>
        {articles.map((article, i) => (
          <li key={article.href} className="border-b last:border-b-0">
            <Link
              href={article.href}
              className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-muted"
            >
              <span
                className={cn(
                  'mt-1 grid size-6 flex-none place-items-center rounded-md bg-primary-subtle text-[13px] font-bold text-primary'
                )}
              >
                {marker === 'number' ? i + 1 : null}
                {marker === 'sparkle' ? <IconSparkles className="size-3.5" /> : null}
                {marker === 'dot' ? <IconPointFilled className="size-3" /> : null}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-base font-bold leading-snug">{article.title}</span>
                  {showNewBadge && article.isNew ? (
                    <Badge className="border-primary/30 bg-primary-subtle text-primary">新機能</Badge>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                  {showCategory ? article.category.title : article.desc}
                </span>
              </span>

              <IconChevronRight className="mt-1.5 size-4 flex-none text-border-strong" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
