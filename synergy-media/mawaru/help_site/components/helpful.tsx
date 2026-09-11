'use client';

import { useState } from 'react';
import { IconMoodSad, IconThumbUp } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/** 記事末尾のフィードバック。いまは表示のみで送信はしていない */
export function Helpful() {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);

  return (
    <Card className="mb-7 py-6">
      <CardContent className="text-center">
        {answer ? (
          <p className="text-[15px] font-bold text-success">
            {answer === 'yes'
              ? 'ご協力ありがとうございます。'
              : 'ご協力ありがとうございます。いただいた内容をもとに改善します。'}
          </p>
        ) : (
          <>
            <p className="mb-3 text-[17px] font-bold">このページは役に立ちましたか？</p>
            <div className="flex justify-center gap-2.5">
              <Button variant="outline" onClick={() => setAnswer('yes')}>
                <IconThumbUp className="size-4" />
                役に立った
              </Button>
              <Button variant="outline" onClick={() => setAnswer('no')}>
                <IconMoodSad className="size-4" />
                役に立たなかった
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
