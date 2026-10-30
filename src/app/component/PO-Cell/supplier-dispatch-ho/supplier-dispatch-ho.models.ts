export interface DispatchPendingSupplier {
  SupplierId: number;
  Label: string;
}

export interface DispatchPendingPo {
  PoId: number;
  OutwardNo: string;
  PoNo: string;
  PoDate: string;
  ItemCode: string;
  ItemName: string;
  BasicRate: number | null;
  Gst: number | null;
  NoOfConsignee: number;
  Quantity: number;
  TotalPoValue: number | null;
  DispatchedQty: number;
  Status: string;
  SupplyStatus: string;
}

export interface DispatchBatch {
  IssueId: number;
  PoId: number;
  LocationId: number;
  LocationName: string;
  TentativeDate: string;
  DispatchDate: string;
  DispatchNo: string;
  Quantity: number;
  ReceivedDate: string;
  SupplyStatus: string;
  InstallationStatus: string;
  HasInvoiceDoc: boolean;
}

export interface DispatchConsigneeRow {
  PoId: number;
  PoItemId: number;
  ConsigneeId: number;
  ItemName: string;
  ItemCode: string;
  LocationName: string;
  UnitPrice: number | null;
  Quantity: number;
  TotalPrice: number | null;
  DispatchedQty: number;
  Batches: DispatchBatch[];
}

export interface DispatchConsigneeView {
  PoId: number;
  PoNo: string;
  PoDate: string;
  Rows: DispatchConsigneeRow[];
}

export interface IncompleteDispatchPoOption {
  PoId: number;
  PoNo: string;
  PoDate: string;
  SupplierName: string;
}

export interface IncompleteDispatchHeader {
  PoId: number;
  PoNo: string;
  PoDate: string;
  SupplierName: string;
  ItemName: string;
  ItemCode: string;
  TotalPoQty: number;
  DirectorateId: number;
  DirectorateName: string;
}

export interface IncompleteDispatchHistory {
  PoNo: string;
  PoDate: string;
  SupplierName: string;
  Location: string;
  EntryDate: string;
  Remark: string;
  DocId: number;
}
