import Image from 'next/image';
import Link from 'next/link';

import { Separator } from '@/components/ui/separator';
import { allArticles } from '@/lib/content';
import { SITE, categories, top } from '@/content/site';
import { asset } from '@/lib/utils';

export function SiteFooter() {
  const popular = top.popular
    .slice(0, 5)
    .map((key) => allArticles.find((a) => `${a.category.id}/${a.slug}` === key))
    .filter((a) => a !== undefined);

  const columns = [
    {
      heading: 'よく見られるページ',
      links: popular.map((a) => ({ label: a.title, href: a.href })),
    },
    {
      heading: 'カテゴリ',
      links: categories.slice(0, 5).map((c) => ({ label: c.title, href: `/${c.id}/` })),
    },
    {
      heading: 'サポート',
      links: [
        { label: 'お問い合わせ', href: '/faq/contact/' },
        { label: 'うまくいかないときは', href: '/faq/troubleshooting/' },
        { label: 'プラン別にできること', href: '/faq/plans/' },
        { label: 'マワルを開く', href: SITE.appUrl },
      ],
    },
  ];

  return (
    <footer className="mt-2 border-t bg-card">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-9 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="mb-3 flex items-center gap-2.5">
            <Image src={asset('/img/logo-mawaru.svg')} alt="マワル" width={131} height={28} className="h-7 w-auto" />
            <span className="text-base font-bold">ヘルプセンター</span>
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            SNS投稿の企画・制作・予約・分析をまとめて行えるツール「マワル」の使い方をまとめています。
            <br />
            機能追加にあわせて内容を更新しています。
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.heading}>
            <h3 className="mb-2.5 text-xs font-bold tracking-wider text-muted-foreground">
              {column.heading}
            </h3>
            <ul className="space-y-1.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-primary"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm hover:text-primary">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Separator />
      <div className="mx-auto max-w-[1240px] px-4 py-3.5 text-xs text-muted-foreground sm:px-6">
        © {SITE.year} {SITE.owner}　{SITE.name}
      </div>
    </footer>
  );
}
