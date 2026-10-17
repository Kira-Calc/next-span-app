import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Button, Label, Money, StatusTag, StepBar, SectionHead } from '../components/ui.jsx';
import { ESTIMATE_OPTIONS, REBATE_TIERS, R1_STEPS } from '../demo-data.js';

function Segmented({ label, options, value, onChange }) {
  return (
    <fieldset className="fieldset">
      <legend className="sub-label">{label}</legend>
      <div className="seg">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    </fieldset>
  );
}

function TierRow({ tier }) {
  return (
    <li className={tier.highest ? 'tier tier-highest' : 'tier'}>
      {tier.highest && <span className="tier-flag">Highest</span>}
      <div className="tier-top">
        <div className="tier-name">
          <span className="tier-code">{tier.code}</span>
          <span className="tier-label">{tier.name}</span>
        </div>
        <Money size={tier.highest ? 'title' : 'head'} />
      </div>
      <div className="tier-track" aria-hidden="true">
        <div className="tier-bar" style={{ width: `${tier.share * 100}%` }} />
      </div>
    </li>
  );
}

export default function Estimate({ estimate, setEstimate }) {
  const [r1Open, setR1Open] = useState(false);
  const set = (k) => (v) => setEstimate({ ...estimate, [k]: v });

  return (
    <Screen side="developer" back="/" title="Rebate estimate">
      <div className="stack-lg">
        <h1 className="page-title">Before you sign a demolition quote</h1>

        <section className="stack-md" aria-labelledby="house-h">
          <SectionHead num="01" id="house-h">Your house</SectionHead>
          <Segmented label="House built" options={ESTIMATE_OPTIONS.built} value={estimate.built} onChange={set('built')} />
          <div className="fieldset">
            <label className="sub-label" htmlFor="area">Floor area</label>
            <div className="field">
              <input
                id="area"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={estimate.area}
                onChange={(e) => set('area')(e.target.value.replace(/\D/g, '').slice(0, 4))}
              />
              <span className="field-unit">m²</span>
            </div>
          </div>
          <Segmented label="Main timber" options={ESTIMATE_OPTIONS.timber} value={estimate.timber} onChange={set('timber')} />
        </section>

        <section aria-labelledby="result-h">
          <SectionHead num="02" id="result-h">Estimated rebate</SectionHead>
          <ol className="tiers">
            {REBATE_TIERS.map((t) => <TierRow key={t.code} tier={t} />)}
          </ol>
          <p className="fine tiers-note">Bar lengths are relative.</p>
        </section>

        <div className="condition">
          <Label>Condition</Label>
          <p className="condition-text">Your new build qualifies only if it uses the standard dimension catalogue (R3 Redesign).</p>
        </div>

        <div>
          <Button variant="primary" onClick={() => go('/checklist')}>Plan deconstruction</Button>
          <Button variant="secondary" aria-expanded={r1Open} aria-controls="r1-panel" onClick={() => setR1Open(!r1Open)}>
            <span>Keep the structure (R1)</span>
            <span className="btn-toggle" aria-hidden="true">{r1Open ? '−' : '+'}</span>
          </Button>
          {r1Open && (
            <div id="r1-panel" className="r1-panel reveal">
              <div className="r1-band" aria-hidden="true" />
              <div className="r1-inner stack">
                <div className="row between">
                  <span className="head">Retention</span>
                  <StatusTag kind="pending">Pending confirmation</StatusTag>
                </div>
                <p>Retention skips grading, listing and acceptance. The retention rebate is paid once the council confirms the structure was kept.</p>
                <StepBar steps={R1_STEPS} current={0} />
              </div>
            </div>
          )}
        </div>

        <div className="stack-sm">
          <p className="fine">Estimate only. Rates are set each year.</p>
          <p className="fine">Generic framework. Not an official Brisbane City Council document.</p>
        </div>
      </div>
    </Screen>
  );
}
