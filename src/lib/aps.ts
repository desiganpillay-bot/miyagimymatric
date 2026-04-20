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

export function computeAPS(subjectMarks: Record<string, string>): APSResult {
  const allRows: APSRow[] = Object.entries(subjectMarks)
    .filter(([, mark]) => !!mark)
    .map(([name, mark]) => {
      const pct = rangeMid(mark);
      return { name, pct, aps: pctToAPS(pct) };
    })
    .sort((a, b) => b.aps - a.aps);

  const best6 = allRows.slice(0, 6);
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
