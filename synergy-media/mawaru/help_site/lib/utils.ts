import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * public/ 配下のファイルを参照する。
 * next/image は `unoptimized: true` のとき src に basePath を付けないので、
 * GitHub Pages のようにサブパス配信するときは自前で前置する必要がある。
 */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
}
