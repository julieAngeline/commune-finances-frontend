import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, FileSpreadsheet, Loader2, Search } from 'lucide-react';
import { textDomain } from '../api/search';
import { searchRead } from '../api/odoo';
import Modal from './Modal';
import DetailModal from './DetailModal';
import { exportToExcel } from '../utils/exportExcel';
import { fmtCell } from '../utils/format';
import './ui.css';

const emptyForm = (fields) => Object.fromEntries(fields.map((f) => [f.name, '']));
const allow = (flag, row) => (typeof flag === 'function' ? flag(row) : flag !== false);

export default function CrudPage({
  title, api, columns, fields = [], extraActions, detail,
  canCreate = true, canEdit = true, canDelete = true,
  searchFields = [],
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

    const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [qDelayed, setQDelayed] = useState(q);

  // Recherche différée dans la page
  useEffect(() => {
    const t = setTimeout(() => setQDelayed(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Quand on arrive depuis la recherche globale (?q=...)
  useEffect(() => { setQ(params.get('q') || ''); }, [params]);

  const load = () =>
    api.list(textDomain(searchFields, qDelayed)).then(setRows).catch((e) => setPageError(e.message));

  // Recharge la liste à chaque changement de recherche
  useEffect(() => { load(); }, [qDelayed]);

  // Listes déroulantes des formulaires (une seule fois)
  useEffect(() => {
    fields.filter((f) => f.type === 'm2o').forEach((f) => {
      const label = f.labelField || 'display_name';
      const flds = ['id', label, ...(f.filterBy ? [f.filterBy] : [])];
      searchRead(f.relation, f.domain || [], flds).then((r) => setOpts((o) => ({ ...o, [f.name]: r })));
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
            <div className="page-head">
        <h2>{title}</h2>
        <div className="page-actions">
          {searchFields.length > 0 && (
            <div className="list-search">
              <Search size={16} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher..."
              />
            </div>
          )}
          <button className="btn btn-excel" disabled={!rows.length}
            onClick={() => exportToExcel(rows, columns, title.replace(/\s+/g, '_'))}>
            <FileSpreadsheet size={17} /> Excel
          </button>
          {canCreate !== false && (
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={17} /> Nouveau
            </button>
          )}
        </div>
      </div>

      {pageError && <p style={{ color: 'crimson', whiteSpace: 'pre-line' }}>{pageError}</p>}

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={typeof rows[0]?.[c.key] === 'number' ? 'num' : ''}>
                  {c.label}
                </th>
              ))}
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="empty-cell">Aucune donnée à afficher</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                {columns.map((c) => {
                  const raw = r[c.key];
                  const shown = c.render ? c.render(raw, r) : fmtCell(c.key, raw);
                  const empty = shown === '' || shown == null;
                  return (
                    <td key={c.key} className={typeof raw === 'number' ? 'num' : ''}>
                      {empty ? <span className="dash-empty">—</span> : shown}
                    </td>
                  );
                })}
                <td className="col-actions">
                  <div className="row-actions">
                    {detail && (
                      <button className="act act-view" title="Voir le détail" onClick={() => setDetailRow(r)}>
                        <Eye size={15} />
                      </button>
                    )}
                    {allow(canEdit, r) && (
                      <button className="act act-edit" title="Modifier" onClick={() => openEdit(r)}>
                        <Pencil size={15} />
                      </button>
                    )}
                    {allow(canDelete, r) && (
                      <button className="act act-del" title="Supprimer" onClick={() => del(r.id)}>
                        <Trash2 size={15} />
                      </button>
                    )}
                    {extraActions?.(r, load, setPageError)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-foot">{rows.length} enregistrement(s)</div>
      </div>

      {open && (
        <Modal title={editId ? `Modifier – ${title}` : `Nouveau – ${title}`} onClose={close}>
          <form onSubmit={save}>
            {fields.map((f) => (
              <div key={f.name} className="form-field">
                <label>
                  {f.label}
                  {f.required !== false && <span className="req"> *</span>}
                </label>
                {f.type === 'm2o' ? (
                  <select className="form-input" value={form[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                    <option value="">-- {f.label} --</option>
                    {optionsFor(f).map((o) => (
                      <option key={o.id} value={o.id}>{String(o[f.labelField || 'display_name'])}</option>
                    ))}
                  </select>
                ) : (
                  <input className="form-input" type={f.type}
                    step={f.type === 'number' ? 'any' : undefined}
                    value={form[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                )}
              </div>
            ))}

            {error && <div className="form-error">{error}</div>}

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={close}>Annuler</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <><Loader2 size={17} className="spin" /> Enregistrement...</>
                ) : editId ? (
                  <><Pencil size={16} /> Modifier</>
                ) : (
                  <><Plus size={17} /> Ajouter</>
                )}
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