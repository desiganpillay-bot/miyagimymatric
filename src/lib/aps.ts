import type { MarkRange } from './constants';

export function pctToAPS(p: number): number {
  if (p >= 80) return 7;
  if (p >= 70) return 6;
  if (p >= 60) return 5;
  if (p >= 50) return 4;
  if (p >= 40) return 3;
  if (p >= 30) return 2;
  return 1;
}

export function rangeMid(r: MarkRange | string): number {
  const map: Record<string, number> = {
    '0-29':   15,
    '30-39':  35,
    '40-49':  45,
    '50-59':  55,
    '60-69':  65,
    '70-79':  75,
    '80-89':  85,
    '90-100': 95
  };
  return map[r] ?? 0;
}

export interface APSRow {
  name: string;
  pct: number;
  aps: number;
}

export interface APSResult {
  total: number;
  best6: APSRow[];
  allRows: APSRow[];
}

// LO is excluded from APS per NSC and IEB rules
const LO_SUBJECT = 'Life Orientation';

export function computeAPS(subjectMarks: Record<string, string | number>): APSResult {
  const allRows: APSRow[] = Object.entries(subjectMarks)
    .filter(([, mark]) => !!mark)
    .map(([name, mark]) => {
      const pct = typeof mark === 'number' ? mark : rangeMid(mark as string);
      return { name, pct, aps: pctToAPS(pct) };
    })
    .sort((a, b) => b.aps - a.aps);

  const best6 = allRows.filter(r => r.name !== LO_SUBJECT).slice(0, 6);
  const total = best6.reduce((sum, r) => sum + r.aps, 0);

  return { total, best6, allRows };
}

export function scoreClass(total: number): string {
  if (total >= 30) return 'score-high';
  if (total >= 22) return 'score-mid';
  return 'score-low';
}

export function barColor(total: number): string {
  if (total >= 30) return 'linear-gradient(90deg,#4ade80,#38bdf8)';
  if (total >= 22) return 'linear-gradient(90deg,#f6c90e,#fb923c)';
  return 'linear-gradient(90deg,#f87171,#fb923c)';
}

export function pClass(p: number): string {
  if (p === 7) return 'p7';
  if (p === 6) return 'p6';
  if (p === 5) return 'p5';
  if (p === 4) return 'p4';
  if (p === 3) return 'p3';
  return 'low';
}

export function passLabel(aps: number): string {
  if (aps >= 30) return "Bachelor's range ✓";
  if (aps >= 23) return "Minimum Bachelor's";
  if (aps >= 19) return 'Diploma range';
  return 'Below degree entry';
}

export function examNeeded(sbaPct: number, targetPct: number): number {
  return Math.max(0, Math.round((targetPct - 0.25 * sbaPct) / 0.75));
}

// ── Wits IEB APS ─────────────────────────────────────────────
// Wits uses a different scale for IEB candidates:
// - 90-100% = 8 pts (distinction bonus), 80-89% = 7, 70-79% = 6, etc.
// - LO is INCLUDED, scored 0–4 on a separate scale
// - +2 bonus if Maths ≥ 60%, +2 bonus if English (HL or FAL) ≥ 60%
// - Top 7 subjects (best 6 academic + LO)
// Source: wits.ac.za undergraduate entry requirements

export interface WitsIEBResult {
  total: number;        // Wits IEB APS (can exceed 42)
  basePoints: number;   // subject points before bonuses
  mathsBonus: number;   // 0 or 2
  englishBonus: number; // 0 or 2
  loPoints: number;     // 0–4
  rows: APSRow[];       // best 6 academic rows
}

function pctToWitsIEB(p: number): number {
  if (p >= 90) return 8;
  if (p >= 80) return 7;
  if (p >= 70) return 6;
  if (p >= 60) return 5;
  if (p >= 50) return 4;
  if (p >= 40) return 3;
  if (p >= 30) return 2;
  return 1;
}

function pctToLOPoints(p: number): number {
  if (p >= 80) return 4;
  if (p >= 60) return 3;
  if (p >= 40) return 2;
  if (p >= 20) return 1;
  return 0;
}

const MATHS_SUBJECTS = ['Mathematics', 'Mathematical Literacy'];
const ENGLISH_SUBJECTS = ['English HL', 'English FAL'];

export function computeWitsIEBAPS(subjectMarks: Record<string, string | number>): WitsIEBResult {
  const allRows = Object.entries(subjectMarks)
    .filter(([, mark]) => !!mark)
    .map(([name, mark]) => {
      const pct = typeof mark === 'number' ? mark : rangeMid(mark as string);
      return { name, pct, aps: pctToWitsIEB(pct) };
    });

  const loRow   = allRows.find(r => r.name === LO_SUBJECT);
  const loPoints = loRow ? pctToLOPoints(loRow.pct) : 0;

  const academic = allRows
    .filter(r => r.name !== LO_SUBJECT)
    .sort((a, b) => b.aps - a.aps)
    .slice(0, 6);

  const basePoints = academic.reduce((s, r) => s + r.aps, 0);

  const mathsRow   = allRows.find(r => MATHS_SUBJECTS.includes(r.name));
  const englishRow = allRows.find(r => ENGLISH_SUBJECTS.includes(r.name));
  const mathsBonus   = mathsRow   && mathsRow.pct   >= 60 ? 2 : 0;
  const englishBonus = englishRow && englishRow.pct >= 60 ? 2 : 0;

  return {
    total: basePoints + loPoints + mathsBonus + englishBonus,
    basePoints,
    mathsBonus,
    englishBonus,
    loPoints,
    rows: academic
  };
}
