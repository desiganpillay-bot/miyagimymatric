# LAST SESSION — Matric Study Guide
_Generated: 2026-04-25 — Session 11_

---

## Date: 2026-04-25 | Session 11
**Title:** Report card photo → OCR auto-import via Claude Haiku

## What Was Done This Session

### Built
- **`/api/parse-report` server route** — POST endpoint accepting image uploads (JPEG/PNG/WebP, max 10MB). Converts to base64, calls Claude Haiku 4.5 vision, extracts subject marks, maps to the 17-item SUBJECTS constant, validates and sanitises output, returns `{ subjects: [{ subject, mark, matchedSubject }] }`.
- **Assessment page photo import UI** — banner inserted above the subjects grid on section 3. Tap "Import photo" → picks from gallery or camera → uploads to `/api/parse-report` → pre-fills all mark% dropdowns automatically. Four states: idle / loading (spinner) / done (count + "Try again") / error (message + "Retry").

### Key Implementation Details
- `markToRange(pct)` converts raw % to the MARK_RANGES bucket ('0-29' … '90-100')
- `capture="environment"` on the file input opens rear camera on mobile by default
- OCR never blocks the user — if it fails, marks can still be filled manually
- All output sanitised server-side before returning to client

## Files Changed
- `src/routes/api/parse-report/+server.ts` — CREATED
- `src/routes/assessment/+page.svelte` — photo import banner + state vars + `handleReportPhoto` + `markToRange` + OCR CSS

## Commits
- `ff062e6` — Feat: report card photo → OCR auto-import via Claude Haiku

## Start Next Session Here

**Priority order:**
1. **Add `ANTHROPIC_API_KEY` to Vercel env** (user action, 2 min) — Vercel dashboard → Settings → Environment Variables. OCR is live in code but will 500 in production without this.
2. **Parent read-only share link** (~1–2 hrs) — new route (`/parent` or `/view/[token]`) with auth scoping so Rav's dad can view the profile without editing. Probably a signed URL or a separate session mode.
3. **WhatsApp daily nudge** — Twilio/WhatsApp Business API, external dependency, lowest priority.

## Key Facts To Carry Forward
- Standard APS scale: 80-100=7 (NOT 90-100=7)
- Rav: standard APS = 34, Wits IEB = 40, Wits BCom requires 44 IEB, gap = 4
- `/deep` saves to `mmm_deep_v1` localStorage. Re-measure date: 21 May 2026.
- GitHub PAT: rotated 2026-04-25, set via terminal by user. Do not use old tokens.
- Svelte 4: no runes, no `as TypeName` in templates, use `on:click=` not `onclick=`
- AI model for OCR: `claude-haiku-4-5-20251001` (not Sonnet — cheaper, sufficient)
