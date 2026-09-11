'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { IconSearch } from '@tabler/icons-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { allArticles } from '@/lib/content';
import { searchDocs, snippet, type Doc } from '@/lib/help-index';
import { top } from '@/content/site';
import { cn } from '@/lib/utils';

type SearchContextValue = { open: (initialQuery?: string) => void };

const SearchContext = createContext<SearchContextValue>({ open: () => {} });

export const useSearch = () => useContext(SearchContext);

/** 検索ダイアログはアプリに1つだけ置く。開く側はどこからでも useSearch().open() */
export function SearchProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const popular = useMemo<Doc[]>(
    () =>
      top.popular
        .slice(0, 6)
        .map((key) => allArticles.find((a) => `${a.category.id}/${a.slug}` === key))
        .filter((a) => a !== undefined)
        .map((a) => ({
          title: a.title,
          href: a.href,
          cat: a.category.title,
          desc: a.desc,
          keywords: '',
          text: '',
        })),
    []
  );

  const hits = query.trim() ? searchDocs(query, 12) : popular;

  const open = useCallback((initialQuery = '') => {
    setQuery(initialQuery);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const go = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <SearchContext.Provider value={{ open }}>
      {children}

      <CommandDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        commandProps={{ shouldFilter: false }}
        title="ヘルプを検索"
        description="キーワードでヘルプ記事を探します"
        className="sm:max-w-2xl"
      >
        <CommandInput
          placeholder="キーワードで探す（例: 予約投稿、リーチ、連携できない）"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>
            <div className="px-4 py-6 text-left text-sm leading-relaxed text-muted-foreground">
              一致するページが見つかりませんでした。
              <br />
              言葉を短くする、ひらがなにする、機能名で探すと見つかりやすくなります。
            </div>
          </CommandEmpty>
          <CommandGroup
            heading={query.trim() ? `検索結果 ${hits.length} 件` : 'よく見られているページ'}
          >
            {hits.map((hit) => (
              <CommandItem
                key={hit.href}
                value={hit.href}
                onSelect={() => go(hit.href)}
                className="flex-col items-start gap-0.5 py-2.5"
              >
                <span className="text-sm font-bold">{hit.title}</span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {hit.cat} — {query.trim() ? snippet(hit.text || hit.desc, query) : hit.desc}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SearchContext.Provider>
  );
}

/** ヘッダー／ヒーローに置く検索の入口 */
export function SearchTrigger({
  variant = 'header',
  className,
}: {
  variant?: 'header' | 'hero';
  className?: string;
}) {
  const { open } = useSearch();
  const hero = variant === 'hero';

  return (
    <Button
      variant="outline"
      onClick={() => open()}
      className={cn(
        'w-full justify-start gap-3 rounded-full border-border-strong bg-card font-normal text-muted-foreground hover:bg-card hover:text-muted-foreground',
        hero ? 'h-15 px-6 text-base shadow-sm sm:text-lg' : 'h-10 px-4 text-sm',
        className
      )}
    >
      <IconSearch className={hero ? 'size-5' : 'size-4'} />
      <span className="truncate">キーワードで探す（例: 予約投稿、リーチ、連携できない）</span>
      {hero ? null : (
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 font-sans text-[10px] font-bold lg:inline-block">
          ⌘K
        </kbd>
      )}
    </Button>
  );
}

/** ヒーロー下のキーワードチップ。押すと検索ダイアログにその語を入れて開く */
export function SearchChips({ items }: { items: string[] }) {
  const { open } = useSearch();
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {items.map((item) => (
        <Button
          key={item}
          variant="outline"
          size="sm"
          onClick={() => open(item)}
          className="h-9 rounded-full border-border-strong bg-card px-4 text-sm font-medium hover:border-primary hover:bg-accent hover:text-foreground"
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
