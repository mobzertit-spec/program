import { ArrowLeft, Download, Lock, Share2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { starPath } from '@/components/art/Zellige'
import { MarkShapes } from '@/components/layout/Logo'
import { BlurFade } from '@/components/ui/blur-fade'
import { ProgressRing } from '@/components/ui/progress-ring'
import { useToast } from '@/components/ui/toast'
import { useApp } from '@/context/AppContext'
import { displayName, useAuth } from '@/context/AuthContext'
import { lessonsByTrack, tracks, type Track } from '@/data/lessons'
import { usePersistentState } from '@/lib/storage'
import { useDocumentTitle } from '@/lib/meta'

const W = 1600
const H = 1130

export default function Certificate() {
  const { track: id } = useParams()
  const track = tracks.find((t) => t.id === id)
  if (!track) return <Navigate to="/path" replace />
  return <CertificateView track={track} />
}

function CertificateView({ track }: { track: Track }) {
  useDocumentTitle(`${track.title} certificate`)
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
        <h1 className="mt-6 text-3xl font-[560] tracking-[-0.02em]">Certificate locked</h1>
        <p lang="ar" data-ar-help className="text-center text-fg-muted">الشهادة مقفلة</p>
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
        <h1 className="mt-4 text-4xl font-[560] tracking-[-0.025em] sm:text-5xl">Congratulations!</h1>
        <p lang="ar" data-ar-help className="mt-1 text-lg text-fg-muted">مبروك! أنهيت مسار {track.titleAr}.</p>
      </BlurFade>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="cert-name" className="text-sm font-medium">
            Name on the certificate <span lang="ar" data-ar-help className="font-normal text-fg-subtle">· الاسم على الشهادة</span>
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

      <div className="mt-8 overflow-hidden rounded-[6px] bg-surface p-2 shadow-pop">
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
  // the PNG is drawn from this SVG without the page's web fonts, so every stack ends in fonts most devices have
  const sans = 'Inter, Segoe UI, Arial, sans-serif'
  const serif = 'Fraunces, Georgia, Times New Roman, serif'
  const INK = '#17161b'
  const MUTED = '#4f4b45'
  const LINE = '#d6ccb8'
  const corner = (x: number, y: number) => (
    <g key={`${x}-${y}`} fill="none" stroke={LINE} strokeWidth="2">
      <path d={starPath(x, y, 54)} />
      <path d={starPath(x, y, 32)} />
      <path d={starPath(x, y, 12)} fill="#2b3fd6" stroke="none" />
    </g>
  )
  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Certificate: ${name} completed ${track.title}`}>
      <rect width={W} height={H} fill="#f4efe4" />
      <rect x="40" y="40" width={W - 80} height={H - 80} fill="none" stroke={INK} strokeWidth="2.5" />
      <rect x="56" y="56" width={W - 112} height={H - 112} fill="none" stroke={LINE} strokeWidth="1.5" />
      {[corner(128, 128), corner(W - 128, 128), corner(128, H - 128), corner(W - 128, H - 128)]}

      {/* the CE mark */}
      <g transform={`translate(${W / 2 - 72} 92) scale(2.25)`}>
        <MarkShapes />
      </g>

      <text x={W / 2} y="330" textAnchor="middle" fontFamily={sans} fontSize="26" letterSpacing="9" fill="#a3410f" fontWeight="700">
        CERTIFICATE OF COMPLETION
      </text>
      <text x={W / 2} y="398" textAnchor="middle" fontFamily={serif} fontSize="32" fontStyle="italic" fill={MUTED}>
        This certifies that
      </text>
      {/* the name, marked with the saffron highlighter */}
      <rect x={W / 2 - 330} y="478" width="660" height="40" fill="#f6c04f" transform={`rotate(-1 ${W / 2} 498)`} />
      <text x={W / 2} y="510" textAnchor="middle" fontFamily={serif} fontSize="100" fontWeight="600" fill={INK} letterSpacing="-2">
        {name}
      </text>
      <text x={W / 2} y="612" textAnchor="middle" fontFamily={sans} fontSize="30" fill={MUTED}>
        has completed all {lessons} lessons of the track
      </text>
      <text x={W / 2} y="700" textAnchor="middle" fontFamily={serif} fontSize="68" fontWeight="600" fill="#2b3fd6" letterSpacing="-1">
        {track.title}
      </text>
      <text x={W / 2} y="772" textAnchor="middle" fontFamily="Aref Ruqaa, Alexandria, Tahoma, Arial, sans-serif" fontSize="44" fontWeight="700" fill={MUTED} direction="rtl">
        {track.titleAr}
      </text>
      <text x={W / 2} y="836" textAnchor="middle" fontFamily={sans} fontSize="25" fill="#696359">
        {track.description}
      </text>

      <line x1="260" y1="960" x2="640" y2="960" stroke={INK} strokeWidth="1.5" />
      <text x="450" y="1000" textAnchor="middle" fontFamily={sans} fontSize="24" fill={MUTED}>
        {date}
      </text>
      <line x1={W - 640} y1="960" x2={W - 260} y2="960" stroke={INK} strokeWidth="1.5" />
      <g transform={`translate(${W - 450 - 40} 878) scale(1.25)`}>
        <MarkShapes />
      </g>
      <text x={W - 450} y="1000" textAnchor="middle" fontFamily={sans} fontSize="24" letterSpacing="4" fill={MUTED}>
        CLAUDE · ENGLISH
      </text>
    </svg>
  )
}
