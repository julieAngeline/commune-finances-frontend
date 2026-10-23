import CrudPage from '../components/CrudPage';
import { budgetRecetteApi, recetteApi } from '../api/commune';


export default function BudgetsRecettes() {
  return (
    <CrudPage
      title="Prévisions de recettes"
      api={budgetRecetteApi}
      searchFields={[{ name: 'code_compte' }, { name: 'libelle' }, { name: 'objet' }]}
      columns={[
        { key: 'exercice_id', label: 'Exercice' },
        { key: 'code_compte', label: 'Compte' },
        { key: 'objet', label: 'Objet' },
        { key: 'prevision', label: 'Prévision' },
        { key: 'cumule', label: 'Réalisé' },
        { key: 'ecart', label: 'Écart' },
        { key: 'taux_realisation', label: 'Taux', render: (v) => `${(v || 0).toFixed(1)} %` },
      ]}
      fields={[
        { name: 'exercice_id', label: 'Exercice', type: 'm2o', relation: 'commune.exercice',
         labelField: 'annee', domain: [['etat', '!=', 'a_venir']] },
        { name: 'code_compte', label: 'Compte (7xxx)', type: 'text' },
        { name: 'libelle', label: 'Libellé du compte', type: 'text', required: false },
        { name: 'objet', label: 'Objet', type: 'text' },
        { name: 'prevision', label: 'Prévision', type: 'number' },
      ]}
      detail={{
        title: (r) => `Recettes du compte ${r.code_compte}`,
        columns: [
          { key: 'numero_ordre_recette', label: 'N° Ordre' },
          { key: 'date_ordre_recette', label: 'Date ordre' },
          { key: 'date_versement', label: 'Versement' },
          { key: 'montant', label: 'Montant' },
        ],
        load: (r) => recetteApi.list([['budget_recette_id', '=', r.id]]),
        filename: (r) => `Recettes_compte_${r.code_compte}`,
      }}
    />
  );
}