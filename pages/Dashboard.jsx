import { useEffect, useState } from 'react';
import { exerciceApi, budgetApi } from '../api/commune';

const money = (v) => Number(v || 0).toLocaleString('fr-FR');
const card = { padding: 16, border: '1px solid #ddd', borderRadius: 8, minWidth: 180 };

export default function Dashboard() {
  const [exos, setExos] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [sel, setSel] = useState('');

  useEffect(() => {
    exerciceApi.list().then((r) => { setExos(r); if (r[0]) setSel(r[0].id); });
  }, []);
  useEffect(() => {
    if (sel) budgetApi.list([['exercice_id', '=', +sel]]).then(setBudgets);
  }, [sel]);

  const ex = exos.find((e) => e.id === +sel);

  return (
    <>
      <h2>Dashboard</h2>
      <select value={sel} onChange={(e) => setSel(e.target.value)}>
        {exos.map((e) => <option key={e.id} value={e.id}>Exercice {e.annee}</option>)}
      </select>

      {ex && (
        <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
          <div style={card}>Excédent N-1<h3>{money(ex.excedent_n_moins_1)}</h3></div>
          <div style={card}>Total recettes<h3>{money(ex.total_recettes)}</h3></div>
          <div style={card}>Total dépenses<h3>{money(ex.total_depenses)}</h3></div>
          <div style={card}>Fonds libre<h3>{money(ex.fonds_libre)}</h3></div>
          <div style={card}>État<h3>{ex.etat}</h3></div>
        </div>
      )}

      <h3>Consommation des budgets</h3>
      {budgets.map((b) => (
        <div key={b.id} style={{ marginBottom: 10 }}>
          {b.compte_id?.[1]} — {b.objet} ({(b.taux_consommation || 0).toFixed(1)} %)
          <div style={{ background: '#eee', height: 10, borderRadius: 5 }}>
            <div style={{
              width: `${Math.min(b.taux_consommation || 0, 100)}%`, height: 10, borderRadius: 5,
              background: b.taux_consommation > 90 ? 'crimson' : 'seagreen',
            }} />
          </div>
        </div>
      ))}
    </>
  );
}