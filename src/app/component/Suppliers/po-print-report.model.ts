export interface PoPrintItem {
  itemCode: string;
  itemName: string;
  model: string;
  quantity: number;
  singleUnitPrice: number;
  lineAmount: number;
}

export interface PoPrintTerm {
  termConditionId: number;
  termCondition: string;
}

export interface PoPrintConsignee {
  consolidatedDate: string;
  locationName: string;
  quantity: number;
}

export interface PoPrintCopyTo {
  designation: string;
  office: string;
}

export interface PoPrintReport {
  poId: number;
  outwardNo: string;
  poDate: string;
  poNo: string;
  supplierName: string;
  supplierAddress: string;
  mobileNo: string;
  emailId: string;
  tenderNo: string;
  tenderDate: string;
  totalPoValueWords: string;
  basicRate: number;
  gstPercent: number;
  trancheDays: number;
  gemPo: string;
  cmc1: string;
  cmc2: string;
  cmc3: string;
  cmc4: string;
  cmc5: string;
  amendNo: string;
  previousOutwardNo: string;
  previousPoDate: string;
  itemsTotal: number;
  items: PoPrintItem[];
  terms: PoPrintTerm[];
  consignees: PoPrintConsignee[];
  copyTo: PoPrintCopyTo[];
}

export function mapPoPrintReport(raw: Record<string, unknown>): PoPrintReport {
  const itemsRaw = raw['items'] ?? raw['Items'] ?? [];
  const termsRaw = raw['terms'] ?? raw['Terms'] ?? [];
  const consigneesRaw = raw['consignees'] ?? raw['Consignees'] ?? [];
  const copyToRaw = raw['copyTo'] ?? raw['CopyTo'] ?? [];

  return {
    poId: Number(raw['poId'] ?? raw['PoId'] ?? 0),
    outwardNo: String(raw['outwardNo'] ?? raw['OutwardNo'] ?? ''),
    poDate: String(raw['poDate'] ?? raw['PoDate'] ?? ''),
    poNo: String(raw['poNo'] ?? raw['PoNo'] ?? ''),
    supplierName: String(raw['supplierName'] ?? raw['SupplierName'] ?? ''),
    supplierAddress: String(raw['supplierAddress'] ?? raw['SupplierAddress'] ?? ''),
    mobileNo: String(raw['mobileNo'] ?? raw['MobileNo'] ?? ''),
    emailId: String(raw['emailId'] ?? raw['EmailId'] ?? ''),
    tenderNo: String(raw['tenderNo'] ?? raw['TenderNo'] ?? ''),
    tenderDate: String(raw['tenderDate'] ?? raw['TenderDate'] ?? ''),
    totalPoValueWords: String(raw['totalPoValueWords'] ?? raw['TotalPoValueWords'] ?? ''),
    basicRate: Number(raw['basicRate'] ?? raw['BasicRate'] ?? 0),
    gstPercent: Number(raw['gstPercent'] ?? raw['GstPercent'] ?? 0),
    trancheDays: Number(raw['trancheDays'] ?? raw['TrancheDays'] ?? 0),
    gemPo: String(raw['gemPo'] ?? raw['GemPo'] ?? ''),
    cmc1: String(raw['cmc1'] ?? raw['Cmc1'] ?? ''),
    cmc2: String(raw['cmc2'] ?? raw['Cmc2'] ?? ''),
    cmc3: String(raw['cmc3'] ?? raw['Cmc3'] ?? ''),
    cmc4: String(raw['cmc4'] ?? raw['Cmc4'] ?? ''),
    cmc5: String(raw['cmc5'] ?? raw['Cmc5'] ?? ''),
    amendNo: String(raw['amendNo'] ?? raw['AmendNo'] ?? ''),
    previousOutwardNo: String(raw['previousOutwardNo'] ?? raw['PreviousOutwardNo'] ?? ''),
    previousPoDate: String(raw['previousPoDate'] ?? raw['PreviousPoDate'] ?? ''),
    itemsTotal: Number(raw['itemsTotal'] ?? raw['ItemsTotal'] ?? 0),
    items: Array.isArray(itemsRaw)
      ? itemsRaw.map((row) => mapPoPrintItem(row as Record<string, unknown>))
      : [],
    terms: Array.isArray(termsRaw)
      ? termsRaw.map((row) => mapPoPrintTerm(row as Record<string, unknown>))
      : [],
    consignees: Array.isArray(consigneesRaw)
      ? consigneesRaw.map((row) => mapPoPrintConsignee(row as Record<string, unknown>))
      : [],
    copyTo: Array.isArray(copyToRaw)
      ? copyToRaw.map((row) => mapPoPrintCopyTo(row as Record<string, unknown>))
      : [],
  };
}

function mapPoPrintItem(row: Record<string, unknown>): PoPrintItem {
  return {
    itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
    itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
    model: String(row['model'] ?? row['Model'] ?? ''),
    quantity: Number(row['quantity'] ?? row['Quantity'] ?? 0),
    singleUnitPrice: Number(row['singleUnitPrice'] ?? row['SingleUnitPrice'] ?? 0),
    lineAmount: Number(row['lineAmount'] ?? row['LineAmount'] ?? 0),
  };
}

function mapPoPrintTerm(row: Record<string, unknown>): PoPrintTerm {
  return {
    termConditionId: Number(row['termConditionId'] ?? row['TermConditionId'] ?? 0),
    termCondition: String(row['termCondition'] ?? row['TermCondition'] ?? ''),
  };
}

function mapPoPrintConsignee(row: Record<string, unknown>): PoPrintConsignee {
  return {
    consolidatedDate: String(row['consolidatedDate'] ?? row['ConsolidatedDate'] ?? ''),
    locationName: String(row['locationName'] ?? row['LocationName'] ?? ''),
    quantity: Number(row['quantity'] ?? row['Quantity'] ?? 0),
  };
}

function mapPoPrintCopyTo(row: Record<string, unknown>): PoPrintCopyTo {
  return {
    designation: String(row['designation'] ?? row['Designation'] ?? ''),
    office: String(row['office'] ?? row['Office'] ?? ''),
  };
}
