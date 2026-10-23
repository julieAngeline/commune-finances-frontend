// Colonnes considérées comme des montants (affichées avec l'unité Ariary)
export const MONEY_KEYS = [
  'credit_ouvert', 'cumule', 'disponible', 'montant', 'prevision', 'ecart',
  'excedent_n_moins_1', 'total_recettes', 'total_depenses', 'fonds_libre',
];

const PLAIN = ['annee', 'id'];

export const ar = (v) => `${Number(v || 0).toLocaleString('fr-FR')} Ar`;
export const nomAffiche = (name) => (!name || name === 'Administrator' ? 'Cuf.301' : name);

export const fmtCell = (key, v) => {
  if (Array.isArray(v)) return v[1];
  if (v === false || v == null) return '';
  if (MONEY_KEYS.includes(key)) return ar(v);
  if (typeof v === 'number') return PLAIN.includes(key) ? v : v.toLocaleString('fr-FR');
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v.split('-').reverse().join('/');
  return v;
};