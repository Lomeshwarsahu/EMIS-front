/**
 * Printable replacement for legacy RDLC exports: renders tables in a new window and opens the print dialog
 * (the user can print or "Save as PDF"). Values are HTML-escaped.
 */
export interface PrintColumn {
  label: string;
  key: string;
}

export interface PrintSection {
  heading?: string;
  columns: PrintColumn[];
  rows: Record<string, unknown>[];
}

export interface PrintDocument {
  title: string;
  /** Label/value pairs shown under the title. */
  info?: [string, unknown][];
  sections: PrintSection[];
  /** Free text (paragraphs) printed after the tables. */
  footerLines?: string[];
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildPrintHtml(doc: PrintDocument): string {
  const info = (doc.info ?? [])
    .map(([label, value]) => `<div><span>${escapeHtml(label)}:</span> <strong>${escapeHtml(value || '-')}</strong></div>`)
    .join('');
  const sections = doc.sections
    .map((section) => {
      const head = section.columns.map((c) => `<th>${escapeHtml(c.label)}</th>`).join('');
      const body = section.rows.length
        ? section.rows
            .map((row) => `<tr>${section.columns.map((c) => `<td>${escapeHtml(row[c.key] ?? '')}</td>`).join('')}</tr>`)
            .join('')
        : `<tr><td colspan="${section.columns.length}" class="empty">No records.</td></tr>`;
      return `${section.heading ? `<h3>${escapeHtml(section.heading)}</h3>` : ''}<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
    })
    .join('');
  const footer = (doc.footerLines ?? []).map((line) => `<p>${escapeHtml(line)}</p>`).join('');

  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(doc.title)}</title>
<style>
body{font-family:Arial,sans-serif;font-size:12px;color:#111;margin:24px}
h2{text-align:center;margin:0 0 6px}
.org{text-align:center;font-weight:600;margin-bottom:12px}
.info{display:grid;grid-template-columns:repeat(2,1fr);gap:4px 24px;margin-bottom:14px}
.info span{color:#555}
h3{font-size:13px;margin:16px 0 6px}
table{width:100%;border-collapse:collapse;margin-bottom:10px}
th,td{border:1px solid #999;padding:4px 6px;text-align:left;vertical-align:top}
th{background:#eee}
td.empty{text-align:center;color:#666}
p{margin:6px 0}
@media print{body{margin:10mm}}
</style></head><body>
<div class="org">Chhattisgarh Medical Services Corporation Ltd.</div>
<h2>${escapeHtml(doc.title)}</h2>
<div class="info">${info}</div>
${sections}${footer}
</body></html>`;
}

/** Opens the document in a new window and starts printing. Returns false when the popup was blocked. */
export function openPrintWindow(doc: PrintDocument): boolean {
  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.open();
  win.document.write(buildPrintHtml(doc));
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
  return true;
}
