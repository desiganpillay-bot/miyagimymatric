# Matric Study Guide

South African Grade 10–12 study planning web application.

## Quick start

Open any `.html` file in `src/` directly in a browser. No build step, no server needed.

```
open src/matric_self_assessment.html
```

## Project files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Full context for Claude Code — read this first every session |
| `STATUS.md` | Live project tracker — what's done, open, and decided |
| `src/matric_self_assessment.html` | Self-assessment tool (complete) |
| `docs/Summary_for_study_planning.md` | Research document — content source for all sections |

## Architecture

- Single self-contained HTML files — no build system, no npm, no server
- Mobile-first design (375px+)
- Zero external runtime dependencies (Google Fonts only)
- localStorage for any state persistence

## Status

See `STATUS.md` for current build status.
