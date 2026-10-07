import CrudPage from '../components/CrudPage';
import { budgetApi, depenseApi } from '../api/commune';

export default function Budgets() {
  return (
    <CrudPage
      title="Budgets de dépenses"
      api={budgetApi}
      columns={[
        { key: 'exercice_id', label: 'Exercice' },
        { key: 'compte_id', label: 'Compte' },
        { key: 'objet', label: 'Objet' },
        { key: 'credit_ouvert', label: 'Crédit ouvert' },
        { key: 'cumule', label: 'Cumul' },
        { key: 'disponible', label: 'Disponible' },
        { key: 'taux_consommation', label: 'Taux', render: (v) => `${(v || 0).toFixed(1)} %` },
      ]}
      fields={[
       { name: 'code_compte', label: 'Compte (6xxx / 2xxx)', type: 'text' },
       { name: 'libelle', label: 'Libellé du compte', type: 'text', required: false },
      ]}

detail={{
  title: (r) => `Dépenses du budget ${r.objet}`,
  columns: [
    { key: 'date', label: 'Date' },
    { key: 'objet', label: 'Objet' },
    { key: 'montant', label: 'Montant' },
    { key: 'cumule', label: 'Cumul' },
    { key: 'disponible', label: 'Disponible' },
  ],
  load: (r) => depenseApi.list([['budget_id', '=', r.id]]),
  filename: (r) => `Depenses_budget_${r.objet}`,
}}
    />
  );
}