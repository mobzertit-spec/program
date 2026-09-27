import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'

/**
 * Site-wide ambient background: soft brand-colored orbs that drift, rotate and change size as you scroll,
 * over a faint dot grid. Fixed behind all content and ignored by assistive tech.
 */
export function AmbientBackground() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 })
  const k = reduce ? 0 : 1
  const y1 = useTransform(p, [0, 1], ['0vh', `${-35 * k}vh`])
  const x1 = useTransform(p, [0, 1], ['0vw', `${18 * k}vw`])
  const y2 = useTransform(p, [0, 1], ['0vh', `${40 * k}vh`])
  const x2 = useTransform(p, [0, 1], ['0vw', `${-22 * k}vw`])
  const y3 = useTransform(p, [0, 1], ['0vh', `${-55 * k}vh`])
  const s3 = useTransform(p, [0, 0.5, 1], [1, 1 + 0.35 * k, 1])
  const rot = useTransform(p, [0, 1], [0, 140 * k])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div style={{ rotate: rot }} className="absolute inset-[-20%]">
        {/* outer layer follows the scroll, inner layer drifts on its own (two transforms, no conflict).
            The radial gradients are already soft, so no costly blur filter is needed. */}
        <motion.div style={{ x: x1, y: y1, opacity: 'var(--orb-opacity)' }} className="absolute left-[8%] top-[-6%] size-[46vmax]">
          <div className="size-full rounded-full bg-[radial-gradient(closest-side,var(--ember),transparent)] will-change-transform motion-safe:animate-[float_22s_ease-in-out_infinite]" />
        </motion.div>
        <motion.div style={{ x: x2, y: y2, opacity: 'var(--orb-opacity)' }} className="absolute right-[4%] top-[10%] size-[44vmax]">
          <div className="size-full rounded-full bg-[radial-gradient(closest-side,var(--iris),transparent)] will-change-transform motion-safe:animate-[float_26s_ease-in-out_infinite_reverse]" />
        </motion.div>
        <motion.div style={{ y: y3, scale: s3, opacity: 'calc(var(--orb-opacity) * 0.8)' }} className="absolute bottom-[-10%] left-[30%] size-[40vmax]">
          <div className="size-full rounded-full bg-[radial-gradient(closest-side,#38bdf8,transparent)] will-change-transform motion-safe:animate-[float_30s_ease-in-out_infinite]" />
        </motion.div>
      </motion.div>
      {/* frosted veil keeps text contrast high */}
      <div className="absolute inset-0 bg-bg/70 dark:bg-bg/60" />
      {/* dot grid fading out from the top */}
      <div
        className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent_75%)]"
        style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '26px 26px' }}
      />
    </div>
  )
}
