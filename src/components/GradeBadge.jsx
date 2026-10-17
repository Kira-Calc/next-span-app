import { GRADE_NAMES } from '../demo-data.js';
import { BADGE_PATHS } from './badgePaths.js';

// Triple coding: colour + capital letter + number of 45° cuts
// (A none, B top right, C adds bottom right, D adds bottom left).
// Geometry and letterforms come straight from the Figma badge components.
const TEXT = { A: '#FFFFFF', B: '#FFFFFF', C: '#111111', D: '#FFFFFF' };

export default function GradeBadge({ grade, size = 48, decorative = false, muted = false }) {
  const p = BADGE_PATHS[grade];
  const a11y = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': `Grade ${grade}, ${GRADE_NAMES[grade]}` };
  return (
    <svg className="grade-badge" width={size} height={size} viewBox="0 0 113.38 113.38" {...a11y}>
      <path d={p.shape} fill={muted ? 'var(--ns-line)' : `var(--ns-grade-${grade.toLowerCase()})`} />
      <path d={p.glyph} fill={muted ? 'var(--ns-ink)' : TEXT[grade]} />
    </svg>
  );
}
