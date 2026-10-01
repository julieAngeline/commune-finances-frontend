import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, width }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1f2937', color: '#fff', borderRadius: 12,
          padding: 24, width: 'min(520px, 92vw)', maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ display: 'flex', padding: 4 }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}