import { motion, useInView, useReducedMotion } from 'motion/react'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { isServer, isTakeover } from '@/lib/boot'

const useIsoLayoutEffect = isServer ? () => {} : useLayoutEffect

/**
 * 21st.dev / Magic UI style "BlurFade": content softly fades and rises in as it scrolls into view.
 * Prerendered HTML is shown as is: on that first paint only content below the fold is hidden and revealed later.
 */
export function BlurFade({
  children,
  delay = 0,
  className,
  y = 16,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [armed, setArmed] = useState(() => !reduce && !isServer && !isTakeover())
  useIsoLayoutEffect(() => {
    // taking over prerendered HTML: keep what the visitor already sees, animate the rest when it scrolls in
    if (!armed && !reduce && isTakeover() && ref.current && ref.current.getBoundingClientRect().top > window.innerHeight) setArmed(true)
  }, [])
  const show = !armed || inView
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={show && armed ? { duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] } : { duration: 0 }}
    >
      {children}
    </motion.div>
  )
}
