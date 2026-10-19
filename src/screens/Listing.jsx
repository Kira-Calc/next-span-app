import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Section, Row, Button, Money, StatusTag, RebateBar, Stepper, Alert } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import { BATCH, PRICE, DEMAND } from '../demo-data.js';

const MAX = Math.max(...Object.values(BATCH.grades));

function priceNote(step) {
  if (step === 0) return 'Suggested';
  const n = Math.abs(step);
  return `${n} step${n > 1 ? 's' : ''} ${step > 0 ? 'above' : 'below'} suggested`;
}

export default function Listing({ listing, setListing }) {
  const { locked, priceStep } = listing;
  const set = (patch) => setListing({ ...listing, ...patch });
  const [notAvailable, setNotAvailable] = useState(false);

  return (
    <Screen side="developer" back="/grade" title="Batch and listing" subtitle="Developer">
      <div className="plain-block hero">
        <p className="display batch-id">{BATCH.id}</p>
        <p className="hero-sub">{BATCH.members} members</p>
      </div>

      <Section num="01" title="Members by grade">
        {Object.entries(BATCH.grades).map(([g, n]) => (
          <Row key={g} className="dist-row" aria-label={`Grade ${g}, ${n} members`}>
            <GradeBadge grade={g} size={36} />
            <span className="dist-count">{n}</span>
            <RebateBar share={n / MAX} height={18} color={`var(--ns-grade-${g.toLowerCase()})`} />
          </Row>
        ))}
      </Section>

      <Section num="02" title="Price">
        <Row className="row-flex pad-lg">
          <div>
            <Money size={20} value={PRICE} />
            <p className="footnote secondary strong-text">{priceNote(priceStep)}</p>
          </div>
          <Stepper label="price" disabled={locked} onDec={() => set({ priceStep: priceStep - 1 })} onInc={() => set({ priceStep: priceStep + 1 })} />
        </Row>
      </Section>

      <Section num="03" title="Rebate">
        <Row className="pad-lg rebate-row">
          <div className="tag-pair">
            <StatusTag kind={locked ? 'rebate' : 'neutral'}>{locked ? 'Locked' : 'Calculated'}</StatusTag>
            {locked && <span className="tag tag-strong">Not paid yet</span>}
          </div>
          <Money size={44} />
          <div className={`rebate-meter ${locked ? 'is-locked' : ''}`} aria-hidden="true"><div className="rebate-fill" /></div>
          {locked && (
            <>
              <ol className="rules" role="status">
                <li><span className="rule-num" aria-hidden="true">1</span>Released only after a buyer accepts the batch.</li>
                <li><span className="rule-num" aria-hidden="true">2</span>No expiry while the batch stays listed.</li>
                <li><span className="rule-num" aria-hidden="true">3</span>If it does not sell, relist it or move pieces down a grade.</li>
              </ol>
              <div className="btn-row rule-actions">
                <Button variant="glass" onClick={() => setNotAvailable(true)}>Relist</Button>
                <Button variant="glass" onClick={() => setNotAvailable(true)}>Move pieces down a grade</Button>
              </div>
            </>
          )}
        </Row>
      </Section>

      {!locked && (
        <div className="actions"><Button onClick={() => set({ locked: true })}>List batch</Button></div>
      )}

      {locked && (
        <>
          <Section num="04" title="After listing" card={false} footer="Demand figures are illustrative.">
            <div className="demand">
              <div><span className="display">{DEMAND.shortlisted}</span><span>Shortlisted by {DEMAND.shortlisted} projects</span></div>
              <div><span className="display">{DEMAND.views}</span><span>Viewed {DEMAND.views} times</span></div>
            </div>
          </Section>
          <div className="actions" style={{ '--tint': 'var(--ns-grade-a)' }}>
            <Button onClick={() => go('/batch/NS-0412')}>View as a buyer</Button>
          </div>
        </>
      )}
      {notAvailable && <Alert text="Prototype: not available" onClose={() => setNotAvailable(false)} />}
    </Screen>
  );
}
