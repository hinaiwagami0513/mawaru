'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { IconExternalLink, IconMenu2 } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CategoryNav } from '@/components/category-nav';
import { SearchTrigger } from '@/components/search-provider';
import { SITE } from '@/content/site';
import { asset } from '@/lib/utils';

export function SiteHeader({ showSearch = true }: { showSearch?: boolean }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-18 border-b bg-card">
      <div className="mx-auto flex h-full max-w-[1240px] items-center gap-4 px-4 sm:px-6">
        {/* モバイルのカテゴリナビ */}
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label="メニュー">
              <IconMenu2 className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <SheetHeader className="border-b">
              <SheetTitle>カテゴリ</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100svh-4.5rem)]">
              <div className="p-3">
                <CategoryNav onNavigate={() => setNavOpen(false)} />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5 md:flex-none">
          <Image
            src={asset('/img/logo-mawaru.png')}
            alt="マワル"
            width={140}
            height={28}
            priority
            className="h-7 w-auto"
          />
          <span className="truncate text-base font-bold">ヘルプセンター</span>
        </Link>

        {showSearch ? (
          <div className="hidden max-w-md flex-1 md:block">
            <SearchTrigger />
          </div>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/faq/contact/">お問い合わせ</Link>
          </Button>
          <Button asChild size="sm">
            <a href={SITE.appUrl} target="_blank" rel="noopener noreferrer">
              マワルを開く
              <IconExternalLink className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
