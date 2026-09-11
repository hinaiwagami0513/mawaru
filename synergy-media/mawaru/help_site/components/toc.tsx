'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

/** 右カラムの目次。見出しの位置を見て現在地を光らせる */
export function Toc({ items }: { items: { id: string; text: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const spy = () => {
      const y = window.scrollY + 130;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= y) current = item.id;
      }
      setActive(current);
    };
    spy();
    window.addEventListener('scroll', spy, { passive: true });
    return () => window.removeEventListener('scroll', spy);
  }, [items]);

  if (!items.length) return null;

  return (
    <nav aria-label="このページの内容" className="sticky top-24 text-sm">
      <p className="mb-2.5 text-xs font-bold tracking-wider text-muted-foreground">
        このページの内容
      </p>
      <ul className="border-l">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                '-ml-px block border-l-2 py-1.5 pl-3 leading-snug transition-colors',
                active === item.id
                  ? 'border-primary font-bold text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
