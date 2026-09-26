import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, ArrowRight, Check, CloudCheck, CloudOff, Loader2, LogOut, Mail, RefreshCw, ShieldCheck, Smartphone } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/layout/Logo'
import { BlurFade } from '@/components/ui/blur-fade'
import { useApp } from '@/context/AppContext'
import { avatarUrl, displayName, useAuth } from '@/context/AuthContext'
import { useSync } from '@/context/SyncContext'
import { lessons } from '@/data/lessons'
import { cn } from '@/lib/utils'

export default function Account() {
  const { enabled, loading, user } = useAuth()
  return (
    <div className="mx-auto max-w-[1024px] px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
      {loading ? (
        <div className="grid min-h-[40vh] place-items-center text-fg-muted">
          <Loader2 className="size-6 animate-spin" aria-label="Loading account" />
        </div>
      ) : !enabled ? (
        <NotConfigured />
      ) : user ? (
        <Profile />
      ) : (
        <SignIn />
      )}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

function SignIn() {
  const { signInWithGoogle, sendMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'google'>('idle')
  const [error, setError] = useState<string | null>(null)

  const onEmail = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address.')
    setError(null)
    setState('sending')
    const err = await sendMagicLink(email.trim())
    if (err) {
      setError(err)
      setState('idle')
    } else setState('sent')
  }

  const onGoogle = async () => {
    setError(null)
    setState('google')
    const err = await signInWithGoogle()
    if (err) {
      setError(err)
      setState('idle')
    }
  }

  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      <BlurFade>
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">Your account</p>
        <h1 className="mt-2 text-5xl font-bold tracking-[-0.035em] sm:text-6xl">Keep your progress everywhere.</h1>
        <p lang="ar" className="mt-3 text-lg text-fg-muted">احفظ تقدّمك على كل أجهزتك.</p>
        <ul className="mt-8 space-y-4 text-fg-muted">
          {[
            { icon: Smartphone, t: 'Continue on your phone, laptop, or any browser', ar: 'تابع على الجوال أو الحاسوب أو أي متصفح' },
            { icon: CloudCheck, t: 'Your streak, XP, lessons and words are backed up', ar: 'سلسلة أيامك ونقاطك ودروسك وكلماتك محفوظة' },
            { icon: ShieldCheck, t: 'No password to remember — only you can see your data', ar: 'بدون كلمة مرور، ولا يرى بياناتك أحد غيرك' },
          ].map(({ icon: Icon, t, ar }) => (
            <li key={t} className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface shadow-card">
                <Icon className="size-5 text-primary" aria-hidden />
              </span>
              <span>
                <span className="block text-fg">{t}</span>
                <span lang="ar" className="block text-sm">{ar}</span>
              </span>
            </li>
          ))}
        </ul>
      </BlurFade>

      <BlurFade delay={0.1}>
        <div className="rounded-[32px] border border-border-soft bg-surface p-6 shadow-pop sm:p-8">
          <div className="flex items-center gap-3">
            <Logo className="size-10" />
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Sign in to CE</h2>
              <p className="text-sm text-fg-muted">New here? The same button creates your account.</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {state === 'sent' ? (
              <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-2xl bg-success-soft p-5" role="status">
                <p className="flex items-center gap-2 font-semibold text-success">
                  <Check className="size-5" /> Check your inbox
                </p>
                <p className="mt-2 text-sm text-fg">
                  We sent a sign-in link to <strong>{email}</strong>. Open it on this device to finish.
                </p>
                <p lang="ar" className="mt-1 text-sm text-fg-muted">أرسلنا رابط الدخول إلى بريدك. افتحه على هذا الجهاز.</p>
                <button onClick={() => setState('idle')} className="mt-4 cursor-pointer text-sm font-medium text-link hover:underline">
                  Use a different email
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
                <button
                  onClick={onGoogle}
                  disabled={state !== 'idle'}
                  className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-full border border-border bg-surface font-medium transition-colors hover:bg-bg-alt disabled:opacity-60"
                >
                  {state === 'google' ? <Loader2 className="size-5 animate-spin" /> : <GoogleIcon />}
                  Continue with Google
                </button>

                <div className="my-6 flex items-center gap-3 text-xs text-fg-subtle" aria-hidden>
                  <span className="h-px flex-1 bg-border-soft" /> or <span className="h-px flex-1 bg-border-soft" />
                </div>

                <form onSubmit={onEmail} noValidate>
                  <label htmlFor="email" className="text-sm font-medium">
                    Email address <span lang="ar" className="font-normal text-fg-subtle">· البريد الإلكتروني</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'email-error' : 'email-help'}
                    className="mt-1.5 h-12 w-full rounded-2xl border border-border bg-bg-alt px-4 text-base outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/15 focus-visible:outline-none"
                  />
                  <p id="email-help" className="mt-1.5 text-xs text-fg-subtle">
                    We’ll email you a one-time link. No password needed.
                  </p>
                  {error && (
                    <p id="email-error" role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-danger">
                      <AlertCircle className="size-4" /> {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={state !== 'idle'}
                    className="mt-4 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary font-medium text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
                  >
                    {state === 'sending' ? <Loader2 className="size-5 animate-spin" /> : <Mail className="size-5" />}
                    Email me a sign-in link
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-xs text-fg-subtle">
            You can also keep learning without an account — progress is then saved only in this browser.
          </p>
        </div>
      </BlurFade>
    </div>
  )
}

function Profile() {
  const { user, signOut } = useAuth()
  const { status, lastSynced, error, syncNow } = useSync()
  const { xp, streak, completed, saved, level } = useApp()
  if (!user) return null
  const name = displayName(user)
  const avatar = avatarUrl(user)

  return (
    <BlurFade>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {avatar ? (
          <img src={avatar} alt="" referrerPolicy="no-referrer" className="size-20 rounded-full object-cover shadow-card" />
        ) : (
          <span className="bg-brand grid size-20 place-items-center rounded-full text-3xl font-bold text-white shadow-card">
            {name[0]?.toUpperCase()}
          </span>
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">Signed in</p>
          <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">Hi, {name}.</h1>
          <p className="text-fg-muted">{user.email}</p>
        </div>
        <button
          onClick={() => void signOut()}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border px-5 font-medium hover:bg-bg-alt"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-4">
        {[
          { v: level.level, l: 'Level' },
          { v: xp.toLocaleString(), l: 'XP' },
          { v: `${streak} d`, l: 'Streak' },
          { v: `${completed.length}/${lessons.length}`, l: 'Lessons' },
        ].map((s) => (
          <div key={s.l} className="rounded-3xl border border-border-soft bg-surface p-5 shadow-card">
            <p className="text-3xl font-bold tracking-tight">{s.v}</p>
            <p className="text-sm text-fg-muted">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-border-soft bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3" role="status" aria-live="polite">
          <span
            className={cn(
              'grid size-11 place-items-center rounded-2xl',
              status === 'error' ? 'bg-danger-soft text-danger' : 'bg-success-soft text-success',
            )}
          >
            {status === 'syncing' ? <Loader2 className="size-5 animate-spin" /> : status === 'error' ? <CloudOff className="size-5" /> : <CloudCheck className="size-5" />}
          </span>
          <div>
            <p className="font-semibold">
              {status === 'syncing' ? 'Syncing…' : status === 'error' ? 'Sync problem' : 'Progress synced'}
            </p>
            <p className="text-sm text-fg-muted">
              {status === 'error'
                ? error
                : lastSynced
                  ? `Last saved ${new Date(lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${saved.length} words`
                  : 'Your progress is saved to your account automatically.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => void syncNow()}
          disabled={status === 'syncing'}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-full bg-bg-alt px-5 font-medium hover:bg-border-soft disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw className="size-4" /> Sync now
        </button>
      </div>

      <Link to="/path" className="mt-8 inline-flex items-center gap-2 font-medium text-link hover:underline">
        Continue learning <ArrowRight className="size-4" />
      </Link>
    </BlurFade>
  )
}

function NotConfigured() {
  return (
    <BlurFade>
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-clay">Your account</p>
      <h1 className="mt-2 text-5xl font-bold tracking-[-0.035em]">Sign-in is coming soon.</h1>
      <p lang="ar" className="mt-2 text-fg-muted">تسجيل الدخول غير مفعّل بعد على هذه النسخة من الموقع.</p>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">
        This copy of CE runs without a server, so your progress is saved in this browser. You can still move it to another device
        with a backup file on the Path page.
      </p>
      <div className="mt-6 max-w-2xl rounded-3xl border border-dashed border-border p-5 text-sm text-fg-muted">
        <p className="font-semibold text-fg">For the site owner</p>
        <p className="mt-1">
          Add <code className="font-mono">VITE_SUPABASE_URL</code> and <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> (see{' '}
          <code className="font-mono">web/.env.example</code> and the README) to enable email and Google sign-in with cloud sync.
        </p>
      </div>
      <Link to="/path" className="mt-8 inline-flex items-center gap-2 font-medium text-link hover:underline">
        Back to your path <ArrowRight className="size-4" />
      </Link>
    </BlurFade>
  )
}
