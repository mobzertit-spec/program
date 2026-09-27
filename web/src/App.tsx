import { type ReactNode } from 'react'
import { createBrowserRouter, matchRoutes, RouterProvider, type RouteObject } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ToastProvider } from '@/components/ui/toast'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/context/AuthContext'
import { LocaleProvider } from '@/context/LocaleContext'
import { SyncProvider } from '@/context/SyncContext'
import { TranslatorProvider } from '@/context/TranslatorContext'
import { loadWordBank } from '@/data/dictionary'
import { lazyWithPreload } from '@/lib/boot'
import Home, { preloadHome } from '@/pages/Home'

const Lessons = lazyWithPreload(() => import('@/pages/Lessons'))
const LessonPage = lazyWithPreload(() => import('@/pages/LessonPage'))
const Vocabulary = lazyWithPreload(() => import('@/pages/Vocabulary'))
const PromptLab = lazyWithPreload(() => import('@/pages/PromptLab'))
const Path = lazyWithPreload(() => import('@/pages/Path'))
const Library = lazyWithPreload(() => import('@/pages/Library'))
const Account = lazyWithPreload(() => import('@/pages/Account'))
const Practice = lazyWithPreload(() => import('@/pages/Practice'))
const Certificate = lazyWithPreload(() => import('@/pages/Certificate'))
const NotFound = lazyWithPreload(() => import('@/pages/NotFound'))
const Privacy = lazyWithPreload(() => import('@/pages/Privacy'))

export const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

type Page = ReturnType<typeof lazyWithPreload>
/** `data`: what the page needs besides its code to render its final layout (e.g. the word bank). */
const route = (path: string, Page: Page, data?: () => Promise<unknown>): RouteObject => ({
  path,
  element: <Page />,
  handle: { preload: data ? () => Promise.all([Page.preload(), data()]) : Page.preload },
})

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home />, handle: { preload: preloadHome } },
      route('/lessons', Lessons),
      route('/lessons/:id', LessonPage),
      route('/vocabulary', Vocabulary, loadWordBank),
      route('/lab', PromptLab),
      route('/path', Path, loadWordBank),
      route('/library', Library),
      route('/account', Account),
      route('/practice', Practice, loadWordBank),
      route('/certificate/:track', Certificate),
      route('/privacy', Privacy),
      route('*', NotFound),
    ],
  },
]

/** Load the code for a URL before the first render, so prerendered HTML is replaced without a blank frame. */
export function preloadRoute(pathname: string) {
  const matches = matchRoutes(routes, pathname, basename) ?? []
  return Promise.all(matches.map((m) => (m.route.handle as { preload?: () => Promise<unknown> } | undefined)?.preload?.()))
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <LocaleProvider>
        <AuthProvider>
          <AppProvider>
            <SyncProvider>
              <TranslatorProvider>{children}</TranslatorProvider>
            </SyncProvider>
          </AppProvider>
        </AuthProvider>
      </LocaleProvider>
    </ToastProvider>
  )
}

let router: ReturnType<typeof createBrowserRouter> | undefined

export default function App() {
  router ??= createBrowserRouter(routes, { basename })
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
