import CrudPage from '../components/CrudPage';
import { recetteApi } from '../api/commune';

export default function Recettes() {
  return (
    <CrudPage
      title="Recettes"
      api={recetteApi}
      searchFields={[
        { name: 'numero_ordre_recette' },
        { name: 'numero_declaration_recette' },
        { name: 'code_compte' },
      ]}
      columns={[
        { key: 'numero_ordre_recette', label: 'N° Ordre' },
        { key: 'date_ordre_recette', label: 'Date ordre' },
        { key: 'date_versement', label: 'Versement' },
        { key: 'code_compte', label: 'Compte' },
        { key: 'montant', label: 'Montant' },
        { key: 'exercice_id', label: 'Exercice' },
      ]}
      fields={[
        { name: 'exercice_id', label: 'Exercice', type: 'm2o', relation: 'commune.exercice',
          labelField: 'annee', domain: [['etat', '!=', 'a_venir']] },
        { name: 'budget_recette_id', label: 'Prévision (compte 7)', type: 'm2o',
          relation: 'commune.budget.recette', filterBy: 'exercice_id', required: false },
        { name: 'date_versement', label: 'Date de versement', type: 'date' },
        { name: 'numero_declaration_recette', label: 'N° Déclaration', type: 'text', required: false },
        { name: 'date_declaration_recette', label: 'Date déclaration', type: 'date', required: false },
        { name: 'numero_ordre_recette', label: 'N° Ordre de recette', type: 'text' },
        { name: 'date_ordre_recette', label: "Date de l'ordre", type: 'date' },
        { name: 'periode_debut', label: 'Période début', type: 'date', required: false },
        { name: 'periode_fin', label: 'Période fin', type: 'date', required: false },
        { name: 'montant', label: 'Montant', type: 'number' },
      ]}
    />
  );
}