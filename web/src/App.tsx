import { lazy, Suspense } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ToastProvider } from '@/components/ui/toast'
import { AppProvider } from '@/context/AppContext'
import { TranslatorProvider } from '@/context/TranslatorContext'
import Home from '@/pages/Home'

const Lessons = lazy(() => import('@/pages/Lessons'))
const LessonPage = lazy(() => import('@/pages/LessonPage'))
const Vocabulary = lazy(() => import('@/pages/Vocabulary'))
const PromptLab = lazy(() => import('@/pages/PromptLab'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const Fallback = () => <div className="min-h-[60vh]" aria-busy="true" />
const page = (el: React.ReactNode) => <Suspense fallback={<Fallback />}>{el}</Suspense>

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/lessons', element: page(<Lessons />) },
      { path: '/lessons/:id', element: page(<LessonPage />) },
      { path: '/vocabulary', element: page(<Vocabulary />) },
      { path: '/lab', element: page(<PromptLab />) },
      { path: '*', element: page(<NotFound />) },
    ],
  },
])

export default function App() {
  return (
    <AppProvider>
      <TranslatorProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </TranslatorProvider>
    </AppProvider>
  )
}
