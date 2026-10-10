import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ZelligePattern } from './Zellige'

/**
 * Art-directed illustrations (two-ink risograph style: ultramarine + saffron on paper), generated for CE.
 * Files live in public/art as `<name>-<width>.webp`; the browser picks the smallest one that is sharp enough.
 */
export const ART = {
  hero: { w: 1280, h: 960, widths: [640, 960, 1280] },
  bridge: { w: 1536, h: 1024, widths: [768, 1152, 1536] },
  foundations: { w: 960, h: 1280, widths: [480, 720, 960] },
  prompting: { w: 960, h: 1280, widths: [480, 720, 960] },
  features: { w: 960, h: 1280, widths: [480, 720, 960] },
  english: { w: 960, h: 1280, widths: [480, 720, 960] },
  students: { w: 960, h: 1280, widths: [480, 720, 960] },
} as const
export type ArtName = keyof typeof ART

/** The prints that are in public/art (all of them now). A name left out keeps a quiet pattern in its place (no request, no 404). */
const READY = new Set<ArtName>(Object.keys(ART) as ArtName[])

const src = (name: ArtName, w: number) => `${import.meta.env.BASE_URL}art/${name}-${w}.webp`

export function Art({
  name,
  alt = '',
  sizes = '100vw',
  eager = false,
  className,
  imgClassName,
}: {
  name: ArtName
  alt?: string
  /** the `sizes` attribute: how wide the image is shown, so the right file is chosen */
  sizes?: string
  eager?: boolean
  className?: string
  imgClassName?: string
}) {
  const a = ART[name]
  const [failed, setFailed] = useState(!READY.has(name))
  return (
    <div className={cn('relative overflow-hidden bg-[#efe7d6]', className)} style={{ aspectRatio: `${a.w} / ${a.h}` }}>
      {failed ? (
        // the file is missing (e.g. a fresh checkout without the art) — keep the layout with a quiet pattern
        <ZelligePattern className="text-[#2b3fd6] opacity-25" />
      ) : (
        <img
          src={src(name, a.widths[a.widths.length - 1])}
          srcSet={a.widths.map((w) => `${src(name, w)} ${w}w`).join(', ')}
          sizes={sizes}
          width={a.w}
          height={a.h}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={cn('h-full w-full object-cover dark:brightness-[0.92]', imgClassName)}
        />
      )}
    </div>
  )
}
