import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * CE monogram — an ember "C" (Claude) beside a white "E" (English) on an ink tile,
 * with an iris spark: the moment an idea becomes clear.
 */
export function Logo({ className = 'size-8' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}-tile`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#23274a" />
          <stop offset="1" stopColor="#0b0c1a" />
        </linearGradient>
        <linearGradient id={`${id}-c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb07a" />
          <stop offset="1" stopColor="#f0643a" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id}-tile)`} />
      <rect width="64" height="64" rx="16" fill={`url(#${id}-shine)`} />
      <path d="M30.8 24.2A11 11 0 1 0 30.8 39.8" fill="none" stroke={`url(#${id}-c)`} strokeWidth="6.5" strokeLinecap="round" />
      <path d="M48.5 21.5H37V42.5H48.5M37 32H46" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52 8l1.3 3.4L56.7 12.7l-3.4 1.3L52 17.4l-1.3-3.4-3.4-1.3 3.4-1.3z" fill="#aaa6ff" />
    </svg>
  )
}

export function Wordmark({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Logo className="size-8" />
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-extrabold tracking-[-0.04em]">
          C<span className="text-brand">E</span>
        </span>
        {!compact && <span className="mt-0.5 text-[10px] font-medium tracking-wide text-fg-subtle">Claude · English</span>}
      </span>
    </span>
  )
}
