# Prompt English

Learn how to use **Claude** while improving your **English** — every word on the site can be translated to Arabic with one click.

تعلّم استخدام Claude وطوّر لغتك الإنجليزية في الوقت نفسه — كل كلمة في الموقع قابلة للترجمة إلى العربية بنقرة واحدة.

## Features

- **10 lessons** on using Claude (clear prompts, context, examples, roles & tone, XML tags, step-by-step thinking, iteration, English practice, files & code) — each with bilingual paragraphs, a weak-vs-strong prompt comparison, key vocabulary and a mini quiz.
- **Translation system**
  - Click / tap any word → popover with Arabic meaning, part of speech, pronunciation and "Save word".
  - Select any sentence → floating **Translate** pill for the whole phrase.
  - Quick translator panel (button bottom-right or press `/`).
  - Offline dictionary + lemmatizer (plurals, -ed, -ing …), with the free MyMemory API as an online fallback.
  - Per-paragraph `ع` toggle or a global "Arabic" switch in the navbar.
- **Vocabulary**: saved words, all lesson words, search (English or Arabic) and 3D flip **flashcards**.
- **Prompt Lab**: build a prompt from Role / Task / Context / Examples / Format / Tone with a live quality score, optional XML tags, copy, and "Try it in Claude".
- Apple-inspired design (large type, generous whitespace, glass navbar, bento grid), 21st.dev-style components (BlurFade, WordReveal, Spotlight card, Bento grid, Marquee, animated segmented control), light/dark mode, `prefers-reduced-motion`, keyboard focus states.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · Lucide icons · React Router (hash routing, so `dist/` works on any static host).

## Run

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

Progress, saved words and theme are stored in the browser's localStorage.

_Independent learning project — not affiliated with Anthropic._
