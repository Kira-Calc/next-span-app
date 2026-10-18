import { go } from '../router.js';
import { Screen, Section, Row, Segmented, Button } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import { BATCH, SEARCH_OPTIONS, LENGTH_MIN, GRADE_NAMES } from '../demo-data.js';

const GRADES = ['A', 'B', 'C', 'D'];

export default function Search({ search, setSearch }) {
  const { length, section, grades, shortlisted } = search;
  const set = (patch) => setSearch({ ...search, ...patch });
  const toggleGrade = (g) => set({ grades: grades.includes(g) ? grades.filter((x) => x !== g) : [...grades, g].sort() });

  const lengthOk = !length || 2400 >= LENGTH_MIN[length];
  const sectionOk = !section || section === 'Any' || section === BATCH.section;
  const shown = grades.length ? grades : GRADES;
  const pieces = shown.reduce((n, g) => n + BATCH.grades[g], 0);
  const match = lengthOk && sectionOk;

  return (
    <Screen side="specifier" back="/" title="Stock search" subtitle="Specifier">
      {shortlisted && (
        <div className="shortlist-bar reveal" role="status">
          <span>☆ Project shortlist (1)</span>
          <span className="secondary">{BATCH.id}</span>
        </div>
      )}

      <Section num="01" title="What you need">
        <Row className="pad-lg"><Segmented label="Length (mm)" options={SEARCH_OPTIONS.length} value={length} allowAll onChange={(v) => set({ length: v })} /></Row>
        <Row className="pad-lg"><Segmented label="Section (mm)" options={SEARCH_OPTIONS.section} value={section} allowAll onChange={(v) => set({ section: v })} /></Row>
        <Row className="pad-lg">
          <span className="sub-label">Grade</span>
          <div className="grade-toggles">
            {GRADES.map((g) => {
              const on = grades.includes(g);
              return (
                <button key={g} className={`grade-toggle ${on ? 'on' : ''}`} aria-pressed={on} aria-label={`Grade ${g}, ${GRADE_NAMES[g]}`} onClick={() => toggleGrade(g)}>
                  <GradeBadge grade={g} size={40} decorative />
                  <span className={`radio ${on ? 'on blue' : ''}`} aria-hidden="true">{on ? '✓' : ''}</span>
                </button>
              );
            })}
          </div>
        </Row>
      </Section>

      <Section num="02" title={match ? '1 batch matches' : 'No batches match'}>
        {match ? (
          <Row className="pad-lg result-card">
            <p className="display result-size">{BATCH.section} · {BATCH.length}</p>
            <p className="result-qty">{pieces} pieces</p>
            <div className="result-grades">
              {shown.map((g) => <GradeBadge key={g} grade={g} size={28} />)}
              <span className="headline">{BATCH.id}</span>
            </div>
            <p className="strong-text">Updated {BATCH.updated}</p>
            <p className="footnote secondary">{BATCH.source}</p>
            <div className="btn-row">
              <Button variant="glass" aria-pressed={shortlisted} onClick={() => set({ shortlisted: !shortlisted })}>
                {shortlisted ? '✓ Shortlisted' : '+ Shortlist'}
              </Button>
              <Button onClick={() => go('/batch/NS-0412')}>Open batch</Button>
            </div>
          </Row>
        ) : (
          <Row className="pad-lg empty">
            <p className="headline">Nothing at this size yet</p>
            <p className="footnote secondary">Try a shorter length or Any section.</p>
          </Row>
        )}
        <Row className="pad-lg sample" aria-label="Sample listing NS-0398, not available">
          <span className="sample-tag">Sample</span>
          <p className="display sample-size">140 × 45 · 3 000</p>
          <p className="headline">NS-0398</p>
          <p className="footnote">Sample listing. Not available in this prototype.</p>
        </Row>
      </Section>
    </Screen>
  );
}
