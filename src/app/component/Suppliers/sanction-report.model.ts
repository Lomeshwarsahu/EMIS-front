export interface SanctionReportItem {
  itemCode: string;
  itemName: string;
  percentValue: number;
  basicRate: number;
  finalRate: number;
  poQty: number;
  poValue: number;
}

export interface SanctionReportLine {
  locationName: string;
  invoiceNo: string;
  invoiceDate: string;
  orderedQty: number;
  invoiceAbsQty: number;
  gst: number;
  basicRate: number;
  sup: number;
  paymentType: string;
  invoiceValueOnBill: number;
  receivedDate: string;
  daysTaken: number;
  ldDays: number;
  penaltyAmount: number;
  logo: string;
  logoPenaltyAmt: number;
}

export interface SanctionTaxLine {
  sanctionId: number;
  taxPer: number;
  taxTypeName: string;
  taxValue: number;
  taxCategory: string;
  taxTypeId: number;
}

export interface SanctionReport {
  poId: number;
  sanctionId: number;
  sanctionNo: string;
  sanctionDate: string;
  finReceiptDate: string;
  poNo: string;
  poDate: string;
  accYear: string;
  supplierName: string;
  schemeName: string;
  outwardNo: string;
  soIssueDate: string;
  supGst: string;
  hsnCode: string;
  remarks: string;
  totalDeductions: number;
  totalAdditions: number;
  paidAmount: number;
  grossInvoiceAmount: number;
  paidAmountWords: string;
  grossAmountWords: string;
  items: SanctionReportItem[];
  lines: SanctionReportLine[];
  taxes: SanctionTaxLine[];
}

export function mapSanctionReport(raw: Record<string, unknown>): SanctionReport {
  const itemsRaw = (raw['items'] ?? raw['Items'] ?? []) as unknown[];
  const linesRaw = (raw['lines'] ?? raw['Lines'] ?? []) as unknown[];
  const taxesRaw = (raw['taxes'] ?? raw['Taxes'] ?? []) as unknown[];

  return {
    poId: Number(raw['poId'] ?? raw['PoId'] ?? 0),
    sanctionId: Number(raw['sanctionId'] ?? raw['SanctionId'] ?? 0),
    sanctionNo: String(raw['sanctionNo'] ?? raw['SanctionNo'] ?? ''),
    sanctionDate: String(raw['sanctionDate'] ?? raw['SanctionDate'] ?? ''),
    finReceiptDate: String(raw['finReceiptDate'] ?? raw['FinReceiptDate'] ?? ''),
    poNo: String(raw['poNo'] ?? raw['PoNo'] ?? ''),
    poDate: String(raw['poDate'] ?? raw['PoDate'] ?? ''),
    accYear: String(raw['accYear'] ?? raw['AccYear'] ?? ''),
    supplierName: String(raw['supplierName'] ?? raw['SupplierName'] ?? ''),
    schemeName: String(raw['schemeName'] ?? raw['SchemeName'] ?? ''),
    outwardNo: String(raw['outwardNo'] ?? raw['OutwardNo'] ?? ''),
    soIssueDate: String(raw['soIssueDate'] ?? raw['SoIssueDate'] ?? ''),
    supGst: String(raw['supGst'] ?? raw['SupGst'] ?? ''),
    hsnCode: String(raw['hsnCode'] ?? raw['HsnCode'] ?? ''),
    remarks: String(raw['remarks'] ?? raw['Remarks'] ?? ''),
    totalDeductions: Number(raw['totalDeductions'] ?? raw['TotalDeductions'] ?? 0),
    totalAdditions: Number(raw['totalAdditions'] ?? raw['TotalAdditions'] ?? 0),
    paidAmount: Number(raw['paidAmount'] ?? raw['PaidAmount'] ?? 0),
    grossInvoiceAmount: Number(raw['grossInvoiceAmount'] ?? raw['GrossInvoiceAmount'] ?? 0),
    paidAmountWords: String(raw['paidAmountWords'] ?? raw['PaidAmountWords'] ?? ''),
    grossAmountWords: String(raw['grossAmountWords'] ?? raw['GrossAmountWords'] ?? ''),
    items: itemsRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
        itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
        percentValue: Number(row['percentValue'] ?? row['PercentValue'] ?? 0),
        basicRate: Number(row['basicRate'] ?? row['BasicRate'] ?? 0),
        finalRate: Number(row['finalRate'] ?? row['FinalRate'] ?? 0),
        poQty: Number(row['poQty'] ?? row['PoQty'] ?? 0),
        poValue: Number(row['poValue'] ?? row['PoValue'] ?? 0),
      };
    }),
    lines: linesRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        locationName: String(row['locationName'] ?? row['LocationName'] ?? ''),
        invoiceNo: String(row['invoiceNo'] ?? row['InvoiceNo'] ?? ''),
        invoiceDate: String(row['invoiceDate'] ?? row['InvoiceDate'] ?? ''),
        orderedQty: Number(row['orderedQty'] ?? row['OrderedQty'] ?? 0),
        invoiceAbsQty: Number(row['invoiceAbsQty'] ?? row['InvoiceAbsQty'] ?? 0),
        gst: Number(row['gst'] ?? row['Gst'] ?? 0),
        basicRate: Number(row['basicRate'] ?? row['BasicRate'] ?? 0),
        sup: Number(row['sup'] ?? row['Sup'] ?? 0),
        paymentType: String(row['paymentType'] ?? row['PaymentType'] ?? ''),
        invoiceValueOnBill: Number(row['invoiceValueOnBill'] ?? row['InvoiceValueOnBill'] ?? 0),
        receivedDate: String(row['receivedDate'] ?? row['ReceivedDate'] ?? ''),
        daysTaken: Number(row['daysTaken'] ?? row['DaysTaken'] ?? 0),
        ldDays: Number(row['ldDays'] ?? row['LdDays'] ?? 0),
        penaltyAmount: Number(row['penaltyAmount'] ?? row['PenaltyAmount'] ?? 0),
        logo: String(row['logo'] ?? row['Logo'] ?? ''),
        logoPenaltyAmt: Number(row['logoPenaltyAmt'] ?? row['LogoPenaltyAmt'] ?? 0),
      };
    }),
    taxes: taxesRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        sanctionId: Number(row['sanctionId'] ?? row['SanctionId'] ?? 0),
        taxPer: Number(row['taxPer'] ?? row['TaxPer'] ?? 0),
        taxTypeName: String(row['taxTypeName'] ?? row['TaxTypeName'] ?? ''),
        taxValue: Number(row['taxValue'] ?? row['TaxValue'] ?? 0),
        taxCategory: String(row['taxCategory'] ?? row['TaxCategory'] ?? ''),
        taxTypeId: Number(row['taxTypeId'] ?? row['TaxTypeId'] ?? 0),
      };
    }),
  };
}
