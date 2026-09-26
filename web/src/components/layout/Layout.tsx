import { Suspense, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'
import { SelectionTranslator } from '@/components/translate/SelectionTranslator'
import { TranslatorPanel } from '@/components/translate/TranslatorPanel'
import { WordPopover } from '@/components/translate/WordPopover'
import { useTranslator } from '@/context/TranslatorContext'
import { AmbientBackground } from '@/components/art/AmbientBackground'
import { endTakeover, isServer, isTakeover } from '@/lib/boot'
import { ROUTE_META, pageTitle } from '@/lib/meta'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function Layout() {
  const { pathname } = useLocation()
  const { close } = useTranslator()
  const reduce = useReducedMotion()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    close()
  }, [pathname, close])
  // static pages name the tab here; lesson pages set their own title
  useEffect(() => {
    const meta = ROUTE_META[pathname.replace(/(.)\/$/, '$1')]
    if (meta) document.title = pageTitle(meta.title)
  }, [pathname])
  // the first render has replaced the prerendered HTML — from now on, animate as usual
  useEffect(endTakeover, [])

  return (
    <div className="flex min-h-dvh flex-col pb-16 lg:pb-0">
      <AmbientBackground />
      <button
        onClick={() => document.getElementById('main')?.focus()}
        className="sr-only cursor-pointer focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[80] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </button>
      <Navbar />
      {/* min height keeps the footer below the fold while a page loads (no layout shift) */}
      <main id="main" tabIndex={-1} className="min-h-dvh flex-1 pt-[72px] outline-none">
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
    </div>
  )
}
