import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'
const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-6px_color-mix(in_srgb,var(--primary)_60%,transparent)]',
  secondary: 'border border-border bg-transparent text-fg hover:-translate-y-0.5 hover:bg-bg-alt',
  ghost: 'text-fg hover:bg-bg-alt',
  link: 'text-link hover:underline underline-offset-4 px-0!',
}
const sizes: Record<Size, string> = {
  sm: 'min-h-9 px-4 text-sm',
  md: 'min-h-11 px-5 text-[15px]',
  lg: 'min-h-12 px-7 text-[17px]',
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className)

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ variant, size, className, ...props }, ref) => (
  <button ref={ref} className={buttonClass(variant, size, className)} {...props} />
))
Button.displayName = 'Button'

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />
}
