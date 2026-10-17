import { useState } from 'react';
import { go } from '../router.js';
import { Screen, Button, Money, StatusTag, StepBar, SectionHead } from '../components/ui.jsx';
import ImageSheet from '../components/ImageSheet.jsx';
import { JOURNEY_STEPS } from '../demo-data.js';

export default function Checklist({ estimate, lodged, setLodged }) {
  const [zoom, setZoom] = useState(false);

  return (
    <Screen side="developer" back="/estimate" title="Checklist">
      <div className="stack-lg">
        <StepBar steps={JOURNEY_STEPS} current={1} />

        <section aria-label="Deconstruction checklist">
          <h1 className="sr-only">Deconstruction checklist</h1>
          <button className="doc-thumb" onClick={() => setZoom(true)} aria-label="Enlarge checklist page 1">
            <img src="./artwork/checklist/checklist-page1.png" alt="Deconstruction checklist, page 1 of 2" />
            <span className="doc-thumb-cta">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.8l-.3-.3A6.5 6.5 0 1 0 9.5 16a6.5 6.5 0 0 0 4.2-1.6l.3.3v.8l5 5 1.5-1.5-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14zM10 7H9v2H7v1h2v2h1v-2h2V9h-2z" fill="currentColor" /></svg>
              Tap to enlarge
            </span>
          </button>
        </section>

        <section aria-labelledby="carried-h">
          <SectionHead num="01" id="carried-h">Carried over from your estimate</SectionHead>
          <dl className="facts">
            <div><dt>House built</dt><dd>{estimate.built}</dd></div>
            <div><dt>Floor area</dt><dd>{estimate.area || 'Not given'} m²</dd></div>
            <div><dt>Main timber</dt><dd>{estimate.timber}</dd></div>
            <div><dt>Method</dt><dd>Full deconstruction</dd></div>
            <div><dt>Estimated rebate</dt><dd><Money size="head" /></dd></div>
          </dl>
        </section>

        <section aria-labelledby="lodge-h" className="stack">
          <SectionHead num="02" id="lodge-h">Lodge with the council</SectionHead>
          {lodged ? (
            <div className="lodged reveal">
              <StatusTag kind="ready">Ready to lodge</StatusTag>
              <p className="note-line">The council receives the same record again when a buyer accepts the batch.</p>
            </div>
          ) : (
            <Button variant="primary" onClick={() => setLodged(true)}>Attach to demolition application</Button>
          )}
          <Button variant={lodged ? 'primary' : 'secondary'} onClick={() => go('/grade')}>Start grading</Button>
        </section>

        <p className="fine legal">Generic framework. Not an official Brisbane City Council form.</p>
      </div>

      {zoom && (
        <ImageSheet
          src="./artwork/checklist/checklist-page1.png"
          alt="Deconstruction checklist, page 1 of 2"
          title="Checklist, page 1 of 2"
          onClose={() => setZoom(false)}
        />
      )}
    </Screen>
  );
}
