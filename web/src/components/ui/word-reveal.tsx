import { motion, useReducedMotion } from 'motion/react'
import { isServer, isTakeover } from '@/lib/boot'
import { cn } from '@/lib/utils'

/** Staggered word-by-word headline reveal (21st.dev "text generate" pattern). */
export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  as: Tag = 'h1',
}: {
  text: string
  className?: string
  wordClassName?: (word: string, i: number) => string | undefined
  delay?: number
  as?: 'h1' | 'h2' | 'p'
}) {
  // no reveal on prerendered HTML or its first takeover: the headline is already on screen
  const still = useReducedMotion() || isServer || isTakeover()
  const words = text.split(' ')
  return (
    <Tag className={cn(className)} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={cn('inline-block whitespace-pre', wordClassName?.(w, i))}
          initial={still ? false : { opacity: 0, y: '0.35em', filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: delay + i * 0.07, ease: [0.2, 0.65, 0.3, 0.9] }}
        >
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </Tag>
  )
}
