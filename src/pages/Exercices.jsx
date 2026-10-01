import CrudPage from '../components/CrudPage';
import { callKw } from '../api/odoo';
import { exerciceApi, budgetApi } from '../api/commune';

const actions = [
  { etat: 'ouvert', method: 'action_passer_periode_complementaire', label: '→ Période complémentaire' },
  { etat: 'complementaire', method: 'action_cloturer', label: '🔒 Clôturer' },
  { etat: 'cloture', method: 'action_reouvrir', label: '🔓 Réouvrir' },
];

export default function Exercices() {
  return (
    <CrudPage
      title="Exercices"
      api={exerciceApi}
      columns={[
        { key: 'annee', label: 'Année' },
        { key: 'excedent_n_moins_1', label: 'Excédent N-1' },
        { key: 'total_recettes', label: 'Total recettes' },
        { key: 'total_depenses', label: 'Total dépenses' },
        { key: 'fonds_libre', label: 'Fonds libre' },
        { key: 'etat', label: 'État' },
      ]}
      fields={[
        { name: 'annee', label: 'Année', type: 'number' },
        { name: 'excedent_n_moins_1', label: 'Excédent N-1', type: 'number' },
      ]}
      extraActions={(row, reload, setError) =>
        actions.filter((a) => a.etat === row.etat).map((a) => (
          <button key={a.method} style={{ marginLeft: 6 }}
            onClick={async () => {
              try { await callKw('commune.exercice', a.method, [[row.id]]); reload(); }
              catch (e) { setError(e.message); }
            }}>
            {a.label}
          </button>
        ))
      }

detail={{
  title: (r) => `Budgets de l'exercice ${r.annee}`,
  columns: [
    { key: 'compte_id', label: 'Compte' },
    { key: 'objet', label: 'Objet' },
    { key: 'credit_ouvert', label: 'Crédit ouvert' },
    { key: 'cumule', label: 'Cumul' },
    { key: 'disponible', label: 'Disponible' },
  ],
  load: (r) => budgetApi.list([['exercice_id', '=', r.id]]),
  filename: (r) => `Budgets_${r.annee}`,
}}
    />
  );
}