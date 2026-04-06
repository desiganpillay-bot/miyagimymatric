// localStorage persistence for anonymous users
// Same key as the original vanilla HTML tool for continuity

const ASSESSMENT_KEY = 'mmm_assessment_v1';

export interface AssessmentState {
  answers: Record<string, unknown>;
  subjectMarks: Record<string, string>;
  subjectRatings: Record<string, number>;
  completedAt?: string;
}

export function loadAssessment(): AssessmentState | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ASSESSMENT_KEY);
    return raw ? (JSON.parse(raw) as AssessmentState) : null;
  } catch {
    return null;
  }
}

export function saveAssessment(state: AssessmentState): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(state));
}

export function clearAssessment(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(ASSESSMENT_KEY);
}
