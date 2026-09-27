import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/**
 * Soft 3D tilt that follows the mouse, with a gentle lift and a light glare.
 * Does nothing on touch screens or with "reduce motion".
 */
export function Tilt({ children, className, max = 6, lift = 6 }: { children: ReactNode; className?: string; max?: number; lift?: number }) {
  const reduce = useReducedMotion()
  const [enabled] = useState(() => finePointer())
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const hover = useMotionValue(0)
  const spring = { stiffness: 220, damping: 22, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)
  const y = useSpring(useTransform(hover, [0, 1], [0, -lift]), spring)
  const glareX = useTransform(px, [0, 1], ['0%', '100%'])
  const glareY = useTransform(py, [0, 1], ['0%', '100%'])
  const glareOpacity = useSpring(hover, spring)
  const glare = useTransform([glareX, glareY], ([x, yy]) => `radial-gradient(420px circle at ${x} ${yy}, rgb(255 255 255 / 0.35), transparent 55%)`)

  if (reduce || !enabled) return <div className={className}>{children}</div>

  const onMove = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
    hover.set(0)
  }

  return (
    <div className={cn('[perspective:900px]', className)}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={() => hover.set(1)}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, y, transformStyle: 'preserve-3d' }}
        className="relative h-full"
      >
        {children}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
          style={{
            opacity: glareOpacity,
            background: glare,
            borderRadius: 'inherit',
          }}
        />
      </motion.div>
    </div>
  )
}

/** Pulls its child gently toward the mouse — for the main call-to-action. */
export function Magnetic({ children, strength = 0.25, className }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion()
  const [enabled] = useState(() => finePointer())
  const x = useSpring(0, { stiffness: 250, damping: 18 })
  const y = useSpring(0, { stiffness: 250, damping: 18 })
  if (reduce || !enabled) return <span className={cn('inline-flex', className)}>{children}</span>
  return (
    <motion.span
      className={cn('inline-flex', className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        const clamp = (v: number) => Math.max(-8, Math.min(8, v))
        x.set(clamp((e.clientX - r.left - r.width / 2) * strength))
        y.set(clamp((e.clientY - r.top - r.height / 2) * strength))
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}
