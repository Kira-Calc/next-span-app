import { go } from '../router.js';
import { PrototypeFooter } from '../components/ui.jsx';

const ARROW = (
  <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11h12.2l-5.6-5.6L12 4l8 8-8 8-1.4-1.4 5.6-5.6H4z" fill="currentColor" /></svg>
);

export default function Entry() {
  return (
    <div className="screen entry">
      <header className="entry-head">
        <img src="./brand/logo/next-span-tri.svg" alt="Next Span" width="64" height="64" />
        <p className="entry-tagline">Timber that is used again, paid for when it is.</p>
      </header>
      <div className="entry-choices">
        <button className="entry-choice entry-dev" onClick={() => go('/estimate')}>
          <span className="ns-label entry-side">Developer</span>
          <span className="entry-choice-text">I'm removing a house</span>
          {ARROW}
        </button>
        <button className="entry-choice entry-spec" onClick={() => go('/search')}>
          <span className="ns-label entry-side">Specifier</span>
          <span className="entry-choice-text">I'm specifying timber</span>
          {ARROW}
        </button>
      </div>
      <a className="entry-link" href="#/batch/NS-0412">Open batch NS-0412</a>
      <PrototypeFooter />
    </div>
  );
}
