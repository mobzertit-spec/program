import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'
import { SelectionTranslator } from '@/components/translate/SelectionTranslator'
import { TranslatorPanel } from '@/components/translate/TranslatorPanel'
import { WordPopover } from '@/components/translate/WordPopover'
import { useTranslator } from '@/context/TranslatorContext'
import { endTakeover, isServer, isTakeover } from '@/lib/boot'
import { ROUTE_META, pageTitle } from '@/lib/meta'
import { scrollToTop, startSmoothScroll } from '@/lib/smooth-scroll'
import { Footer } from './Footer'

// parties for lessons, levels, badges and the daily goal — loaded once the page is up
const Celebrations = lazy(() => import('@/components/learn/Celebrations').then((m) => ({ default: m.Celebrations })))
import { Navbar } from './Navbar'

export function Layout() {
  const { pathname } = useLocation()
  const { close } = useTranslator()
  const reduce = useReducedMotion()
  useEffect(() => {
    scrollToTop()
    close()
  }, [pathname, close])
  // static pages name the tab here; lesson pages set their own title
  useEffect(() => {
    const meta = ROUTE_META[pathname.replace(/(.)\/$/, '$1')]
    if (meta) document.title = pageTitle(meta.title)
  }, [pathname])
  // the first render has replaced the prerendered HTML — from now on, animate as usual
  useEffect(endTakeover, [])
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  // gliding scroll for mouse wheels and trackpads, once the page is up and idle
  useEffect(() => {
    const go = () => void startSmoothScroll()
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 2500 })
    else window.setTimeout(go, 1200)
  }, [])

  return (
    <div className="flex min-h-dvh flex-col pb-16 lg:pb-0">
      <button
        onClick={() => document.getElementById('main')?.focus()}
        className="sr-only cursor-pointer focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[80] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </button>
      <Navbar />
      {/* min height keeps the footer below the fold while a page loads (no layout shift) */}
      <main id="main" tabIndex={-1} className="min-h-dvh flex-1 pt-16 outline-none">
        {/* soft page transition: each route fades and rises in (not on the very first, prerendered paint) */}
        <motion.div
          key={pathname}
          initial={reduce || isServer || isTakeover() ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.7, 0.3, 1] }}
        >
          <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
            <Outlet />
          </Suspense>
        </motion.div>
      </main>
      <Footer />
      <TranslatorPanel />
      <WordPopover />
      <SelectionTranslator />
      {ready && (
        <Suspense fallback={null}>
          <Celebrations />
        </Suspense>
      )}
    </div>
  )
}
