import { useEffect, useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import Modal from './Modal';
import { exportToExcel } from '../utils/exportExcel';
import { fmtCell } from '../utils/format';
import './ui.css';

export default function DetailModal({ title, columns, load, filename, onClose }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    load().then(setRows).catch((e) => setError(e.message));
  }, []);

  return (
    <Modal title={title} onClose={onClose} width="min(900px, 95vw)">
      <div className="detail-tools">
        <button className="btn btn-excel" disabled={!rows.length}
          onClick={() => exportToExcel(rows, columns, filename)}>
          <FileSpreadsheet size={17} /> Exporter Excel
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={typeof rows[0]?.[c.key] === 'number' ? 'num' : ''}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !error && (
              <tr><td colSpan={columns.length} className="empty-cell">Aucune donnée pour cet élément</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                {columns.map((c) => (
                  <td key={c.key} className={typeof r[c.key] === 'number' ? 'num' : ''}>
                    {fmtCell(c.key, r[c.key]) || <span className="dash-empty">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">{rows.length} enregistrement(s)</div>
      </div>
    </Modal>
  );
}