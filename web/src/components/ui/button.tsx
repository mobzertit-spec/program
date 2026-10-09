import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50'
const variants: Record<Variant, string> = {
  // a printed-key feel: a solid edge underneath instead of a coloured glow
  primary:
    'bg-primary text-on-primary shadow-[0_3px_0_0_color-mix(in_srgb,var(--primary)_55%,black)] hover:bg-primary-hover hover:-translate-y-px active:translate-y-[2px] active:shadow-none',
  secondary: 'border border-fg/60 bg-transparent text-fg hover:border-fg hover:bg-fg hover:text-bg',
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
