import { Fragment } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Inline } from '@/components/inline';
import { noteIcon } from '@/components/icons';
import type { Block, NoteKind } from '@/content/types';
import { cn } from '@/lib/utils';

/** Alert は shadcn のまま使い、種類ごとの色だけトークンで足す */
const noteStyle: Record<NoteKind, { box: string; head: string; label: string }> = {
  point: {
    box: 'bg-primary-subtle border-primary/30',
    head: 'text-primary',
    label: 'ポイント',
  },
  caution: {
    box: 'bg-warning-subtle border-warning-border',
    head: 'text-warning',
    label: '注意',
  },
  ref: { box: 'bg-info-subtle border-info/25', head: 'text-info', label: '参考' },
  danger: {
    box: 'bg-destructive-subtle border-destructive/30',
    head: 'text-destructive',
    label: 'できません',
  },
};

function Note({ block }: { block: Extract<Block, { t: 'note' }> }) {
  const kind = block.kind ?? 'point';
  const style = noteStyle[kind];
  const Icon = noteIcon[kind];
  const lines = Array.isArray(block.body) ? block.body : [block.body];

  return (
    <Alert className={cn('mb-5 items-start gap-x-3', style.box)}>
      <Icon className={cn('size-[18px] translate-y-0.5', style.head)} />
      <AlertTitle className={cn('font-bold', style.head)}>{block.title ?? style.label}</AlertTitle>
      <AlertDescription className="text-foreground">
        {Array.isArray(block.body) ? (
          <ul className="list-disc space-y-1 pl-4">
            {lines.map((line, i) => (
              <li key={i} className="leading-relaxed">
                <Inline>{line}</Inline>
              </li>
            ))}
          </ul>
        ) : (
          <p className="leading-relaxed">
            <Inline>{lines[0]}</Inline>
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}

function Steps({ block }: { block: Extract<Block, { t: 'steps' }> }) {
  return (
    <ol className="mb-6">
      {block.items.map((step, i) => {
        const paragraphs = (Array.isArray(step.body) ? step.body : [step.body]).filter(Boolean);
        const last = i === block.items.length - 1;
        return (
          <li key={i} className="relative pl-12 pb-6 last:pb-0">
            <span className="absolute left-0 top-0 grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {i + 1}
            </span>
            {last ? null : (
              <span className="absolute left-4 top-9 bottom-1 w-px -translate-x-1/2 bg-border" />
            )}
            <p className="mt-0.5 mb-1.5 text-[17px] font-bold leading-snug">{step.title}</p>
            {paragraphs.map((text, j) => (
              <p key={j} className="mb-2 text-base leading-relaxed last:mb-0">
                <Inline>{text}</Inline>
              </p>
            ))}
          </li>
        );
      })}
    </ol>
  );
}

export function ArticleBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-help">
      {blocks.map((block, index) => {
        switch (block.t) {
          case 'h2':
            return (
              <h2
                key={index}
                id={block.id}
                className="mt-11 mb-3.5 scroll-mt-28 border-b-2 pb-2 text-2xl first:mt-0"
              >
                {block.text}
              </h2>
            );

          case 'h3':
            return (
              <h3 key={index} className="mt-7 mb-2.5 text-lg">
                {block.text}
              </h3>
            );

          case 'p':
            return (
              <p key={index}>
                <Inline>{block.text}</Inline>
              </p>
            );

          case 'ul':
          case 'ol': {
            const List = block.t === 'ul' ? 'ul' : 'ol';
            return (
              <List key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>
                    <Inline>{item}</Inline>
                  </li>
                ))}
              </List>
            );
          }

          case 'steps':
            return <Steps key={index} block={block} />;

          case 'note':
            return <Note key={index} block={block} />;

          case 'table':
            return (
              // shadcn の Table は自前で overflow-x コンテナを持つので、外側は枠の役だけ
              <div key={index} className="mb-6 overflow-hidden rounded-md border bg-card">
                <Table className="min-w-[520px] text-[15px]">
                  <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                      {block.head.map((head, i) => (
                        <TableHead
                          key={i}
                          className="h-auto whitespace-normal px-3.5 py-2.5 align-top text-[15px] font-bold text-foreground"
                        >
                          <Inline>{head}</Inline>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {block.rows.map((row, i) => (
                      <TableRow key={i}>
                        {row.map((cell, j) => (
                          <TableCell
                            key={j}
                            className={cn(
                              'whitespace-normal px-3.5 py-2.5 align-top leading-relaxed',
                              j === 0 && block.rowhead !== false && 'font-bold'
                            )}
                          >
                            <Inline>{cell}</Inline>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );

          case 'fig':
            return (
              <figure key={index} className="mb-6">
                <div className="grid min-h-42 place-items-center rounded-md border border-dashed border-border-strong bg-muted p-6 text-center">
                  <span className="text-sm font-medium text-muted-foreground">{block.shot}</span>
                </div>
                {block.caption ? (
                  <figcaption className="mt-2 text-sm text-muted-foreground">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );

          case 'faq':
            return (
              <Accordion
                key={index}
                type="single"
                collapsible
                className="mb-6 overflow-hidden rounded-md border bg-card"
              >
                {block.items.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${index}-${i}`} className="px-4 last:border-b-0">
                    <AccordionTrigger className="text-left text-base font-bold">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[15px]">
                      {(Array.isArray(item.a) ? item.a : [item.a]).map((line, j) => (
                        <p key={j} className="mb-2 leading-relaxed last:mb-0">
                          <Inline>{line}</Inline>
                        </p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            );

          case 'mini':
            return (
              <div key={index} className="mb-6 grid gap-3 sm:grid-cols-2">
                {block.items.map((item, i) => (
                  <Card key={i} className="gap-0 py-4">
                    <CardContent className="px-4">
                      <p className="mb-1 text-base font-bold">{item.title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        <Inline>{item.body}</Inline>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            );

          default:
            return <Fragment key={index} />;
        }
      })}
    </div>
  );
}
