import CrudPage from '../components/CrudPage';
import { depenseApi } from '../api/commune';

export default function Depenses() {
  return (
    <CrudPage
      title="Dépenses"
      api={depenseApi}
      columns={[
        { key: 'date', label: 'Date' },
        { key: 'exercice_id', label: 'Exercice' },
        { key: 'compte_id', label: 'Compte' },
        { key: 'objet', label: 'Objet' },
        { key: 'credit_ouvert', label: 'Crédit ouvert' },
        { key: 'montant', label: 'Montant' },
        { key: 'cumule', label: 'Cumul' },
        { key: 'disponible', label: 'Disponible' },
      ]}
      fields={[
        { name: 'exercice_id', label: 'Exercice', type: 'm2o', relation: 'commune.exercice', labelField: 'annee' },
        { name: 'budget_id', label: 'Budget', type: 'm2o', relation: 'commune.budget.depense', filterBy: 'exercice_id' },
        { name: 'date', label: 'Date', type: 'date' },
        { name: 'objet', label: 'Objet', type: 'text' },
        { name: 'montant', label: 'Montant', type: 'number' },
      ]}
    />
  );
}