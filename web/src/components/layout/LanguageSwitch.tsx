import { Globe } from 'lucide-react'
import { useLocale } from '@/context/LocaleContext'
import { cn } from '@/lib/utils'

/** Interface language: English or Arabic (lesson content always stays in English). */
export function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLocale()
  return (
    <div role="group" aria-label="Interface language · لغة الواجهة" className={cn('inline-flex items-center gap-1 rounded-full bg-bg-alt p-1', className)}>
      <Globe className="mx-1.5 size-4 text-fg-subtle" aria-hidden />
      {(
        [
          ['en', 'English'],
          ['ar', 'العربية'],
        ] as const
      ).map(([code, label]) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          lang={code}
          className={cn(
            'min-h-8 cursor-pointer rounded-full px-3 text-xs font-medium transition-colors',
            lang === code ? 'bg-surface text-fg shadow-card' : 'text-fg-muted hover:text-fg',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
