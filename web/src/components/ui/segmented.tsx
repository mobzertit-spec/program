import { motion } from 'motion/react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

/** Apple-style segmented control with a sliding pill (21st.dev "Animated Tabs"). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  label,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  className?: string
  label: string
}) {
  const id = useId()
  return (
    <div role="tablist" aria-label={label} className={cn('inline-flex rounded-full bg-bg-alt p-1', className)}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              'relative min-h-9 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors duration-200',
              active ? 'text-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-full bg-surface shadow-[0_1px_4px_rgba(0,0,0,0.12)] dark:bg-surface-2"
                transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
