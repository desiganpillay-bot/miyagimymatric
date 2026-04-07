// ============================================================
// MIYAGI MY MATRIC — Core SA Domain Constants
// ============================================================

export const SUBJECTS = [
  'Mathematics',
  'Mathematical Literacy',
  'Physical Sciences',
  'Life Sciences',
  'English HL',
  'English FAL',
  'Accounting',
  'Business Studies',
  'History',
  'Geography',
  'Afrikaans',
  'isiZulu / isiXhosa / Other Lang',
  'Information Technology',
  'Economics',
  'Life Orientation',
  'Computer Applications Technology',
  'Other Subject'
] as const;

export type Subject = typeof SUBJECTS[number];

export const MARK_RANGES = ['0-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-100'] as const;
export type MarkRange = typeof MARK_RANGES[number];

export interface University {
  id: string;
  abbr: string;
  name: string;
  city: string;
}

export const UNIVERSITIES: University[] = [
  { id: 'uct',    abbr: 'UCT',   name: 'Univ. of Cape Town',          city: 'Cape Town' },
  { id: 'wits',   abbr: 'Wits',  name: 'Univ. of the Witwatersrand',  city: 'Johannesburg' },
  { id: 'up',     abbr: 'UP',    name: 'Univ. of Pretoria',           city: 'Pretoria' },
  { id: 'su',     abbr: 'SU',    name: 'Stellenbosch University',     city: 'Stellenbosch' },
  { id: 'uj',     abbr: 'UJ',    name: 'Univ. of Johannesburg',       city: 'Johannesburg' },
  { id: 'ukzn',   abbr: 'UKZN',  name: 'Univ. of KwaZulu-Natal',     city: 'Durban' },
  { id: 'nwu',    abbr: 'NWU',   name: 'North-West University',       city: 'Potchefstroom' },
  { id: 'ufs',    abbr: 'UFS',   name: 'Univ. of the Free State',     city: 'Bloemfontein' },
  { id: 'ru',     abbr: 'RU',    name: 'Rhodes University',           city: 'Makhanda' },
  { id: 'uwc',    abbr: 'UWC',   name: 'Univ. of Western Cape',       city: 'Cape Town' },
  { id: 'unisa',  abbr: 'UNISA', name: 'UNISA (Distance)',            city: 'Nationwide' },
  { id: 'nmu',    abbr: 'NMU',   name: 'Nelson Mandela Univ.',        city: 'Gqeberha' },
  { id: 'ul',     abbr: 'UL',    name: 'Univ. of Limpopo',            city: 'Polokwane' },
  { id: 'univen', abbr: 'Univen',name: 'Univ. of Venda',              city: 'Limpopo' },
  { id: 'wsu',    abbr: 'WSU',   name: 'Walter Sisulu Univ.',         city: 'Eastern Cape' },
  { id: 'cput',   abbr: 'CPUT',  name: 'Cape Peninsula UT',           city: 'Cape Town' },
  { id: 'tut',    abbr: 'TUT',   name: 'Tshwane Univ. of Tech.',      city: 'Pretoria' },
  { id: 'dut',    abbr: 'DUT',   name: 'Durban Univ. of Tech.',       city: 'Durban' },
  { id: 'vut',    abbr: 'VUT',   name: 'Vaal Univ. of Tech.',         city: 'Vanderbijlpark' },
  { id: 'mut',    abbr: 'MUT',   name: 'Mangosuthu UT',               city: 'Durban' }
];

export interface Field {
  id: string;
  label: string;
  icon: string;
  apsReqs: Partial<Record<string, number>>;
  notes: string;
}

export const FIELDS: Field[] = [
  {
    id: 'medicine', label: 'Medicine / Health Sciences', icon: '🩺',
    apsReqs: { uct: 480, wits: 42, up: 36, su: 40, ukzn: 36, uj: 32, ufs: 30, nmu: 30 },
    notes: 'Pure Maths + Physical Sciences compulsory. NBT required at most universities. Highly competitive.'
  },
  {
    id: 'engineering', label: 'Engineering', icon: '⚙️',
    apsReqs: { uct: 420, wits: 38, up: 35, su: 38, uj: 32, ukzn: 30, nwu: 28, ufs: 30, tut: 24, cput: 24, dut: 22, vut: 22, nmu: 28 },
    notes: 'Pure Mathematics + Physical Sciences compulsory for all engineering programmes.'
  },
  {
    id: 'bcom', label: 'BCom / Commerce', icon: '📊',
    apsReqs: { uct: 380, wits: 39, up: 32, su: 36, uj: 28, ukzn: 28, nwu: 24, ufs: 28, ru: 34, uwc: 28, unisa: 20, nmu: 26 },
    notes: 'Mathematics (not Maths Literacy) preferred for most BCom programmes.'
  },
  {
    id: 'law', label: 'Law (LLB)', icon: '⚖️',
    apsReqs: { uct: 430, wits: 46, up: 35, su: 38, uj: 30, ukzn: 30, nwu: 28, ufs: 28, ru: 34, uwc: 28, unisa: 20, ul: 26, nmu: 28 },
    notes: 'Strong English required (min 60%). Maths Literacy usually accepted for LLB.'
  },
  {
    id: 'education', label: 'Education / Teaching', icon: '🏫',
    apsReqs: { up: 30, wits: 30, uj: 26, ukzn: 26, nwu: 24, ufs: 26, ul: 24, unisa: 20, wsu: 20, nmu: 24, uwc: 24 },
    notes: 'Choose subjects that match the subject area you intend to teach.'
  },
  {
    id: 'it', label: 'IT / Computer Science', icon: '💻',
    apsReqs: { uct: 380, wits: 35, up: 30, su: 36, uj: 28, ukzn: 28, nwu: 24, ufs: 26, tut: 22, cput: 22, unisa: 20, nmu: 24 },
    notes: 'Mathematics (not Maths Literacy) required for most IT and Computer Science programmes.'
  },
  {
    id: 'humanities', label: 'Humanities / Social Sciences', icon: '📚',
    apsReqs: { uct: 360, wits: 34, up: 30, su: 34, uj: 26, ukzn: 26, nwu: 24, ufs: 26, ru: 30, uwc: 24, unisa: 20, ul: 22, nmu: 24 },
    notes: 'Strong English and History results are advantageous.'
  },
  {
    id: 'sciences', label: 'BSc / Natural Sciences', icon: '🔬',
    apsReqs: { uct: 400, wits: 36, up: 32, su: 38, uj: 28, ukzn: 28, nwu: 24, ufs: 28, ru: 32, uwc: 26, nmu: 26 },
    notes: 'Maths + Physical Sciences or Life Sciences typically required.'
  },
  {
    id: 'architecture', label: 'Architecture / Built Env.', icon: '🏛️',
    apsReqs: { uct: 420, wits: 36, up: 32, su: 40, uj: 28, ukzn: 28, tut: 24, cput: 24, dut: 22, nmu: 28 },
    notes: 'Mathematics required. Portfolio submission often required.'
  },
  {
    id: 'nursing', label: 'Nursing / Midwifery', icon: '💊',
    apsReqs: { up: 28, uct: 28, ukzn: 27, uj: 26, wits: 28, nwu: 24, ufs: 26, ul: 22, wsu: 20, nmu: 22, uwc: 24 },
    notes: 'Life Sciences highly recommended. Strong practical component.'
  },
  {
    id: 'arts', label: 'Fine Arts / Design / Media', icon: '🎨',
    apsReqs: { uct: 340, wits: 30, up: 28, su: 32, uj: 24, ukzn: 24, nwu: 22, tut: 20, cput: 20, uwc: 20, nmu: 22 },
    notes: 'Portfolio submissions required in addition to APS at most institutions.'
  },
  {
    id: 'agriculture', label: 'Agriculture / Agri-Science', icon: '🌱',
    apsReqs: { up: 28, su: 30, ukzn: 24, ufs: 24, ul: 22, nwu: 22, unisa: 20, nmu: 22 },
    notes: 'Life Sciences and Geography recommended. Strong career growth sector.'
  },
  {
    id: 'accounting', label: 'Chartered Accounting (CTA)', icon: '🧾',
    apsReqs: { uct: 400, wits: 39, up: 34, su: 38, uj: 30, ukzn: 30, nwu: 26, ufs: 30, uwc: 28 },
    notes: 'Mathematics compulsory. Accounting subject highly recommended.'
  },
  {
    id: 'psychology', label: 'Psychology / Counselling', icon: '🧠',
    apsReqs: { uct: 360, wits: 34, up: 30, su: 36, uj: 26, ukzn: 26, nwu: 24, ufs: 26, ru: 30, uwc: 24, unisa: 20 },
    notes: 'Strong English and Human Sciences recommended.'
  },
  {
    id: 'sport', label: 'Sport Science / Biokinetics', icon: '🏃',
    apsReqs: { up: 28, wits: 28, uj: 24, ukzn: 24, uwc: 22, nwu: 22, ufs: 24, nmu: 22 },
    notes: 'Life Sciences and Physical Sciences recommended.'
  }
];

// SA exam key dates 2025
export const EXAM_DATES = {
  prelim_start: new Date('2025-08-25'),
  finals_start_ieb: new Date('2025-09-09'),
  finals_start_caps: new Date('2025-10-21'),
  finals_end: new Date('2025-11-27')
};
