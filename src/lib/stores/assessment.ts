import { writable, derived } from 'svelte/store';
import { computeAPS } from '$lib/aps';
import { SUBJECTS } from '$lib/constants';
import { saveAssessment, loadAssessment } from '$lib/storage';

// Initialise from localStorage if available
function initSubjectMarks(): Record<string, string> {
  const saved = loadAssessment();
  if (saved?.subjectMarks) return saved.subjectMarks;
  return Object.fromEntries(SUBJECTS.map(s => [s, '']));
}

function initSubjectRatings(): Record<string, number> {
  const saved = loadAssessment();
  if (saved?.subjectRatings) return saved.subjectRatings;
  return Object.fromEntries(SUBJECTS.map(s => [s, 0]));
}

function initAnswers(): Record<string, unknown> {
  const saved = loadAssessment();
  return saved?.answers ?? {};
}

export const currentSection = writable(0);
export const answers = writable<Record<string, unknown>>(initAnswers());
export const subjectMarks = writable<Record<string, string>>(initSubjectMarks());
export const subjectRatings = writable<Record<string, number>>(initSubjectRatings());

// Live APS — recalculates whenever subjectMarks changes
export const apsResult = derived(subjectMarks, ($marks) => computeAPS($marks));

// Persist to localStorage on any change
answers.subscribe($a => {
  const saved = loadAssessment();
  saveAssessment({
    answers: $a,
    subjectMarks: saved?.subjectMarks ?? {},
    subjectRatings: saved?.subjectRatings ?? {}
  });
});

subjectMarks.subscribe($m => {
  const saved = loadAssessment();
  saveAssessment({
    answers: saved?.answers ?? {},
    subjectMarks: $m,
    subjectRatings: saved?.subjectRatings ?? {}
  });
});

subjectRatings.subscribe($r => {
  const saved = loadAssessment();
  saveAssessment({
    answers: saved?.answers ?? {},
    subjectMarks: saved?.subjectMarks ?? {},
    subjectRatings: $r
  });
});

export function resetAssessment() {
  currentSection.set(0);
  answers.set({});
  subjectMarks.set(Object.fromEntries(SUBJECTS.map(s => [s, ''])));
  subjectRatings.set(Object.fromEntries(SUBJECTS.map(s => [s, 0])));
}
