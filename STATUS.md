# STATUS.md — Miyagi My Matric
_Last updated: 2026-04-06_

---

## 🟢 LIVE & COMPLETE

| Item | Description |
|------|-------------|
| `src/routes/+page.svelte` | Landing page — Miyagi branding, 6 feature cards, Mr. Miyagi quote, CTA |
| `src/routes/assessment/+page.svelte` | Full 6-section self-assessment: exam system, career/uni goals, live APS calculator, learning style, study habits, wellbeing. Svelte 4 compatible. localStorage auto-persist. |
| `src/lib/constants.ts` | 15 subjects, 20 SA universities, 15 fields of study with APS requirements, mark ranges, exam dates |
| `src/lib/aps.ts` | APS calculation, SBA cushion calculator, score formatting helpers |
| `src/lib/stores/assessment.ts` | Svelte stores with localStorage auto-persist (`mmm_assessment_v1`) |
| `src/lib/supabase.ts` | Supabase browser client |
| `src/lib/auth.ts` | Magic link + Google OAuth helpers |
| `src/app.css` | Full design system — exact preservation of all CSS variables, animations, fonts |
| `supabase/migrations/001_initial_schema.sql` | All tables: profiles, learner_subjects, subject_marks, goals, timetable_templates, timetable_slots, study_sessions, sba_tasks, report_uploads, achievements, assessment_snapshots |
| `supabase/migrations/002_rls_policies.sql` | RLS on all tables — `auth.uid() = user_id` pattern |
| `supabase/migrations/003_functions_triggers.sql` | handle_new_user trigger, update_streak function, handle_session_xp trigger |
| **Supabase project** | Live at `rdyeimdlnueqolptkpqx.supabase.co` — all 3 migration scripts applied successfully |

---

## 🔴 OPEN — Build next in this order

| Priority | Item | Notes |
|----------|------|-------|
| 1 | **Deploy to Vercel** | Push to GitHub → import in Vercel → add env vars → assign `miyagimymatric.com` |
| 2 | **Dashboard** (`/dashboard`) | APS ring (circular progress), streak counter, countdown timers (X days to Prelims/Finals), recent marks summary |
| 3 | **Timetable builder** (`/timetable`) | Weekly grid, subject blocks, 50/10 Pomodoro structure |
| 4 | **SBA task tracker** (`/sba`) | Add tasks, due dates, urgency colours (<7 days = red pulse) |
| 5 | **Pomodoro timer** | 50/10 format, auto-logs study session to DB, XP awarded on completion |
| 6 | **Mark entry** (`/marks`) | Manual subject mark entry, SBA vs exam split, trend view |
| 7 | **Subject strategy pages** (`/subjects/[subject]`) | 8 subjects documented: Maths, Physical Sciences, Life Sciences, English, Accounting, Business Studies, History, Geography |
| 8 | **Study techniques toolkit** (`/techniques`) | Spaced repetition, active recall, Pomodoro, mind mapping, Feynman |
| 9 | **Resource directory** (`/resources`) | Zero-rated platforms flagged, Siyavula, Matric Live, Maski, Kevinmathscience etc. |
| 10 | **Report upload + AI parsing** (`/reports`) | Claude Haiku OCR, Supabase Storage, Realtime parse status |
| 11 | **Streaks + XP + badges** | Duolingo-style, 1-day grace period, level 1–50 |
| 12 | **PWA** | `@vite-pwa/sveltekit`, offline cache via Dexie.js, add-to-home-screen prompt |

---

## 🟡 DEFERRED

| Item | Reason |
|------|--------|
| PWA / Workbox service worker | Version conflict with current Svelte 4 stack — add after core features are stable |
| Afrikaans / isiZulu UI strings | Phase 6 polish |
| Web Push notifications | After core dashboard is live |

---

## INFRASTRUCTURE

| Service | Detail |
|---------|--------|
| **Hosting** | Vercel — `miyagimymatric.com` registered, pending deploy |
| **Database** | Supabase — project `miyagimymatric`, region West EU (Ireland) |
| **Supabase URL** | `https://rdyeimdlnueqolptkpqx.supabase.co` |
| **Auth** | Magic link + Google OAuth (no SMS — SA prepaid numbers change too often) |
| **Offline** | Dexie.js (IndexedDB) — planned for Phase 2 |
| **AI parsing** | Claude Haiku via Anthropic SDK — server-side only (`/api/parse-report`) |

---

## CREDENTIALS (stored in `.env.local` — never commit)

| Key | Location |
|-----|----------|
| `PUBLIC_SUPABASE_URL` | `.env.local` + Vercel env vars |
| `PUBLIC_SUPABASE_ANON_KEY` | `.env.local` + Vercel env vars |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` + Vercel env vars (server-side only) |
| `ANTHROPIC_API_KEY` | Vercel env vars only (not needed locally until report parsing built) |
| Database password | `hitfod-tabfY6-tesnep` — Supabase project DB password |

---

## ARCHITECTURE

| Layer | Technology |
|-------|-----------|
| Frontend | SvelteKit + Svelte 4 (not 5 — no runes) + TypeScript |
| Adapter | `@sveltejs/adapter-vercel` |
| Database | Supabase (PostgreSQL + RLS + Realtime + Storage) |
| Auth | `@supabase/ssr` — magic link + Google OAuth |
| Offline | Dexie.js (IndexedDB) — planned |
| AI | Claude Haiku via `@anthropic-ai/sdk` — server-side API routes only |
| Design | CSS custom properties — no Tailwind. Syne + DM Sans fonts. |

**Key Svelte 4 rules (never violate):**
- No `$state()` runes — use `let` + `$:` reactive declarations
- No TypeScript `as TypeName` casts inside `{@const}` template blocks — use `str()` / `num()` / `arr()` helpers
- Event handlers: `on:click=` directive syntax, NOT `onclick=` HTML attribute

---

## DECISIONS LOG

| Decision | Detail |
|----------|--------|
| Platform name | **Miyagi My Matric** — "Your Matric Sensei". Domain: `miyagimymatric.com` |
| Stack | SvelteKit + Supabase + Vercel (not Netlify — domain already on Vercel) |
| Svelte version | **Svelte 4** (not 5) — smaller bundle, stable, no rune migration needed |
| Assessment weighting | 25% SBA / 75% exam for most subjects. 40/60 applies only to CAT, IT, Tourism. LO is 100% internal. |
| APS scale | Standard 7-point (80%+=7 down to 0–29%=1). Max 42. UCT uses 600-point scale. |
| Auth strategy | Anonymous → magic link (prompted after assessment) → Google OAuth. No SMS. |
| localStorage key | `mmm_assessment_v1` — migrates to Supabase on first sign-in |
| Pomodoro format | SA educators recommend 50/10 (not standard 25/5) |
| AI model | Claude Haiku (not Sonnet) — ~10x cheaper, sufficient for report card OCR |
| Supabase region | West EU (Ireland) — no SA region available on Supabase free tier |
| Exam systems | IEB and CAPS/NSC both supported throughout |
| Universities in scope | 20 SA public universities |
| Fields of study | 15 fields |
| Past papers | Single most effective matric prep tool |
| SBA strategy | 80% SBA → only need 53% in final for 60% overall |

---

## FILE REGISTRY

| Path | Type | Status |
|------|------|--------|
| `src/routes/+page.svelte` | Landing page | ✅ Current |
| `src/routes/assessment/+page.svelte` | Assessment tool | ✅ Current |
| `src/routes/+layout.svelte` | App shell | ✅ Current |
| `src/routes/+layout.ts` | SSR disabled | ✅ Current |
| `src/lib/constants.ts` | Data constants | ✅ Current |
| `src/lib/aps.ts` | APS logic | ✅ Current |
| `src/lib/stores/assessment.ts` | Svelte stores | ✅ Current |
| `src/lib/supabase.ts` | DB client | ✅ Current |
| `src/lib/auth.ts` | Auth helpers | ✅ Current |
| `src/app.css` | Design system | ✅ Current |
| `supabase/migrations/001_initial_schema.sql` | DB schema | ✅ Applied |
| `supabase/migrations/002_rls_policies.sql` | RLS policies | ✅ Applied |
| `supabase/migrations/003_functions_triggers.sql` | Functions | ✅ Applied |
| `.env.local` | Local secrets | ✅ Current (never commit) |
| `.env.example` | Secrets template | ✅ Current |
| `docs/Summary_for_study_planning.md` | Content source | ✅ Current |

---

## INSTRUCTIONS REMINDER

- Read this file at the start of every session before doing anything else
- STATUS.md wins over memory, chat history, and conversation summaries if there is any conflict
- Output a STATUS.md UPDATE block at the end of any session where something was completed, changed, or decided
- User applies the update — Claude does not silently update state
