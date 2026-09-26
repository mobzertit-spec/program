---
name: lesson-writer
description: Write or update lessons for the Prompt English website (web/) — bilingual English/Arabic lessons that teach how to use Claude and improve English. Use when the user asks to add a lesson, a new track, more vocabulary, quiz questions, or "Go deeper" resources, or to fix lesson content.
---

# Lesson writer — Prompt English

Prompt English teaches **how to use Claude** in **simple English**, with Arabic help for every word.
Lessons live in `web/src/data/lessons/` and must follow the `LessonInput` type in `web/src/data/lessons/types.ts`.

## Where things go

| Track id      | File                                  | Topic                                              |
|---------------|---------------------------------------|----------------------------------------------------|
| `foundations` | `web/src/data/lessons/foundations.ts` | first steps, clear requests, context, AI fluency   |
| `prompting`   | `web/src/data/lessons/prompting.ts`   | prompting techniques                               |
| `features`    | `web/src/data/lessons/features.ts`    | Claude features (Projects, Artifacts, Skills, …)   |
| `english`     | `web/src/data/lessons/english.ts`     | English for work, with Claude as a coach           |

Order inside a file = order on the learning path (each lesson unlocks the next one in its track).
Lesson numbers are computed automatically — never add a `number` field.
A new track also needs an entry in `tracks` in `web/src/data/lessons/index.ts` and a file added to the `lessons` array there.

## Lesson recipe

1. **id**: kebab-case, unique, never rename an existing id (learner progress is stored by id).
2. **title / titleAr**: short (max ~6 words). **summary**: one sentence, `{ en, ar }`.
3. **level**: `Beginner` | `Intermediate` | `Advanced`; **minutes**: 5–8; **icon**: one of `LessonIconName`
   (add new icons to `web/src/components/LessonIcon.tsx` if needed).
4. **sections**: exactly 2 sections × 2 paragraphs. Each paragraph is `{ en, ar }`.
5. **example**: a weak prompt (`bad`) vs a strong prompt (`good`) + `why` `{ en, ar }`. Use `\n` for line breaks.
6. **tip**: one practical tip `{ en, ar }` — ideally one that also practises English.
7. **resources**: 1–5 items from `R` in `web/src/data/resources.ts`. **video** (optional): one `R.v…` item.
8. **vocab**: exactly 5 words `{ word, ar, pos, example }` — base form (lemma), lowercase, **unique across all lessons**,
   and each word should appear in the lesson text.
9. **quiz**: 2 questions `{ q, qAr, options, answer, explain: { en, ar } }` — vary the index of the correct answer;
   one question checks the idea, one checks a vocabulary word.

## Writing rules

- English at **B1 level**: sentences under ~25 words, common words, active voice, no idioms without explanation.
- Arabic: clear Modern Standard Arabic, a faithful translation (not a summary). Keep product names in English
  (Claude, Projects, Artifacts, Skills, Claude Code, MCP).
- Be **accurate** about Claude. Only state facts you can support from the official sources below;
  when a feature depends on the plan (Free / Pro / Max / Team / Enterprise), say so or leave the detail out.
  Features change — prefer timeless wording ("use the + button") over exact menu paths.
- No emoji in content. Use typographic apostrophes (`’`) inside single-quoted TS strings.

## Official sources only

Resources and facts must come from these sites (the content check rejects any other link):

- Claude Academy — `https://academy.claude.com/courses/…` (free courses)
- Claude Docs — `https://platform.claude.com/docs/…` and `https://code.claude.com/docs/…`
- Claude Help Center — `https://support.claude.com/en/articles/…`
- Anthropic on YouTube — `https://www.youtube.com/watch?v=…` (official Anthropic channel only)
- Anthropic on GitHub — `https://github.com/anthropics/…`

To add a new resource: verify the URL returns 200 (e.g. `curl -sL -o /dev/null -w '%{http_code}' URL`),
then add it to `R` in `resources.ts` with a short `description` / `descriptionAr`. Never invent video ids or URLs.
Do not copy text from these sources — write original, simpler explanations and link to them.

## Check your work

Run from `web/`:

```bash
npm run check:content   # offline translation for every word, unique vocab, valid quiz answers, official links only
npx tsc -b && npm run lint && npm run build
```

If `check:content` lists words without offline translation, add them to `RAW` in `web/src/data/dictionary.ts`
(`word|pos|Arabic`, pos = n, v, adj, adv, prep, conj, pron, det, int, phr). Irregular forms go in `IRREGULAR`.
General vocabulary for the word bank goes in `web/src/data/wordbank/{a1,a2,b1,b2,c1}.ts`.

Finally, open the lesson in the browser (`npm run dev` → `#/lessons/<id>`) and click a few words to confirm the
translation popover works.
