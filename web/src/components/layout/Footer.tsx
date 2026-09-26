import { Link } from 'react-router-dom'
import { Wordmark } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-border-soft bg-bg-alt">
      <div className="mx-auto max-w-[1024px] px-4 py-10 text-xs text-fg-muted sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <Wordmark />
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/path" className="hover:text-fg hover:underline">Path</Link>
            <Link to="/lessons" className="hover:text-fg hover:underline">Lessons</Link>
            <Link to="/vocabulary" className="hover:text-fg hover:underline">Vocabulary</Link>
            <Link to="/lab" className="hover:text-fg hover:underline">Prompt Lab</Link>
            <Link to="/library" className="hover:text-fg hover:underline">Library</Link>
          </nav>
        </div>
        <div className="mt-8 border-t border-border-soft pt-6 leading-relaxed">
          <p>
            An independent learning project. Not affiliated with Anthropic. “Claude” is a trademark of Anthropic, PBC.
            Online translations are provided by the free MyMemory API. Course and video links go to official Anthropic websites.
          </p>
          <p lang="ar" className="mt-2">
            مشروع تعليمي مستقل لتعلّم استخدام Claude وتطوير لغتك الإنجليزية في الوقت نفسه.
          </p>
        </div>
      </div>
    </footer>
  )
}
