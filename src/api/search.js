import { searchRead } from './odoo';
import { ar } from '../utils/format';

// Odoo attend un « OU » en notation préfixée : ['|', cond1, cond2]
const orDomain = (conds) =>
  conds.length < 2 ? conds : [...Array(conds.length - 1).fill('|'), ...conds];

// Construit le filtre de recherche à partir des champs d'une page
export const textDomain = (fields, q) => {
  const t = (q || '').trim();
  if (!t) return [];
  const conds = [];
  fields.forEach((f) => {
    if (f.numeric) {
      if (/^\d+$/.test(t)) conds.push([f.name, '=', +t]);
    } else {
      conds.push([f.name, 'ilike', t]);
    }
  });
  return conds.length ? orDomain(conds) : [['id', '=', 0]]; // aucun résultat
};

// Modèles interrogés par la recherche globale
export const SEARCH_MODELS = [
  {
    label: 'Exercices', model: 'commune.exercice', route: '/exercices',
    fields: [{ name: 'annee', numeric: true }],
    read: ['annee', 'etat'],
    title: (r) => `Exercice ${r.annee}`,
    sub: (r) => r.etat,
  },
  {
    label: 'Recettes', model: 'commune.recette', route: '/recettes',
    fields: [{ name: 'numero_ordre_recette' }, { name: 'numero_declaration_recette' }, { name: 'code_compte' }],
    read: ['numero_ordre_recette', 'montant', 'code_compte'],
    title: (r) => `N° ordre ${r.numero_ordre_recette}`,
    sub: (r) => ar(r.montant),
  },
  {
    label: 'Prévisions de recettes', model: 'commune.budget.recette', route: '/budgets-recettes',
    fields: [{ name: 'code_compte' }, { name: 'libelle' }, { name: 'objet' }],
    read: ['code_compte', 'objet', 'prevision'],
    title: (r) => `${r.code_compte} – ${r.objet}`,
    sub: (r) => `Prévision ${ar(r.prevision)}`,
  },
  {
    label: 'Budgets de dépenses', model: 'commune.budget.depense', route: '/budgets',
    fields: [{ name: 'code_compte' }, { name: 'libelle' }, { name: 'objet' }],
    read: ['code_compte', 'objet', 'credit_ouvert'],
    title: (r) => `${r.code_compte} – ${r.objet}`,
    sub: (r) => `Crédit ouvert ${ar(r.credit_ouvert)}`,
  },
  {
    label: 'Dépenses', model: 'commune.depense', route: '/depenses',
    fields: [{ name: 'objet' }, { name: 'code_compte' }],
    read: ['objet', 'code_compte', 'montant'],
    title: (r) => `${r.objet}`,
    sub: (r) => `${r.code_compte || ''} · ${ar(r.montant)}`,
  },
];

// Lance la recherche dans tous les modèles en parallèle
export async function globalSearch(q) {
  const groups = await Promise.all(
    SEARCH_MODELS.map(async (m) => {
      try {
        const rows = await searchRead(m.model, textDomain(m.fields, q), m.read, { limit: 5 });
        return { ...m, rows };
      } catch {
        return { ...m, rows: [] };
      }
    })
  );
  return groups.filter((g) => g.rows.length > 0);
}