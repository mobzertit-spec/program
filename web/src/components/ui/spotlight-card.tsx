import { useRef, type HTMLAttributes, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

/** Card with a soft radial light that follows the pointer (21st.dev "Spotlight Card"). */
export function SpotlightCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--x', `${e.clientX - r.left}px`)
    el.style.setProperty('--y', `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        'lift group relative overflow-hidden rounded-3xl border border-border-soft bg-surface shadow-card',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), color-mix(in srgb, var(--primary) 12%, transparent), transparent 60%)',
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}
