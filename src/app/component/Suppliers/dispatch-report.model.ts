export interface DispatchReport {
  poId: number;
  locationId: number;
  issueId: number;
  dispatchNo: string;
  dispatchDate: string;
  itemCode: string;
  itemName: string;
  poNo: string;
  poDate: string;
  tenderNo: string;
  consigneeName: string;
  modelNo: string;
  make: string;
  basicRate: number;
  totalNetPoValue: number;
  totalGrossPoValue: number;
  poQtyForConsignee: number;
  supplyDays: string;
  taxPercent: number;
  challanNo: string;
  challanDate: string;
  invoiceNo: string;
  invoiceDate: string;
  remarks: string;
}

export function mapDispatchReport(row: Record<string, unknown>): DispatchReport {
  return {
    poId: Number(row['poId'] ?? row['PoId'] ?? 0),
    locationId: Number(row['locationId'] ?? row['LocationId'] ?? 0),
    issueId: Number(row['issueId'] ?? row['IssueId'] ?? 0),
    dispatchNo: String(row['dispatchNo'] ?? row['DispatchNo'] ?? ''),
    dispatchDate: String(row['dispatchDate'] ?? row['DispatchDate'] ?? ''),
    itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
    itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
    poNo: String(row['poNo'] ?? row['PoNo'] ?? ''),
    poDate: String(row['poDate'] ?? row['PoDate'] ?? ''),
    tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
    consigneeName: String(row['consigneeName'] ?? row['ConsigneeName'] ?? ''),
    modelNo: String(row['modelNo'] ?? row['ModelNo'] ?? ''),
    make: String(row['make'] ?? row['Make'] ?? ''),
    basicRate: Number(row['basicRate'] ?? row['BasicRate'] ?? 0),
    totalNetPoValue: Number(row['totalNetPoValue'] ?? row['TotalNetPoValue'] ?? 0),
    totalGrossPoValue: Number(row['totalGrossPoValue'] ?? row['TotalGrossPoValue'] ?? 0),
    poQtyForConsignee: Number(row['poQtyForConsignee'] ?? row['PoQtyForConsignee'] ?? 0),
    supplyDays: String(row['supplyDays'] ?? row['SupplyDays'] ?? ''),
    taxPercent: Number(row['taxPercent'] ?? row['TaxPercent'] ?? 0),
    challanNo: String(row['challanNo'] ?? row['ChallanNo'] ?? ''),
    challanDate: String(row['challanDate'] ?? row['ChallanDate'] ?? ''),
    invoiceNo: String(row['invoiceNo'] ?? row['InvoiceNo'] ?? ''),
    invoiceDate: String(row['invoiceDate'] ?? row['InvoiceDate'] ?? ''),
    remarks: String(row['remarks'] ?? row['Remarks'] ?? ''),
  };
}
