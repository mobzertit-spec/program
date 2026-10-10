import { useInView, useReducedMotion } from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'
import { isServer, isTakeover } from '@/lib/boot'
import { cn } from '@/lib/utils'

/**
 * The brand device: words marked with a saffron highlighter. The stroke is drawn in when it scrolls into view
 * (prerendered HTML and reduced motion show it already drawn).
 */
export function Mark({ children, className, delay }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const [armed] = useState(() => !isServer && !isTakeover() && !reduce)
  return (
    <span
      ref={ref}
      className={cn('hl', armed && (inView ? 'hl-draw' : 'hl-off'), className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </span>
  )
}
