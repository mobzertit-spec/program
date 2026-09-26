import { ButtonLink } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="text-8xl font-bold tracking-tighter text-fg-subtle">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">This page doesn’t exist.</h1>
      <p lang="ar" data-ar-help className="mt-2 text-center text-fg-muted">هذه الصفحة غير موجودة.</p>
      <ButtonLink to="/" className="mt-8">Go home</ButtonLink>
    </div>
  )
}
