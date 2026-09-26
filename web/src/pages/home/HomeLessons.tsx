import { ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LessonIcon, levelTone } from '@/components/LessonIcon'
import { Parallax, TrackArt } from '@/components/art/TrackArt'
import { Badge } from '@/components/ui/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { Marquee } from '@/components/ui/marquee'
import { lessons, lessonsByTrack, tracks } from '@/data/lessons'

/* Home sections that need the lesson data — code-split so the first screen loads faster. */

const allVocab = lessons.flatMap((l) => l.vocab)

export function TracksSection() {
  return (
    <>
      {/* ---------------- Tracks ---------------- */}
      <section className="mx-auto max-w-[1024px] px-4 pt-24 sm:px-6">
        <BlurFade>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">Five tracks</p>
          <h2 className="mt-2 max-w-3xl text-balance text-4xl font-bold tracking-[-0.03em] sm:text-6xl">
            From your first message to <span className="text-brand">Claude Code</span>.
          </h2>
          <p lang="ar" data-ar-help className="mt-3 text-fg-muted">
            خمسة مسارات: من رسالتك الأولى حتى Claude Code والدراسة.
          </p>
        </BlurFade>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {tracks.map((t, i) => (
            <BlurFade key={t.id} delay={i * 0.06}>
              <Link
                to="/path"
                className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border-soft bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-pop"
              >
                <Parallax distance={10} tilt={false}>
                  <TrackArt track={t.id} className="transition-transform duration-500 group-hover:scale-[1.03]" />
                </Parallax>
                <div className="mt-5 flex items-start justify-between gap-3 px-1">
                  <div>
                    <p className="text-xs font-semibold text-fg-subtle">
                      Track {i + 1} · {lessonsByTrack(t.id).length} lessons
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-tight">{t.title}</h3>
                    <p lang="ar" data-ar-help className="text-sm text-fg-muted">
                      {t.titleAr}
                    </p>
                    <p className="mt-2 text-[15px] text-fg-muted">{t.description}</p>
                  </div>
                  <ArrowRight className="mt-6 size-5 shrink-0 text-link transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>
    </>
  )
}

export function VocabMarquee() {
  return (
    <>
      {/* ---------------- Vocabulary marquee ---------------- */}
      <section className="overflow-hidden bg-bg-alt py-20">
        <BlurFade className="mx-auto mb-10 max-w-[1024px] px-4 sm:px-6">
          <h2 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Words you will actually use.</h2>
          <p className="mt-3 max-w-xl text-lg text-fg-muted">
            Every lesson teaches five practical English words — the same words you need to write great prompts.
          </p>
        </BlurFade>
        <div className="space-y-4">
          {[0, 1].map((row) => (
            <Marquee key={row} reverse={row === 1} duration={row ? 55 : 45}>
              {allVocab
                .filter((_, i) => i % 2 === row)
                .map((v) => (
                  <div
                    key={v.word}
                    className="flex items-center gap-3 rounded-full border border-border-soft bg-surface px-5 py-3 shadow-card"
                  >
                    <span className="font-semibold">{v.word}</span>
                    <span className="h-4 w-px bg-border" />
                    <span lang="ar" data-ar-help className="text-fg-muted">
                      {v.ar}
                    </span>
                  </div>
                ))}
            </Marquee>
          ))}
        </div>
      </section>
    </>
  )
}

export function LessonLineup() {
  return (
    <>
      {/* ---------------- Lesson lineup ---------------- */}
      <section className="py-24">
        <div className="mx-auto flex max-w-[1024px] items-end justify-between gap-4 px-4 sm:px-6">
          <BlurFade>
            <h2 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Explore the lessons.</h2>
            <p lang="ar" data-ar-help className="mt-2 text-fg-muted">
              اكتشف الدروس
            </p>
          </BlurFade>
          <Link to="/lessons" className="hidden shrink-0 items-center gap-1 text-link hover:underline sm:inline-flex">
            View all <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-6 sm:scroll-px-6 sm:px-6 lg:px-[max(1.5rem,calc((100vw-1024px)/2+1.5rem))]">
          {lessons.map((l, i) => (
            <BlurFade key={l.id} delay={Math.min(i, 4) * 0.06} className="snap-start">
              <Link
                to={`/lessons/${l.id}`}
                className="group flex h-[360px] w-[280px] flex-col justify-between rounded-[28px] border border-border-soft bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-pop"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-bg-alt">
                      <LessonIcon name={l.icon} className="size-6 text-clay" />
                    </span>
                    <span className="text-sm font-medium text-fg-subtle">{String(l.number).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight">{l.title}</h3>
                  <p lang="ar" data-ar-help className="mt-1 text-sm text-fg-muted">
                    {l.titleAr}
                  </p>
                  <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-fg-muted">{l.summary.en}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge tone={levelTone(l.level)}>{l.level}</Badge>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-link">
                    {l.minutes} min <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>
    </>
  )
}
