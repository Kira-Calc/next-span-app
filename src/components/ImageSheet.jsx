import { Sheet } from './ui.jsx';

// Full-screen preview of a printed original. Scrolls when taller than the screen.
export default function ImageSheet({ src, alt, title, band = 'developer', onClose, footer }) {
  return (
    <Sheet band={band} title={title} onClose={onClose} footer={footer}>
      <div className="image-sheet">
        <img src={src} alt={alt} />
      </div>
    </Sheet>
  );
}
