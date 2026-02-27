export interface vendorBankDetail_model {

    bankaccountid:any;
    accountname: any;
    acno: string;
    // {
    //     "bankaccountid": "254",
    //     "accountname": "Maan Pharmaceuticals Limited",
    //     "acno": " AC. NO : - 00011305000275 IFSC :- MSNU0000001 The Mehsana Urben Co-Operative Bank Ltd, Main Branch, Urban Bank Road, Highway, Mehsana-384002"
    //   }
   
  }


  export interface SupplierBankAccDetail_model {
    supplierid: number
    bankaccountid: number
    accountname: string
    accountno: string
    bankname: string
    branch: string
    ifsccode: string
    defaultacc: boolean
  }


  
  export class UpdateBankDetails_model {
    VendorRegistrationId: string | undefined;
    SelectedBankAccountId: number| undefined;
    AccountNumber: string| undefined;
    AccountHolderName: string| undefined;
    BankName: string| undefined;
    BranchName: string| undefined;
    IFSCCode: string| undefined;
    supplierid: string| undefined;
    BankDetailDocument:string| undefined;
  }
  export class UpdateAnnualTurnover_model {
    Atid: string | undefined;
    VregId: string| undefined;
    SupplierId: string| undefined;
    AccYrSetId: string| undefined;
    TurnOverAmt: string| undefined;
    UDINNO: string| undefined;
    TurnOverDocument:string| undefined;
  }
  export class GetAnnualTurnoverDetail {
    sno:any
    slno: number | undefined;
    atid: number| undefined;
    accyear: string| undefined;
    accyrsetid: number| undefined;
    turnoveramt: number| undefined;
    filename: string| undefined;
    ext: string| undefined;
    filepath: string| undefined;
    udinno: string| undefined;
    isapprove!: string
    approvedt: any
    approvereason: any

  }
  export class BankMandateDetail {
    sno:any;
    bankaccountid: number| undefined;
    supplierid: number| undefined;
    accountname: string| undefined;
    accountno: string| undefined;
    bankname: string| undefined;
    branch: string| undefined;
    ifsccode: string| undefined;
    defaultacc: boolean| undefined;
    isapprove!: string
    approvedt: any
    approvereason: any
  }
  export class MassuppliergstDetails {
    sno:any;
    gstid: number| undefined;
    gstno: string| undefined;
    filename: string| undefined;
    filepath: string| undefined;
    statename: string| undefined;
    stateid: number| undefined;
    vregid: number| undefined;
    isapprove!: string
    approvedt: any
    approvereason: any
  }
  export class GstReturnDetails {
    sno:any;
    retid: number| undefined;
    gstid: number| undefined;
    gstno: string| undefined;
    accyear: string| undefined;
    gstqtrid: number| undefined;
    quartername: string| undefined;
    startmonth: string| undefined;
    endmonth: string| undefined;
    filename: string| undefined;
    filepath: string| undefined;
    isapprove!: string
    approvedt: any
    approvereason: any
  }
  export class licenseModel  {
    licid: number| undefined;
    manfacname: string| undefined;
    formname: string| undefined;
    unitname: string| undefined;
  }


  export interface ComplienceCertificateDetails {
    detailRow: any;
    sno:any;
    licno: string
    unitname: string
    whono: string
    comid: number
    comname: string
    issuedate: string
    startdate: string
    validitydate: string
    remarks: string
    whotype: string
    whoid: number
    vregid: number
    supplierid: number
    filename: string
    ext: string
    licid: number
    filepath: string
    iswhoaccepted: string
    iswhoaccepteddt: any
    whoaccrejremarks: any
  }
  export interface GetCOMTyepDetails {
    sno: any;
    whotypeid: number;
    whoid: number;
    whono: string;
    itemtypeid: number;
    itemtypename: string;
    vregid: number;
  }
  export interface GetGCPDetails {
    sno:any;
    gcpid: number
    vregid: number
    gcpno: string
    issuedate: string
    startdate: any
    expdate: string
    filename: string
    filepath: string
    entrydate: string
    isgcpaccepted: string
    isgcpaccepteddt: string
    gcpaccrejremarks: string
  }

  export interface TechnicalDetails_model {
    sno:any;
    vregid: string
    mscid: string
    filename: string
    ext: string
    fileid: string
    code: string
    filepath: string
    ismfaccepted: string
    mfaccrejremarks: any
    ismfaccepteddt: any
   
  }
  export interface registeredVendorsdata {
    sno:any
    vregid: number
    vregno: string
    regdate: string
    bankaccountid: string
    pancardno: string
    status: string
    supplierName: string
    phone1: string
    authName: any
    authEmail: any
    authMobileNo: any
    authSigName: any
    authSigMobileNo: any
    authSigEmailId: any
    supplierid: string
  }