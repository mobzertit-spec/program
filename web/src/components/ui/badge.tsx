import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const tones = {
  neutral: 'bg-bg-alt text-fg-muted',
  clay: 'bg-clay-soft text-clay',
  success: 'bg-success-soft text-success',
  primary: 'bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-primary',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  )
}
