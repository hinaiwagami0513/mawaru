import Link from 'next/link';

import { parseInline } from '@/lib/content';

/** 記事データ内のインライン記法（**太字** / `code` / [表示](リンク)）を描く */
export function Inline({ children }: { children: string }) {
  return (
    <>
      {parseInline(children).map((part, i) => {
        switch (part.kind) {
          case 'strong':
            return (
              <strong key={i} className="font-bold">
                {part.value}
              </strong>
            );
          case 'code':
            return (
              <code
                key={i}
                className="rounded-sm border bg-muted px-1.5 py-0.5 font-mono text-[0.88em]"
              >
                {part.value}
              </code>
            );
          case 'link':
            return part.href.startsWith('http') ? (
              <a
                key={i}
                href={part.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                {part.value}
              </a>
            ) : (
              <Link
                key={i}
                href={part.href}
                className="text-primary underline-offset-4 hover:underline"
              >
                {part.value}
              </Link>
            );
          default:
            return <span key={i}>{part.value}</span>;
        }
      })}
    </>
  );
}
