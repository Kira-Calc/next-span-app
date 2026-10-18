import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Section, Row, Button, Stepper } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import ImageSheet from '../components/ImageSheet.jsx';
import { BATCH, MONEY, GRADE_NAMES } from '../demo-data.js';

const GRADES = ['A', 'B', 'C', 'D'];

function Before({ delivered, setDelivered, onAccept, onScan, onReject }) {
  const bump = (g, d) => setDelivered({ ...delivered, [g]: Math.max(0, Math.min(99, delivered[g] + d)) });
  return (
    <>
      <Section num="01" title="Count what arrived">
        {GRADES.map((g) => (
          <Row key={g} className="row-flex count-row" aria-label={`Grade ${g}, listed ${BATCH.grades[g]}, delivered ${delivered[g]}`}>
            <GradeBadge grade={g} size={44} />
            <div className="count-text">
              <span className="footnote secondary">Listed {BATCH.grades[g]}</span>
              <span className="headline">Delivered {delivered[g]}</span>
            </div>
            <Stepper label={`grade ${g} delivered`} onDec={() => bump(g, -1)} onInc={() => bump(g, 1)} />
          </Row>
        ))}
        <Row>
          <button className="link-btn" style={{ color: 'var(--ns-grade-a)' }} onClick={onScan}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8V4.5A1.5 1.5 0 0 1 4.5 3H8m8 0h3.5A1.5 1.5 0 0 1 21 4.5V8m0 8v3.5a1.5 1.5 0 0 1-1.5 1.5H16m-8 0H4.5A1.5 1.5 0 0 1 3 19.5V16M7.5 7.5h3v3h-3zm6 0h3v3h-3zm-6 6h3v3h-3zm6 0h3v3h-3z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            Scan a label
          </button>
        </Row>
      </Section>

      <div className="actions">
        <Button onClick={onAccept}>Accept batch</Button>
        <Button variant="glass" className="btn-danger" onClick={onReject}>Report a grade mismatch</Button>
      </div>
      <p className="section-foot legal">Generic framework. Not an official Brisbane City Council document.</p>
    </>
  );
}

// Both sides on one screen: the buyer's acceptance on top, the developer's payment below.
function After() {
  return (
    <div className="meet">
      <section className="meet-card meet-you" aria-label="You">
        <p className="caps">You</p>
        <p className="meet-big">Batch accepted</p>
        <p className="meet-sub"><span aria-hidden="true">✓</span> Carbon certificate issued</p>
      </section>

      <div className="meet-line"><span>Payment and use meet here.</span></div>

      <section className="meet-card meet-dev" aria-label="Developer">
        <div className="meet-fill" aria-hidden="true" />
        <div className="meet-dev-content">
          <div className="row-flex">
            <p className="caps">Developer</p>
            <span className="tag-swap" aria-label="Status: released">
              <span className="white-tag tag-old">LOCKED</span>
              <span className="white-tag tag-new">RELEASED</span>
            </span>
          </div>
          <p className="meet-money"><span className="display">{MONEY}</span><span className="white-chip">illustrative</span></p>
          <p className="meet-sub"><span aria-hidden="true">↓</span> Paid to developer</p>
        </div>
      </section>

      <p className="footnote secondary meet-note">The council receives the acceptance record that closes the claim.</p>
      <p className="footnote secondary">Generic framework. Not an official Brisbane City Council document.</p>
    </div>
  );
}

export default function Accept({ accept, setAccept }) {
  const [sheet, setSheet] = useState(null);
  const { accepted, delivered } = accept;

  return (
    <Screen side="specifier" back="/batch/NS-0412" title={accepted ? 'Accepted' : `Delivery for ${BATCH.id}`} subtitle="Specifier">
      {accepted ? (
        <>
          <After />
          <div className="actions" style={{ '--tint': 'var(--ns-ink)' }}>
            <Button onClick={() => go('/certificates')}>View certificates</Button>
          </div>
        </>
      ) : (
        <Before
          delivered={delivered}
          setDelivered={(d) => setAccept({ ...accept, delivered: d })}
          onAccept={() => setAccept({ ...accept, accepted: true })}
          onScan={() => setSheet('scan')}
          onReject={() => setSheet('reject')}
        />
      )}

      {sheet === 'scan' && (
        <ImageSheet band="var(--ns-grade-a)" src="./artwork/labels/label-B-07.png"
          alt={`Grade B label, ${BATCH.id}, member 07 of 24, ${GRADE_NAMES.B}`}
          title="Scanned: member 07 of 24" onClose={() => setSheet(null)} />
      )}
      {sheet === 'reject' && (
        <ImageSheet band="var(--ns-status-rejected)" src="./artwork/rejection-notice/rejection-notice.png"
          alt="Rebate not released. Reason code R-02: buyer reported a grade mismatch on delivery. Batch NS-0412, 24 members. The rebate is still locked. It has not been cancelled."
          title="Grade mismatch reported" footerLabel="Back to delivery" onClose={() => setSheet(null)} />
      )}
    </Screen>
  );
}
