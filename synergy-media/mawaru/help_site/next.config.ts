import type { NextConfig } from 'next';

/**
 * 静的書き出し（out/）。ヘルプは全ページ静的で足りるので SSR は不要。
 *
 * GitHub Pages は https://hinaiwagami0513.github.io/mawaru/ の下に置くため、
 * ヘルプは /mawaru/help をルートとして書き出す。
 * ローカル開発（npm run dev / preview）では basePath なしで動かしたいので、
 * BASE_PATH 環境変数で切り替える。CI 側（.github/workflows/help-pages.yml）で渡す。
 */
const basePath = process.env.BASE_PATH ?? '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
