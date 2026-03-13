export interface PODetails {
    sno:number
  ponoid: number
  poNo: string
  podt: string
  schemeCode: string
  itemCode: string
  supplierName: string
  supplierId: number
  fileNo: string
  fileDT: string
}
export interface PaymentListDetails {
    sno:number
  poId: number
  tenderNo: string
  poNo: string
  supplier: string
  poDate: string
  itemName: string
  poQty: number
  supplyQty: number
  receiptQty: number
  fitUnfit: any
  presentFile: string
  fileNo: any
  lastRDate: any
}
export interface HeaderPO {
  sno:number
    PoId: number
  PoDate: string
  YearOnly: string
  TenderId: number
  PoNo: string
  SupplierId: number
  TenderNo: string
  TenderDate: string
  Status: string
  Remarks: string
  ItemName: string
  itemcode: string
  FinancialYearId: number
  Year: string
  ApprovedBy: string
  OutwardNo: string
  Poq: number
  Dispatched: number
  ReceiptQty: number
  InsQty: number
  Percentage: number
  BasicRate: number
  ContractItemId: number
  WarrantyYear: number
  Make: string
  Model: string
  TrancheDays: number
  Nosco: number
}
export interface CRIDetailDTO {
    sno:number
  SlNo: number
  ItemDetailId: number
  UType: string
  ModelNo: string
  MakeNo: string
  RecievedDate: string
  InstallationDate: string
  WarentyFrom: string
  WarentyTo: string
  ReceiptItemId: number
  Status: string
  EqupitmentCode: string
  Make: string
  InstallationLocation: string
  TrainingSatisfactorily: string
  CgmscLogPrinted: string
  ManualProvided: string
  OpeningManualProvided: string
  CalibrationCertificateProv: string
  OrgWarrantyCardRec: string
  OtherStatutory: string
  WarrantyValidity: string
  WarrantyCertificateNo: string
  InticatedPoAreReceived: string
  ReceiptId: number
  IssueDetailId: number
  ReceivedQty: number
  WarrantyCardNo: string
  InstallationBy: string
  InstalationReportFile: string
  InstalationPhoto: string
  Challanfile: string
  WarrantyCardFile: string
  Ext: string
  Ext1: string
  ISmongo: string
  PoId: number
  LocationName: string
}
