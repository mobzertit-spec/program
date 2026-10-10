import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useId, useRef } from 'react'
import { cn } from '@/lib/utils'

/** Outline of an eight-pointed star (two squares, one turned 45°) — the khatam of zellige tilework. */
export function starPath(cx: number, cy: number, R: number) {
  const r = (R / Math.SQRT2) * 1.0824
  const pts: string[] = []
  for (let k = 0; k < 8; k++) {
    const a = ((k * 45 - 90) * Math.PI) / 180
    const b = a + Math.PI / 8
    pts.push(`${(cx + R * Math.cos(a)).toFixed(2)} ${(cy + R * Math.sin(a)).toFixed(2)}`)
    pts.push(`${(cx + r * Math.cos(b)).toFixed(2)} ${(cy + r * Math.sin(b)).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
}

/**
 * Star-and-cross line pattern (the classic zellige layout), drawn as a repeating SVG tile.
 * Decorative: inherits `currentColor`; size and strength come from the caller.
 */
export function ZelligePattern({ className, cell = 56, stroke = 1 }: { className?: string; cell?: number; stroke?: number }) {
  const id = `zl-${useId().replace(/:/g, '')}`
  const h = cell / 2
  return (
    <svg aria-hidden className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}>
      <defs>
        <pattern id={id} width={cell} height={cell} patternUnits="userSpaceOnUse">
          <path d={starPath(h, h, h)} fill="none" stroke="currentColor" strokeWidth={stroke} />
          <path d={starPath(h, h, h * 0.42)} fill="none" stroke="currentColor" strokeWidth={stroke} opacity="0.7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/**
 * A single large star that draws itself and turns slowly as the section scrolls past.
 * Pass a scroll progress (0..1) or let it follow its own position in the page.
 */
export function StarOrnament({ className, progress }: { className?: string; progress?: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const own = useScroll({ target: ref, offset: ['start end', 'end start'] }).scrollYProgress
  const p = progress ?? own
  const draw = useTransform(p, [0, 0.5], [reduce ? 1 : 0.05, 1])
  const rotate = useTransform(p, [0, 1], [reduce ? 0 : -22, reduce ? 0 : 22])
  return (
    <motion.div ref={ref} aria-hidden className={cn('pointer-events-none', className)} style={{ rotate }}>
      <svg viewBox="0 0 100 100" className="size-full">
        <motion.path d={starPath(50, 50, 48)} fill="none" stroke="currentColor" strokeWidth="0.7" style={{ pathLength: draw }} />
        <motion.path d={starPath(50, 50, 30)} fill="none" stroke="currentColor" strokeWidth="0.7" style={{ pathLength: draw }} />
        <motion.path d={starPath(50, 50, 12)} fill="none" stroke="currentColor" strokeWidth="0.7" style={{ pathLength: draw }} />
      </svg>
    </motion.div>
  )
}
