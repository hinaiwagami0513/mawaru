/* info-mark — ヘルプ/AIの印。キャラクターは置かない方針（2026-09-11 決定）。
   色は currentColor を拾うので、置き場所の文字色に従う。 */
export function InfoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <circle cx="12" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
