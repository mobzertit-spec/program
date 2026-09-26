import { ExternalLink, ListVideo } from 'lucide-react'
import { ResourceCard } from '@/components/learn/ResourceCard'
import { VideoEmbed } from '@/components/learn/VideoEmbed'
import { BlurFade } from '@/components/ui/blur-fade'
import { PLAYLISTS, R, type Resource } from '@/data/resources'

const courses: Resource[] = [
  R.claude101, R.aiFluency, R.aiFluencyStudents, R.aiFluencyEducators, R.aiFluencyBuilders,
  R.claudeCode101, R.agentSkillsCourse, R.mcpCourse, R.apiCourse, R.academyAll,
]
const videos: Resource[] = [R.vPrompting101, R.vAiFluencyIntro, R.vAiFluency4D, R.vPromptingAgents, R.vClaudeCodeBP, R.vMcp201]
const docs: Resource[] = [R.bestPractices, R.promptTutorial, R.promptOverview, R.skillsDocs, R.claudeCodeDocs, R.claudeCodeMemory]
const help: Resource[] = [
  R.getStarted, R.projects, R.artifacts, R.skillsHelp, R.useSkills, R.createSkill, R.connectors,
  R.webSearch, R.research, R.whenSearch, R.voice, R.memory, R.incognito, R.usageLimits,
]

const SECTIONS = [
  { id: 'courses', label: 'Courses', ar: 'دورات' },
  { id: 'videos', label: 'Videos', ar: 'فيديوهات' },
  { id: 'docs', label: 'Docs & tutorials', ar: 'وثائق وشروحات' },
  { id: 'help', label: 'Help Center', ar: 'مركز المساعدة' },
]

export default function Library() {
  return (
    <div className="mx-auto max-w-[1024px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <BlurFade>
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">Official sources only</p>
        <h1 className="mt-2 text-5xl font-bold tracking-[-0.035em] sm:text-7xl">Library.</h1>
        <p className="mt-4 max-w-2xl text-lg text-fg-muted sm:text-xl">
          The best free material about Claude, straight from Anthropic: Claude Academy courses with certificates, official videos,
          documentation and Help Center guides.
        </p>
        <p lang="ar" dir="rtl" className="mt-1 text-left text-fg-subtle">
          أفضل المحتوى المجاني عن Claude مباشرة من Anthropic: دورات Claude Academy بشهادات، وفيديوهات رسمية، ووثائق، وأدلة مركز المساعدة.
        </p>
      </BlurFade>

      <nav aria-label="Library sections" className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border-soft bg-surface px-4 text-sm font-medium hover:bg-bg-alt"
          >
            {s.label} <span lang="ar" className="text-xs text-fg-subtle">{s.ar}</span>
          </button>
        ))}
      </nav>

      <Section id="courses" title="Claude Academy courses" titleAr="دورات Claude Academy" note="Free, self-paced, with a certificate when you finish.">
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((r, i) => (
            <BlurFade key={r.url} delay={Math.min(i, 6) * 0.03}>
              <ResourceCard r={r} />
            </BlurFade>
          ))}
        </div>
      </Section>

      <Section id="videos" title="Official videos" titleAr="فيديوهات رسمية" note="Turn on English subtitles and click the pause button often — a great listening exercise.">
        <div className="grid gap-4 sm:grid-cols-2">
          {videos.map((v) => (
            <VideoEmbed key={v.url} video={v} />
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PLAYLISTS.map((p) => (
            <a
              key={p.url}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-border-soft bg-surface p-4 shadow-card hover:border-primary/40"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bg-alt text-primary">
                <ListVideo className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-fg-subtle">Playlist · Anthropic on YouTube</span>
                <span className="block font-semibold leading-snug">{p.title}</span>
                <span lang="ar" className="block text-xs text-fg-subtle">{p.titleAr}</span>
              </span>
              <ExternalLink className="size-4 shrink-0 opacity-50" />
            </a>
          ))}
        </div>
      </Section>

      <Section id="docs" title="Docs & tutorials" titleAr="الوثائق والشروحات" note="For deeper, more technical reading.">
        <div className="grid gap-3 sm:grid-cols-2">
          {docs.map((r) => (
            <ResourceCard key={r.url} r={r} />
          ))}
        </div>
      </Section>

      <Section id="help" title="Claude Help Center" titleAr="مركز مساعدة Claude" note="Short, practical guides for every feature.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {help.map((r) => (
            <ResourceCard key={r.url} r={r} compact />
          ))}
        </div>
      </Section>

      <p className="mt-16 text-xs text-fg-subtle">
        All links point to official Anthropic websites and open in a new tab. Course lists change over time — see “All Claude Academy
        resources” for the newest material.
      </p>
    </div>
  )
}

function Section({
  id,
  title,
  titleAr,
  note,
  children,
}: {
  id: string
  title: string
  titleAr: string
  note: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-20" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p lang="ar" className="text-fg-muted">{titleAr}</p>
      <p className="mt-2 text-fg-muted">{note}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}
