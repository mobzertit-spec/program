import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Outlet, useLocation } from 'react-router-dom'
import { SelectionTranslator } from '@/components/translate/SelectionTranslator'
import { TranslatorPanel } from '@/components/translate/TranslatorPanel'
import { WordPopover } from '@/components/translate/WordPopover'
import { useTranslator } from '@/context/TranslatorContext'
import { AmbientBackground } from '@/components/art/AmbientBackground'
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
      <main id="main" tabIndex={-1} className="flex-1 pt-[72px] outline-none">
        {/* soft page transition: each route fades and rises in */}
        <motion.div
          key={pathname}
          initial={reduce ? false : { opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.45, ease: [0.2, 0.7, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
      <TranslatorPanel />
      <WordPopover />
      <SelectionTranslator />
    </div>
  )
}
