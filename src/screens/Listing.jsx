import { go } from '../router.js';
import { Screen, Section, Row, Button, Money, StatusTag, RebateBar, Stepper } from '../components/ui.jsx';
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
          <StatusTag kind={locked ? 'rebate' : 'neutral'}>{locked ? 'Locked' : 'Calculated'}</StatusTag>
          <Money size={44} />
          <div className={`rebate-meter ${locked ? 'is-locked' : ''}`} aria-hidden="true"><div className="rebate-fill" /></div>
          {locked && <p className="callout strong-text" role="status">Locked at listing. Released when a buyer accepts.</p>}
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
          <Section>
            <Row className="pad-lg row-flex lock-note">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>
              <span className="callout">If no buyer accepts, the rebate stays locked. You can relist or move pieces down a grade.</span>
            </Row>
          </Section>
          <div className="actions" style={{ '--tint': 'var(--ns-grade-a)' }}>
            <Button onClick={() => go('/batch/NS-0412')}>View as a buyer</Button>
          </div>
        </>
      )}
    </Screen>
  );
}
