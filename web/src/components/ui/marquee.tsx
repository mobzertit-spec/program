import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Infinite horizontal marquee with edge fade (21st.dev "Marquee"). Pauses on hover. */
export function Marquee({
  children,
  className,
  reverse,
  duration = 40,
}: {
  children: ReactNode
  className?: string
  reverse?: boolean
  duration?: number
}) {
  return (
    <div
      className={cn(
        'group relative flex overflow-hidden [--gap:1rem] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]',
        className,
      )}
      style={{ ['--duration' as string]: `${duration}s` }}
    >
      <div
        className={cn(
          'flex w-max shrink-0 animate-marquee gap-[var(--gap)] pr-[var(--gap)] group-hover:[animation-play-state:paused]',
          reverse && '[animation-direction:reverse]',
        )}
      >
        {children}
        <div aria-hidden className="flex gap-[var(--gap)]">
          {children}
        </div>
      </div>
    </div>
  )
}
