import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/** 21st.dev / Magic UI style "BlurFade": content softly un-blurs as it scrolls into view. */
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
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}
