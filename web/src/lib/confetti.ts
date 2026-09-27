/**
 * Tiny confetti burst on a throw-away canvas (no dependency). Skipped for people who prefer reduced motion.
 * Colors follow the CE brand: Ember, Iris, Primary plus a few festive accents.
 */
const COLORS = ['#f07a45', '#6d5dfc', '#4f46e5', '#ffb07a', '#8b8dff', '#3ddc84', '#f5c542']

type Options = {
  /** origin in viewport pixels (default: centre, a little below the middle) */
  x?: number
  y?: number
  count?: number
  /** spread angle in degrees around "up" */
  spread?: number
  /** initial speed in px/frame */
  power?: number
  /** main direction in degrees (-90 = straight up) */
  angle?: number
}

export function confetti({ x, y, count = 120, spread = 70, power = 13, angle: dir = -90 }: Options = {}) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const W = window.innerWidth
  const H = window.innerHeight
  canvas.width = W * dpr
  canvas.height = H * dpr
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '120' })
  canvas.setAttribute('aria-hidden', 'true')
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas.remove()
  ctx.scale(dpr, dpr)

  const ox = x ?? W / 2
  const oy = y ?? H * 0.6
  const parts = Array.from({ length: count }, () => {
    const angle = ((dir + (Math.random() - 0.5) * spread * 2) * Math.PI) / 180
    const speed = power * (0.55 + Math.random() * 0.6)
    return {
      x: ox,
      y: oy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      round: Math.random() < 0.25,
    }
  })

  const start = performance.now()
  const DURATION = 2600
  const frame = (t: number) => {
    const age = t - start
    ctx.clearRect(0, 0, W, H)
    const fade = age > DURATION - 700 ? Math.max(0, (DURATION - age) / 700) : 1
    for (const p of parts) {
      p.vy += 0.32 // gravity
      p.vx *= 0.985 // air
      p.vy *= 0.985
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      ctx.save()
      ctx.globalAlpha = fade
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      if (p.round) {
        ctx.beginPath()
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // flutter: squash the rectangle as it spins
        ctx.fillRect(-p.w / 2, (-p.h / 2) * Math.abs(Math.cos(p.rot * 2)), p.w, p.h * Math.abs(Math.cos(p.rot * 2)) + 1)
      }
      ctx.restore()
    }
    if (age < DURATION) requestAnimationFrame(frame)
    else canvas.remove()
  }
  requestAnimationFrame(frame)
}

/** Two bursts from the lower corners — for the big moments. */
export function celebrate() {
  const W = window.innerWidth
  const H = window.innerHeight
  confetti({ x: W * 0.1, y: H * 0.9, count: 90, spread: 25, power: 19, angle: -65 })
  confetti({ x: W * 0.9, y: H * 0.9, count: 90, spread: 25, power: 19, angle: -115 })
}
