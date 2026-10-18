import { Sheet, Button } from './ui.jsx';

// Printed original in a full-screen sheet. Scrolls when taller than the screen.
export default function ImageSheet({ src, alt, title, band, onClose, footerLabel = 'Done' }) {
  return (
    <Sheet band={band} title={title} onClose={onClose} footer={<Button onClick={onClose}>{footerLabel}</Button>}>
      <img src={src} alt={alt} />
    </Sheet>
  );
}
