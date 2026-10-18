import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Section, Row, Button } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import ImageSheet from '../components/ImageSheet.jsx';
import { BATCH, CHECK_ITEMS, GRADE_NAMES } from '../demo-data.js';

const GRADES = ['A', 'B', 'C', 'D'];
const MARKS = [
  { value: 'ok', glyph: '✓', name: 'checked' },
  { value: 'unknown', glyph: '?', name: 'unknown' },
  { value: 'fail', glyph: '✕', name: 'fails' },
];
const nextGrade = (g) => GRADES[Math.min(GRADES.indexOf(g) + 1, 3)];

export default function Grade({ grading, setGrading }) {
  const [printing, setPrinting] = useState(false);
  const { member, grade, checks, applied } = grading;
  const update = (patch) => setGrading({ ...grading, ...patch });

  const anyFail = CHECK_ITEMS.some((c) => checks[c] === 'fail');
  const suggested = nextGrade(grade);
  const checked = CHECK_ITEMS.filter((c) => checks[c] === 'ok');
  const unknown = CHECK_ITEMS.filter((c) => checks[c] === 'unknown' || !checks[c]);

  const toolbar = (
    <div className="toolbar">
      <button className="glass-circle" aria-label="Print label" onClick={() => setPrinting(true)}>
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V3.5h10V8M7 17H4.5V9.5a1.5 1.5 0 0 1 1.5-1.5h12a1.5 1.5 0 0 1 1.5 1.5V17H17M7 13.5h10V20.5H7z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
      </button>
      <button className="glass-circle glass-label" disabled={member >= BATCH.members}
        onClick={() => update({ member: member + 1, checks: {}, applied: false })} aria-label="Next member">
        Next member
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );

  return (
    <Screen side="developer" back="/checklist" title="Grade on site" subtitle={`Batch ${BATCH.id}`} after={toolbar}>
      <div className="plain-block member-head">
        <span>Member</span>
        <span className="display member-num">{String(member).padStart(2, '0')}</span>
        <span>of {BATCH.members}</span>
      </div>

      <Section num="01" title="Grade this piece">
        <Row className="pad-lg">
          <div className="grade-grid" role="radiogroup" aria-label="Grade this piece">
            {GRADES.map((g) => (
              <button key={g} role="radio" aria-checked={grade === g} className={`grade-choice ${grade === g ? 'is-on' : ''}`}
                onClick={() => update({ grade: g, applied: false })}>
                <span className="grade-choice-top">
                  <GradeBadge grade={g} size={64} decorative />
                  <span className={`radio ${grade === g ? 'on' : ''}`} aria-hidden="true">{grade === g ? '✓' : ''}</span>
                </span>
                <span className="headline">Grade {g}</span>
                <span className="footnote secondary">{GRADE_NAMES[g]}</span>
              </button>
            ))}
          </div>
          {grade === 'A' && <p className="rule-line">Structural use requires certifier sign-off.</p>}
        </Row>
      </Section>

      <Section num="02" title="Checks">
        {CHECK_ITEMS.map((item) => (
          <Row key={item} className="row-flex check-row">
            <span className="row-label">{item}</span>
            <span className="check-marks" role="group" aria-label={item}>
              {MARKS.map((m) => (
                <button key={m.value} className={`mark mark-${m.value}`} aria-pressed={checks[item] === m.value}
                  aria-label={`${item}: ${m.name}`}
                  onClick={() => update({ checks: { ...checks, [item]: checks[item] === m.value ? undefined : m.value } })}>
                  {m.glyph}
                </button>
              ))}
            </span>
          </Row>
        ))}
      </Section>

      {anyFail && (
        <Section>
          <Row className="pad-lg downgrade reveal" role="status">
            <p className="downgrade-line"><span className="down-icon" aria-hidden="true">↓</span> One check moves this piece down a grade.</p>
            {!applied && grade !== 'D' && (
              <div className="row-flex downgrade-suggest">
                <GradeBadge grade={suggested} size={44} />
                <div className="downgrade-text">
                  <span className="footnote secondary">Suggested</span>
                  <span className="headline">Grade {suggested}</span>
                </div>
                <button className="btn btn-glass btn-small" onClick={() => update({ grade: suggested, applied: true })}>Use {suggested}</button>
              </div>
            )}
          </Row>
        </Section>
      )}

      <Section num="03" title="Record for this piece">
        <Row className="pad-lg record-cols">
          <div>
            <p className="caps">Checked</p>
            <ul>{checked.length ? checked.map((c) => <li key={c}>{c}</li>) : <li className="secondary">None</li>}</ul>
          </div>
          <div>
            <p className="caps">Unknown</p>
            <ul>{unknown.length ? unknown.map((c) => <li key={c}>{c}</li>) : <li className="secondary">None</li>}</ul>
          </div>
        </Row>
      </Section>

      <div className="actions toolbar-space">
        <Button onClick={() => go('/listing')}>Finish grading</Button>
      </div>

      {printing && (
        <ImageSheet src="./artwork/labels/label-B-07.png" alt="Grade B label for NS-0412, member 07 of 24"
          title="Label preview" onClose={() => setPrinting(false)} />
      )}
    </Screen>
  );
}
