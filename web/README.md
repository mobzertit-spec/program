# CE — Claude · English

Learn how to use **Claude** while improving your **English** — every word on the site can be translated to Arabic with one click.

تعلّم استخدام Claude وطوّر لغتك الإنجليزية في الوقت نفسه — كل كلمة في الموقع قابلة للترجمة إلى العربية بنقرة واحدة.

## Features

- **Learning path**: 31 lessons in 5 tracks (Foundations · Prompting craft · Claude’s toolbox · English for work · Claude for students), shown as a visual map. Each lesson unlocks the next one in its track.
- **Motivation**: XP, levels, a daily goal, a daily streak with a 7-day activity chart, and 17 badges.
- **Lessons** — each with bilingual paragraphs, a weak-vs-strong prompt, a pro tip, 5 key words, a quiz, an optional official video and **“Go deeper”** links to Claude Academy, Claude Docs and the Help Center.
- **Library**: official Claude Academy courses, Anthropic videos (click-to-load, privacy-friendly embeds), docs and Help Center guides.
- **Translation system**
  - Click / tap any word → popover with Arabic meaning, part of speech, pronunciation and "Save word".
  - Select any sentence → floating **Translate** pill for the whole phrase.
  - Quick translator panel (button bottom-right or press `/`).
  - Offline dictionary + lemmatizer (plurals, -ed, -ing …), with the free MyMemory API as an online fallback.
  - Per-paragraph `ع` toggle or a global "Arabic" switch in the navbar.
- **Vocabulary**: a 3,000-word bank by CEFR level (A1–C1), saved words, **spaced-repetition reviews** (Leitner boxes), word of the day, and **pronunciation practice** with the microphone (browser speech recognition).
- **No account needed**: progress lives in the browser; download / restore a backup file from the Path page.
- **Prompt Lab**: build a prompt from Role / Task / Context / Examples / Format / Tone with a live quality score, optional XML tags, copy, and "Try it in Claude".
- Apple-inspired design (large type, generous whitespace, glass navbar, bento grid), 21st.dev-style components (BlurFade, WordReveal, Spotlight card, Bento grid, Marquee, animated segmented control), light/dark mode, `prefers-reduced-motion`, keyboard focus states.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · Lucide icons · React Router with clean URLs (`dist/404.html` makes deep links work on static hosts; old `#/` links redirect automatically). Set `VITE_BASE` when the site lives in a sub-folder, e.g. `VITE_BASE=/program/`.

## Run

```bash
cd web
npm install
npm run dev             # http://localhost:5173
npm run build           # static output in dist/
npm run check:content   # validate lessons: translations, vocab, quizzes, official links
```

## Add lessons

Ask Claude Code to use the **lesson-writer** skill (`.claude/skills/lesson-writer/SKILL.md`), e.g.
“Add a lesson about Claude’s memory feature to the features track.” The skill explains the lesson format,
the writing rules and the official sources to link.

## Sign-in and cloud sync (optional)

CE works without any server. To let learners sign in with **email (magic link)** or **Google** and sync
progress across devices, connect a free [Supabase](https://supabase.com) project:

1. Create a project, then run `supabase/migrations/001_progress.sql` in **SQL Editor** (creates the `progress`
   table with Row Level Security — each user can only read and write their own row).
2. **Authentication → URL Configuration**: set *Site URL* to your site (e.g. `https://USER.github.io/program/`)
   and add `http://localhost:5173/` to *Redirect URLs*.
3. **Email**: the magic link works out of the box (Supabase’s built-in email has a low hourly limit —
   add your own SMTP under Authentication → Emails for real traffic).
4. **Google**: in Google Cloud Console create an OAuth client (type *Web application*) and add the redirect URI
   shown in Supabase → Authentication → Providers → Google, then paste the client ID and secret there.
5. Copy `web/.env.example` to `web/.env.local` and fill in the project URL and anon key
   (Project Settings → API). For GitHub Pages, add the same two values as **repository variables**
   (Settings → Secrets and variables → Actions → Variables).

## Deploy (free, GitHub Pages)

The workflow in `.github/workflows/deploy-pages.yml` builds and publishes `web/` on every push to `main`.
One-time setup: GitHub repository → **Settings → Pages → Source: GitHub Actions**.

Progress, saved words and theme are stored in the browser's localStorage.

_Independent learning project — not affiliated with Anthropic. All course, docs and video links point to official Anthropic websites._
