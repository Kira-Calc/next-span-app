import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Section, Row, LabeledRow, Button, Money, StatusTag, StepBar } from '../components/ui.jsx';
import ImageSheet from '../components/ImageSheet.jsx';
import { JOURNEY_STEPS } from '../demo-data.js';

export default function Checklist({ estimate, lodged, setLodged }) {
  const [zoom, setZoom] = useState(false);

  return (
    <Screen side="developer" back="/estimate" title="Checklist" subtitle="Developer">
      <Section>
        <Row className="pad-lg"><StepBar steps={JOURNEY_STEPS} current={1} /></Row>
      </Section>

      <Section num="01" title="Deconstruction checklist">
        <Row className="doc-row">
          <button className="doc-thumb" onClick={() => setZoom(true)} aria-label="Enlarge checklist page 1">
            <img src="./artwork/checklist/checklist-page1.png" alt="Deconstruction checklist, page 1 of 2" />
            <span className="glass-chip">⤢ Enlarge</span>
          </button>
        </Row>
      </Section>

      <Section num="02" title="Carried over from your estimate">
        <LabeledRow label="House built">{estimate.built}</LabeledRow>
        <LabeledRow label="Floor area">{estimate.area || 'Not given'} m²</LabeledRow>
        <LabeledRow label="Main timber">{estimate.timber}</LabeledRow>
        <LabeledRow label="Method">Full deconstruction</LabeledRow>
        <LabeledRow label="Estimated rebate"><Money size={17} /></LabeledRow>
      </Section>

      <Section num="03" title="Lodge with the council" footer="Generic framework. Not an official Brisbane City Council form.">
        {lodged ? (
          <Row className="pad-lg lodged reveal">
            <StatusTag kind="ready">Ready to lodge</StatusTag>
            <p className="callout strong-text">The council receives the same record again when a buyer accepts the batch.</p>
          </Row>
        ) : (
          <Row>
            <button className="link-btn" onClick={() => setLodged(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 12.5 14 7a3 3 0 0 1 4.2 4.2l-7.4 7.4a5 5 0 0 1-7-7L11 4.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
              Attach to demolition application
            </button>
          </Row>
        )}
      </Section>

      <div className="actions">
        <Button onClick={() => go('/grade')}>Start grading</Button>
      </div>

      {zoom && (
        <ImageSheet src="./artwork/checklist/checklist-page1.png" alt="Deconstruction checklist, page 1 of 2"
          title="Checklist, page 1 of 2" onClose={() => setZoom(false)} />
      )}
    </Screen>
  );
}
