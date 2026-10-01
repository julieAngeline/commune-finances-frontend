import CrudPage from '../components/CrudPage';
import { budgetApi } from '../api/commune';

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
        { name: 'exercice_id', label: 'Exercice', type: 'm2o', relation: 'commune.exercice', labelField: 'annee' },
        { name: 'compte_id', label: 'Compte', type: 'm2o', relation: 'commune.compte.depense' },
        { name: 'objet', label: 'Objet', type: 'text' },
        { name: 'credit_ouvert', label: 'Crédit ouvert', type: 'number' },
      ]}
    />
  );
}