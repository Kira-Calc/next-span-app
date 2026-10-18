import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Section, Row, LabeledRow, Button, Money, StatusTag, Alert } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import { BATCH, CARBON, KNOWN, UNKNOWN, SCAN_MEMBERS } from '../demo-data.js';

const GRADES = ['A', 'B', 'C', 'D'];
const DOWNLOAD = <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20zM14 3.5V8h4M12.5 10.5v6m-3-3 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg>;

export default function Batch({ params }) {
  const [alert, setAlert] = useState(false);
  const m = params.get('m');
  const scanned = m && SCAN_MEMBERS[m] ? { member: m, grade: SCAN_MEMBERS[m] } : null;

  return (
    <Screen side="specifier" back="/search" title="Batch page" subtitle="Specifier"
      extra={<button className="glass-circle" aria-label="Download record" onClick={() => setAlert(true)}>{DOWNLOAD}</button>}>
      {scanned && (
        <div className="scan-banner" role="status" style={{ background: `color-mix(in srgb, var(--ns-grade-${scanned.grade.toLowerCase()}) 12%, white)` }}>
          <GradeBadge grade={scanned.grade} size={48} />
          <p>You scanned member {scanned.member} of {BATCH.members}, Grade {scanned.grade}</p>
        </div>
      )}

      <div className="plain-block hero">
        <p className="display batch-id">{BATCH.id}</p>
        <div className="spec-line">
          <span><strong>{BATCH.section} · {BATCH.length}</strong> <small className="secondary">mm</small></span>
          <span><strong>{BATCH.members}</strong> <small className="secondary">members</small></span>
        </div>
        <div className="dist-strip" aria-label="Members by grade: A 6, B 10, C 5, D 3">
          {GRADES.map((g) => (
            <div key={g} className={`dist-seg ${scanned && scanned.grade === g ? 'is-scanned' : ''}`} style={{ flexGrow: BATCH.grades[g] }}>
              <span className="dist-seg-bar" style={{ background: `var(--ns-grade-${g.toLowerCase()})` }} />
              <span className="dist-seg-label"><GradeBadge grade={g} size={18} decorative /><strong>{BATCH.grades[g]}</strong></span>
            </div>
          ))}
        </div>
      </div>

      <Section num="01" title="What we know">
        {KNOWN.map((k) => <LabeledRow key={k.what} label={k.what} sub={k.source}>{k.value}</LabeledRow>)}
      </Section>

      <Section num="02" title="What we don't">
        {UNKNOWN.map((u) => (
          <Row key={u.what} className="row-flex">
            <span className="row-label">{u.what}</span>
            <span className="ask">Ask: {u.ask}</span>
          </Row>
        ))}
      </Section>

      <Section num="03" title="Price breakdown" footer="Items marked to quote are not included." footerStrong>
        <LabeledRow label="Timber"><Money size={17} /></LabeledRow>
        <LabeledRow label="De-nailing">Included</LabeledRow>
        <LabeledRow label="Machining"><StatusTag kind="quote">To quote</StatusTag></LabeledRow>
        <LabeledRow label="Delivery"><StatusTag kind="quote">To quote</StatusTag></LabeledRow>
        <LabeledRow label="Waste allowance">10% assumed</LabeledRow>
        <Row className="row-flex">
          <span className="headline">Known total</span>
          <Money size={24} />
        </Row>
      </Section>

      <Section num="04" title="Source">
        <Row className="pad-lg">
          <p className="headline">{BATCH.source}</p>
          <p className="footnote secondary">Graded {BATCH.graded} · Listed {BATCH.listed}</p>
          <p className="carbon-line"><strong>{CARBON}</strong> kept in use <small className="secondary">illustrative</small></p>
        </Row>
      </Section>

      <div className="actions">
        <Button onClick={() => go('/accept')}>Specify this batch</Button>
      </div>

      {alert && <Alert text="Prototype: download not available" onClose={() => setAlert(false)} />}
    </Screen>
  );
}
