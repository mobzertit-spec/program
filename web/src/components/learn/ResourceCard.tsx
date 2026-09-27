import { BookOpen, Code2, ExternalLink, GraduationCap, LifeBuoy, PlayCircle } from 'lucide-react'
import type { Resource, ResourceKind } from '@/data/resources'
import { cn } from '@/lib/utils'

const ICONS: Record<ResourceKind, typeof BookOpen> = {
  course: GraduationCap,
  docs: BookOpen,
  help: LifeBuoy,
  video: PlayCircle,
  tutorial: Code2,
}
const KIND_LABEL: Record<ResourceKind, string> = {
  course: 'Free course',
  docs: 'Official docs',
  help: 'Help article',
  video: 'Video',
  tutorial: 'Tutorial',
}

export function ResourceCard({ r, compact }: { r: Resource; compact?: boolean }) {
  const Icon = ICONS[r.kind]
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'group flex h-full items-start gap-3 rounded-2xl border border-border-soft bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40',
        compact && 'p-3.5',
      )}
    >
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-xl',
          r.kind === 'course' ? 'bg-clay-soft text-clay' : 'bg-bg-alt text-primary',
        )}
      >
        <Icon className="icon-pop size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-fg-subtle">
          {KIND_LABEL[r.kind]} · {r.source}
        </span>
        <span className="mt-0.5 flex items-start gap-1 font-semibold leading-snug text-fg group-hover:text-link">
          {r.title}
          <ExternalLink className="mt-1 size-3 shrink-0 opacity-50" aria-hidden />
        </span>
        {!compact && r.description && <span className="mt-1 block text-sm text-fg-muted">{r.description}</span>}
        {!compact && r.descriptionAr && (
          <span lang="ar" data-ar-help className="block text-xs text-fg-subtle">
            {r.descriptionAr}
          </span>
        )}
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
