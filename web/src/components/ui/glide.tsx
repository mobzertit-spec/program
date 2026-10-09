import { motion, useInView, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { isServer, isTakeover } from '@/lib/boot'
import { cn } from '@/lib/utils'

const useIsoLayoutEffect = isServer ? () => {} : useLayoutEffect
const EASE = [0.16, 1, 0.3, 1] as const // long, soft landing

/**
 * Whether an element should animate in, and whether it is in view yet. Prerendered HTML stays as it is on the first
 * paint (only elements below the fold are armed), and reduced motion never animates.
 */
function useReveal<T extends Element>(margin = '0px 0px -10% 0px') {
  const ref = useRef<T>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: margin as `${number}px` })
  const [armed, setArmed] = useState(() => !reduce && !isServer && !isTakeover())
  useIsoLayoutEffect(() => {
    if (!armed && !reduce && isTakeover() && ref.current && ref.current.getBoundingClientRect().top > window.innerHeight) setArmed(true)
  }, [])
  return { ref, armed, show: !armed || inView }
}

/** A heading that glides up out of an invisible slot as it scrolls into view. */
export function Glide({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, armed, show } = useReveal<HTMLSpanElement>()
  return (
    <span ref={ref} className={cn('block overflow-hidden pb-[0.12em] -mb-[0.12em]', className)}>
      <motion.span
        className="block"
        initial={false}
        animate={show ? { y: '0%', rotate: 0 } : { y: '108%', rotate: 2 }}
        transition={show && armed ? { duration: 0.95, delay, ease: EASE } : { duration: 0 }}
        style={{ transformOrigin: '0% 100%' }}
      >
        {children}
      </motion.span>
    </span>
  )
}

/** A picture that slides out of the paper (a wipe from the bottom) as it scrolls into view. */
export function ClipReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { ref, armed, show } = useReveal<HTMLDivElement>('0px 0px -6% 0px')
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={show ? { clipPath: 'inset(0% 0% 0% 0%)', y: 0 } : { clipPath: 'inset(100% 0% 0% 0%)', y: 24 }}
      transition={show && armed ? { duration: 1.1, delay, ease: EASE } : { duration: 0 }}
    >
      {children}
    </motion.div>
  )
}
