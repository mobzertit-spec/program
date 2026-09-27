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

`npm run build` also runs `scripts/prerender.ts`: each page (home, path, all lessons, …) is rendered to its own
`dist/<page>/index.html`, so content shows before any JavaScript loads and search engines can read it. The app then
starts after the first paint and takes over the page. The script also writes `robots.txt`, `llms.txt` and — when
`VITE_SITE_URL` is set — `sitemap.xml` and canonical links. Fonts are self-hosted (`src/fonts.css`).

## Run

```bash
cd web
npm install
npm run dev             # http://localhost:5173
npm run build           # static output in dist/ (every page prerendered to HTML)
npm run check:content   # validate lessons: translations, vocab, quizzes, official links
```

## Add lessons

Ask Claude Code to use the **lesson-writer** skill (`.claude/skills/lesson-writer/SKILL.md`), e.g.
“Add a lesson about Claude’s memory feature to the features track.” The skill explains the lesson format,
the writing rules and the official sources to link.

## Design files

- **Figma — “CE — Design System”** (in your Figma drafts): *Foundations* page with the logo, all color tokens as
  variables (collections “CE Color · Light” and “CE Color · Dark”, each with its CSS variable as code syntax), size
  tokens, 11 text styles (Inter, Alexandria for Arabic, JetBrains Mono); *Components* page with Button (3 variants),
  Word popover, Lesson card, Lesson feedback and Leaderboard, each linked to its React file in the description.
  Keep `web/src/index.css` and the Figma variables in sync when the palette changes.
- **Product screenshots** (`web/public/shots/*.webp`, light + dark): real captures of the site shown in the home page
  “See it in action” section. Retake them after big UI changes so they stay true to the product.
- **Canva — Instagram launch post** (in your Canva account): an editable 1080×1350 post to share CE.

## Supabase: feedback, leaderboard, sign-in and cloud sync

CE works fully without a server; Supabase adds the community features. The site is connected to the Supabase
project **ce-learn** through `web/.env` (project URL + publishable key — both public by design; Row Level Security
protects every table). The database is defined in `supabase/migrations/` (apply them in order in the SQL Editor
if you use your own project):

| Migration | What it does |
|---|---|
| `001_progress.sql` | `progress`: one row per learner, readable and writable only by that learner (cloud sync) |
| `002_leaderboard_feedback.sql` | `profiles` + `leaderboard` + `weekly_leaderboard` view (opt-in, name + weekly XP only, written by triggers) and `lesson_feedback` + `lesson_stats` (anyone can answer “Was this helpful?”, nobody can read answers through the API) |
| `003_tighten_grants.sql` | removes every API privilege the site does not need |

**Working now, without sign-in:** “Was this lesson helpful?” on every lesson (answers appear in
Table Editor → `lesson_feedback`) and the public weekly leaderboard on the Path page.

**Turning on sign-in** (email magic link and/or Google) — these settings live only in the Supabase dashboard:

1. **Authentication → URL Configuration**: *Site URL* = your site (e.g. `https://USER.github.io/program/`);
   *Redirect URLs*: add the same URL and `http://localhost:5173/`.
2. **Email**: Supabase’s built-in email only sends to members of your Supabase team. For everyone else add your own
   SMTP (e.g. a free Resend or Brevo account) under **Authentication → Emails → SMTP Settings**.
3. **Google** (optional): in Google Cloud Console create an OAuth client (type *Web application*), add the redirect
   URI shown in Supabase → Authentication → Providers → Google, and paste the client ID and secret there.
4. Switch the buttons on: set `VITE_AUTH_PROVIDERS=email,google` (or just `email`) — locally in `web/.env.local`,
   and for GitHub Pages as a **repository variable** (Settings → Secrets and variables → Actions → Variables).

New visitors never download the Supabase library: it loads only when someone signs in or has a saved session.

## Deploy (free, GitHub Pages)

The workflow in `.github/workflows/deploy-pages.yml` builds and publishes `web/` on every push to `main`.
One-time setup: GitHub repository → **Settings → Pages → Source: GitHub Actions**.

Progress, saved words and theme are stored in the browser's localStorage.

_Independent learning project — not affiliated with Anthropic. All course, docs and video links point to official Anthropic websites._
