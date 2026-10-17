import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Button, Label, Money, StatusTag, SectionHead } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import { BATCH, CARBON, KNOWN, UNKNOWN, SCAN_MEMBERS, GRADE_NAMES } from '../demo-data.js';

const GRADES = ['A', 'B', 'C', 'D'];

export default function Batch({ params }) {
  const [toast, setToast] = useState(false);
  const m = params.get('m');
  const scanned = m && SCAN_MEMBERS[m] ? { member: m, grade: SCAN_MEMBERS[m] } : null;

  return (
    <Screen side="specifier" back="/search" title="Batch page">
      <div className="stack-lg">
        {scanned && (
          <div className="scan-banner" role="status">
            <GradeBadge grade={scanned.grade} size={56} />
            <p>You scanned member {scanned.member} of {BATCH.members}, Grade {scanned.grade}</p>
          </div>
        )}

        <header>
          <Label>Batch</Label>
          <h1 className="display batch-id">{BATCH.id}</h1>
          <div className="spec-line">
            <span className="spec-size">{BATCH.section} · {BATCH.length} <small>mm</small></span>
            <span className="spec-qty"><strong>{BATCH.members}</strong> members</span>
          </div>
          <div className="dist-strip" aria-label="Members by grade: A 6, B 10, C 5, D 3">
            {GRADES.map((g) => (
              <div
                key={g}
                className={`dist-seg ${scanned && scanned.grade === g ? 'is-scanned' : ''}`}
                style={{ flexGrow: BATCH.grades[g] }}
              >
                <span className="dist-seg-bar" style={{ background: `var(--ns-grade-${g.toLowerCase()})` }} />
                <span className="dist-seg-label">
                  <GradeBadge grade={g} size={22} decorative />
                  <strong>{BATCH.grades[g]}</strong>
                </span>
              </div>
            ))}
          </div>
        </header>

        <section aria-labelledby="know-h">
          <SectionHead num="01" id="know-h">What we know / What we don't</SectionHead>
          <div className="know-cols">
            <div className="know-col is-known">
              <div className="know-head">Checked</div>
              <ul>
                {KNOWN.map((k) => (
                  <li key={k.what}>
                    <strong>{k.what}</strong>
                    <span className="know-value">{k.value}</span>
                    <span className="know-source">{k.source}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="know-col is-unknown">
              <div className="know-head">Unknown</div>
              <ul>
                {UNKNOWN.map((u) => (
                  <li key={u.what}>
                    <strong>{u.what}</strong>
                    <span className="know-ask">Ask: {u.ask}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-labelledby="price-h">
          <SectionHead num="02" id="price-h">Price breakdown</SectionHead>
          <dl className="price-list">
            <div><dt>Timber</dt><dd><Money size="body" /></dd></div>
            <div><dt>De-nailing</dt><dd>Included</dd></div>
            <div><dt>Machining</dt><dd><StatusTag kind="quote">To quote</StatusTag></dd></div>
            <div><dt>Delivery</dt><dd><StatusTag kind="quote">To quote</StatusTag></dd></div>
            <div><dt>Waste allowance</dt><dd>10% assumed</dd></div>
            <div className="price-total"><dt>Known total</dt><dd><Money size="title" /></dd></div>
          </dl>
          <p className="note-line price-foot">Items marked to quote are not included.</p>
        </section>

        <section aria-labelledby="source-h">
          <SectionHead num="03" id="source-h">Source</SectionHead>
          <p className="head">{BATCH.source}</p>
          <p className="source-dates">Graded {BATCH.graded} · Listed {BATCH.listed}</p>
          <p className="carbon-line"><strong>{CARBON}</strong> kept in use <span className="fine">· illustrative</span></p>
        </section>

        <div>
          <Button variant="secondary" onClick={() => setToast(true)}>Download record</Button>
          {toast && <p className="toast reveal" role="status">Prototype: download not available</p>}
          <Button variant="specifier" onClick={() => go('/accept')}>Specify this batch</Button>
        </div>
        <p className="sr-only">{GRADES.map((g) => `Grade ${g} ${GRADE_NAMES[g]}: ${BATCH.grades[g]}`).join('. ')}</p>
      </div>
    </Screen>
  );
}
