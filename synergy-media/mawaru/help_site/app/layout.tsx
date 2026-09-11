import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';

import { HelpAssistant } from '@/components/help-assistant';
import { SearchProvider } from '@/components/search-provider';
import { SITE } from '@/content/site';

import './globals.css';

/** DESIGN.md: Noto Sans JP / weight は 400・500・700・900 のみ（800 は使わない） */
const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
  // 本文はほぼ日本語。latin サブセットを preload すると「読み込んだが使われない」警告になる
  preload: false,
});

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: 'マワルの使い方・設定・トラブル解決をまとめたヘルプセンターです。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <body className="antialiased">
        <SearchProvider>
          {children}
          <HelpAssistant />
        </SearchProvider>
      </body>
    </html>
  );
}
