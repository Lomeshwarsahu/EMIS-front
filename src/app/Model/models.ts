export interface PODetails {
    sno:number
  PONOID: number
  PONo: string
  PODT: string
  SchemeCode: string
  ItemCode: string
  SupplierName: string
  SupplierId: number
  FileNo: string
  FileDT: string
}
export interface PaymentListDetails {
  //   sno:number
  // poId: number
  // tenderNo: string
  // poNo: string
  // supplier: string
  // poDate: string
  // itemName: string
  // poQty: number
  // supplyQty: number
  // receiptQty: number
  // fitUnfit: any
  // presentFile: string
  // fileNo: any
  // lastRDate: any
   PoId: number
  TenderNo: string
  PoNo: string
  Supplier: string
  PoDate: string
  ItemName: string
  POQty: number
  SupplyQty: number
  ReceiptQty: number
  FitUnfit: string
  PresentFile: string
  FileNo: string
  LastRDate: string
  FacilityAutName: string
  ItemCode: string
  POValue: number
  InstallationQty: number
  PoType: string
  FileDt: string
  PresentUserId: number
  ToUserId: number
  PenaltyPercent: number
  ReasonId: number
  ReasonName: string
  IsSolved: string
  SiteStatus: string
  RowNo: number
  ToDate: string
  EntDT: string
  Remarks: string
  ExtStatus: string
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
export interface ExtensionEHODTO {
    sno:number
  item_id: number
  PO_ID: number
  CODE: string
  ITEM_NAME: string
  OUTWARD_NO: string
  po_date: string
  PO_NO: string
  quantity: number
  no_of_consignee: number
  basic_rate: number
  percentage: number
  single_unit_price: number
  totalPOvalue: number
  tender_no: string
  status: string
  SD: string
  SubmissionStatus: string
  name: string
}


export interface  ExtensionListDTO
  {
      sno:number
     ExtensionId: number
     PoId: number
      Remark: string
      Days: number
      ExtendedDate: string
      PoEndDate: string
      Path: string
      LetterDate: string
      LetterNo: string
      SysGenApplyDate: string
      Status: string
      Penalty: string
  }