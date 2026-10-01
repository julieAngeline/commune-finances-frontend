import CrudPage from '../components/CrudPage';
import { compteApi, depenseApi } from '../api/commune';

const depCols = [
  { key: 'date', label: 'Date' },
  { key: 'exercice_id', label: 'Exercice' },
  { key: 'objet', label: 'Objet' },
  { key: 'credit_ouvert', label: 'Crédit ouvert' },
  { key: 'montant', label: 'Montant' },
  { key: 'cumule', label: 'Cumul' },
  { key: 'disponible', label: 'Disponible' },
];

export default function Comptes() {
  return (
    <CrudPage
      title="Comptes de dépense"
      api={compteApi}
      columns={[
        { key: 'code_compte', label: 'Code' },
        { key: 'libelle', label: 'Libellé' },
      ]}
      fields={[
        { name: 'code_compte', label: 'Code compte', type: 'text' },
        { name: 'libelle', label: 'Libellé', type: 'text' },
      ]}
      detail={{
        title: (r) => `Dépenses du compte ${r.code_compte} - ${r.libelle}`,
        columns: depCols,
        load: (r) => depenseApi.list([['compte_id', '=', r.id]]),
        filename: (r) => `Depenses_compte_${r.code_compte}`,
      }}
    />
  );
}