import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmdSupplierOption {
  supplierId: number;
  supplierName: string;
}

export interface EmdTenderOption {
  tenderId: number;
  tenderNo: string;
}

export interface EmdRefundPendingRow {
  id: number;
  supId: number;
  supplierName: string;
  tenderNo: string;
  emdAmt: number;
  emdType: string;
  emdDocumentNo: string;
  emdDocument: string;
  emdDepositDate: string;
  entryDate: string;
  hasFile: boolean;
  status?: string;
  selected?: boolean;
}

export interface SdReleasePendingRow {
  poId: number;
  tenderNo: string;
  poNo: string;
  poDate: string;
  supplierName: string;
  sdAmount: number;
  sdType: string;
  sdIssueDate: string;
  sdMaturityDate: string;
  sdEntryDate: string;
  sdDetailsId: number;
  selected?: boolean;
}

export interface SdReleaseRequest {
  poIds: number[];
  releaseAmount: number;
  recoveredAmount: number;
  releaseType: string;
  refundDate: string;
  chequeNo: string;
  remarks: string;
}

@Injectable({ providedIn: 'root' })
export class EmdRefundApiService {
  private readonly base = `${environment.apiUrl}/EMDRefund`;

  constructor(private readonly http: HttpClient) {}

  getSuppliers(): Observable<EmdSupplierOption[]> {
    return this.http.get<EmdSupplierOption[]>(`${this.base}/suppliers`);
  }

  getTenders(): Observable<EmdTenderOption[]> {
    return this.http.get<EmdTenderOption[]>(`${this.base}/tenders`);
  }

  getPendingEmd(supplierId: number = 0, tenderId: number = 0): Observable<EmdRefundPendingRow[]> {
    return this.http.get<EmdRefundPendingRow[]>(
      `${this.base}/pending-emd?supplierId=${supplierId}&tenderId=${tenderId}`
    );
  }

  approveEmd(items: { id: number; supId: number }[]): Observable<any> {
    return this.http.post(`${this.base}/approve-emd`, { items });
  }

  getSdSuppliers(tenderId: number = 0): Observable<EmdSupplierOption[]> {
    return this.http.get<EmdSupplierOption[]>(`${this.base}/sd-suppliers?tenderId=${tenderId}`);
  }

  getPendingSd(supplierId: number = 0, tenderId: number = 0): Observable<SdReleasePendingRow[]> {
    return this.http.get<SdReleasePendingRow[]>(
      `${this.base}/pending-sd?supplierId=${supplierId}&tenderId=${tenderId}`
    );
  }

  releaseSd(data: SdReleaseRequest): Observable<any> {
    return this.http.post(`${this.base}/release-sd`, data);
  }
}
