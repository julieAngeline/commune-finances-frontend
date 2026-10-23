import * as XLSX from 'xlsx-js-style';
import { MONEY_KEYS } from './format';

const FMT_AR = '#,##0 "Ar";-#,##0 "Ar"';   // 5 000 Ar
const FMT_PCT = '0.0" %"';                  // 80.0 %
const PERCENT_KEYS = ['taux_consommation', 'taux_realisation'];

// En-têtes : bleu foncé, texte blanc en gras
const HEADER_STYLE = {
  font: { name: 'Calibri', bold: true, sz: 12, color: { rgb: 'FFFFFF' } },
  fill: { patternType: 'solid', fgColor: { rgb: '1F4E79' } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: {
    top: { style: 'thin', color: { rgb: '1F4E79' } },
    bottom: { style: 'thin', color: { rgb: '1F4E79' } },
    left: { style: 'thin', color: { rgb: '1F4E79' } },
    right: { style: 'thin', color: { rgb: '1F4E79' } },
  },
};

const cellText = (r, c) => {
  const v = r[c.key];
  if (Array.isArray(v)) return v[1];
  if (v === false || v == null) return '';
  return v;
};

export function exportToExcel(rows, columns, filename = 'export') {
  const data = rows.map((r) =>
    Object.fromEntries(columns.map((c) => [c.label, cellText(r, c)]))
  );

  const ws = XLSX.utils.json_to_sheet(data, { header: columns.map((c) => c.label) });

  columns.forEach((c, i) => {
    // 1) En-tête (ligne 1)
    const head = XLSX.utils.encode_cell({ r: 0, c: i });
    if (ws[head]) ws[head].s = HEADER_STYLE;

    // 2) Format des cellules : montants en Ar, taux en %
    const isMoney = MONEY_KEYS.includes(c.key);
    const isPct = PERCENT_KEYS.includes(c.key);
    if (!isMoney && !isPct) return;

    rows.forEach((_, k) => {
      const ref = XLSX.utils.encode_cell({ r: k + 1, c: i });
      if (ws[ref] && typeof ws[ref].v === 'number') {
        ws[ref].z = isMoney ? FMT_AR : FMT_PCT;
      }
    });
  });

  ws['!rows'] = [{ hpt: 26 }];

  // Largeur des colonnes selon le contenu (+ place pour « Ar »)
  ws['!cols'] = columns.map((c) => {
    const extra = MONEY_KEYS.includes(c.key) ? 4 : 0;
    const longest = Math.max(
      c.label.length,
      ...rows.map((r) => String(cellText(r, c)).length)
    );
    return { wch: Math.min(Math.max(longest + 4 + extra, 14), 45) };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Export');
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}