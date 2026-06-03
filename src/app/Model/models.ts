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
  export interface ItemWiseDetailDTO {
      sno:number
  financial_year_id: number
  item_code_as_per_tender: string
  po_id: number
  tender_no: string
  year: string
  outward_no: string
  po_no: string
  po_date: string
  directorate_id: number
  facility_aut_name: string
  item_name: string
  Supplier: string
  POQTY: number
  Supplyqty: any
  receiptQTY: any
  LastRDate: any
  insqty: any
  potype: string
  balanceToDispatch: number
  BalToReceipt: number
  BalToInstall: number
}

export interface ItemWiseFullDTO {
     sno:number
  po_id: number
  tender_no: string
  year: string
  outward_no: string
  po_no: string
  po_date: string
  directorate_id: number
  facility_aut_name: string
  item_code_as_per_tender: string
  item_name: string
  Supplier: string
  DBStart_Name_En: string
  location_name: string
  POQTY: number
  Supplyqty: number
  receiptQTY: number
  insqty: number
  potype: string
  balanceToDispatch: number
  BalToReceipt: number
  BalToInstall: number
}
export interface IndentPOSummaryDirwiseDTO {
    sno:number
  IndentDT: string
  Indent_Letter_no: string
  po_no: string
  podate: string
  item_code_as_per_tender: string
  item_name: string
  eqtype: string
  Indent_Qty: number
  poqty: number
  no_of_consignee: number
  povalue: number
  indent_consolidation_id: number
  indent_year: string
  po_year: string
}

export interface DistrictWiseDetailDTO {
    sno:number
  potype: string
  tender_no: string
  po_no: string
  po_date: string
  supplier_name: string
  item_code_as_per_tender: string
  item_name: string
  DBStart_Name_En: string
  consignee_id: number
  location_name: string
  po_qty: number
  basicrate: number
  percentage: number
  totalprice: number
  Eqptype: string
  po_id: number
  supply_qty: number
  receiptQTY: number
  insqty: number
}
export interface IndentConsolidationReportDto {
    sno:number
  EquipmentCount: number
  IndentConsolidationId: number
  Description: string
  UserId: number
  DirectorateId: number
  FinancialYearId: number
  ProposedQty: number
  IndentConNo: string
  ConsolidatedDate: string
  FinalQty: number
  EStatus: string
  UploadStatus: string
  CreatedOn: string
}
export interface ContractItem {
      sno:number
  contractItemId: number;
  itemId: number;

  itemCode: string;
  itemName: string;

  make: string;
  model: string;

  supplierName: string;
  tenderNo: string;

  contractDate: string;
  contractEndDate: string;

  basicRate: number;
  gst: number;
  singleUnitPrice: number;

  cmc1: number;
  cmc2: number;
  cmc3: number;
  cmc4: number;
  cmc5: number;

  tenderId: number;
}
export interface TenderSupplierDataDTO {
     sno:number
  ItemId: number
  ItemCode: string
  ItemName: string
  SupplierName: string
  TenderNo: string
  TenderDate: string
  TenderQuantity: number
  BasicRate: number
  GST: number
  AcceptedBasicRate: number
  AcceptedDate: string
  TenderId: number
  SupplierId: number
}
export interface ContractGridDetailDTO {
     sno:number
  AwardOfContractId: number
  ContractItemId: number
  ItemId: number
  ItemCodeE: string
  ItemNameE: string
  BasicRate: number
  Percentage: number
  SingleUnitPrice: number
  Model: string
  ContractDate: string
  ContractDuration: string
  ContractEndDate: string
  SupplierName: string
  TenderNo: string
  TenderId: number
  ContractNewEndDate: string
  Remark: string
}
export interface PoExtensionReportDto {
     sno:number
 SupplierId: number
  SupplierName: string
  ItemId: number
  PoId: number
  Code: string
  ItemName: string
  OutwardNo: string
  PoDate: string
  PoNo: string
  Quantity: number
  NoOfConsignee: number
  BasicRate: number
  Percentage: number
  SingleUnitPrice: number
  TotalPoValue: number
  TenderNo: string
  Status: string
  Sd: string
  SubmissionStatus: string
  TrancheDays: number
  PoEndDate: string
  LetterId: string
  ExtensionId: number
  Remark: string
  Days: number
  ExtendedDate: string
  LastPoEndDate: string
  Path: string
  LetterDate: string
  LetterNo: string
  SysGenApplyDate: string
  LetterStatus: string
}
export interface IndentConsolidationDTO {
     sno:number
  IndentConsolidationId: number
  IndentConNo: string
  IndentDate: string
  ItemCount: number
  Status: string
  FacilityAutName: string
  Description: string
  Path: string
  UserType: string
  Designation: string
  UserId: number
  UserName: string
}
export interface ComplaintDTO {
   sno:number
  ComplaintId: number
  ComplaintNo: string
  ComplaintDate: string
  ItemId: number
  ComplaintDetails: string
  LocationId: number
  SupplierId: number
  ComplaintTroubleId: number
  NotFunctionDate: string
  ItemName: string
  LocationName: string
  ItemCode: string
  UserId: number
  SerialNo: string
  SupplierName: string
  Email: string
  MobileNo: string
  Path: string
  Ext: string
  ExtensionId: number
}
export interface FacilityReportDTO {
   sno:number
  FacilityAutId: number
  FacilityAutName: string
  POtype: string
  NosPO: number
  NosItem: number
  TotalPOValueCr: number
  PValue: number
}

export interface PODetailsReportDTO {
   sno:number
  FacilityAutId: number
  FacilityAutName: string
  PONO: string
  POtype: string
  CODE: string
  ITEM_NAME: string
  PODate: string
  SupplierName: string
  TenderNo: string
  Quantity: number
  PValue: number
  PDate: string
  Percentage: number
  BasicRate: number
}
export interface PaymentPOWiseDTO {
     sno:number
  PoNo: string
  PoDate: string
  OutwardNo: string
  SupplierName: string
  SanctionDate: string
  GrossAmt: number
  TotalDed: number
  TotalAddition: number
  ChequeAmt: number
  AidNo: string
  ChequeDate: string
  BudgetName: string
  BudgetId: number
  SanctionId: number
  PStatus: string
  SupplierId: number
  Potype: string
  PoId: number
  PaymentId: number
  TypeP: string
  AidDate: string
  AdminCharges: number
  ActChequeAmt: number
  AccountNo: string
}
export interface ChequePaymentSummaryDTO {
     sno:number

  Name: string
  SupplierId: number
  CountNOs: number
  ChequeAmt: number
  AdminC: number
  AidNo: string
  ChequeDT: string
  PaidOn: string
  PaymentId: number
  BudgetName: string
  BudgetId: number
  TotalCheque: number
  MobileNo: string
  LenMob: number
  EmailId: string
  Potype: any
}
export interface IndentItemSummaryDTO {
     sno:number
  Code: string
  ItemName: string
  Quantity: number
  BasicRate: number
  Percentage: number
  SingleUnitPrice: number
  TotalPOValue: number
}
export interface IndentDetailsDTO {
   sno:number
  LocationId: number
  LocationName: string
  DP_DistrictID: number
  UserId: number
  UserName: string
  UserType: string
  Designation: string
  Code: string
  ItemName: string
  OutwardNo: string
  PoDate: string
  Quantity: number
  BasicRate: number
  Percentage: number
  SingleUnitPrice: number
  TotalPOValue: number
  SupplierName: string
  MobileNo: string
  TenderNo: string
  TenderDate: string
  Status: string
  Remarks: string
  ItemId: number
  FinancialYearId: number
  Year: string
  TenderId: number
  PoNo: string
  SupplierId: number
  DirectorateId: number
  IndentFundId: number
  PoId: number
}
export interface TenderDto {
   sno:number
  TenderId: number
  TenderNo: string
  TenderDate: string
  TenderDescription: string
  TotalItems: number
  Found: number
  NotFound: number
  PriceEntry: number
  Accept: number
  Reject: number
  Status: string
  Flag: string
  FinancialYearId: number
  WarrantyYear: number
  ImportDays: number
  DomesticDays: number
  CoverA: string
  CoverB: string
  CoverDemo: string
  CoverC: string
  CsId: number
}

export interface POReceiptDTO {
   sno:number
  PoId: number
  TenderNo: string
  Year: string
  OutwardNo: string
  po_no: string
  Pono: string
  PoDate: string
  FacilityAutName: string
  EQPTyp: string
  item_code_as_per_tender: any
  ItemName: string
  Supplier: string
  POQty: number
  SupplyQty: number
  ReceiptQty: number
  LastRDate: string
  InsQty: number
  PoType: string
  CancellationDays: number
  DaysTakenToSupply: number
  LastSupplyDate: string
  Todays: number
}
export interface TenderAllItemStatusDTO {
   sno:number
  TenderId: number
  TenderNo: string
  ItemCodeAsPerTender: string
  ItemName: string
  TenderDate: string
  EndDate: string
  FinalStatus: string
  ItemId: number
  CsId: number
}
export interface MassupplierDTO {
  sno:number
  SupplierId: number
  IsContractor: any
  Name: string
  EmailId: string
  PhNo: string
  Address: string
  SupplierCode: string
  ModuleCode: string
  MobileNo: any
  GSTNo: any
  Type: any
  Class: any
  IsRegister: any
  ServiceEngineerName: string
  ServiceEngineerNumber: string
  TinNo: string
}

export interface SupplierResponseDTO {
  SupplierId: number
  SupplierName: string
  ContactPersonName: string
  ContactPersonNumber: string
  MobileNo: any
  Email: string
  GSTNo: any
  PhnNo: string
  TinNo: string
  Address: string
}

export interface EquipmentItemDTO {
   sno:number
  ContractItemId: any
  ItemName: string
  ItemId: number
  ItemCodeAsPerTender: string
  EstimatedCost: number
  AMC: string
  PM: string
  PmMonth: string
  RCValid: string
  BasicRate: any
  Percentage: any
  TenderNo: string
  Category: string
  CategoryId: number
}
export interface UnmappedItemDTO {
  sno:number
  ItemCodeAsPerTender: string
  ItemName: string
  ItemId: number
  Pid: any
  PItemName: any
}
export interface TenderLinkedItemDto {
  sno:number
   SlNo:number
    ItemId: number
    TenderItemId: number
    TenderId: number
    ItemName: string
    ItemCodeAsPerTender: string
    ItemCode: string
    EmdAmount: number
    TenderQuantity: number
    CategoryName: string
    ItemDesc: string
}
export interface IndentConsolidationDetailDto {
  sno:number
  ItemId: number
  ItemCodeAsPerTender: string
  RcEndDate: string
  ItemDesc: string
  ItemName: string
  FileName: string
  UploadDocId: any
  UploadFolderName: string
  SingleUnitPrice: number
  EstimatedCost: number
  ContractItemId: number
  IndentConsItemsId: any
  IndentConsolidationId: any
  ProposedQty: number
  OtherFundName: string
  FinalQtyI: number
  FinalQty: number
  IndentFundId: any
  IndentMonthId: any
  IndentFundName: string
  IndentMonth: string
  Status: string
}
export interface distcDetailsGrid {
  sno:number
  LocationId: number
  LocationName: string
  DpDistrictId: number
  IndentQuantity: string
  IndentItemId: any
  FacilityTypeId: number
}
export interface HodConversationDTO {
    detailRow: any;
  sno: number;
  SCHEMEID: number;
  SCHEMENAME: string;
  FACILITYTYPECODE: string;
  LetterNo: number;
  LetterDate: string;
  Remarks: string;
  SendDate: string;
  EntryDate: string;
  FileName: string;
  FilePath: string;
  Convid: number;
}
export interface TenderSupplierParticipationDto {
  [x: string]: any
  sno:number
   SlNo:number
    SchStatusDid: number
    // TenderItemId: number
    TenderId: number
    SupplierName: string
    Emd: number
    ReqEMDAMt: number
    SubmittedEMDAMT: number
    TpAmount: number
    EmdDocType: string
    DTypeName: string
    EmdPath: string
    EmdFileName: string
    TpFileName: string
    TpPath: string
    EmdDocNo: string
    SupplierId: number
    Remark: string
    PItems: number
    IsEligibleB: string
    IsCovTechEli: string,
    IsCOVFinEli: string,
    CovATechRemarksBefore_OBClM: string,
    CovAFINRemarksBefore_OBClM: string,
    Csid: number,
    ItemId:number,
    TenderItemId:number,
    ItemName:string,
    ItemCodeAsPerTender:string,
    ItemCode:string,
    TenderQuantity:number
}
export interface GetTenderItemsDTO {
  sno:number
   SlNo:number
    TenderId: number
    FinancialYearId: number
    ItemId: number
    ItemCodeAsPerTender: string
    ItemName: string


}
export interface ParticipationItemDTO {
  sno:number
   SlNo:number
    SchemeId: number
    EmdAmount: number
    ItemId: number
    ItemCode: string
    ItemName: string

    // SlNo": 0,
    // "SchemeId": 680,
    // "ItemCode": "GeMCTSCAN64SLICEGPM",
    // "ItemName": "CT SCAN (64 SLICE) MACHINE",
    // "EmdAmount": 800000,
    // "ItemId": 3646
}
export interface HodReplyDTO {
  sno: number;
  CONRID: number;
  CONVID: number;
  RecvDate: number;
  LetterNo: number;
  LetterDT: string;
  Remarks: string;
  FileName: string;
  FilePath: string;
  EntryBy: string;
  EntryDate: string;
}

export interface RDLCRport {
  TenderNo: string
  LiveDT: string
  TLast: string
  NoSitems: number
  FinalStatus: string
  NosItemsA: string
  AItemsSupplier: string
  CoverA: string
  COVALastDays: any
  NositemsDA: string
  AdaItemsSupplier: string
  ObjClaimLastDate: string
  ObjCStartDT: string
  COVBDT: string
  COVCDT: string
  NoofPriceFound: number
  NosAccepted: number
  NosRejected: number
  DaysTakenFromLiveDT: number
  COVAToObjStartDays: any
  OBJDays: any
  ClaimEndToBDays: any
  CovBToCovCDays: any
  Csid: number
  TenderId: number
  DaysClosed: number
  Show: number
  NosRC: number
}

export interface SupplierGridDto {
  sno: number;
  SupplierId: number
  SupplierCode: string
  SupplierName: string
  CountryName: string
  IsActive: string
  Deletable: string
  Address1: string
  Address2: string
  Address3: string
  City: string
  Zip: string
  ContactPerson: string
  Phone: string
  Fax: string
  Email: string
}
