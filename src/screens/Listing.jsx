import { go } from '../router.js';
import { Screen, Button, Label, Money, StatusTag, SectionHead } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import { BATCH, PRICE, DEMAND, GRADE_NAMES } from '../demo-data.js';

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
    <Screen side="developer" back="/grade" title="Batch and listing">
      <div className="stack-lg">
        <header>
          <Label>Batch</Label>
          <h1 className="display batch-id">{BATCH.id}</h1>
          <p className="batch-members"><strong>{BATCH.members}</strong> members</p>
        </header>

        <section aria-labelledby="dist-h">
          <SectionHead num="01" id="dist-h">Members by grade</SectionHead>
          <ul className="dist">
            {Object.entries(BATCH.grades).map(([g, n]) => (
              <li key={g} className="dist-row">
                <GradeBadge grade={g} size={44} />
                <span className="dist-count">{n}</span>
                <span className="dist-track" aria-hidden="true">
                  <span className="dist-bar" style={{ width: `${(n / MAX) * 100}%`, background: `var(--ns-grade-${g.toLowerCase()})` }} />
                </span>
                <span className="sr-only">{GRADE_NAMES[g]}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="price-h">
          <SectionHead num="02" id="price-h">Price</SectionHead>
          <div className="price-row">
            <div>
              <span className="price-value">{PRICE}</span> <span className="fine">illustrative</span>
              <p className="price-note">{priceNote(priceStep)}</p>
            </div>
            <div className="stepper">
              <button className="stepper-btn" aria-label="Lower price" disabled={locked} onClick={() => set({ priceStep: priceStep - 1 })}>−</button>
              <button className="stepper-btn" aria-label="Raise price" disabled={locked} onClick={() => set({ priceStep: priceStep + 1 })}>+</button>
            </div>
          </div>
        </section>

        <section aria-labelledby="rebate-h">
          <SectionHead num="03" id="rebate-h">Rebate</SectionHead>
          <div className="rebate-head">
            <StatusTag kind={locked ? 'locked' : 'calculated'}>{locked ? 'Locked' : 'Calculated'}</StatusTag>
            <Money size="display" />
          </div>
          <div className={`rebate-meter ${locked ? 'is-locked' : ''}`} aria-hidden="true">
            <div className="rebate-fill" />
          </div>
          {locked ? (
            <p className="note-line rebate-line" role="status">Locked at listing. Released when a buyer accepts.</p>
          ) : (
            <div className="list-btn"><Button variant="primary" onClick={() => set({ locked: true })}>List batch</Button></div>
          )}
        </section>

        {locked && (
          <section className="stack reveal" aria-labelledby="demand-h">
            <SectionHead num="04" id="demand-h">After listing</SectionHead>
            <div className="demand">
              <div><span className="demand-num">{DEMAND.shortlisted}</span><span>Shortlisted by {DEMAND.shortlisted} projects</span></div>
              <div><span className="demand-num">{DEMAND.views}</span><span>Viewed {DEMAND.views} times</span></div>
            </div>
            <p className="fine">Demand figures are illustrative.</p>
            <div className="condition">
              <p className="condition-text">If no buyer accepts, the rebate stays locked. You can relist or move pieces down a grade.</p>
            </div>
            <Button variant="specifier" onClick={() => go('/batch/NS-0412')}>View as a buyer</Button>
          </section>
        )}
      </div>
    </Screen>
  );
}
