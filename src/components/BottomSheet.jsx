export default function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <>
      <div className="sheet-overlay" onClick={onClose} aria-hidden="true" />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title || 'Bottom sheet'}>
        <div className="sheet-handle" />
        {title && <div className="sheet-title">{title}</div>}
        {children}
      </div>
    </>
  );
}
