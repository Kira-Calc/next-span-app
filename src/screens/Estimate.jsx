import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Section, Row, Segmented, Button, Money, RebateBar, StatusTag, StepBar } from '../components/ui.jsx';
import { ESTIMATE_OPTIONS, REBATE_TIERS, R1_STEPS } from '../demo-data.js';

function TierRow({ tier }) {
  return (
    <Row className="pad-lg tier">
      {tier.highest && <div className="tier-flag"><StatusTag>Highest</StatusTag></div>}
      <div className="row-flex tier-top">
        <div>
          <div className={`display tier-code ${tier.highest ? 'is-big' : ''}`}>{tier.code}</div>
          <div className="tier-name">{tier.name}</div>
        </div>
        <Money size={tier.highest ? 30 : 22} stacked />
      </div>
      <RebateBar share={tier.share} height={tier.highest ? 14 : 10} />
    </Row>
  );
}

export default function Estimate({ estimate, setEstimate }) {
  const [r1Open, setR1Open] = useState(false);
  const set = (k) => (v) => setEstimate({ ...estimate, [k]: v });

  return (
    <Screen side="developer" back="/" title="Rebate estimate" subtitle="Developer">
      <h2 className="title-2 plain-block page-lead">Before you sign a demolition quote</h2>

      <Section num="01" title="Your house">
        <Row className="pad-lg"><Segmented label="House built" options={ESTIMATE_OPTIONS.built} value={estimate.built} onChange={set('built')} /></Row>
        <Row className="row-flex">
          <label className="row-label" htmlFor="area">Floor area</label>
          <span className="inline-input">
            <input id="area" type="text" inputMode="numeric" pattern="[0-9]*" value={estimate.area}
              onChange={(e) => set('area')(e.target.value.replace(/\D/g, '').slice(0, 4))} />
            <span className="secondary">m²</span>
          </span>
        </Row>
        <Row className="pad-lg"><Segmented label="Main timber" options={ESTIMATE_OPTIONS.timber} value={estimate.timber} onChange={set('timber')} /></Row>
      </Section>

      <Section num="02" title="Estimated rebate" footer="Bar lengths are relative.">
        {REBATE_TIERS.map((t) => <TierRow key={t.code} tier={t} />)}
      </Section>

      <Section>
        <Row className="pad-lg">
          <p className="footnote secondary condition-label">Condition</p>
          <p className="condition-text">Your new build qualifies only if it uses the standard dimension catalogue (R3 Redesign).</p>
        </Row>
      </Section>

      <div className="actions">
        <Button onClick={() => go('/checklist')}>Plan deconstruction</Button>
        <Button variant="glass" aria-expanded={r1Open} aria-controls="r1-panel" onClick={() => setR1Open(!r1Open)}>
          <span aria-hidden="true" className={`chev ${r1Open ? 'up' : ''}`} /> Keep the structure (R1)
        </Button>
      </div>

      {r1Open && (
        <Section id="r1-panel">
          <div className="r1-band" aria-hidden="true" />
          <Row className="pad-lg reveal r1-inner">
            <div className="row-flex">
              <span className="headline">Retention</span>
              <StatusTag kind="rebate">Pending confirmation</StatusTag>
            </div>
            <p className="callout">Retention skips grading, listing and acceptance. The retention rebate is paid once the council confirms the structure was kept.</p>
            <StepBar steps={R1_STEPS} current={0} />
          </Row>
        </Section>
      )}

      <div className="section-foot legal">
        <p>Estimate only. Rates are set each year.</p>
        <p>Generic framework. Not an official Brisbane City Council document.</p>
      </div>
    </Screen>
  );
}
