import { AnimatePresence, motion } from 'motion/react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'

const links = [
  { to: '/lessons', label: 'Lessons', ar: 'الدروس' },
  { to: '/vocabulary', label: 'Vocabulary', ar: 'المفردات' },
  { to: '/lab', label: 'Prompt Lab', ar: 'مختبر الطلبات' },
]

export function Navbar() {
  const { theme, setTheme, showArabic, setShowArabic, saved } = useApp()
  const location = useLocation()
  // menu is tied to the path it was opened on, so navigating closes it without an effect
  const [openPath, setOpenPath] = useState<string | null>(null)
  const open = openPath === location.pathname
  const setOpen = (v: boolean) => setOpenPath(v ? location.pathname : null)
  const isDark =
    theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft/70 bg-[var(--nav-bg)] backdrop-blur-xl backdrop-saturate-150">
      <nav className="mx-auto flex h-13 max-w-[1024px] items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link to="/" className="flex items-center gap-2 rounded-lg" aria-label="Prompt English home">
          <Logo className="size-7" />
          <span className="text-[15px] font-semibold tracking-tight">Prompt English</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-3.5 py-1.5 text-[13px] transition-colors',
                    isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-bg-alt"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                      />
                    )}
                    <span className="relative">
                      {l.label}
                      {l.to === '/vocabulary' && saved.length > 0 && (
                        <span className="ml-1.5 rounded-full bg-clay px-1.5 py-px text-[10px] font-semibold text-white">{saved.length}</span>
                      )}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowArabic(!showArabic)}
            aria-pressed={showArabic}
            title={showArabic ? 'Hide Arabic translations' : 'Show Arabic translations'}
            className={cn(
              'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-colors',
              showArabic ? 'bg-fg text-bg' : 'text-fg-muted hover:bg-bg-alt hover:text-fg',
            )}
          >
            <span className="font-arabic text-[15px] leading-none">ع</span>
            <span className="hidden sm:inline">{showArabic ? 'Arabic on' : 'Arabic'}</span>
          </button>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="grid size-9 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors hover:bg-bg-alt hover:text-fg"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="grid size-9 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-bg-alt md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100dvh - 52px)' }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
            className="overflow-hidden bg-bg md:hidden"
          >
            <ul className="flex flex-col gap-1 px-8 pt-6">
              {links.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                >
                  <NavLink to={l.to} className="flex items-baseline justify-between py-3 text-3xl font-semibold tracking-tight">
                    {l.label}
                    <span lang="ar" className="text-base font-normal text-fg-muted">
                      {l.ar}
                    </span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
