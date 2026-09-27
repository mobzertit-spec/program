import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { SpotlightCard } from './spotlight-card'

export function BentoGrid({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('grid auto-rows-[minmax(18rem,auto)] grid-cols-1 gap-4 md:grid-cols-6', className)}>{children}</div>
}

export function BentoCard({
  className,
  eyebrow,
  title,
  description,
  children,
}: {
  className?: string
  eyebrow?: string
  title: string
  description: ReactNode
  children?: ReactNode
}) {
  return (
    <SpotlightCard className={cn('flex flex-col', className)}>
      <div className="flex h-full flex-col">
        <div className="p-7 pb-0">
          {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-clay">{eyebrow}</p>}
          <h3 className="text-2xl font-semibold tracking-tight text-fg">{title}</h3>
          <div className="mt-2 max-w-md text-[15px] leading-relaxed text-fg-muted">{description}</div>
        </div>
        {children && <div className="relative mt-auto flex-1 p-7 pt-5">{children}</div>}
      </div>
    </SpotlightCard>
  )
}
