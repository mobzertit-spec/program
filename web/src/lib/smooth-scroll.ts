import type Lenis from 'lenis'

/**
 * Smooth, gliding scroll for mouse wheels and trackpads (Lenis). Touch screens keep their own native momentum,
 * and nothing changes for people who ask for reduced motion. Loaded after the first paint, so it never delays it.
 * Native scroll position stays the source of truth, so `useScroll`, sticky sections and anchors keep working.
 */
let lenis: Lenis | null = null

export async function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer: fine)').matches) return
  const { default: L } = await import('lenis')
  if (lenis) return
  lenis = new L({
    lerp: 0.085, // how much of the remaining distance each frame covers: lower = longer glide
    wheelMultiplier: 0.95,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: true,
    anchors: { offset: -88 },
    allowNestedScroll: true, // dialogs, lists and panels with their own scroll keep working
  })
}

/** Jump to the top on a new page (no glide across the whole old page). */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
}
