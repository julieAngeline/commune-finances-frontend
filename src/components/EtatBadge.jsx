const ETATS = {
  a_venir:        { label: 'À venir',                 bg: 'rgba(14,165,233,0.15)',  fg: '#0ea5e9' },
  ouvert:         { label: 'Ouvert',                  bg: 'rgba(16,185,129,0.15)',  fg: '#10b981' },
  complementaire: { label: 'Période complémentaire',  bg: 'rgba(245,158,11,0.18)',  fg: '#f59e0b' },
  cloture:        { label: 'Clôturé',                 bg: 'rgba(156,163,175,0.25)', fg: '#6b7280' },
};

export default function EtatBadge({ etat }) {
  const e = ETATS[etat] || { label: etat, bg: 'rgba(156,163,175,0.25)', fg: '#6b7280' };
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
      background: e.bg, color: e.fg, whiteSpace: 'nowrap',
    }}>
      {e.label}
    </span>
  );
}

// Légende affichée à la place des boutons Clôturer / Réouvrir
export function EtatLegende({ row }) {
  const n = row.annee;
  const today = new Date();
  const finDep = new Date(n + 1, 0, 20, 23, 59);
  const finRec = new Date(n + 1, 6, 31, 23, 59);

  let lignes = [];
  if (row.etat === 'a_venir') {
    lignes = [`Ouverture le 01/01/${n}`, 'Aucune opération avant cette date'];
  } else if (row.etat === 'cloture') {
    lignes = ['Verrouillé : aucune modification possible'];
  } else {
    lignes = [
      `Dépenses jusqu'au 20/01/${n + 1}${today > finDep ? ' (terminé)' : ''}`,
      `Recettes jusqu'au 31/07/${n + 1}${today > finRec ? ' (terminé)' : ''}`,
    ];
  }
  return (
    <span style={{ marginLeft: 10, fontSize: 11.5, lineHeight: 1.35, color: 'var(--muted)', display: 'inline-block', verticalAlign: 'middle' }}>
      {lignes.map((l) => <span key={l} style={{ display: 'block' }}>{l}</span>)}
    </span>
  );
}