import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import type { TrackId } from '@/data/lessons'
import { cn } from '@/lib/utils'

/** Hand-drawn brand illustrations, one per track. Colors come from theme tokens, so they adapt to dark mode. */
export function TrackArt({ track, className }: { track: TrackId; className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={cn('h-auto w-full', className)} role="img" aria-label={LABELS[track]}>
      <defs>
        <clipPath id={`c-${track}`}>
          <rect x="4" y="4" width="312" height="192" rx="28" />
        </clipPath>
        <linearGradient id={`g-${track}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--ember)" />
          <stop offset="1" stopColor="var(--iris)" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="312" height="192" rx="28" fill="var(--surface-2)" stroke="var(--border-soft)" />
      <g clipPath={`url(#c-${track})`}>
        <circle cx="270" cy="40" r="60" fill={`url(#g-${track})`} opacity="0.12" />
        <circle cx="40" cy="175" r="50" fill={`url(#g-${track})`} opacity="0.1" />
      </g>
      {ART[track](`url(#g-${track})`)}
    </svg>
  )
}

const LABELS: Record<TrackId, string> = {
  foundations: 'Illustration: a conversation with Claude and an Arabic translation',
  prompting: 'Illustration: prompt cards with XML tags',
  features: 'Illustration: a grid of Claude tools',
  english: 'Illustration: a microphone with sound waves and a speech bubble',
  students: 'Illustration: a graduation cap on a stack of books with a checklist',
}

const line = (x: number, y: number, w: number, fill = 'var(--border)') => <rect x={x} y={y} width={w} height="7" rx="3.5" fill={fill} />

const ART: Record<string, (grad: string) => React.ReactNode> = {
  foundations: (grad) => (
    <g>
      <rect x="120" y="34" width="160" height="58" rx="20" fill={grad} />
      {line(138, 52, 110, 'rgb(255 255 255 / 0.85)')}
      {line(138, 67, 76, 'rgb(255 255 255 / 0.6)')}
      <rect x="40" y="104" width="170" height="66" rx="20" fill="var(--surface)" stroke="var(--border)" />
      <circle cx="64" cy="128" r="11" fill="var(--clay-soft)" />
      <path d="M64 121l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="var(--ember)" />
      {line(84, 122, 104)}
      {line(84, 137, 80)}
      {line(84, 152, 56)}
      <g transform="translate(222 118)">
        <rect width="76" height="40" rx="14" fill="var(--ink)" />
        <text x="14" y="26" fontSize="15" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">Aa</text>
        <path d="M38 20h8m-3-3l3 3-3 3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="54" y="27" fontSize="16" fill="#ffb07a" fontFamily="Alexandria, sans-serif">ع</text>
      </g>
    </g>
  ),
  prompting: (grad) => (
    <g>
      <rect x="92" y="30" width="170" height="120" rx="18" fill="var(--surface)" stroke="var(--border-soft)" transform="rotate(6 177 90)" />
      <rect x="76" y="38" width="170" height="124" rx="18" fill="var(--surface)" stroke="var(--border)" />
      <text x="94" y="66" fontSize="13" fontWeight="600" fill="var(--iris)" fontFamily="JetBrains Mono, monospace">&lt;task&gt;</text>
      {line(94, 78, 120)}
      <rect x="94" y="93" width="130" height="9" rx="4.5" fill={grad} />
      {line(94, 110, 96)}
      <text x="94" y="140" fontSize="13" fontWeight="600" fill="var(--iris)" fontFamily="JetBrains Mono, monospace">&lt;/task&gt;</text>
      <g transform="translate(222 120)">
        <circle r="26" fill="var(--ink)" />
        <path d="M-9-7l-7 7 7 7M9-7l7 7-7 7M3-11l-6 22" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(60 150)">
        <circle r="16" fill={grad} />
        <path d="M-6 0l4 4 8-8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  ),
  features: (grad) => (
    <g>
      {[
        [70, 40], [140, 40], [210, 40],
        [70, 110], [140, 110], [210, 110],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <rect width="56" height="56" rx="16" fill={i === 4 ? grad : 'var(--surface)'} stroke={i === 4 ? 'none' : 'var(--border)'} />
          {GLYPHS[i](i === 4 ? '#fff' : i % 2 ? 'var(--iris)' : 'var(--ember)')}
        </g>
      ))}
    </g>
  ),
  english: (grad) => (
    <g>
      <g transform="translate(96 44)">
        <rect x="-18" y="0" width="36" height="62" rx="18" fill={grad} />
        <path d="M-30 38a30 30 0 0 0 60 0M0 68v18m-16 0h32" stroke="var(--fg-muted)" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${140 + i * 14} ${60 - i * 8}q${12 + i * 4} ${30 + i * 8} 0 ${60 + i * 16}`}
          stroke="var(--iris)"
          strokeOpacity={0.8 - i * 0.22}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <g transform="translate(196 42)">
        <path d="M0 16a16 16 0 0 1 16-16h68a16 16 0 0 1 16 16v28a16 16 0 0 1-16 16H30l-14 14v-14A16 16 0 0 1 0 44z" fill="var(--ink)" />
        <text x="18" y="37" fontSize="17" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">Hello!</text>
      </g>
      <g transform="translate(196 132)">
        <rect width="100" height="34" rx="12" fill="var(--surface)" stroke="var(--border)" />
        <text x="14" y="22" fontSize="13" fontWeight="600" fill="var(--fg)" fontFamily="Inter, sans-serif">fluent</text>
        <text x="84" y="23" fontSize="13" textAnchor="end" fill="var(--clay)" fontFamily="Alexandria, sans-serif">طليق</text>
      </g>
    </g>
  ),
}

ART.students = (grad: string) => (
  <g>
    {[0, 1, 2].map((i) => (
      <rect key={i} x={70 + i * 6} y={150 - i * 24} width={130 - i * 12} height="20" rx="6" fill={i === 1 ? grad : 'var(--surface)'} stroke="var(--border)" />
    ))}
    <g transform="translate(134 66)">
      <path d="M0 -26L52 -6 0 14-52-6z" fill="var(--ink)" />
      <path d="M-30 4v18c0 8 60 8 60 0V4" fill="var(--ink)" opacity="0.85" />
      <path d="M40 -2v24" stroke="var(--ember)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="26" r="5" fill="var(--ember)" />
    </g>
    <g transform="translate(214 60)">
      <rect width="74" height="96" rx="14" fill="var(--surface)" stroke="var(--border)" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(12 ${18 + i * 26})`}>
          <rect width="14" height="14" rx="4" fill={i < 2 ? 'var(--iris)' : 'none'} stroke="var(--iris)" strokeWidth="2" />
          {i < 2 && <path d="M3.5 7l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />}
          <rect x="22" y="4" width="30" height="6" rx="3" fill="var(--border)" />
        </g>
      ))}
    </g>
  </g>
)

const GLYPHS: ((c: string) => React.ReactNode)[] = [
  (c) => <path d="M14 20h10l4 4h14v16H14z" fill="none" stroke={c} strokeWidth="3" strokeLinejoin="round" />,
  (c) => (
    <g fill="none" stroke={c} strokeWidth="3" strokeLinecap="round">
      <rect x="16" y="13" width="24" height="30" rx="4" />
      <path d="M22 23h12M22 30h8" />
    </g>
  ),
  (c) => (
    <g fill="none" stroke={c} strokeWidth="3">
      <circle cx="28" cy="28" r="13" />
      <path d="M15 28h26M28 15c6 7 6 19 0 26M28 15c-6 7-6 19 0 26" />
    </g>
  ),
  (c) => <path d="M22 14v10m12-10v10M17 24h22v6a11 11 0 0 1-22 0zM28 41v5" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />,
  (c) => <path d="M18 18h8a4 4 0 1 1 8 0h4v8a4 4 0 1 1 0 8v6H18v-8a4 4 0 1 0 0-8z" fill="none" stroke={c} strokeWidth="3" strokeLinejoin="round" />,
  (c) => (
    <g fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 22l7 6-7 6M29 36h10" />
    </g>
  ),
]

/** Wraps art so it drifts gently against the page scroll (parallax). */
export function Parallax({
  children,
  className,
  distance = 40,
  tilt = true,
}: {
  children: React.ReactNode
  className?: string
  distance?: number
  tilt?: boolean
}) {
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
