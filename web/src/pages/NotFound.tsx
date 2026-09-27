import { Mascot } from '@/components/mascot/Mascot'
import { ButtonLink } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <Mascot pose="sleep" size={150} />
      <p className="mt-4 text-7xl font-bold tracking-tighter text-fg-subtle">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">This page doesn’t exist.</h1>
      <p lang="ar" data-ar-help className="mt-2 text-center text-fg-muted">هذه الصفحة غير موجودة.</p>
      <p className="mt-3 text-fg-muted">Cee looked everywhere — even under the bed. Let’s go back to learning.</p>
      <ButtonLink to="/" className="mt-8">Go home</ButtonLink>
    </div>
  )
}
