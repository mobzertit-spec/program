import type { ReactNode } from 'react'
import { useLocale } from '@/context/LocaleContext'
import { BlurFade } from './blur-fade'

type Text = { en: string; ar: string }

/** Bilingual page header. In the Arabic interface, Arabic leads (RTL) and English follows as the learning line. */
export function PageHeader({ eyebrow, title, intro, children }: { eyebrow: Text; title: Text; intro: Text; children?: ReactNode }) {
  const { rtl } = useLocale()
  return (
    <BlurFade>
      <div dir={rtl ? 'rtl' : 'ltr'}>
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay" lang={rtl ? 'ar' : 'en'}>
          {rtl ? eyebrow.ar : eyebrow.en}
        </p>
        <h1 lang={rtl ? 'ar' : 'en'} className="mt-2 text-5xl font-bold tracking-[-0.035em] sm:text-7xl" style={rtl ? { letterSpacing: 0, lineHeight: 1.25 } : undefined}>
          {rtl ? title.ar : title.en}
        </h1>
        {rtl && <p className="mt-1 text-xl font-semibold text-fg-subtle" lang="en" dir="ltr" style={{ textAlign: 'right' }}>{title.en}</p>}
        <p lang={rtl ? 'ar' : 'en'} className="mt-4 max-w-2xl text-lg text-fg-muted sm:text-xl">
          {rtl ? intro.ar : intro.en}
        </p>
        <p lang={rtl ? 'en' : 'ar'} dir={rtl ? 'ltr' : 'rtl'} className="mt-1 max-w-2xl text-fg-subtle" style={{ textAlign: rtl ? 'right' : 'left' }}>
          {rtl ? intro.en : intro.ar}
        </p>
        {children}
      </div>
    </BlurFade>
  )
}
