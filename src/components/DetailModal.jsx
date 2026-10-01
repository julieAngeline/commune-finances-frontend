import { useEffect, useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import Modal from './Modal';
import { exportToExcel } from '../utils/exportExcel';

const fmt = (v) => (Array.isArray(v) ? v[1] : v === false || v == null ? '' : v);

export default function DetailModal({ title, columns, load, filename, onClose }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    load().then(setRows).catch((e) => setError(e.message));
  }, []);

  return (
    <Modal title={title} onClose={onClose} width="min(900px, 95vw)">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button
          className="icon-btn"
          disabled={!rows.length}
          onClick={() => exportToExcel(rows, columns, filename)}
        >
          <FileSpreadsheet size={16} /> Exporter Excel
        </button>
      </div>

      {error && <p style={{ color: '#f87171' }}>{error}</p>}
      {!rows.length && !error && <p>Aucune dépense pour cet élément.</p>}

      {rows.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  {columns.map((c) => <td key={c.key}>{fmt(r[c.key])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}