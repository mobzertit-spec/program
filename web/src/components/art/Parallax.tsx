import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef, type ReactNode } from 'react'

/** Moves its content a little against the scroll (and tilts it slightly) — depth for decorative art. */
export function Parallax({ children, className, distance = 40, tilt = true }: { children: ReactNode; className?: string; distance?: number; tilt?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : distance, reduce ? 0 : -distance])
  const rotate = useTransform(scrollYProgress, [0, 1], [reduce || !tilt ? 0 : -2, reduce || !tilt ? 0 : 2])
  return (
    <motion.div ref={ref} style={{ y, rotate }} className={className}>
      {children}
    </motion.div>
  )
}
