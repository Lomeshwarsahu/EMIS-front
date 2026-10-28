import * as XLSX from 'xlsx';

// Same layout as legacy AddExcel.aspx (Sheet1): A = item code, B = item name, C = EMD amount, D = tender qty. Row 1 is the header.
export interface TenderExcelItemRow {
  ItemCode: string;
  EmdAmount: number;
  TenderQuantity: number;
}

// Legacy lnkDownload_Click: every item from masitems with EMD 0 and qty 0
export function downloadTenderExcelFormat(items: { ItemCode: string; ItemName: string }[] = []) {
  const rows: any[][] = [['code', 'item_name', 'emdamt', 'tenderqty']];
  items.forEach((i) => rows.push([i.ItemCode, i.ItemName, 0, 0]));
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'TenderItemsFormat.xlsx');
}

export function isTenderExcelFile(file: File | null | undefined): boolean {
  return !!file && /\.(xlsx|xls)$/i.test(file.name);
}

export async function readTenderExcelRows(file: File): Promise<TenderExcelItemRow[]> {
  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const ws = wb.Sheets['Sheet1'] || wb.Sheets[wb.SheetNames[0]];
  if (!ws) return [];

  const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false, defval: '' });
  return rows
    .slice(1)
    .map((r) => ({
      ItemCode: String(r[0] ?? '').trim(),
      EmdAmount: Number(r[2]) || 0,
      TenderQuantity: Number(r[3]) || 0,
    }))
    .filter((r) => r.ItemCode !== '');
}
