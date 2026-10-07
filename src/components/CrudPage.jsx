import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, FileSpreadsheet } from 'lucide-react';
import { searchRead } from '../api/odoo';
import Modal from './Modal';
import DetailModal from './DetailModal';
import { exportToExcel } from '../utils/exportExcel';

const emptyForm = (fields) => Object.fromEntries(fields.map((f) => [f.name, '']));
const fmt = (v) => (Array.isArray(v) ? v[1] : v === false || v == null ? '' : v);
const fieldStyle = { width: '100%', padding: 8, boxSizing: 'border-box', marginTop: 4 };
const allow = (flag, row) => (typeof flag === 'function' ? flag(row) : flag !== false);

export default function CrudPage({
  title, api, columns, fields = [], extraActions, detail,
  canCreate = true, canEdit = true, canDelete = true,
}) {
  const [rows, setRows] = useState([]);
  const [opts, setOpts] = useState({});
  const [form, setForm] = useState(emptyForm(fields));
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [pageError, setPageError] = useState('');
  const [saving, setSaving] = useState(false);
  const [detailRow, setDetailRow] = useState(null);

  const load = () => api.list().then(setRows).catch((e) => setPageError(e.message));

  useEffect(() => {
    load();
    fields.filter((f) => f.type === 'm2o').forEach((f) => {
      const label = f.labelField || 'display_name';
      const flds = ['id', label, ...(f.filterBy ? [f.filterBy] : [])];
      searchRead(f.relation, [], flds).then((r) => setOpts((o) => ({ ...o, [f.name]: r })));
    });
  }, []);

  const optionsFor = (f) => {
    let list = opts[f.name] || [];
    if (f.filterBy) list = list.filter((o) => o[f.filterBy]?.[0] === +form[f.filterBy]);
    return list;
  };

  const payload = () =>
    Object.fromEntries(fields.map((f) => {
      const v = form[f.name];
      if (v === '') return [f.name, false];
      return [f.name, f.type === 'm2o' || f.type === 'number' ? +v : v];
    }));

  const openCreate = () => { setEditId(null); setForm(emptyForm(fields)); setError(''); setOpen(true); };

  const openEdit = (row) => {
    setEditId(row.id);
    setForm(Object.fromEntries(fields.map((f) => [
      f.name,
      f.type === 'm2o' ? row[f.name]?.[0] ?? '' : row[f.name] === false ? '' : row[f.name],
    ])));
    setError('');
    setOpen(true);
  };

  const close = () => { setOpen(false); setEditId(null); setError(''); };

  const save = async (e) => {
    e.preventDefault();
    const missing = fields.filter((f) => f.required !== false && form[f.name] === '');
    if (missing.length) {
      setError('Champs obligatoires : ' + missing.map((f) => f.label).join(', '));
      return;
    }
    setSaving(true);
    setError('');
    try {
      editId ? await api.update(editId, payload()) : await api.create(payload());
      close();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Supprimer ?')) return;
    try { await api.remove(id); setPageError(''); load(); }
    catch (e) { setPageError(e.message); }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{title}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="icon-btn" disabled={!rows.length}
            onClick={() => exportToExcel(rows, columns, title.replace(/\s+/g, '_'))}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          {canCreate !== false && (
            <button onClick={openCreate} className="icon-btn">
              <Plus size={16} /> Nouveau
            </button>
          )}
        </div>
      </div>

      {pageError && <p style={{ color: 'crimson', whiteSpace: 'pre-line' }}>{pageError}</p>}

      <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}<th>Actions</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              {columns.map((c) => (
                <td key={c.key}>{c.render ? c.render(r[c.key], r) : fmt(r[c.key])}</td>
              ))}
              <td>
                {allow(canEdit, r) && (
                  <button onClick={() => openEdit(r)}><Pencil size={14} /></button>
                )}{' '}
                {allow(canDelete, r) && (
                  <button onClick={() => del(r.id)}><Trash2 size={14} /></button>
                )}
                {extraActions?.(r, load, setPageError)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <Modal title={editId ? `Modifier ${title}` : `Nouveau - ${title}`} onClose={close}>
          <form onSubmit={save}>
            {fields.map((f) => (
              <div key={f.name} style={{ marginBottom: 12 }}>
                <label>{f.label}{f.required !== false && ' *'}</label>
                {f.type === 'm2o' ? (
                  <select style={fieldStyle} value={form[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                    <option value="">-- {f.label} --</option>
                    {optionsFor(f).map((o) => (
                      <option key={o.id} value={o.id}>{String(o[f.labelField || 'display_name'])}</option>
                    ))}
                  </select>
                ) : (
                  <input style={fieldStyle} type={f.type} value={form[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                )}
              </div>
            ))}

            {error && <p style={{ color: '#f87171', whiteSpace: 'pre-line' }}>{error}</p>}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
              <button type="button" onClick={close}>Annuler</button>
              <button type="submit" disabled={saving}>
                {saving ? 'Enregistrement...' : editId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {detailRow && detail && (
        <DetailModal
          title={detail.title(detailRow)}
          columns={detail.columns}
          load={() => detail.load(detailRow)}
          filename={detail.filename(detailRow)}
          onClose={() => setDetailRow(null)}
        />
      )}
    </>
  );
}