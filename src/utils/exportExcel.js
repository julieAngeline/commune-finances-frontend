import * as XLSX from 'xlsx';

export function exportToExcel(rows, columns, filename = 'export') {
  const data = rows.map((r) =>
    Object.fromEntries(
      columns.map((c) => {
        let v = r[c.key];
        if (Array.isArray(v)) v = v[1];            // Many2one -> anarana
        else if (v === false || v == null) v = '';  // champ foana
        return [c.label, v];
      })
    )
  );

  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = columns.map((c) => ({ wch: Math.max(c.label.length + 2, 16) }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Export');
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}