import { go } from '../router.js';
import { Screen, SectionHead } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import { BATCH, SEARCH_OPTIONS, LENGTH_MIN, GRADE_NAMES } from '../demo-data.js';

const GRADES = ['A', 'B', 'C', 'D'];

function Seg({ label, options, value, onChange }) {
  return (
    <fieldset className="fieldset">
      <legend className="sub-label">{label}</legend>
      <div className="seg">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(value === o ? null : o)}>{o}</button>
        ))}
      </div>
    </fieldset>
  );
}

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
    <Screen side="specifier" back="/" title="Stock search">
      {shortlisted && (
        <div className="shortlist-bar reveal" role="status">
          <span>Project shortlist (1)</span>
          <span className="shortlist-id">{BATCH.id}</span>
        </div>
      )}
      <div className="stack-lg">
        <section className="stack-md" aria-labelledby="filter-h">
          <SectionHead num="01" id="filter-h">What you need</SectionHead>
          <Seg label="Length (mm)" options={SEARCH_OPTIONS.length} value={length} onChange={(v) => set({ length: v })} />
          <Seg label="Section (mm)" options={SEARCH_OPTIONS.section} value={section} onChange={(v) => set({ section: v })} />
          <fieldset className="fieldset">
            <legend className="sub-label">Grade</legend>
            <div className="grade-toggles">
              {GRADES.map((g) => (
                <button
                  key={g}
                  className="grade-toggle"
                  aria-pressed={grades.includes(g)}
                  aria-label={`Grade ${g}, ${GRADE_NAMES[g]}`}
                  onClick={() => toggleGrade(g)}
                >
                  <GradeBadge grade={g} size={48} decorative />
                  <span className="grade-toggle-state" aria-hidden="true">{grades.includes(g) ? 'On' : 'Off'}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </section>

        <section aria-labelledby="results-h">
          <SectionHead num="02" id="results-h">{match ? '1 batch' : 'No batches'} match</SectionHead>
          <div className="stack">
            {match ? (
              <article className="result-card">
                <button className="result-main" onClick={() => go('/batch/NS-0412')} aria-label={`Open batch ${BATCH.id}`}>
                  <span className="result-size">{BATCH.section} · {BATCH.length}</span>
                  <span className="result-qty">{pieces} pieces</span>
                  <span className="result-grades">
                    {shown.map((g) => <GradeBadge key={g} grade={g} size={32} />)}
                    <span className="result-id">{BATCH.id}</span>
                  </span>
                  <span className="result-updated">Updated {BATCH.updated}</span>
                  <span className="result-source">{BATCH.source}</span>
                </button>
                <button
                  className={`shortlist-btn ${shortlisted ? 'is-on' : ''}`}
                  aria-pressed={shortlisted}
                  onClick={() => set({ shortlisted: !shortlisted })}
                >
                  {shortlisted ? '✓ Shortlisted' : '+ Shortlist'}
                </button>
              </article>
            ) : (
              <p className="note-line">Nothing in stock at this size yet. Try a shorter length or Any section.</p>
            )}

            <article className="result-card is-sample" aria-label="Sample listing, not available">
              <div className="result-main">
                <span className="sample-tag">Sample</span>
                <span className="result-size">140 × 45 · 3 000</span>
                <span className="result-grades"><span className="result-id">NS-0398</span></span>
                <span className="result-source">Sample listing. Not available in this prototype.</span>
              </div>
            </article>
          </div>
        </section>
      </div>
    </Screen>
  );
}
