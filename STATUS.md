# STATUS.md — Miyagi My Matric
_Last updated: 2026-04-18 (session 6)_

---

## 🟢 LIVE & COMPLETE

| Item | Description |
|------|-------------|
| `src/routes/+page.svelte` | Landing: Start Assessment CTA (primary) + How it works pill (ghost) + resources teaser + "Take me back to my Plan" |
| `src/routes/assessment/+page.svelte` | Full 6-section self-assessment. Reactivity fixed. localStorage auto-persist. POPIA consent checkboxes. |
| `src/routes/auth/callback/+page.svelte` | Auth callback — PKCE exchange, POPIA consent persist to DB, redirect to dashboard |
| `src/routes/dashboard/+page.svelte` | "My Plan" — APS ring, prelim/finals countdowns, streak, recent marks, SBA alert. Spinner fix (try/catch/finally + 8s safety). |
| `src/routes/privacy/+page.svelte` | POPIA Privacy Notice — full legal text, design system |
| `src/routes/terms/+page.svelte` | Terms of Use + disclaimer + limited indemnity |
| `src/routes/timetable/+page.svelte` | Weekly grid, click-to-assign subject/type per slot, localStorage |
| `src/routes/sba/+page.svelte` | SBA tracker — subjects from assessment, CAPS templates pre-populated, urgency pills, profile completion %, Supabase sync |
| `src/routes/pomodoro/+page.svelte` | 50/10 Pomodoro timer, localStorage |
| `src/routes/marks/+page.svelte` | Mark entry — subject tabs from assessment, topic + sections + file attach, trend indicator, APS calculator |
| `src/routes/subjects/+page.svelte` | Subject strategy guide (8 subjects) |
| `src/routes/techniques/+page.svelte` | Study techniques reference |
| `src/routes/resources/+page.svelte` | Resource directory — zero-rated platforms flagged |
| **Vercel deploy** | Live at `miyagimymatric.com` + `www.miyagimymatric.com`. SSL active. Auto-deploys from GitHub main. |
| **Supabase auth emails** | Confirm signup + Magic link templates branded — dark card, yellow CTA, SA footer. |
| `src/lib/constants.ts` | 15 subjects, 20 SA universities, 15 fields of study with APS requirements, mark ranges, exam dates |
| `src/lib/aps.ts` | APS calculation, SBA cushion calculator, score formatting helpers |
| `src/lib/stores/assessment.ts` | Svelte stores with localStorage auto-persist (`mmm_assessment_v1`) |
| `src/lib/supabase.ts` | Supabase browser client |
| `src/lib/auth.ts` | Magic link + Google OAuth helpers |
| `src/app.css` | Design system — new palette: Coral #FF5252, Lemon #F5F56A, Lime #7AFF7A, Sky #69B4FF. All inner pages updated. |
| **Bottom nav** | Route-based visibility — shows on all non-public inner pages regardless of auth. 5 items: My Plan · Timetable · SBA · Marks · Profile |
| `supabase/migrations/001_initial_schema.sql` | All tables: profiles, learner_subjects, subject_marks, goals, timetable_templates, timetable_slots, study_sessions, sba_tasks, report_uploads, achievements, assessment_snapshots |
| `supabase/migrations/002_rls_policies.sql` | RLS on all tables — `auth.uid() = user_id` pattern |
| `supabase/migrations/003_functions_triggers.sql` | handle_new_user trigger, update_streak function, handle_session_xp trigger |
| `supabase/migrations/004_popia_consent.sql` | Adds `consented_at TIMESTAMPTZ`, `terms_version TEXT` to `profiles` — ✅ Applied |
| `supabase/migrations/005_fix_search_path.sql` | Hardens security-definer functions — `set search_path = ''` — ✅ Applied |

---

## 🔴 OPEN — Build next in this order

### ⚡ NEXT SPRINT (start here next session)

**Sprint goal: Google OAuth fix, then PWA offline cache**

1. **OAuth diagnosis first — before touching any code:**
   - Check Supabase dashboard → Authentication → Logs for exact error
   - Check Google Cloud Console → OAuth consent screen — is it still in "Testing" mode? (limits to 100 users)
   - Verify redirect URI in Google Cloud matches exactly: `https://rdyeimdlnueqolptkpqx.supabase.co/auth/v1/callback`
   - Only write code if the issue is not a config fix

2. **PWA after OAuth:** Add `vite-plugin-pwa`, configure service worker, test offline behaviour. Watch for Svelte 4 / Vite compatibility issues.

Build in this order:

1. **30-min slot grid with fixed blocks**
   - Slots: 06:00–22:00, 30-min increments, Mon–Sun
   - Fixed blocks auto-placed: sleep, school (Mon–Fri 07:30–14:00), travel, lunch, dinner, leisure/wind-down
   - Fixed blocks non-editable, visually muted

2. **Three mode tabs**
   - Default (~15 hrs/week) — maintain current marks
   - **Stretch (~28 hrs/week) — AUTO-LOADED, is the default**
   - Optimal (~35 hrs/week) — overshoot targets +10%
   - Switching mode rebuilds grid

3. **Smart distribution**
   - `computeHourAllocation(mode)`: weight by `gap × priority` (high=3, med=2, low=1)
   - `buildGrid()`: weighted pool + `smartShuffle()` (no 3× consecutive same subject)
   - Past papers auto-placed first 2 weekend slots
   - Spread across all 7 days — weekends get 2× weekday slots

4. **Task modal (click any study block)**
   - Personalized task: subject × phase (confidence ≤2=foundation, 3=consolidation, ≥4=exam_prep) × learning_style
   - 3–4 zero-rated resource links per subject
   - Close: backdrop click or ESC

5. **Stats bar + APS callout**
   - Hours/week, term total, subjects covered
   - Current APS vs target APS vs gap (use `computeAPS()` from `$lib/aps.ts`)
   - Per-subject allocation bars: current %, target %, hours, priority

Assessment data consumed from `mmm_assessment_v1`:
- `subjectMarks` → `rangeMid()` for gap calc
- `subjectRatings` → confidence → phase
- `answers.learning_style`, `answers.goal`, `answers.exam_system`, `answers.challenges`

Manual slot edit preserved. localStorage persist preserved.

---

| Priority | Item | Notes |
|----------|------|-------|
| **Next** | **Timetable rebuild** | See sprint detail above |
| Deferred | Marks → Supabase sync | Not blocking learner value |
| Deferred | Pomodoro session logging | Not blocking learner value |
| Deferred | Auth fix (localhost→miyagimymatric.com) | Free tier, not urgent |
| Deferred | Subject strategy pages (dynamic routes) | Nice to have |
| Deferred | Report upload + AI parsing | Phase 3 |
| Deferred | PWA / offline cache | After core features stable |

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
| **Hosting** | Vercel — `miyagimymatric.com`, auto-deploys from GitHub main |
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
| Supabase sync pattern | localStorage = source of truth; Supabase sync is non-blocking fire-and-forget. DB errors never surface to user. |
| SBA enum mapping | Page `status:'pending'` → DB `'upcoming'`; page `task_type:'exam'` → DB `'prelim'` |

---

## FILE REGISTRY

| Path | Type | Status |
|------|------|--------|
| `src/routes/+page.svelte` | Landing page | ✅ Current |
| `src/routes/assessment/+page.svelte` | Assessment tool | ✅ Current |
| `src/routes/auth/callback/+page.svelte` | Auth callback | ✅ Current |
| `src/routes/dashboard/+page.svelte` | Dashboard | ✅ Current |
| `src/routes/privacy/+page.svelte` | Privacy Notice (POPIA) | ✅ Current |
| `src/routes/terms/+page.svelte` | Terms of Use | ✅ Current |
| `src/routes/timetable/+page.svelte` | Timetable builder | ✅ Current |
| `src/routes/sba/+page.svelte` | SBA tracker | ✅ Current |
| `src/routes/pomodoro/+page.svelte` | Pomodoro timer | ✅ Current |
| `src/routes/marks/+page.svelte` | Mark entry | ✅ Current |
| `src/routes/subjects/+page.svelte` | Subject strategy | ✅ Current |
| `src/routes/techniques/+page.svelte` | Study techniques | ✅ Current |
| `src/routes/resources/+page.svelte` | Resource directory | ✅ Current |
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
| `supabase/migrations/004_popia_consent.sql` | POPIA consent columns | ✅ Applied |
| `supabase/migrations/005_fix_search_path.sql` | Security fix | ✅ Applied |
| `.env.local` | Local secrets | ✅ Current (never commit) |
| `.env.example` | Secrets template | ✅ Current |
| `docs/Summary_for_study_planning.md` | Content source | ✅ Current |

---

## INSTRUCTIONS REMINDER

- Read this file at the start of every session before doing anything else
- STATUS.md wins over memory, chat history, and conversation summaries if there is any conflict
- Output a STATUS.md UPDATE block at the end of any session where something was completed, changed, or decided
- User applies the update — Claude does not silently update state

---

## SESSION LOG
_Session history written here by Claude at end of each session_

### 2026-04-18 — Palette consistency + nav active state fix

- Committed pending landing page simplification: Start Assessment (primary) stacked above How it works (ghost pill)
- Global palette swap across all 9 inner pages: replaced old rgba values (246,201,14 yellow, 74,222,128 lime, 56,189,248 sky) with new coral/lime/sky tokens
- Nav active state fix: `isActive` now reads `$page.url.pathname` directly (not via intermediate `current` variable) — ensures Svelte 4 tracks the store subscription and re-evaluates on navigation
- Files modified: `src/routes/+page.svelte`, all 9 inner page svelte files, `src/routes/+layout.svelte`
- All pushed and deploying via Vercel
- Next open: Google OAuth diagnosis (check Supabase + Google Cloud Console config before writing code)

### 2026-04-16/17 — Major UX overhaul (session 5b)

- New colour palette: Coral #FF5252, Lemon #F5F56A, Lime #7AFF7A, Sky #69B4FF — applied to `app.css`
- Dashboard infinite spinner fix: `onMount` wrapped in try/catch/finally + 8s safety timeout
- Dashboard renamed "Your Dashboard" → "My Plan" throughout
- SBA page rewrite: subjects pulled from assessment, 14-subject CAPS task templates pre-populated, dates count toward profile completion %, urgency pills (coral/lemon/lime)
- Marks page rewrite: subject tabs from assessment, topic + sections tested + file attach, trend indicator (up/down/flat)
- Nav overhaul: route-based visibility (no auth gate), 5 items: My Plan · Timetable · SBA · Marks · Profile
- Landing page: resources teaser grid (6 locked cards), CTA hierarchy fix (Start Assessment primary, Take me back to my Plan ghost), "no login" text in lime
- `goToMyPlan()` always routes to `/assessment?signin=1`
- Files modified: `src/app.css`, `src/routes/+layout.svelte`, `src/routes/+page.svelte`, `src/routes/dashboard/+page.svelte`, `src/routes/sba/+page.svelte`, `src/routes/marks/+page.svelte`

### 2026-04-15 — Home button + nav restore
- Added Home (🏠 → `/`) as first item in bottom nav
- Restored Dashboard (⬡ → `/dashboard`) which had been replaced in a prior uncommitted local change
- Nav is now 6 items: Home · Dashboard · Assess · Timetable · SBA · Timer
- Fixed `isActive` so Home only highlights on `/`, not `/dashboard`
- Files modified: `src/routes/+layout.svelte`
- Deployed and live at miyagimymatric.com
- Next open: full timetable rebuild (see ⚡ NEXT SPRINT in 🔴 OPEN section)
