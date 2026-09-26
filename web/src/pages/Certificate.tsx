import { ArrowLeft, Download, Lock, Share2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { BlurFade } from '@/components/ui/blur-fade'
import { ProgressRing } from '@/components/ui/progress-ring'
import { useToast } from '@/components/ui/toast'
import { useApp } from '@/context/AppContext'
import { displayName, useAuth } from '@/context/AuthContext'
import { lessonsByTrack, tracks, type Track } from '@/data/lessons'
import { usePersistentState } from '@/lib/storage'

const W = 1600
const H = 1130

export default function Certificate() {
  const { track: id } = useParams()
  const track = tracks.find((t) => t.id === id)
  if (!track) return <Navigate to="/path" replace />
  return <CertificateView track={track} />
}

function CertificateView({ track }: { track: Track }) {
  const { completed } = useApp()
  const { user } = useAuth()
  const toast = useToast()
  const [name, setName] = usePersistentState('pe:cert-name', user ? displayName(user) : '')
  const [busy, setBusy] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const items = lessonsByTrack(track.id)
  const done = items.filter((l) => completed.includes(l.id)).length
  const earned = done === items.length
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const toPng = async (): Promise<Blob> => {
    const svg = svgRef.current!
    const xml = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml)
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    canvas.getContext('2d')!.drawImage(img, 0, 0, W, H)
    return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('export failed'))), 'image/png'))
  }

  const fileName = `CE-certificate-${track.id}.png`

  const download = async () => {
    setBusy(true)
    try {
      const blob = await toPng()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast('Could not create the image — try again')
    } finally {
      setBusy(false)
    }
  }

  const share = async () => {
    try {
      const file = new File([await toPng()], fileName, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: `I finished “${track.title}” on CE` })
      else await download()
    } catch {
      /* share cancelled */
    }
  }

  if (!earned) {
    return (
      <div className="mx-auto max-w-xl px-4 pb-24 pt-20 text-center sm:px-6">
        <div className="relative mx-auto w-fit">
          <ProgressRing value={done / items.length} size={120} stroke={9} label={`${done} of ${items.length} lessons done`} />
          <Lock className="absolute inset-0 m-auto size-8 text-fg-subtle" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">Certificate locked</h1>
        <p lang="ar" className="text-center text-fg-muted">الشهادة مقفلة</p>
        <p className="mt-3 text-fg-muted">
          Finish all {items.length} lessons of “{track.title}” to unlock it. You have done {done}.
        </p>
        <Link to="/path" className="mt-6 inline-flex items-center gap-2 font-medium text-link hover:underline">
          <ArrowLeft className="size-4" /> Back to your path
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1024px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      <BlurFade>
        <Link to="/path" className="inline-flex items-center gap-1 text-sm text-link hover:underline">
          <ArrowLeft className="size-4" /> Learning path
        </Link>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Congratulations!</h1>
        <p lang="ar" className="mt-1 text-lg text-fg-muted">مبروك! أنهيت مسار {track.titleAr}.</p>
      </BlurFade>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="cert-name" className="text-sm font-medium">
            Name on the certificate <span lang="ar" className="font-normal text-fg-subtle">· الاسم على الشهادة</span>
          </label>
          <input
            id="cert-name"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-surface px-4 text-base outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 focus-visible:outline-none"
          />
        </div>
        <button
          onClick={download}
          disabled={busy || !name.trim()}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-6 font-medium text-on-primary disabled:opacity-50"
        >
          <Download className="size-4" /> Download PNG
        </button>
        <button
          onClick={share}
          disabled={busy || !name.trim()}
          className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-border px-6 font-medium hover:bg-bg-alt disabled:opacity-50"
        >
          <Share2 className="size-4" /> Share
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl shadow-pop">
        <CertificateSvg ref={svgRef} name={name.trim() || 'Your name'} track={track} lessons={items.length} date={date} />
      </div>
    </div>
  )
}

function CertificateSvg({
  ref,
  name,
  track,
  lessons,
  date,
}: {
  ref: React.Ref<SVGSVGElement>
  name: string
  track: Track
  lessons: number
  date: string
}) {
  const font = 'Inter, Segoe UI, Arial, sans-serif'
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Certificate: ${name} completed ${track.title}`}>
      <defs>
        <linearGradient id="cert-brand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f07a45" />
          <stop offset="1" stopColor="#6d5dfc" />
        </linearGradient>
        <radialGradient id="cert-glow-a" cx="0" cy="0" r="1">
          <stop offset="0" stopColor="#f07a45" stopOpacity="0.28" />
          <stop offset="1" stopColor="#f07a45" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cert-glow-b" cx="1" cy="1" r="1">
          <stop offset="0" stopColor="#6d5dfc" stopOpacity="0.28" />
          <stop offset="1" stopColor="#6d5dfc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#fbfaff" />
      <rect width={W} height={H} fill="url(#cert-glow-a)" />
      <rect width={W} height={H} fill="url(#cert-glow-b)" />
      <rect x="40" y="40" width={W - 80} height={H - 80} rx="36" fill="none" stroke="#12142b" strokeWidth="3" />
      <rect x="60" y="60" width={W - 120} height={H - 120} rx="24" fill="none" stroke="url(#cert-brand)" strokeWidth="6" />

      {/* logo */}
      <g transform={`translate(${W / 2 - 48} 120) scale(1.5)`}>
        <rect width="64" height="64" rx="16" fill="#12142b" />
        <path d="M30.8 24.2A11 11 0 1 0 30.8 39.8" fill="none" stroke="#f07a45" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M48.5 21.5H37V42.5H48.5M37 32H46" fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M52 8l1.3 3.4L56.7 12.7l-3.4 1.3L52 17.4l-1.3-3.4-3.4-1.3 3.4-1.3z" fill="#aaa6ff" />
      </g>

      <text x={W / 2} y="330" textAnchor="middle" fontFamily={font} fontSize="30" letterSpacing="10" fill="#c4531f" fontWeight="700">
        CERTIFICATE OF COMPLETION
      </text>
      <text x={W / 2} y="400" textAnchor="middle" fontFamily={font} fontSize="30" fill="#5c6079">
        This certifies that
      </text>
      <text x={W / 2} y="510" textAnchor="middle" fontFamily={font} fontSize="96" fontWeight="800" fill="#12142b" letterSpacing="-2">
        {name}
      </text>
      <rect x={W / 2 - 300} y="545" width="600" height="4" rx="2" fill="url(#cert-brand)" />
      <text x={W / 2} y="620" textAnchor="middle" fontFamily={font} fontSize="32" fill="#5c6079">
        has completed all {lessons} lessons of the track
      </text>
      <text x={W / 2} y="705" textAnchor="middle" fontFamily={font} fontSize="64" fontWeight="800" fill="url(#cert-brand)">
        {track.title}
      </text>
      <text x={W / 2} y="770" textAnchor="middle" fontFamily="Alexandria, Tahoma, Arial, sans-serif" fontSize="36" fill="#5c6079" direction="rtl">
        {track.titleAr}
      </text>
      <text x={W / 2} y="830" textAnchor="middle" fontFamily={font} fontSize="26" fill="#7b7f98">
        {track.description}
      </text>

      <line x1="220" y1="960" x2="620" y2="960" stroke="#d4d6e4" strokeWidth="2" />
      <text x="420" y="1000" textAnchor="middle" fontFamily={font} fontSize="26" fill="#5c6079">
        {date}
      </text>
      <line x1={W - 620} y1="960" x2={W - 220} y2="960" stroke="#d4d6e4" strokeWidth="2" />
      <text x={W - 420} y="945" textAnchor="middle" fontFamily={font} fontSize="44" fontWeight="800" fill="#12142b">
        CE
      </text>
      <text x={W - 420} y="1000" textAnchor="middle" fontFamily={font} fontSize="26" fill="#5c6079">
        Claude · English
      </text>
    </svg>
  )
}
