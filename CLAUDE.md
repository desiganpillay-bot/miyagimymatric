# CLAUDE.md — Matric Study Guide Project

## Read this first, every session

This is the primary context file for Claude Code. Before doing anything, read:
1. This file (CLAUDE.md) — project overview, architecture, constraints, decisions
2. STATUS.md — what is done, what is open, what has been decided

STATUS.md wins over everything else if there is any conflict.

---

## Project overview

A South African matric (Grade 12) study planning web application. The primary user is a real learner (teenager, son of the project owner) who will use this as an active study tool.

**Core goal:** A self-contained, browser-based tool that helps SA Grade 10–12 learners plan their studies, understand their strengths and gaps, build a personalised timetable, and access the best free SA study resources — all without needing a server, login, or data connection after initial load.

**Current state:** Phase 1 (self-assessment tool) is built and ready for testing. Phase 2 onward (timetable, techniques, subject guides, resources) is open.

---

## Hard constraints — never violate these

1. **Single HTML file per tool** — no build system, no npm, no server. Each section of the guide is a self-contained `.html` file or part of one. No external dependencies that require installation.
2. **No login, no backend, no database** — everything runs in the browser. State that needs to persist uses `localStorage` only.
3. **Zero-rating compatible** — minimise external scripts and large assets. Google Fonts is acceptable. No CDN-heavy frameworks.
4. **Mobile-first** — most SA learners access the internet via smartphone. Every UI must work on a 375px screen.
5. **Offline-capable after first load** — critical content must not depend on live API calls to render.
6. **Simple English** — many learners study in their second or third language. Avoid jargon, keep sentences short.

---

## Design system (established in matric_self_assessment.html)

All new files must match this exactly:

```css
--bg: #0d1117
--surface: #161b22
--surface2: #1f2937
--border: #2d3748
--accent: #f6c90e      /* yellow — primary CTA, highlights */
--accent2: #38bdf8     /* blue — secondary, links */
--accent3: #4ade80     /* green — success, met targets */
--text: #f0f4f8
--muted: #8899a6
--danger: #f87171      /* red — warnings, high priority */
--radius: 12px
--font-head: 'Syne', sans-serif   /* headings, labels, numbers */
--font-body: 'DM Sans', sans-serif /* body text */
```

Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

Background treatment:
```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 0%, rgba(246,201,14,.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(56,189,248,.05) 0%, transparent 60%);
}
```

Card pattern: `background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 2rem;`

Animation pattern: `fadeDown` for headers, `fadeUp` for cards (staggered with `animation-delay`), `fadeIn` for progress.

---

## SA domain knowledge — critical facts

### Assessment system
- **25% SBA / 75% final exam** for most subjects (NOT 40/60 — common misconception)
- 40/60 applies only to: CAT, IT, Tourism
- Life Orientation: 100% internal (CAPS: 80% SBA + 20% CAT; IEB: 70% SBA + 30% CAT)
- Prelim exams are part of the 25% SBA — strategically very important
- Missing SBA tasks → "Not Resulted" status → no NSC at all

### APS (Admission Point Score)
Standard 7-point scale used by all SA public universities:

| % Range | APS Points |
|---------|-----------|
| 80–100% | 7 |
| 70–79%  | 6 |
| 60–69%  | 5 |
| 50–59%  | 4 |
| 40–49%  | 3 |
| 30–39%  | 2 |
| 0–29%   | 1 |

- APS is calculated from best 6 subjects (excluding Life Orientation)
- Maximum APS = 42 (6 subjects × 7 points)
- UCT uses a unique 600-point scale (sum of % marks, not 7-point conversion)
- Bachelor's pass minimum: APS 23+ (varies by university and programme)

### The SBA cushion calculation
80% SBA + x% exam = 60% overall
→ 0.25(80) + 0.75(x) = 60
→ 20 + 0.75x = 60
→ x = 53.3%
**A learner with 80% SBA only needs 53% in the final exam to get 60% overall.**

### Exam systems
**IEB (Independent Examinations Board)**
- ~17,000 candidates/year, independent schools
- 98.31% pass rate (2025)
- Explicitly uses Bloom's taxonomy — 60% of Life Sciences marks at analysis/synthesis/evaluation level
- Grants 10-minute reading period before each paper
- History: source material booklets requiring bias/reliability/perspective evaluation
- Accounting: split into processing paper + reasoning/analysis paper
- 2025 final exams: 9 September – 27 November

**CAPS/NSC (National Senior Certificate)**
- ~900,000+ candidates/year, government schools
- 87.3% pass rate (2024)
- 55% of Mathematics marks in knowledge/routine procedures bands
- Prelims staggered by province; Eastern Cape typically ~25 August
- 2025 final exams: 21 October – 27 November
- Both systems: morning sessions 09:00, afternoon sessions 14:00

### Term structure (Grade 12)
- **Term 1 (Jan–Mar):** Foundation. SBA tasks begin. Daily subject rotation habit critical.
- **Term 2 (Apr–Jun):** Consolidation. Mid-year exams = SBA marks. NBT window (UCT, UJ, SU).
- **Term 3 (Jul–Sep):** Critical. Prelims mid-Aug to Sep. All PATs/portfolios due before prelims.
- **Term 4 (Oct–Nov):** Execution only. Targeted revision per upcoming paper.

### Study techniques (evidence-based, SA-endorsed)
1. **Active recall / blurting** — study 20–30 min, close notes, write everything from memory, check gaps
2. **Spaced repetition** — 1-3-7-14-30 day review schedule. Tools: Anki (free Android), Quizlet
3. **Pomodoro** — SA educators recommend 50/10 (not 25/5) for matric. 4 cycles → 30 min break
4. **Mind mapping** — build from memory first, then check source. Best for Life Sciences, History
5. **Feynman technique** — explain concept as if teaching a beginner; stumbling = real gap
6. **Past papers** — single most effective tool per all SA educators surveyed

### Subject-specific priorities
**Mathematics:**
- Paper 1: Functions+Graphs+Calculus = ~47% of marks → highest priority
- Paper 2: Euclidean Geometry = most feared nationally; needs Term 1 start
- Time: ~1.2 min/mark. Start Paper 2 with Statistics for easy marks.

**Physical Sciences:**
- Paper 1 (Physics): ~60% calculations, 40% conceptual
- Paper 2 (Chemistry): ~50/50
- Grade 10 + 11 content IS examinable
- Study both papers in parallel — never neglect one

**Life Sciences:**
- Most content-heavy science. Two papers.
- IEB Paper 2: 40-mark source-based essay requiring opinion + evidence
- Practise drawing labelled diagrams from memory

**English:**
- Paper 3: 1 essay/week under timed conditions, rotating formats
- Literature: characters/themes/symbols deeply, not just plot

**History:**
- Paper 1: source analysis (origin, purpose, reliability + own knowledge)
- Paper 2: essays using PEEL structure; ~45 min per essay including planning

**Geography:**
- Mapwork: contour interpretation, gradient, bearing, cross-sections — weekly practice all year
- GIS: data layers, buffering, spatial analysis — straightforward marks

**Accounting:**
- Practise full financial statements until format is automatic
- Ratio interpretation questions = most marks lost nationally

**Business Studies:**
- Essay technique paramount: intro → BBBEE/EEA/CPA comparison tables → recommendation conclusion

---

## Universities in scope (20 SA public universities)

| ID | Abbr | Name | City |
|----|------|------|------|
| uct | UCT | University of Cape Town | Cape Town |
| wits | Wits | University of the Witwatersrand | Johannesburg |
| up | UP | University of Pretoria | Pretoria |
| su | SU | Stellenbosch University | Stellenbosch |
| uj | UJ | University of Johannesburg | Johannesburg |
| ukzn | UKZN | University of KwaZulu-Natal | Durban |
| nwu | NWU | North-West University | Potchefstroom |
| ufs | UFS | University of the Free State | Bloemfontein |
| ru | RU | Rhodes University | Makhanda |
| uwc | UWC | University of Western Cape | Cape Town |
| unisa | UNISA | UNISA (Distance) | Nationwide |
| nmu | NMU | Nelson Mandela University | Gqeberha |
| ul | UL | University of Limpopo | Polokwane |
| univen | Univen | University of Venda | Limpopo |
| wsu | WSU | Walter Sisulu University | Eastern Cape |
| cput | CPUT | Cape Peninsula UT | Cape Town |
| tut | TUT | Tshwane University of Technology | Pretoria |
| dut | DUT | Durban University of Technology | Durban |
| vut | VUT | Vaal University of Technology | Vanderbijlpark |
| mut | MUT | Mangosuthu UT | Durban |

---

## Fields of study in scope (15)

Medicine/Health Sciences, Engineering, BCom/Commerce, Law (LLB), Education/Teaching, IT/Computer Science, Humanities/Social Sciences, BSc/Natural Sciences, Architecture/Built Environment, Nursing/Midwifery, Fine Arts/Design/Media, Agriculture/Agri-Science, Chartered Accounting (CTA), Psychology/Counselling, Sport Science/Biokinetics

---

## Free SA study resources (for resource directory section)

### Zero-rated platforms (free data on MTN/Vodacom/Telkom)
- **Siyavula** — adaptive Maths + Physical Sciences (Gr 10–12), unlimited practice, instant feedback
- **DBE website** (education.gov.za) — all NSC past papers 2016+, memorandums, Mind the Gap guides
- **Vodacom e-School** — curriculum content across subjects

### Key tools
- **Matric Live** — FNB App of the Year 2024; video lessons, AI chat, mock exams, offline capability
- **Maski** — WhatsApp-based AI tutor; 100,000+ users within 6 months of March 2025 launch
- **SA Exam Papers** (saexampapers.co.za) — largest past paper collection, 2008+
- **Matric Exam Papers app** — DBE + IEB + provincial papers, 2008+, 40+ subjects
- **IEB past papers** — ieb.co.za, last 5 years free
- **Anki** — spaced repetition flashcards, free Android, SM-2 algorithm
- **Quizlet** — flashcards, free tier

### YouTube
- **Kevinmathscience** — ~1 million subscribers, CAPS + IEB Maths + Science
- **Mindset Learn** — all major subjects, Vodacom Digital Classroom network

### Organisation tools
- Google Calendar (study block scheduling)
- Notion (subject wikis, task trackers)
- Todoist (SBA deadline management)

### Mental health
- **SADAG** helpline: 0800 456 789 (free)
- AVBOB Step 12 — free CAPS guides in all 11 official SA languages

---

## File structure

```
matric-study-guide/
├── CLAUDE.md                          ← this file
├── STATUS.md                          ← project tracker (read every session)
├── src/
│   ├── matric_self_assessment.html    ← COMPLETE: self-assessment tool (section 1/12)
│   └── [future HTML files per section]
├── docs/
│   └── Summary_for_study_planning.md ← research + content source for all sections
└── assets/
    └── [images, icons if needed]
```

---

## What to build next (from STATUS.md open items)

Priority order suggested:

1. **Timetable builder** (`src/timetable_builder.html`) — highest learner value, most requested
2. **Study techniques toolkit** (`src/study_techniques.html`) — content mostly in docs, needs interactive UI
3. **Subject strategy pages** (`src/subjects.html`) — 8 subjects documented, can be one tabbed file
4. **Resource directory** (`src/resources.html`) — straightforward, high immediate value
5. **Wellbeing page** (`src/wellbeing.html`) — SADAG integration, stress management

Lower priority:
6. Goal-setting module (APS logic already in self-assessment — may extend rather than rebuild)
7. Past-paper practice guide
8. Study groups section
9. Exam day logistics
10. Parent/guardian guide

---

## Session protocol

**Start of session:**
1. Read CLAUDE.md (this file)
2. Read STATUS.md
3. Confirm current state before building anything

**End of session:**
Output a STATUS.md update block:
```
## STATUS.md UPDATE — [date]
COMPLETED: [item]
OPENED: [item]
DECISION: [what was decided]
FILE UPDATED: [old] superseded by [new]
```
User applies the update manually.
