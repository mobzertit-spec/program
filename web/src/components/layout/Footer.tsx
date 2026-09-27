import { Link } from 'react-router-dom'
import { useLocale } from '@/context/LocaleContext'
import { LanguageSwitch } from './LanguageSwitch'
import { Wordmark } from './Logo'

const LINKS = [
  ['/path', 'Path', 'المسار'],
  ['/lessons', 'Lessons', 'الدروس'],
  ['/vocabulary', 'Vocabulary', 'المفردات'],
  ['/practice', 'Practice', 'تدرّب'],
  ['/lab', 'Prompt Lab', 'مختبر الطلبات'],
  ['/library', 'Library', 'المكتبة'],
  ['/account', 'Account', 'الحساب'],
  ['/privacy', 'Privacy', 'الخصوصية'],
] as const

export function Footer() {
  const { t, rtl } = useLocale()
  return (
    <footer className="border-t border-border-soft bg-bg-alt">
      <div className="mx-auto max-w-[1024px] px-4 py-10 text-xs text-fg-muted sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4">
            <Wordmark />
            <LanguageSwitch />
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2" dir={rtl ? 'rtl' : 'ltr'}>
            {LINKS.map(([to, en, ar]) => (
              <Link key={to} to={to} lang={rtl ? 'ar' : 'en'} className="text-sm hover:text-fg hover:underline">
                {t(en, ar)}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-border-soft pt-6 leading-relaxed">
          <p>
            An independent learning project. Not affiliated with Anthropic. “Claude” is a trademark of Anthropic, PBC.
            Online translations are provided by the free MyMemory API. Course and video links go to official Anthropic websites.
          </p>
          <p lang="ar" className="mt-2">
            مشروع تعليمي مستقل لتعلّم استخدام Claude وتطوير لغتك الإنجليزية في الوقت نفسه. غير تابع لشركة Anthropic.
          </p>
        </div>
      </div>
    </footer>
  )
}
