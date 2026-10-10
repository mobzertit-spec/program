# Using the Codex plugin with this repo

The [Codex plugin for Claude Code](https://github.com/openai/codex-plugin-cc) lets you ask OpenAI Codex for a second
opinion (a review) or hand it a task, without leaving Claude Code. This page shows how to use it on this repo.

> **بالعربية باختصار:** ثبّت الإضافة مرة واحدة (الخطوات 1–4 أدناه)، ثم شغّل `/codex:review --base main --background`
> من مجلد المستودع قبل دمج أي فرع. للمراجعة الناقدة استخدم `/codex:adversarial-review` مع نص التركيز، ولتكليف Codex
> بإصلاح شيء استخدم `/codex:rescue`. لا تفعّل "review gate" إلا وأنت تراقب الجلسة لأنه يستهلك الحصة بسرعة.

## 1. Setup (once per machine)

You need Node.js 18.18+, and a ChatGPT account (Free works) or an OpenAI API key. Usage counts toward your Codex limits.

In Claude Code, run:

```text
/plugin marketplace add openai/codex-plugin-cc
/plugin install codex@openai-codex
/reload-plugins
/codex:setup
```

`/codex:setup` checks that the Codex CLI is installed and signed in, and offers to install it
(`npm install -g @openai/codex`). If it says you are not signed in, run `!codex login`.

It worked when the `/codex:` commands show up when you type `/codex` and `codex:codex-rescue` is listed in `/agents`.

Always start Claude Code from the repo root (`program/`), so Codex sees both `web/` and `supabase/`.

## 2. Reviews

| Command | What it does |
| --- | --- |
| `/codex:review` | Read-only review of your uncommitted changes. |
| `/codex:review --base main` | Reviews everything your branch changed compared with `main`. Use this before merging. |
| `/codex:adversarial-review --base main <focus>` | Read-only review that challenges design choices. Add what to focus on after the flags. |

Add `--background` for anything bigger than a few files, then check on it with `/codex:status` and read it with
`/codex:result`. Use `--wait` to block until it finishes. Reviews never edit code.

Good focus texts for this repo:

```text
/codex:adversarial-review --base main check the Supabase migrations and RLS policies for data a visitor could read or write
/codex:adversarial-review --base main look for prerender breakage: code that touches window/document at import time
/codex:adversarial-review --base main check Arabic/RTL layout and translation fallbacks in the changed components
/codex:adversarial-review --base main review supabase/functions/prompt-coach for rate-limit and CORS gaps
```

`/codex:review` takes no focus text; use `/codex:adversarial-review` when you want one.

## 3. Handing Codex a task

```text
/codex:rescue --background fix the oxlint errors in web/src
/codex:rescue investigate why npm run test:sync fails
/codex:rescue --resume          # continue the last Codex task
/codex:rescue --fresh ...       # start a new Codex thread instead
```

Options: `--model <model>`, `--effort <level>` (say "spark" for `gpt-5.3-codex-spark`). Codex **does** edit files
here, so commit or stash your own work first and read its diff before keeping it.

Job commands: `/codex:status [job-id]`, `/codex:result [job-id]`, `/codex:cancel [job-id]`.
To keep working in Codex itself, `/codex:transfer` prints a `codex resume <session-id>` command.

## 4. Checks to ask for

CI (`.github/workflows/deploy-pages.yml`) runs these from `web/` and blocks the deploy if any fail. When you hand
Codex a task, ask it to run them before it finishes:

```bash
cd web
npm ci
npm run check:content   # lessons: translations, vocab, quizzes, links
npm run lint            # oxlint
npm run test:sync
npm run test:coach
npm run build           # tsc + vite + prerender
```

For lesson content, point Codex at `.claude/skills/lesson-writer/SKILL.md`: it describes the lesson format and rules.

## 5. Caveats

- **Review gate.** `/codex:setup --enable-review-gate` adds a `Stop` hook that makes Codex review before Claude can
  finish. It can loop and drain your usage quickly; enable it only while you watch the session
  (`/codex:setup --disable-review-gate` turns it off).
- **Secrets.** `web/.env` is committed on purpose: it holds only the public Supabase URL and publishable key. Real
  secrets (`ANTHROPIC_API_KEY`, the service-role key) live in Supabase function secrets. Never paste them into a
  Codex prompt or a file, and treat any Codex suggestion to add a key to `web/.env` as wrong.
- **Pushing to `main` deploys.** Any push to `main` that touches `web/` publishes the site to GitHub Pages. Let Codex
  work on a branch and merge after the checks pass.
- **Migrations.** Files in `supabase/migrations/` are numbered and applied in order. Ask Codex to add a new numbered
  file, never to edit one that has already run.
- **Model settings.** Set `model` and `model_reasoning_effort` in `~/.codex/config.toml` (all projects) or
  `.codex/config.toml` in this repo (loaded only once you trust the project in Codex).
- **Big reviews are slow.** Reviewing the whole branch against `main` can take a while; use `--background`.
- **Cloud sessions.** The plugin needs the Codex CLI and your login on the machine running Claude Code, so use it from
  Claude Code on your own computer, not from a claude.ai cloud session.
