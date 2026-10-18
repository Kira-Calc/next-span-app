import { go } from '../router.js';
import { PrototypeNotice } from '../components/ui.jsx';

const ARROW = <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const HOUSE = <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 11 5l8 6.5M5.5 9.5V19h11V9.5M9.5 19v-5h3v5M17 4.5h3.5L19 6l1.5 1.5H17V4.5zm0 0V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
const RULER = <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="8" width="19" height="8" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M6 8v3M9 8v2M12 8v3M15 8v2M18 8v3" stroke="currentColor" strokeWidth="1.4" /></svg>;
const QR = <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM6 6h1v1H6zm11 0h1v1h-1zM6 17h1v1H6zm8-3h3v3h-3zm4 4h3v3h-3zm-4 3h3" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>;

function RoleCard({ side, title, icon, color, onClick }) {
  return (
    <button className="role-card" style={{ background: color }} onClick={onClick} aria-label={`${title}. ${side} journey`}>
      <span className="role-top">{icon}{ARROW}</span>
      <span className="role-side">{side}</span>
      <span className="role-title">{title}</span>
    </button>
  );
}

export default function Entry() {
  return (
    <div className="screen is-plain entry">
      <main className="content entry-content">
        <header className="entry-head">
          <img src="./brand/logo/next-span-tri.svg" alt="Next Span" width="72" height="72" />
          <p className="entry-tagline">Timber that is used again, paid for when it is.</p>
        </header>
        <div className="entry-choices">
          <RoleCard side="Developer" title="I'm removing a house" icon={HOUSE} color="var(--ns-ink)" onClick={() => go('/estimate')} />
          <RoleCard side="Specifier" title="I'm specifying timber" icon={RULER} color="var(--ns-grade-a)" onClick={() => go('/search')} />
        </div>
        <button className="btn btn-glass btn-small entry-link" onClick={() => go('/batch/NS-0412')}>
          {QR}<span>Open batch NS-0412</span>
        </button>
      </main>
      <PrototypeNotice />
    </div>
  );
}
