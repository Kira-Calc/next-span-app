// All prototype data. Copied word for word from app_spec.md section 5.
// No network requests; state lives in memory and resets on refresh.

export const BATCH = {
  id: 'NS-0412',
  members: 24,
  grades: { A: 6, B: 10, C: 5, D: 3 },
  sampleMembers: { A: '03', B: '07', C: '15', D: '21' },
  species: 'Hardwood, species unknown',
  section: '90 × 45',
  length: '2 400',
  moisture: 'Not tested',
  graded: '12 Oct 2026',
  listed: '14 Oct 2026',
  updated: '16 Oct 2026',
  source: 'Pre-1950 house, Brisbane (illustrative)',
  buyer: 'Small practice architect, Brisbane',
  developer: 'Mark, small builder-developer (illustrative)',
};

export const MONEY = '$ XXX';
export const CARBON = 'XXX kg CO2e';
export const PRICE = '$ XX / m';

export const GRADE_NAMES = {
  A: 'Structural candidate',
  B: 'Direct reuse',
  C: 'Remake',
  D: 'Recycle only',
};

// Relative bar lengths match Claim Handbook Part 1 (R1 100, R4 75, R7/R8 50, R9 25).
export const REBATE_TIERS = [
  { code: 'R1', name: 'Retain the structure', share: 1, highest: true },
  { code: 'R4', name: 'Re-use whole components', share: 0.75 },
  { code: 'R7/R8', name: 'Remanufacture or re-purpose', share: 0.5 },
  { code: 'R9', name: 'Recycle', share: 0.25 },
];

export const ESTIMATE_OPTIONS = {
  built: ['Before 1950', '1950–1980', 'After 1980'],
  timber: ['Hardwood', 'Softwood', 'Not sure'],
};

export const ESTIMATE_DEFAULTS = {
  built: 'Before 1950',
  area: '120',
  timber: 'Hardwood',
};

export const R1_STEPS = ['Plan lodged', 'Works complete', 'Council confirms', 'Rebate released'];

export const SCREENS = [
  { path: '/', label: 'Start', side: null },
  { path: '/estimate', label: '1  Rebate estimate', side: 'developer' },
  { path: '/checklist', label: '2  Checklist', side: 'developer' },
  { path: '/grade', label: '3  Grade on site', side: 'developer' },
  { path: '/listing', label: '4  Batch and listing', side: 'developer' },
  { path: '/search', label: '5  Stock search', side: 'specifier' },
  { path: '/batch/NS-0412', label: '6  Batch page', side: 'specifier' },
  { path: '/accept', label: '7  Accept on delivery', side: 'specifier' },
  { path: '/certificates', label: '8  Certificates', side: 'both' },
];

export const JOURNEY_STEPS = ['Estimate', 'Checklist', 'Grade', 'List', 'Accept'];

export const CHECK_ITEMS = [
  'Splits and checks',
  'Nail and bolt holes',
  'Decay',
  'Insect damage',
  'Paint or coatings',
  'Straightness',
  'Wane',
];

// Member 07 starts as printed on its label: coatings unknown, the rest checked.
export const MEMBER_07_CHECKS = {
  'Splits and checks': 'ok',
  'Nail and bolt holes': 'ok',
  'Decay': 'ok',
  'Insect damage': 'ok',
  'Paint or coatings': 'unknown',
  'Straightness': 'ok',
  'Wane': 'ok',
};

export const DEMAND = { shortlisted: 3, views: 18 };

export const SEARCH_OPTIONS = {
  length: ['≥ 1 800', '2 400', '3 000'],
  section: ['90 × 45', '140 × 45', 'Any'],
};

// Lengths each option admits, in mm. The batch is 2 400 long and 90 × 45.
export const LENGTH_MIN = { '≥ 1 800': 1800, '2 400': 2400, '3 000': 3000 };

export const SCAN_MEMBERS = { '03': 'A', '07': 'B', '15': 'C', '21': 'D' };

export const KNOWN = [
  { what: 'Section', value: '90 × 45', source: 'Measured by grader, 12 Oct 2026' },
  { what: 'Length', value: '2 400', source: 'Measured by grader, 12 Oct 2026' },
  { what: 'Defects', value: 'Recorded', source: 'Grader, 12 Oct 2026' },
];

export const UNKNOWN = [
  { what: 'Species', ask: 'supplier' },
  { what: 'Moisture', ask: 'supplier to test' },
  { what: 'Coatings', ask: 'lab test before indoor use' },
  { what: 'Structural use', ask: 'certifier or engineer' },
];
