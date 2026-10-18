import { useState } from 'react';
import { go } from '../router.js';
import { MONEY } from '../demo-data.js';

const TINT = { developer: 'var(--ns-ink)', specifier: 'var(--ns-grade-a)' };

const Icon = {
  back: <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 4.5 8 12l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  grid: <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></g></svg>,
  close: <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>,
};
export { Icon };

const SCREEN_MENU = [
  ['Developer', [['/estimate', '1  Rebate estimate'], ['/checklist', '2  Checklist'], ['/grade', '3  Grade on site'], ['/listing', '4  Batch and listing']]],
  ['Specifier', [['/search', '5  Stock search'], ['/batch/NS-0412', '6  Batch page'], ['/accept', '7  Accept on delivery'], ['/certificates', '8  Certificates']]],
];

function ScreenMenu() {
  const [open, setOpen] = useState(false);
  const pick = (p) => { setOpen(false); go(p); };
  return (
    <>
      <button className="glass-circle" aria-label="Go to screen" aria-expanded={open} onClick={() => setOpen(!open)}>{Icon.grid}</button>
      {open && (
        <>
          <div className="menu-scrim" onClick={() => setOpen(false)} />
          <div className="menu-sheet" role="menu">
            <button className="menu-item" role="menuitem" onClick={() => pick('/')}>Start</button>
            {SCREEN_MENU.map(([group, items]) => (
              <div key={group}>
                <div className="menu-sep" />
                <div className="menu-head">{group}</div>
                {items.map(([p, label]) => (
                  <button key={p} className="menu-item" role="menuitem" onClick={() => pick(p)}>{label}</button>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}

// iOS-style screen: glass back button, centred title with role subtitle, screen menu.
export function Screen({ side = 'developer', back, title, subtitle, extra, plain, children, after }) {
  return (
    <div className={`screen ${plain ? 'is-plain' : ''} ${extra ? 'wide-right' : ''}`} style={{ '--tint': TINT[side] }}>
      <header className="nav">
        {back ? <button className="glass-circle" aria-label="Back" onClick={() => go(back)}>{Icon.back}</button> : <span />}
        <h1 className="nav-title"><strong>{title}</strong>{subtitle && <span>{subtitle}</span>}</h1>
        <div className="nav-right">
          {extra ? <div className="glass-group">{extra}<ScreenMenu /></div> : <ScreenMenu />}
        </div>
      </header>
      <main className="content">{children}</main>
      {after}
      <PrototypeNotice />
    </div>
  );
}

export function PrototypeNotice() {
  return <footer className="notice">Prototype. All amounts and data are illustrative.</footer>;
}

// Inset grouped section with the numbered header from the printed checklist.
export function Section({ num, title, footer, footerStrong, card = true, id, children }) {
  const hid = `${id || num || 'section'}-h`;
  return (
    <section className="section" id={id} aria-labelledby={title ? hid : undefined}>
      {title && (
        <div className="section-head">
          {num && <span className="section-num" aria-hidden="true">{num}</span>}
          <h2 className="section-title" id={hid}>{title}</h2>
        </div>
      )}
      {card ? <div className="group">{children}</div> : children}
      {footer && <p className={`section-foot ${footerStrong ? 'strong' : ''}`}>{footer}</p>}
    </section>
  );
}

export function Row({ children, className = '', ...rest }) {
  return <div className={`row ${className}`} {...rest}>{children}</div>;
}

export function LabeledRow({ label, children, sub }) {
  return (
    <div className="row">
      <div className="row-flex">
        <span className="row-label">{label}</span>
        <span className="row-value">{children}</span>
      </div>
      {sub && <p className="row-sub">{sub}</p>}
    </div>
  );
}

export function Segmented({ label, options, value, onChange, allowAll }) {
  const items = allowAll ? [[null, 'All'], ...options.map((o) => [o, o])] : options.map((o) => [o, o]);
  return (
    <div role="group" aria-label={label}>
      {label && <span className="sub-label">{label}</span>}
      <div className="seg">
        {items.map(([v, text]) => (
          <button key={text} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>{text}</button>
        ))}
      </div>
    </div>
  );
}

export function Stepper({ label, onDec, onInc, disabled }) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button aria-label={`Decrease ${label}`} disabled={disabled} onClick={onDec}>−</button>
      <i aria-hidden="true" />
      <button aria-label={`Increase ${label}`} disabled={disabled} onClick={onInc}>+</button>
    </div>
  );
}

export function Button({ variant = 'prominent', className = '', children, ...rest }) {
  return <button className={`btn btn-${variant} ${className}`} {...rest}>{children}</button>;
}

const TAG_COLOR = {
  neutral: 'var(--ns-ink)', rebate: 'var(--ns-rebate)', ready: 'var(--ns-grade-b)',
  quote: 'var(--ns-stone)', rejected: 'var(--ns-status-rejected)',
};
export function StatusTag({ kind = 'neutral', children }) {
  return (
    <span className="tag">
      <span className="tag-dot" style={{ background: TAG_COLOR[kind] }} aria-hidden="true" />
      {children}
    </span>
  );
}

export function Money({ size = 22, value = MONEY, stacked }) {
  return (
    <span className={`money ${stacked ? 'stacked' : ''}`}>
      <span className="money-value" style={{ fontSize: size }}>{value}</span>
      <small>illustrative</small>
    </span>
  );
}

export function RebateBar({ share, height = 10, color = 'var(--ns-rebate)' }) {
  return (
    <div className="bar-track" style={{ height }} aria-hidden="true">
      <div className="bar" style={{ width: `${share * 100}%`, background: color }} />
    </div>
  );
}

export function StepBar({ steps, current = 0 }) {
  return (
    <ol className="stepbar" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }} aria-label={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}>
      {steps.map((s, i) => (
        <li key={s} className={i < current ? 'done' : i === current ? 'current' : ''} aria-current={i === current ? 'step' : undefined}>
          <span className="stepbar-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="stepbar-text">{s}</span>
        </li>
      ))}
    </ol>
  );
}

// Full-screen sheet with a coloured band, like a fullScreenCover on iOS.
export function Sheet({ band = 'var(--ns-ink)', title, onClose, footer, children }) {
  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="sheet-band" style={{ background: band }} />
      <div className="sheet-nav">
        <span />
        <h2 className="nav-title"><strong>{title}</strong></h2>
        <button className="glass-circle" aria-label="Close" onClick={onClose}>{Icon.close}</button>
      </div>
      <div className="sheet-body">{children}</div>
      {footer && <div className="sheet-foot">{footer}</div>}
    </div>
  );
}

export function Alert({ text, onClose }) {
  return (
    <div className="alert-scrim" role="alertdialog" aria-modal="true" aria-label={text}>
      <div className="alert">
        <p>{text}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
