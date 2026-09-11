'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  IconArrowRight,
  IconCheck,
  IconCopy,
  IconMessageChatbot,
  IconMoodSmile,
  IconSend2,
  IconX,
} from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  STARTERS,
  inquiryDraft,
  solve,
  suggest,
  type SolveResult,
  type Suggestion,
} from '@/lib/assistant';
import { asset, cn } from '@/lib/utils';

/* -------------------------------------------------------------- 吹き出し */

function Bubble({ children, mine = false }: { children: React.ReactNode; mine?: boolean }) {
  if (mine) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-[15px] leading-relaxed text-primary-foreground">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      <Image
        src={asset('/img/fox-support.png')}
        alt=""
        width={32}
        height={32}
        className="mt-0.5 size-8 flex-none rounded-full bg-card object-contain"
      />
      <div className="min-w-0 flex-1 space-y-2.5 text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

/** ヘルプの該当箇所カード */
function SuggestionCard({ item, onNavigate }: { item: Suggestion; onNavigate: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="block rounded-md border bg-card px-3 py-2.5 transition-colors hover:border-primary hover:bg-accent"
    >
      <p className="flex items-center gap-1.5 text-[13px] font-bold text-primary">
        {item.heading ?? item.label}
        <IconArrowRight className="size-3.5" />
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {item.cat} / {item.label}
      </p>
      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-foreground">{item.excerpt}</p>
    </Link>
  );
}

/* ------------------------------------------------------------ 本体 */

type Turn =
  | { kind: 'user'; text: string }
  | {
      kind: 'suggest';
      query: string;
      hits: Suggestion[];
      faqAnswer: string | null;
      term: { term: string; meaning: string; href: string } | null;
    }
  | { kind: 'solve'; query: string; result: SolveResult }
  | { kind: 'contact'; draft: string }
  | { kind: 'resolved' };

export function HelpAssistant() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lastQuery = [...turns].reverse().find((t) => t.kind === 'user')?.text ?? '';
  const stage = turns.length ? turns[turns.length - 1].kind : 'idle';

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [turns, busy]);

  /** 1段目: ヘルプの該当箇所を出す */
  function ask(text: string) {
    const query = text.trim();
    if (!query) return;
    const { hits, faq, term } = suggest(query);
    setValue('');
    setTurns((prev) => [
      ...prev,
      { kind: 'user', text: query },
      { kind: 'suggest', query, hits, faqAnswer: faq?.a ?? null, term },
    ]);
  }

  /** 2段目: 解決しなかったので、原因と対処を組み立てて出す */
  async function escalate(query: string) {
    setBusy(true);
    const result = await solve(query);
    setBusy(false);
    setTurns((prev) => [...prev, { kind: 'solve', query, result }]);
  }

  /** 3段目: 問い合わせへ。案内済みの対処は「試したこと」として下書きに入れる */
  function toContact(query: string) {
    const solved = turns.find((t) => t.kind === 'solve');
    const tried = solved && solved.kind === 'solve'
      ? solved.result.steps.map((s) => `${s.cause} → ${s.action}`)
      : [];
    setTurns((prev) => [...prev, { kind: 'contact', draft: inquiryDraft(query, tried) }]);
  }

  function reset() {
    setTurns([]);
    setValue('');
  }

  async function copyDraft(draft: string) {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* クリップボードが使えない環境は手でコピーしてもらう */
    }
  }

  return (
    // modal を付けない = 背面のページをそのまま操作できる。
    // 外側クリックでも閉じない（読みながら画面を触るのが普通の使い方なので）。
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-5 right-5 z-40 h-13 gap-2 rounded-full px-5 shadow-lg"
          aria-label={open ? '閉じる' : 'わからないことを聞く'}
        >
          {open ? <IconX className="size-5" /> : <IconMessageChatbot className="size-5" />}
          <span className="hidden sm:inline">
            {open ? '閉じる' : 'わからないことを聞く'}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="end"
        sideOffset={12}
        collisionPadding={16}
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => {
          // 勝手にスクロールさせずに入力欄へ
          e.preventDefault();
          inputRef.current?.focus({ preventScroll: true });
        }}
        className="flex h-[min(600px,70svh)] w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 shadow-xl sm:w-[400px]"
      >
        <div className="flex flex-none items-center gap-2.5 border-b px-4 py-3">
          <Image
            src={asset('/img/fox-support.png')}
            alt=""
            width={30}
            height={30}
            className="size-7.5 object-contain"
          />
          <p className="flex-1 text-[15px] font-bold">わからないことを聞く</p>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-1 size-8"
            onClick={() => setOpen(false)}
            aria-label="閉じる"
          >
            <IconX className="size-4" />
          </Button>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-4 p-4">
            {/* ---- 最初の案内 ---- */}
            <Bubble>
              <p>
                お困りごとを書いてください。まずヘルプの該当箇所をお出しします。
                それで解決しない場合は、考えられる原因と対処までご案内します。
              </p>
            </Bubble>

            {!turns.length ? (
              <div className="ml-10 flex flex-wrap gap-1.5">
                {STARTERS.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    onClick={() => ask(s)}
                    className="h-8 rounded-full border-border-strong text-[13px] font-normal"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            ) : null}

            {/* ---- 会話 ---- */}
            {turns.map((turn, i) => {
              const isLast = i === turns.length - 1;

              if (turn.kind === 'user') return <Bubble key={i} mine>{turn.text}</Bubble>;

              if (turn.kind === 'suggest')
                return (
                  <Bubble key={i}>
                    {/* 用語を聞かれたら定義を先に言い切る。探させない */}
                    {turn.term ? (
                      <div className="rounded-md border border-primary/30 bg-primary-subtle px-3 py-2.5">
                        <p className="text-[13px] font-bold text-primary">{turn.term.term}</p>
                        <p className="mt-0.5 text-[14px] leading-relaxed">{turn.term.meaning}</p>
                        <Link
                          href={turn.term.href}
                          onClick={() => setOpen(false)}
                          className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-primary"
                        >
                          指標の用語集
                          <IconArrowRight className="size-3" />
                        </Link>
                      </div>
                    ) : null}
                    {turn.hits.length ? (
                      <>
                        <p>{turn.term ? '関連するのはこのあたりです。' : 'ヘルプのこのあたりに書かれています。'}</p>
                        <div className="space-y-2">
                          {turn.hits.map((h) => (
                            <SuggestionCard key={h.href} item={h} onNavigate={() => setOpen(false)} />
                          ))}
                        </div>
                        {turn.faqAnswer ? (
                          <p className="rounded-md bg-muted px-3 py-2 text-[13px] leading-relaxed">
                            {turn.faqAnswer}
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <p>
                        近い記述が見つかりませんでした。言葉を変えてもう一度聞くか、
                        下の「解決しない」から先に進んでください。
                      </p>
                    )}
                    {isLast ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button size="sm" variant="outline" onClick={() => setTurns((p) => [...p, { kind: 'resolved' }])}>
                          <IconCheck className="size-4" />
                          解決した
                        </Button>
                        <Button size="sm" onClick={() => escalate(turn.query)}>
                          解決しない
                        </Button>
                      </div>
                    ) : null}
                  </Bubble>
                );

              if (turn.kind === 'solve')
                return (
                  <Bubble key={i}>
                    {turn.result.answer ? <p>{turn.result.answer}</p> : null}

                    {turn.result.steps.length ? (
                      <ol className="space-y-2">
                        {turn.result.steps.map((s, j) => (
                          <li key={j} className="rounded-md border bg-card px-3 py-2.5">
                            <p className="text-[13px] font-bold">
                              {j + 1}. {s.cause}
                            </p>
                            <p className="mt-1 text-[13px] leading-relaxed">{s.action}</p>
                            <Link
                              href={s.href}
                              onClick={() => setOpen(false)}
                              className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-primary"
                            >
                              {s.source}
                              <IconArrowRight className="size-3" />
                            </Link>
                          </li>
                        ))}
                      </ol>
                    ) : null}

                    {!turn.result.answer && !turn.result.steps.length ? (
                      <p>
                        ヘルプの記述からは原因を絞り込めませんでした。
                        お手数ですが、サポートへお問い合わせください。
                      </p>
                    ) : null}

                    {turn.result.origin === 'help' ? (
                      <p className="text-xs text-muted-foreground">
                        ※ ヘルプの記述から組み立てた回答です。
                      </p>
                    ) : null}

                    {isLast ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button size="sm" variant="outline" onClick={() => setTurns((p) => [...p, { kind: 'resolved' }])}>
                          <IconCheck className="size-4" />
                          解決した
                        </Button>
                        <Button size="sm" onClick={() => toContact(turn.query)}>
                          まだ解決しない
                        </Button>
                      </div>
                    ) : null}
                  </Bubble>
                );

              if (turn.kind === 'contact')
                return (
                  <Bubble key={i}>
                    <p>
                      サポートへおつなぎします。下の下書きをコピーして、そのままお送りください。
                      状況が伝わるぶん、解決が早くなります。
                    </p>
                    <pre className="max-h-52 overflow-auto whitespace-pre-wrap rounded-md border bg-muted px-3 py-2.5 font-sans text-[13px] leading-relaxed">
                      {turn.draft}
                    </pre>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => copyDraft(turn.draft)}>
                        {copied ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
                        {copied ? 'コピーしました' : '下書きをコピー'}
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/faq/contact/" onClick={() => setOpen(false)}>
                          お問い合わせ方法を見る
                          <IconArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </Bubble>
                );

              return (
                <Bubble key={i}>
                  <p className="flex items-center gap-1.5 font-bold text-success">
                    <IconMoodSmile className="size-[18px]" />
                    よかったです。
                  </p>
                  <p>ほかに気になることがあれば、続けて聞いてください。</p>
                </Bubble>
              );
            })}

            {busy ? (
              <Bubble>
                <p className="text-muted-foreground">調べています…</p>
              </Bubble>
            ) : null}

            <div ref={endRef} />
          </div>
        </ScrollArea>

        {/* ---- 入力 ---- */}
        <div className="flex-none border-t p-3">
          {turns.length ? (
            <button
              type="button"
              onClick={reset}
              className="mb-2 text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              最初からやり直す
            </button>
          ) : null}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(value);
            }}
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="例: 予約した時間に投稿されない"
              className="h-10"
              aria-label="質問を入力"
            />
            <Button type="submit" size="icon" className="size-10 flex-none" disabled={!value.trim() || busy}>
              <IconSend2 className="size-[18px]" />
              <span className="sr-only">送信</span>
            </Button>
          </form>
          <p className={cn('mt-2 text-[11px] leading-relaxed text-muted-foreground')}>
            解決しない場合は
            <Link href="/faq/contact/" onClick={() => setOpen(false)} className="mx-0.5 text-primary hover:underline">
              お問い合わせ
            </Link>
            までご案内します。
          </p>
        </div>

      </PopoverContent>
    </Popover>
  );
}
