import { useState } from 'react';
import { go } from '../router.js';
import { SCREENS, MONEY } from '../demo-data.js';

const BAND = { developer: 'var(--ns-ink)', specifier: 'var(--ns-grade-a)', rebate: 'var(--ns-rebate)', rejected: 'var(--ns-status-rejected)' };

export function TopBand({ side }) {
  return <div className="top-band" style={{ background: BAND[side] || BAND.developer }} aria-hidden="true" />;
}

// Left: back arrow to the previous screen in the journey. Right: jump menu for demos.
export function AppHeader({ back, title, side = 'developer' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="app-header" style={{ background: BAND[side] || BAND.developer }}>
        {back ? (
          <button className="icon-btn" aria-label="Back" onClick={() => go(back)}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20z" fill="currentColor" /></svg>
          </button>
        ) : <span className="icon-btn-spacer" />}
        <span className="app-header-title">{title}</span>
        <button className="icon-btn" aria-label="Open screen menu" aria-expanded={open} onClick={() => setOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v2.5H3zM3 10.75h18v2.5H3zM3 16.5h18V19H3z" fill="currentColor" /></svg>
        </button>
      </header>
      {open && (
        <Sheet band="developer" title="Go to screen" onClose={() => setOpen(false)} closeLabel="Close menu">
          <nav className="menu-list">
            {SCREENS.map((s) => (
              <button key={s.path} className="menu-item" onClick={() => { setOpen(false); go(s.path); }}>
                {s.label}
              </button>
            ))}
          </nav>
        </Sheet>
      )}
    </>
  );
}

// Full-screen overlay, square corners, coloured band on top.
export function Sheet({ band = 'developer', title, onClose, closeLabel = 'Close', footer, children }) {
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
      <TopBand side={band} />
      <div className="sheet-head">
        <span className="sheet-title">{title}</span>
        <button className="icon-btn" aria-label={closeLabel} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.4 17.6 5 12 10.6 6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12z" fill="currentColor" /></svg>
        </button>
      </div>
      <div className="sheet-body">{children}</div>
      {footer && <div className="sheet-foot">{footer}</div>}
    </div>
  );
}

export function Button({ variant = 'primary', children, ...rest }) {
  return <button className={`btn btn-${variant}`} {...rest}>{children}</button>;
}

export function Card({ strong, children, className = '', ...rest }) {
  return <div className={`card ${strong ? 'card-strong' : ''} ${className}`} {...rest}>{children}</div>;
}

// Square tag, uppercase. Ink text on white keeps AA at small size; the
// coloured square carries the status colour.
const TAG_COLOR = {
  neutral: 'var(--ns-ink)',
  calculated: 'var(--ns-ink)',
  locked: 'var(--ns-rebate)',
  released: 'var(--ns-rebate)',
  pending: 'var(--ns-rebate)',
  ready: 'var(--ns-grade-b)',
  quote: 'var(--ns-stone)',
  rejected: 'var(--ns-status-rejected)',
};
export function StatusTag({ kind = 'neutral', children }) {
  return (
    <span className="tag">
      <span className="tag-dot" style={{ background: TAG_COLOR[kind] }} aria-hidden="true" />
      {children}
    </span>
  );
}

export function Money({ size = 'title', value = MONEY }) {
  return (
    <span className={`money money-${size}`}>
      <span className="money-value">{value}</span>
      <span className="fine">illustrative</span>
    </span>
  );
}

export function Label({ children, as: Tag = 'div', ...rest }) {
  return <Tag className="ns-label label" {...rest}>{children}</Tag>;
}

export function StepBar({ steps, current = 0 }) {
  return (
    <ol className="stepbar" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
      {steps.map((s, i) => (
        <li key={s} className={i < current ? 'done' : i === current ? 'current' : ''} aria-current={i === current ? 'step' : undefined}>
          <span className="stepbar-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="stepbar-text">{s}</span>
        </li>
      ))}
    </ol>
  );
}

export function SectionHead({ num, children, id }) {
  return (
    <div className="section-head" id={id}>
      <span className="section-num" aria-hidden="true">{num}</span>
      <span className="section-title">{children}</span>
    </div>
  );
}

export function PrototypeFooter() {
  return <footer className="proto-footer fine">Prototype. All amounts and data are illustrative.</footer>;
}

// One screen = band + header + scrollable body + fixed prototype line.
export function Screen({ side = 'developer', back, title, children }) {
  return (
    <div className="screen">
      <TopBand side={side} />
      <AppHeader back={back} title={title} side={side} />
      <main className="screen-body">{children}</main>
      <PrototypeFooter />
    </div>
  );
}
