export function Logo({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e07a4f" />
          <stop offset="1" stopColor="#b8532e" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#logo-g)" />
      <path d="M32 11l4 12.5L48.5 28 36 32.5 32 45l-4-12.5L15.5 28 28 23.5z" fill="#fff" />
      <circle cx="47" cy="47" r="5" fill="#fff" opacity=".85" />
    </svg>
  )
}
