import { searchRead, create, write, remove } from './odoo';

const crud = (model, fields, order = 'id desc') => ({
  list: (domain = []) => searchRead(model, domain, fields, { order }),
  create: (vals) => create(model, vals),
  update: (id, vals) => write(model, id, vals),
  remove: (id) => remove(model, id),
});

export const exerciceApi = crud('commune.exercice',
  ['annee', 'excedent_n_moins_1', 'total_recettes', 'total_depenses', 'fonds_libre', 'etat'], 'annee desc');

export const recetteApi = crud('commune.recette',
  ['date_versement', 'numero_declaration_recette', 'date_declaration_recette', 'numero_ordre_recette',
   'date_ordre_recette', 'periode_debut', 'periode_fin', 'montant', 'exercice_id', 'budget_recette_id', 'code_compte']);

export const budgetRecetteApi = crud('commune.budget.recette',
  ['exercice_id', 'code_compte', 'libelle', 'objet', 'prevision', 'cumule', 'ecart', 'taux_realisation']);

export const budgetApi = crud('commune.budget.depense',
  ['exercice_id', 'code_compte', 'libelle', 'objet', 'credit_ouvert', 'cumule', 'disponible', 'taux_consommation']);

export const depenseApi = crud('commune.depense',
  ['exercice_id', 'budget_id', 'code_compte', 'date', 'objet', 'credit_ouvert', 'montant', 'cumule', 'disponible'],
  'date desc, id desc');