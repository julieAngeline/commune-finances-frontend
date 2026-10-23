import CrudPage from '../components/CrudPage';
import { budgetApi, depenseApi } from '../api/commune';


export default function Budgets() {
  return (
    <CrudPage
      title="Budgets de dépenses"
      api={budgetApi}
      searchFields={[{ name: 'code_compte' }, { name: 'libelle' }, { name: 'objet' }]}
      columns={[
        { key: 'exercice_id', label: 'Exercice' },
        { key: 'code_compte', label: 'Compte' },
        { key: 'objet', label: 'Objet' },
        { key: 'credit_ouvert', label: 'Crédit ouvert' },
        { key: 'cumule', label: 'Cumul' },
        { key: 'disponible', label: 'Disponible' },
        { key: 'taux_consommation', label: 'Taux', render: (v) => `${(v || 0).toFixed(1)} %` },
      ]}
      fields={[
        { name: 'exercice_id', label: 'Exercice', type: 'm2o', relation: 'commune.exercice',
          labelField: 'annee', domain: [['etat', '!=', 'a_venir']] },
        { name: 'code_compte', label: 'Compte (2xxx / 6xxx)', type: 'text' },
        { name: 'libelle', label: 'Libellé du compte', type: 'text', required: false },
        { name: 'objet', label: 'Objet', type: 'text' },
        { name: 'credit_ouvert', label: 'Crédit ouvert', type: 'number' },
      ]}
      detail={{
        title: (r) => `Dépenses du compte ${r.code_compte}`,
        columns: [
          { key: 'date', label: 'Date' },
          { key: 'objet', label: 'Objet' },
          { key: 'montant', label: 'Montant' },
          { key: 'cumule', label: 'Cumul' },
          { key: 'disponible', label: 'Disponible' },
        ],
        load: (r) => depenseApi.list([['budget_id', '=', r.id]]),
        filename: (r) => `Depenses_compte_${r.code_compte}`,
      }}
    />
  );
}