import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { exerciceApi, budgetApi, budgetRecetteApi } from '../api/commune';
import PageBanner from '../components/PageBanner';
import './Dashboard.css';

const money = (v) => Number(v || 0).toLocaleString('fr-FR');

const ETATS = {
  a_venir: { label: 'À venir', cls: 'badge-off' },
  ouvert: { label: 'Ouvert', cls: 'badge-ok' },
  complementaire: { label: 'Période complémentaire', cls: 'badge-warn' },
  cloture: { label: 'Clôturé', cls: 'badge-off' },
};

const colorDepense = (t) => (t > 90 ? 'bar-red' : t > 70 ? 'bar-orange' : 'bar-green');

function Kpi({ icon: Icon, label, value, tone, delay }) {
  return (
    <div className={`kpi kpi-${tone}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="kpi-icon"><Icon size={22} /></div>
      <div>
        <div className="kpi-label">{label}</div>
        <div className="kpi-value">{money(value)}</div>
      </div>
    </div>
  );
}

function Bar({ title, sub, pct, cls }) {
  return (
    <div className="bar-row">
      <div className="bar-head">
        <span className="bar-title">{title}{sub && <small> — {sub}</small>}</span>
        <strong>{pct.toFixed(1)} %</strong>
      </div>
      <div className="bar-track">
        <div className={`bar-fill ${cls}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [exos, setExos] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [previsions, setPrevisions] = useState([]);
  const [sel, setSel] = useState('');

  useEffect(() => {
  exerciceApi.list().then((r) => {
    setExos(r);
    const cur = r.find((e) => e.annee === new Date().getFullYear());
    if (cur) setSel(cur.id);
  });
  }
)

  useEffect(() => {
    if (!sel) return;
    budgetApi.list([['exercice_id', '=', +sel]]).then(setBudgets).catch(() => setBudgets([]));
    budgetRecetteApi.list([['exercice_id', '=', +sel]]).then(setPrevisions).catch(() => setPrevisions([]));
  }, [sel]);

  const ex = exos.find((e) => e.id === +sel);
  const etat = ex && (ETATS[ex.etat] || { label: ex.etat, cls: 'badge-off' });

  return (
    <div className="dash">
      <PageBanner
        title="Pilotage intelligent des ressources financières"
        subtitle="Commune Urbaine de Fianarantsoa – situation de l’exercice sélectionné"
      >
        {etat && <span className={`banner-badge ${etat.cls}`}>{etat.label}</span>}
        <select className="banner-select" value={sel} onChange={(e) => setSel(e.target.value)}>
          {exos.map((e) => <option key={e.id} value={e.id}>Exercice {e.annee}</option>)}
        </select>
      </PageBanner>

      {ex && (
        <div className="kpis">
          <Kpi icon={Wallet} label="Excédent N-1" value={ex.excedent_n_moins_1} tone="violet" delay={0} />
          <Kpi icon={TrendingUp} label="Total recettes" value={ex.total_recettes} tone="green" delay={80} />
          <Kpi icon={TrendingDown} label="Total dépenses" value={ex.total_depenses} tone="red" delay={160} />
          <Kpi icon={PiggyBank} label="Fonds libre" value={ex.fonds_libre} tone="blue" delay={240} />
        </div>
      )}

      <div className="panels">
        <section className="panel">
          <h3>Prévisions de recettes</h3>
          {previsions.length === 0 && <p className="empty">Aucune prévision pour cet exercice.</p>}
          {previsions.map((p) => (
            <Bar key={p.id} title={p.code_compte} sub={p.objet}
                 pct={p.taux_realisation || 0} cls="bar-blue" />
          ))}
        </section>

        <section className="panel">
          <h3>Consommation des budgets</h3>
          {budgets.length === 0 && <p className="empty">Aucun budget pour cet exercice.</p>}
          {budgets.map((b) => (
            <Bar key={b.id} title={b.code_compte} sub={b.objet}
                 pct={b.taux_consommation || 0} cls={colorDepense(b.taux_consommation || 0)} />
          ))}
        </section>
      </div>
    </div>
  );
}