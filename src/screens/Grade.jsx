import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Button, Label, SectionHead } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import ImageSheet from '../components/ImageSheet.jsx';
import { BATCH, CHECK_ITEMS, GRADE_NAMES } from '../demo-data.js';

const GRADES = ['A', 'B', 'C', 'D'];
const MARKS = [
  { value: 'ok', glyph: '✓', name: 'checked' },
  { value: 'unknown', glyph: '?', name: 'unknown' },
  { value: 'fail', glyph: '✕', name: 'fails' },
];

function nextGrade(g) {
  return GRADES[Math.min(GRADES.indexOf(g) + 1, GRADES.length - 1)];
}

export default function Grade({ grading, setGrading }) {
  const [printing, setPrinting] = useState(false);
  const { member, grade, checks, applied } = grading;
  const update = (patch) => setGrading({ ...grading, ...patch });

  const anyFail = CHECK_ITEMS.some((c) => checks[c] === 'fail');
  const suggested = nextGrade(grade);
  const showSuggest = anyFail && !applied && grade !== 'D';
  const checked = CHECK_ITEMS.filter((c) => checks[c] === 'ok');
  const unknown = CHECK_ITEMS.filter((c) => checks[c] === 'unknown' || !checks[c]);
  const memberStr = String(member).padStart(2, '0');

  return (
    <Screen side="developer" back="/checklist" title="Grade on site">
      <div className="stack-lg">
        <header className="member-head">
          <Label>Batch {BATCH.id}</Label>
          <h1 className="member-title">
            <span className="member-word">Member</span>
            <span className="display">{memberStr}</span>
            <span className="member-of">of {BATCH.members}</span>
          </h1>
        </header>

        <section aria-labelledby="grade-h">
          <SectionHead num="01" id="grade-h">Grade this piece</SectionHead>
          <div className="grade-grid" role="radiogroup" aria-labelledby="grade-h">
            {GRADES.map((g) => (
              <button
                key={g}
                role="radio"
                aria-checked={grade === g}
                className={`grade-choice ${grade === g ? 'is-on' : ''}`}
                onClick={() => update({ grade: g, applied: false })}
              >
                <GradeBadge grade={g} size={104} decorative />
                <span className="grade-choice-name">
                  <span className="grade-choice-letter">Grade {g}</span>
                  <span>{GRADE_NAMES[g]}</span>
                </span>
                {grade === g && <span className="grade-choice-mark" aria-hidden="true">Selected</span>}
              </button>
            ))}
          </div>
          {grade === 'A' && <p className="rule-line">Structural use requires certifier sign-off.</p>}
        </section>

        <section aria-labelledby="checks-h">
          <SectionHead num="02" id="checks-h">Checks</SectionHead>
          <ul className="checks">
            {CHECK_ITEMS.map((item) => (
              <li key={item} className="check-row">
                <span className="check-name">{item}</span>
                <div className="check-marks" role="group" aria-label={item}>
                  {MARKS.map((m) => (
                    <button
                      key={m.value}
                      className={`mark mark-${m.value}`}
                      aria-pressed={checks[item] === m.value}
                      aria-label={`${item}: ${m.name}`}
                      onClick={() => update({ checks: { ...checks, [item]: checks[item] === m.value ? undefined : m.value } })}
                    >
                      {m.glyph}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          {anyFail && (
            <div className="downgrade reveal" role="status">
              <p className="note-line">One check moves this piece down a grade.</p>
              {showSuggest && (
                <div className="downgrade-suggest">
                  <GradeBadge grade={suggested} size={56} />
                  <div className="downgrade-text">
                    <Label>Suggested</Label>
                    <span className="head">Grade {suggested}</span>
                  </div>
                  <button className="btn btn-secondary downgrade-btn" onClick={() => update({ grade: suggested, applied: true })}>
                    Use {suggested}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="record-cols" aria-label="Record for this piece">
          <div>
            <Label>Checked</Label>
            <ul className="record-list">
              {checked.length ? checked.map((c) => <li key={c}>{c}</li>) : <li className="stone">None yet</li>}
            </ul>
          </div>
          <div>
            <Label>Unknown</Label>
            <ul className="record-list">
              {unknown.length ? unknown.map((c) => <li key={c}>{c}</li>) : <li className="stone">None</li>}
            </ul>
          </div>
        </section>

        <div>
          <Button variant="secondary" onClick={() => setPrinting(true)}>Print label</Button>
          <Button
            variant="secondary"
            disabled={member >= BATCH.members}
            onClick={() => update({ member: member + 1, checks: {}, applied: false })}
          >
            Next member
          </Button>
          <Button variant="primary" onClick={() => go('/listing')}>Finish grading</Button>
        </div>
      </div>

      {printing && (
        <ImageSheet
          src="./artwork/labels/label-B-07.png"
          alt="Grade B label for NS-0412, member 07 of 24"
          title="Label preview"
          onClose={() => setPrinting(false)}
          footer={<Button variant="primary" onClick={() => setPrinting(false)}>Done</Button>}
        />
      )}
    </Screen>
  );
}
