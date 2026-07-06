export interface InstallationReportRow {
  slNo: number;
  itemDetailId: number;
  serialNo: string;
  installationDate: string;
  warrantyFrom: string;
  warrantyTo: string;
  receivedQty: number;
  warrantyCardNo: string;
  installationLocation: string;
  isMongo: boolean;
  hasInstallationReport: boolean;
  hasInstallationPhoto: boolean;
  hasWarrantyCard: boolean;
  hasChallan: boolean;
}

export interface InstallationReportPage {
  receiptId: number;
  receivedDate: string;
  bulkInst: boolean;
  hasBulkInstallationReport: boolean;
  hasBulkInstallationPhoto: boolean;
  hasBulkWarrantyCard: boolean;
  hasBulkChallan: boolean;
  rows: InstallationReportRow[];
}

export interface InstallationPrintReport {
  itemDetailId: number;
  itemName: string;
  supplierName: string;
  supplyQty: string;
  poNo: string;
  serialNo: string;
  consigneeAddress: string;
  receiptDate: string;
  installationLocation: string;
  trainingItemName: string;
  warrantyValidity: string;
  cgmscLogoPrinted: string;
  serviceManualProvided: string;
  operatingManualProvided: string;
  calibrationCertificateProvided: string;
  originalWarrantyCardReceived: string;
  otherStatutoryDocuments: string;
  allAccessoriesReceived: string;
  dispatchNo: string;
  dispatchDate: string;
}

export function mapInstallationReportPage(raw: Record<string, unknown>): InstallationReportPage {
  const rowsRaw = raw['rows'] ?? raw['Rows'] ?? [];
  const rows = Array.isArray(rowsRaw)
    ? rowsRaw.map((row) => mapInstallationReportRow(row as Record<string, unknown>))
    : [];

  return {
    receiptId: Number(raw['receiptId'] ?? raw['ReceiptId'] ?? 0),
    receivedDate: String(raw['receivedDate'] ?? raw['ReceivedDate'] ?? ''),
    bulkInst: Boolean(raw['bulkInst'] ?? raw['BulkInst']),
    hasBulkInstallationReport: Boolean(
      raw['hasBulkInstallationReport'] ?? raw['HasBulkInstallationReport'],
    ),
    hasBulkInstallationPhoto: Boolean(
      raw['hasBulkInstallationPhoto'] ?? raw['HasBulkInstallationPhoto'],
    ),
    hasBulkWarrantyCard: Boolean(raw['hasBulkWarrantyCard'] ?? raw['HasBulkWarrantyCard']),
    hasBulkChallan: Boolean(raw['hasBulkChallan'] ?? raw['HasBulkChallan']),
    rows,
  };
}

function mapInstallationReportRow(row: Record<string, unknown>): InstallationReportRow {
  return {
    slNo: Number(row['slNo'] ?? row['SlNo'] ?? 0),
    itemDetailId: Number(row['itemDetailId'] ?? row['ItemDetailId'] ?? 0),
    serialNo: String(row['serialNo'] ?? row['SerialNo'] ?? ''),
    installationDate: String(row['installationDate'] ?? row['InstallationDate'] ?? ''),
    warrantyFrom: String(row['warrantyFrom'] ?? row['WarrantyFrom'] ?? ''),
    warrantyTo: String(row['warrantyTo'] ?? row['WarrantyTo'] ?? ''),
    receivedQty: Number(row['receivedQty'] ?? row['ReceivedQty'] ?? 0),
    warrantyCardNo: String(row['warrantyCardNo'] ?? row['WarrantyCardNo'] ?? ''),
    installationLocation: String(row['installationLocation'] ?? row['InstallationLocation'] ?? ''),
    isMongo: Boolean(row['isMongo'] ?? row['IsMongo']),
    hasInstallationReport: Boolean(row['hasInstallationReport'] ?? row['HasInstallationReport']),
    hasInstallationPhoto: Boolean(row['hasInstallationPhoto'] ?? row['HasInstallationPhoto']),
    hasWarrantyCard: Boolean(row['hasWarrantyCard'] ?? row['HasWarrantyCard']),
    hasChallan: Boolean(row['hasChallan'] ?? row['HasChallan']),
  };
}

export function mapInstallationPrintReport(raw: Record<string, unknown>): InstallationPrintReport {
  return {
    itemDetailId: Number(raw['itemDetailId'] ?? raw['ItemDetailId'] ?? 0),
    itemName: String(raw['itemName'] ?? raw['ItemName'] ?? ''),
    supplierName: String(raw['supplierName'] ?? raw['SupplierName'] ?? ''),
    supplyQty: String(raw['supplyQty'] ?? raw['SupplyQty'] ?? ''),
    poNo: String(raw['poNo'] ?? raw['PoNo'] ?? ''),
    serialNo: String(raw['serialNo'] ?? raw['SerialNo'] ?? ''),
    consigneeAddress: String(raw['consigneeAddress'] ?? raw['ConsigneeAddress'] ?? ''),
    receiptDate: String(raw['receiptDate'] ?? raw['ReceiptDate'] ?? ''),
    installationLocation: String(raw['installationLocation'] ?? raw['InstallationLocation'] ?? ''),
    trainingItemName: String(raw['trainingItemName'] ?? raw['TrainingItemName'] ?? ''),
    warrantyValidity: String(raw['warrantyValidity'] ?? raw['WarrantyValidity'] ?? ''),
    cgmscLogoPrinted: String(raw['cgmscLogoPrinted'] ?? raw['CgmscLogoPrinted'] ?? ''),
    serviceManualProvided: String(raw['serviceManualProvided'] ?? raw['ServiceManualProvided'] ?? ''),
    operatingManualProvided: String(
      raw['operatingManualProvided'] ?? raw['OperatingManualProvided'] ?? '',
    ),
    calibrationCertificateProvided: String(
      raw['calibrationCertificateProvided'] ?? raw['CalibrationCertificateProvided'] ?? '',
    ),
    originalWarrantyCardReceived: String(
      raw['originalWarrantyCardReceived'] ?? raw['OriginalWarrantyCardReceived'] ?? '',
    ),
    otherStatutoryDocuments: String(
      raw['otherStatutoryDocuments'] ?? raw['OtherStatutoryDocuments'] ?? '',
    ),
    allAccessoriesReceived: String(
      raw['allAccessoriesReceived'] ?? raw['AllAccessoriesReceived'] ?? '',
    ),
    dispatchNo: String(raw['dispatchNo'] ?? raw['DispatchNo'] ?? ''),
    dispatchDate: String(raw['dispatchDate'] ?? raw['DispatchDate'] ?? ''),
  };
}
