import { QmHofaReportRow } from '@qm/app/api/qualificationsApi';

// "115-2026" → 115 (para ordenar las columnas por indicador)
const uidOf = (key: string) => parseInt(key, 10) || 0;

const esc = (s: string) =>
  (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// sin ceros de más: 0.25 → 0.25 · 3 → 3 · -0.1 → -0.1
const fmt = (v: number) => Number(v.toFixed(4));

/**
 * Exporta una matriz (personas × métricas) a un archivo .xls que Excel abre
 * directo, sin librerías. Columnas: Name · Total · una por cada indicador.
 */
export function exportQualityMatrix(
  rows: QmHofaReportRow[],
  opts: { filename: string; totalLabel: string; totalOf: (r: QmHofaReportRow) => number },
) {
  if (rows.length === 0) return;

  // Unión de todos los indicadores (IRM trae un set distinto), ordenados por uid
  const colMap = new Map<string, { label: string; uid: number }>();
  rows.forEach((r) =>
    r.indicators.forEach((i) => {
      if (!colMap.has(i.indicatorsUniqueKey))
        colMap.set(i.indicatorsUniqueKey, { label: i.indicatorLabel, uid: uidOf(i.indicatorsUniqueKey) });
    }),
  );
  const cols = Array.from(colMap.entries()).sort((a, b) => a[1].uid - b[1].uid);

  const header =
    '<tr>' +
    `<th>Name</th><th>${esc(opts.totalLabel)}</th>` +
    cols.map(([, c]) => `<th>${esc(c.label)}</th>`).join('') +
    '</tr>';

  const body = rows
    .map((r) => {
      const byKey = new Map(r.indicators.map((i) => [i.indicatorsUniqueKey, i.score]));
      const cells = cols
        .map(([key]) => {
          const v = byKey.get(key);
          return v === undefined ? '<td></td>' : `<td>${fmt(v)}</td>`;
        })
        .join('');
      return `<tr><td>${esc(r.name ?? '')}</td><td>${fmt(opts.totalOf(r))}</td>${cells}</tr>`;
    })
    .join('');

  const html =
    '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head>' +
    `<body><table border="1">${header}${body}</table></body></html>`;

  const blob = new Blob(['﻿' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = opts.filename.endsWith('.xls') ? opts.filename : `${opts.filename}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
