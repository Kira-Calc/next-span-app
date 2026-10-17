import { useState } from 'react';
import { useHashRoute } from './router.js';
import { BATCH, ESTIMATE_DEFAULTS, MEMBER_07_CHECKS } from './demo-data.js';
import Entry from './screens/Entry.jsx';
import Estimate from './screens/Estimate.jsx';
import Checklist from './screens/Checklist.jsx';
import Grade from './screens/Grade.jsx';
import Listing from './screens/Listing.jsx';
import Search from './screens/Search.jsx';
import Batch from './screens/Batch.jsx';
import Accept from './screens/Accept.jsx';
import Certificates from './screens/Certificates.jsx';

export default function App() {
  const { path, params } = useHashRoute();
  // Shared demo state. Lives in memory only, so a refresh resets the demo.
  const [estimate, setEstimate] = useState(ESTIMATE_DEFAULTS);
  const [lodged, setLodged] = useState(false);
  const [grading, setGrading] = useState({ member: 7, grade: 'B', checks: MEMBER_07_CHECKS, applied: false });
  const [listing, setListing] = useState({ locked: false, priceStep: 0 });
  const [search, setSearch] = useState({ length: null, section: null, grades: ['A', 'B'], shortlisted: false });
  const [accept, setAccept] = useState({ accepted: false, delivered: { ...BATCH.grades } });

  let screen;
  switch (path) {
    case '/estimate':
      screen = <Estimate estimate={estimate} setEstimate={setEstimate} />;
      break;
    case '/checklist':
      screen = <Checklist estimate={estimate} lodged={lodged} setLodged={setLodged} />;
      break;
    case '/grade':
      screen = <Grade grading={grading} setGrading={setGrading} />;
      break;
    case '/listing':
      screen = <Listing listing={listing} setListing={setListing} />;
      break;
    case '/search':
      screen = <Search search={search} setSearch={setSearch} />;
      break;
    case '/batch/NS-0412':
      screen = <Batch params={params} />;
      break;
    case '/accept':
      screen = <Accept accept={accept} setAccept={setAccept} />;
      break;
    case '/certificates':
      screen = <Certificates />;
      break;
    default:
      screen = <Entry />;
  }

  return <div className="stage">{screen}</div>;
}
