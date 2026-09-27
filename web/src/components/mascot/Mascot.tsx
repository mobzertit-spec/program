import { useId } from 'react'
import { cn } from '@/lib/utils'

export type MascotPose = 'wave' | 'cheer' | 'think' | 'sleep'

const INK = '#12142b'
const LEFT = '#f58a55'
const RIGHT = '#7466fb'

/**
 * Cee — the CE mascot (designed in Figma: “CE — Design System” → Mascot page, component set “Cee”).
 * A friendly speech bubble in the brand gradient with the logo spark as an antenna.
 * Poses: wave (welcome), cheer (celebrations), think (coach, empty lists), sleep (404, nothing due).
 * Decorative by default; pass `title` when the mascot carries meaning.
 */
export function Mascot({
  pose = 'wave',
  size = 120,
  animated = true,
  title,
  className,
}: {
  pose?: MascotPose
  size?: number
  animated?: boolean
  title?: string
  className?: string
}) {
  const gid = `cee-${useId().replace(/:/g, '')}`
  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={cn('shrink-0 overflow-visible', animated && 'cee-anim', className)}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      <defs>
        <linearGradient id={gid} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ff9a62" />
          <stop offset="0.55" stopColor="#e9708a" />
          <stop offset="1" stopColor="#6d5dfc" />
        </linearGradient>
      </defs>
      <ellipse className="cee-shadow" cx="80" cy="152" rx="36" ry="5" fill={INK} opacity="0.12" />
      <g className="cee-figure">
        <Arms pose={pose} />
        <g>
          <path d="M 96 27 Q 100 18 106 14" fill="none" stroke="#7b6cff" strokeWidth="3.5" strokeLinecap="round" />
          <path className="cee-spark" d="M 108 3 l 1.6 4.2 4.2 1.6 -4.2 1.6 -1.6 4.2 -1.6 -4.2 -4.2 -1.6 4.2 -1.6 z" fill="#aaa6ff" />
        </g>
        <path
          d="M 68 26 H 92 A 44 44 0 0 1 136 70 V 82 A 44 44 0 0 1 92 126 H 68 L 44 146 L 46 120.1 A 44 44 0 0 1 24 82 V 70 A 44 44 0 0 1 68 26 Z"
          fill={`url(#${gid})`}
        />
        <ellipse cx="56" cy="46" rx="15" ry="8" transform="rotate(-24 56 46)" fill="#fff" opacity="0.28" />
        <Face pose={pose} />
        <g fill="#ff6f9f" opacity="0.5">
          <ellipse cx="48" cy="92" rx="7" ry="4.5" />
          <ellipse cx="112" cy="92" rx="7" ry="4.5" />
        </g>
        <Extras pose={pose} />
      </g>
    </svg>
  )
}

function Arms({ pose }: { pose: MascotPose }) {
  const arm = (d: string, color: string, className?: string) => (
    <path className={className} d={d} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
  )
  switch (pose) {
    case 'wave':
      return (
        <>
          {arm('M 27 94 Q 16 104 14 114', LEFT)}
          {arm('M 133 78 Q 146 64 148 46', RIGHT, 'cee-wave')}
        </>
      )
    case 'cheer':
      return (
        <>
          {arm('M 27 80 Q 14 64 12 44', LEFT, 'cee-cheer-l')}
          {arm('M 133 80 Q 146 64 148 44', RIGHT, 'cee-cheer-r')}
        </>
      )
    case 'think':
      return arm('M 27 94 Q 16 104 14 114', LEFT) // the other hand sits on the chin (drawn over the body)
    case 'sleep':
      return (
        <>
          {arm('M 27 96 Q 18 106 18 116', LEFT)}
          {arm('M 133 96 Q 142 106 142 116', RIGHT)}
        </>
      )
  }
}

function Face({ pose }: { pose: MascotPose }) {
  if (pose === 'cheer')
    return (
      <>
        <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round">
          <path d="M 54 77 Q 62 67 70 77" />
          <path d="M 90 77 Q 98 67 106 77" />
        </g>
        <path d="M 69 90 Q 80 108 91 90 Z" fill={INK} />
        <path d="M 74 99 Q 80 104 86 99 Q 80 96 74 99 Z" fill="#ff7a8a" />
      </>
    )
  if (pose === 'sleep')
    return (
      <>
        <g fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round">
          <path d="M 55 75 Q 62 81 69 75" />
          <path d="M 91 75 Q 98 81 105 75" />
        </g>
        <ellipse className="cee-snore" cx="80" cy="96" rx="4" ry="4.5" fill={INK} />
      </>
    )
  const [dx, dy] = pose === 'think' ? [4, -4] : [0, 0]
  return (
    <>
      <g className="cee-eyes">
        <ellipse cx={62 + dx} cy={74 + dy} rx="7" ry="9" fill={INK} />
        <ellipse cx={98 + dx} cy={74 + dy} rx="7" ry="9" fill={INK} />
        <circle cx={64.5 + dx} cy={70 + dy} r="2.6" fill="#fff" />
        <circle cx={100.5 + dx} cy={70 + dy} r="2.6" fill="#fff" />
      </g>
      {pose === 'think' ? (
        <path d="M 73 95 Q 81 100 88 93" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      ) : (
        <path d="M 71 93 Q 80 102 89 93" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      )}
    </>
  )
}

function Extras({ pose }: { pose: MascotPose }) {
  if (pose === 'think')
    return (
      <>
        <path d="M 133 98 Q 124 118 104 108" fill="none" stroke="#fff" strokeWidth="13" strokeLinecap="round" />
        <path d="M 133 98 Q 124 118 104 108" fill="none" stroke={RIGHT} strokeWidth="9" strokeLinecap="round" />
        <g fill="#aaa6ff">
          <circle className="cee-dot cee-dot-1" cx="30" cy="30" r="3" />
          <circle className="cee-dot cee-dot-2" cx="20" cy="20" r="4.5" />
          <circle className="cee-dot cee-dot-3" cx="8" cy="7" r="6" />
        </g>
      </>
    )
  if (pose === 'sleep')
    return (
      <g fill="none" stroke="#7b6cff" strokeLinecap="round" strokeLinejoin="round">
        <path className="cee-z cee-z-1" d="M 118 18 H 128 L 118 29 H 128" strokeWidth="3.2" />
        <path className="cee-z cee-z-2" d="M 133 4 H 140 L 133 12 H 140" strokeWidth="2.6" />
      </g>
    )
  if (pose === 'cheer')
    return (
      <g className="cee-sparkles">
        <path d="M 20 22 l 1.4 3.6 3.6 1.4 -3.6 1.4 -1.4 3.6 -1.4 -3.6 -3.6 -1.4 3.6 -1.4 z" fill="#f5c542" />
        <path d="M 144 20 l 1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 z" fill="#3ddc84" />
        <circle cx="34" cy="10" r="2.5" fill="#f07a45" />
        <circle cx="128" cy="6" r="2.5" fill="#6d5dfc" />
      </g>
    )
  return null
}
