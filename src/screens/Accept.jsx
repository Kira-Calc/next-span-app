import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Button, StatusTag, SectionHead } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import ImageSheet from '../components/ImageSheet.jsx';
import { BATCH, MONEY, GRADE_NAMES } from '../demo-data.js';

const GRADES = ['A', 'B', 'C', 'D'];

function Before({ delivered, setDelivered, onAccept, onScan, onReject }) {
  const bump = (g, d) => setDelivered({ ...delivered, [g]: Math.max(0, Math.min(99, delivered[g] + d)) });
  return (
    <div className="stack-lg">
      <h1 className="page-title">Delivery for {BATCH.id}</h1>

      <section aria-labelledby="count-h">
        <SectionHead num="01" id="count-h">Count what arrived</SectionHead>
        <ul className="count-list">
          {GRADES.map((g) => (
            <li key={g} className="count-row">
              <GradeBadge grade={g} size={56} />
              <div className="count-text">
                <span>Listed <strong>{BATCH.grades[g]}</strong></span>
                <span>Delivered <strong className="count-num">{delivered[g]}</strong></span>
              </div>
              <div className="stepper">
                <button className="stepper-btn" aria-label={`Fewer grade ${g} delivered`} onClick={() => bump(g, -1)}>−</button>
                <button className="stepper-btn" aria-label={`More grade ${g} delivered`} onClick={() => bump(g, 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
        <div className="scan-btn">
          <Button variant="secondary" onClick={onScan}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style={{ marginRight: 10 }}><path d="M3 3h7v2H5v5H3zm11 0h7v7h-2V5h-5zM3 14h2v5h5v2H3zm16 0h2v7h-7v-2h5zM7 7h4v4H7zm6 0h4v4h-4zm-6 6h4v4H7zm6 0h4v4h-4z" fill="currentColor" /></svg>
            Scan a label
          </Button>
        </div>
      </section>

      <div>
        <Button variant="specifier" onClick={onAccept}>Accept batch</Button>
        <Button variant="danger" onClick={onReject}>Report a grade mismatch</Button>
      </div>
      <p className="fine">Generic framework. Not an official Brisbane City Council document.</p>
    </div>
  );
}

// Both sides of the deal in one view: acceptance on top, payment below.
function After() {
  return (
    <div className="meet">
      <section className="meet-you" aria-labelledby="you-h">
        <h2 className="meet-who" id="you-h">You</h2>
        <p className="meet-big">Batch accepted</p>
        <p className="meet-sub">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" fill="currentColor" /></svg>
          Carbon certificate issued
        </p>
      </section>

      <div className="meet-line" aria-hidden="false">
        <span>Payment and use meet here.</span>
      </div>

      <section className="meet-dev" aria-labelledby="dev-h">
        <div className="meet-dev-head">
          <h2 className="meet-who" id="dev-h">Developer</h2>
          <span className="tag-swap">
            <span className="tag-old"><StatusTag kind="locked">Locked</StatusTag></span>
            <span className="tag-new"><StatusTag kind="released">Released</StatusTag></span>
          </span>
        </div>
        <div className="meet-fill">
          <div className="meet-fill-bar" aria-hidden="true" />
          <div className="meet-fill-content">
            <span className="meet-money">{MONEY}</span>
            <span className="meet-chip">illustrative</span>
            <p className="meet-paid">Paid to developer</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Accept({ accept, setAccept }) {
  const [sheet, setSheet] = useState(null);
  const { accepted, delivered } = accept;

  return (
    <Screen side="specifier" back="/batch/NS-0412" title="Accept on delivery">
      {accepted ? (
        <div className="stack">
          <After />
          <p className="fine">The council receives the acceptance record that closes the claim.</p>
          <p className="fine">Generic framework. Not an official Brisbane City Council document.</p>
          <Button variant="primary" onClick={() => go('/certificates')}>View certificates</Button>
        </div>
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
        <ImageSheet
          band="specifier"
          src="./artwork/labels/label-B-07.png"
          alt={`Grade B label, ${BATCH.id}, member 07 of 24, ${GRADE_NAMES.B}`}
          title="Scanned: member 07 of 24"
          onClose={() => setSheet(null)}
          footer={<Button variant="primary" onClick={() => setSheet(null)}>Done</Button>}
        />
      )}
      {sheet === 'reject' && (
        <ImageSheet
          band="rejected"
          src="./artwork/rejection-notice/rejection-notice.png"
          alt="Rebate not released. Reason code R-02: buyer reported a grade mismatch on delivery. Batch NS-0412, 24 members. The rebate is still locked. It has not been cancelled."
          title="Grade mismatch reported"
          onClose={() => setSheet(null)}
          footer={<Button variant="primary" onClick={() => setSheet(null)}>Back to delivery</Button>}
        />
      )}
    </Screen>
  );
}
