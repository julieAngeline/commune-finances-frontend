import CrudPage from '../components/CrudPage';
import { recetteApi } from '../api/commune';

export default function Recettes() {
  return (
    <CrudPage
      title="Recettes"
      api={recetteApi}
      columns={[
        { key: 'numero_ordre_recette', label: 'N° Ordre' },
        { key: 'date_ordre_recette', label: 'Date ordre' },
        { key: 'date_versement', label: 'Versement' },
        { key: 'montant', label: 'Montant' },
        { key: 'exercice_id', label: 'Exercice' },
      ]}
      fields={[
        { name: 'exercice_id', label: 'Exercice', type: 'm2o', relation: 'commune.exercice', labelField: 'annee' },
        { name: 'date_versement', label: 'Date de versement', type: 'date' },
        { name: 'numero_declaration_recette', label: 'N° Déclaration', type: 'text' },
        { name: 'date_declaration_recette', label: 'Date déclaration', type: 'date' },
        { name: 'numero_ordre_recette', label: 'N° Ordre de recette', type: 'text' },
        { name: 'date_ordre_recette', label: "Date de l'ordre", type: 'date' },
        { name: 'periode_debut', label: 'Période début', type: 'date' },
        { name: 'periode_fin', label: 'Période fin', type: 'date' },
        { name: 'montant', label: 'Montant', type: 'number' },
      ]}
    />
  );
}