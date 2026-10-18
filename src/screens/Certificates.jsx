import { useLayoutEffect, useRef, useState } from 'react';
import { Screen, Sheet, Segmented } from '../components/ui.jsx';
import GradeBadge from '../components/GradeBadge.jsx';
import { BATCH, CARBON } from '../demo-data.js';

const MAX = Math.max(...Object.values(BATCH.grades));

// Drawn to match the rebate certificate: A4 landscape, colour panel left, record right.
// Built at 842 × 595 and scaled to fit, so the proportions match the printed PNG.
function CarbonCertificate() {
  return (
    <div className="cert" role="img" aria-label={`Carbon certificate. Embodied carbon kept in use ${CARBON}, illustrative. Batch ${BATCH.id}. Issued to developer and buyer.`}>
      <div className="cert-panel">
        <img src="./brand/logo/next-span-tri-reversed.svg" alt="" width="30" height="30" />
        <p className="cert-title">Carbon<br />certificate</p>
        <p className="cert-big">XXX</p>
        <p className="cert-unit">kg CO2e</p>
        <p className="cert-ill">Illustrative amount</p>
      </div>
      <div className="cert-body">
        <p className="cert-k">Batch</p>
        <p className="cert-id">{BATCH.id}</p>
        <div className="cert-two">
          <div><p className="cert-k">Accepted on delivery</p><p className="cert-v">Date of acceptance (illustrative)</p></div>
          <div><p className="cert-k">Buyer</p><p className="cert-v">{BATCH.buyer}</p></div>
        </div>
        <p className="cert-k">Members by grade</p>
        <div className="cert-bars">
          {Object.entries(BATCH.grades).map(([g, n]) => (
            <div key={g} className="cert-bar-row">
              <GradeBadge grade={g} size={24} decorative />
              <span style={{ width: `${(n / MAX) * 70}%`, background: `var(--ns-grade-${g.toLowerCase()})` }} />
            </div>
          ))}
        </div>
        <p className="cert-k">Embodied carbon kept in use</p>
        <p className="cert-carbon">{CARBON} <span>(illustrative)</span></p>
        <div className="cert-rule" />
        <p className="cert-foot-strong">Issued to: Developer and buyer</p>
        <p className="cert-legal">Generic framework. Not an official government certificate.</p>
      </div>
    </div>
  );
}

// Scales the 842 px certificate to whatever width the card has.
function Scaled({ children }) {
  const box = useRef(null);
  const [k, setK] = useState(0.42);
  useLayoutEffect(() => {
    const el = box.current;
    const fit = () => setK(el.clientWidth / 842);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="cert-scale" ref={box}>
      <div className="cert-scale-inner" style={{ transform: `scale(${k})` }}>{children}</div>
    </div>
  );
}

const NAMES = ['Rebate', 'Carbon'];

export default function Certificates() {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null);
  const track = useRef(null);

  const show = (i) => {
    setActive(i);
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };
  const onScroll = () => {
    const el = track.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <Screen side="developer" back="/accept" title="Certificates" subtitle="Developer and buyer">
      <div className="cert-seg">
        <Segmented label="Certificate" options={NAMES} value={NAMES[active]} onChange={(v) => show(NAMES.indexOf(v))} />
      </div>

      <div className="cert-track" ref={track} onScroll={onScroll}>
        <div className="cert-slide">
          <button className="cert-thumb" onClick={() => setZoom('rebate')} aria-label="Enlarge rebate certificate">
            <img src="./artwork/certificate/rebate-certificate.png" alt={`Rebate certificate for ${BATCH.id}, $ XXX illustrative`} />
            <span className="glass-chip round">⤢</span>
          </button>
          <p className="headline cert-name">Rebate certificate</p>
          <p className="secondary">Paid to the developer when the buyer accepts.</p>
        </div>
        <div className="cert-slide">
          <button className="cert-thumb" onClick={() => setZoom('carbon')} aria-label="Enlarge carbon certificate">
            <Scaled><CarbonCertificate /></Scaled>
            <span className="glass-chip round">⤢</span>
          </button>
          <p className="headline cert-name">Carbon certificate</p>
          <p className="secondary">Embodied carbon kept in use {CARBON}, illustrative.</p>
        </div>
      </div>
      <div className="page-dots" aria-hidden="true">
        {NAMES.map((n, i) => <span key={n} className={i === active ? 'on' : ''} />)}
      </div>

      <p className="section-foot legal">Generic framework. Not an official government certificate.</p>

      {zoom && (
        <Sheet band={zoom === 'rebate' ? 'var(--ns-rebate)' : 'var(--ns-ink)'} title={zoom === 'rebate' ? 'Rebate certificate' : 'Carbon certificate'} onClose={() => setZoom(null)}>
          <div className="cert-zoom">
            {zoom === 'rebate'
              ? <img src="./artwork/certificate/rebate-certificate.png" alt={`Rebate certificate for ${BATCH.id}`} />
              : <div className="cert-zoom-carbon"><CarbonCertificate /></div>}
          </div>
          <p className="footnote secondary">Scroll sideways to read the whole certificate.</p>
        </Sheet>
      )}
    </Screen>
  );
}
