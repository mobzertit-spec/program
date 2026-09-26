import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { BookA, BookOpen, CircleUserRound, Flame, Gamepad2, Languages, Library, Moon, Route, Sun } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { avatarUrl, displayName, useAuth } from '@/context/AuthContext'
import { useLocale } from '@/context/LocaleContext'
import { useTranslator } from '@/context/TranslatorContext'
import { cn } from '@/lib/utils'
import { Wordmark } from './Logo'

const links = [
  { to: '/path', label: 'Path', ar: 'المسار', icon: Route },
  { to: '/lessons', label: 'Lessons', ar: 'الدروس', icon: BookOpen },
  { to: '/vocabulary', label: 'Words', ar: 'الكلمات', icon: BookA },
  { to: '/practice', label: 'Practice', ar: 'تدرّب', icon: Gamepad2 },
  { to: '/library', label: 'Library', ar: 'المكتبة', icon: Library },
]

/** Floating glass navbar: hides while scrolling down, returns on scroll up, shows page progress. */
export function Navbar() {
  const { theme, setTheme, arabicHelp, setArabicHelp, dueWords, streak, xp, xpToday, dailyGoal } = useApp()
  const { setPanelOpen } = useTranslator()
  const { user } = useAuth()
  const { t, rtl } = useLocale()
  const reduce = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(!reduce && y > prev && y > 160)
    setScrolled(y > 8)
  })
  const isDark =
    theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden ? -96 : 0 }}
        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3"
      >
        <nav
          aria-label="Main"
          className={cn(
            'relative mx-auto flex h-14 max-w-[1100px] items-center justify-between overflow-hidden rounded-full border pl-3 pr-1.5 backdrop-blur-xl backdrop-saturate-150 transition-[box-shadow,background-color,border-color] duration-300',
            'border-border-soft bg-[var(--nav-bg)]',
            scrolled ? 'shadow-[0_8px_30px_rgb(18_20_43/0.1)]' : 'shadow-[0_2px_10px_rgb(18_20_43/0.04)]',
          )}
        >
          <Link to="/" className="rounded-full pr-2" aria-label="CE home">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex" dir={rtl ? 'rtl' : 'ltr'}>
            {links.map(({ to, label, ar, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      'relative flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-medium transition-colors',
                      isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full bg-surface shadow-[0_1px_6px_rgb(18_20_43/0.1)] dark:bg-surface-2"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                        />
                      )}
                      <Icon className={cn('relative size-4', isActive && 'text-primary')} aria-hidden />
                      <span className="relative" lang={rtl ? 'ar' : 'en'}>
                        {t(label, ar)}
                      </span>
                      {to === '/vocabulary' && dueWords.length > 0 && (
                        <span className="relative rounded-full bg-clay px-1.5 py-px text-[10px] font-semibold text-white" aria-label={`${dueWords.length} words to review`}>
                          {dueWords.length}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-0.5 sm:gap-1">
            {xp > 0 && (
            <Link
              to="/path"
              title={`${xpToday}/${dailyGoal} XP today`}
              aria-label={`${streak}-day streak, ${xpToday} of ${dailyGoal} XP today`}
              className="inline-flex h-10 items-center gap-1 rounded-full px-3 text-[13px] font-semibold transition-colors hover:bg-bg-alt"
            >
              <Flame className={cn('size-[18px]', streak ? 'fill-clay text-clay' : 'text-fg-subtle')} />
              <span className={streak ? 'text-clay' : 'text-fg-muted'}>{streak}</span>
            </Link>
            )}
            <button
              onClick={() => setPanelOpen(true)}
              aria-label="Open the translator"
              title="Translate (/)"
              className="grid size-10 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors hover:bg-bg-alt hover:text-fg lg:hidden"
            >
              <Languages className="size-[19px]" />
            </button>
            <button
              onClick={() => setArabicHelp(!arabicHelp)}
              aria-pressed={arabicHelp}
              title={arabicHelp ? 'Hide Arabic help' : 'Show Arabic help'}
              aria-label={arabicHelp ? 'Hide Arabic help' : 'Show Arabic help'}
              className={cn(
                'grid size-10 cursor-pointer place-items-center rounded-full font-arabic text-base transition-colors',
                arabicHelp ? 'bg-fg text-bg' : 'text-fg-muted hover:bg-bg-alt hover:text-fg',
              )}
            >
              ع
            </button>
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="grid size-10 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors hover:bg-bg-alt hover:text-fg"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </button>
            <NavLink
              to="/account"
              aria-label={user ? `Your account: ${displayName(user)}` : 'Sign in'}
              title={user ? displayName(user) : 'Sign in'}
              className="grid size-10 place-items-center rounded-full text-fg-muted transition-colors hover:bg-bg-alt hover:text-fg"
            >
              {user && avatarUrl(user) ? (
                <img src={avatarUrl(user)} alt="" referrerPolicy="no-referrer" className="size-8 rounded-full object-cover" />
              ) : user ? (
                <span className="bg-brand grid size-8 place-items-center rounded-full text-sm font-bold text-white">
                  {displayName(user)[0]?.toUpperCase()}
                </span>
              ) : (
                <CircleUserRound className="size-[20px]" />
              )}
            </NavLink>
          </div>

          <motion.span
            aria-hidden
            style={{ scaleX: progress }}
            className="bg-brand absolute inset-x-8 bottom-0 h-[2px] origin-left rounded-full"
          />
        </nav>
      </motion.header>

      {/* Mobile tab bar */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border-soft bg-[var(--nav-bg)] pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 lg:hidden"
      >
        <ul className="mx-auto grid h-16 max-w-lg grid-cols-5" dir={rtl ? 'rtl' : 'ltr'}>
          {links.map(({ to, label, ar, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'relative flex h-full flex-col items-center justify-center gap-0.5 text-[10.5px] font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-fg-muted',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="tab-dot" className="absolute top-1 h-1 w-6 rounded-full bg-primary" />}
                    <span className="relative">
                      <Icon className="size-[22px]" aria-hidden />
                      {to === '/vocabulary' && dueWords.length > 0 && (
                        <span className="absolute -right-2 -top-1 size-2.5 rounded-full border-2 border-bg bg-clay" aria-hidden />
                      )}
                    </span>
                    <span lang={rtl ? 'ar' : 'en'}>{t(label, ar)}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
