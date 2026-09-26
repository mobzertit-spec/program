import { ExternalLink, Play } from 'lucide-react'
import { useState } from 'react'
import type { Resource } from '@/data/resources'
import { cn } from '@/lib/utils'

/**
 * Click-to-load YouTube embed: shows the thumbnail first and only loads the player
 * (from youtube-nocookie.com) when the learner presses play — faster and more private.
 */
export function VideoEmbed({ video, className }: { video: Resource; className?: string }) {
  const [playing, setPlaying] = useState(false)
  const [thumbFailed, setThumbFailed] = useState(false)
  const id = video.youtubeId
  if (!id) return null
  return (
    <figure className={cn('overflow-hidden rounded-3xl border border-border-soft bg-surface shadow-card', className)}>
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&cc_load_policy=1&hl=en`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 cursor-pointer"
            aria-label={`Play video: ${video.title}`}
          >
            {thumbFailed ? (
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,100,66,.55),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(0,113,227,.5),transparent_55%)]" />
            ) : (
              <img
                src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                onError={() => setThumbFailed(true)}
                className="size-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-black shadow-pop transition-transform group-hover:scale-110">
              <Play className="ml-1 size-7 fill-current" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="font-semibold leading-snug">{video.title}</p>
          {video.description && <p className="mt-0.5 text-sm text-fg-muted">{video.description}</p>}
          {video.descriptionAr && <p lang="ar" className="text-xs text-fg-subtle">{video.descriptionAr}</p>}
        </div>
        <a
          href={video.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-link hover:underline"
        >
          YouTube <ExternalLink className="size-3" />
        </a>
      </figcaption>
    </figure>
  )
}
