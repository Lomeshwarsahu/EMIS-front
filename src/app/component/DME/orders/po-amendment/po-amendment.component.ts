import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage } from '../../shared/session.util';

interface PoAmendmentHeader {
  PoId: number;
  ItemName: string;
  ItemCode: string;
  SchemeName: string;
  AccYear: string;
  PoNo: string;
  PoDate: string;
  SoIssueDt: string;
  OutwardNo: string;
  SupplierName: string;
  TotalPoQty: number;
  PoValue: number;
  BasicRate: number;
  GstPercent: number;
  FinalRate: number;
}

interface PoAmendmentType {
  AmendId: number;
  AmenmentType: string;
}

interface PoAmendmentHistoryRow {
  PoAmmdId: number;
  PoNo: string;
  AmendDate: string;
  NastiLetterNo: string;
  Remark: string;
  FileName: string;
  Ext: string;
}

@Component({
  selector: 'app-po-amendment',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './po-amendment.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './po-amendment.component.css'],
})
export class PoAmendmentComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  get downloadUrl(): string {
    return `${this.apiRoot}po-amendment/file/`;
  }

  header: PoAmendmentHeader | null = null;
  types: PoAmendmentType[] = [];
  history: PoAmendmentHistoryRow[] = [];
  loading = false;
  saving = false;

  dispatchNo = '';
  amendDate = '';
  remarks = '';
  amendTypeId = 0;
  isReprintReq: 'Y' | 'N' = 'N';
  selectedFile: File | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const poId = Number(params.get('Poid') || params.get('poId') || 0);
      if (!poId) {
        this.toastr.error('PO id is required.');
        return;
      }
      this.loadAll(poId);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (file && !file.name.toLowerCase().endsWith('.pdf')) {
      this.toastr.warning('Please upload pdf file only.');
      input.value = '';
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
  }

  canSave(): boolean {
    return !!(
      this.header &&
      this.amendTypeId > 0 &&
      this.amendDate &&
      this.remarks.trim() &&
      this.selectedFile
    );
  }

  save(): void {
    if (!this.header) return;
    if (!this.amendTypeId) {
      this.toastr.warning('Please Select Amendment Type.');
      return;
    }
    if (!this.amendDate) {
      this.toastr.warning('Amendment Date is required.');
      return;
    }
    if (!this.remarks.trim()) {
      this.toastr.warning('Remark should not be empty.');
      return;
    }
    if (!this.selectedFile) {
      this.toastr.warning('Upload PDF File of Nasti/Letter.');
      return;
    }

    const formData = new FormData();
    formData.append('poId', String(this.header.PoId));
    formData.append('dispatchNo', this.dispatchNo);
    formData.append('amendDate', this.amendDate);
    formData.append('prevSoIssueDt', this.header.SoIssueDt || '');
    formData.append('prevSoIssueNo', this.header.OutwardNo || '');
    formData.append('remarks', this.remarks);
    formData.append('amendTypeId', String(this.amendTypeId));
    formData.append('isReprintReq', this.isReprintReq);
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.saving = true;
    this.http.post<{ message?: string }>(`${this.apiRoot}po-amendment`, formData).subscribe({
      next: (res) => {
        this.saving = false;
        this.toastr.success(res?.message ?? 'Saved Successfully');
        this.dispatchNo = '';
        this.amendDate = '';
        this.remarks = '';
        this.amendTypeId = 0;
        this.isReprintReq = 'N';
        this.selectedFile = null;
        this.loadAll(this.header?.PoId ?? 0);
      },
      error: (e) => {
        this.saving = false;
        this.toastr.error(apiErrorMessage(e, 'Could not save amendment.'));
      },
    });
  }

  private loadAll(poId: number): void {
    this.loading = true;
    this.http.get<PoAmendmentHeader>(`${this.apiRoot}po-amendment/header?poId=${poId}`).subscribe({
      next: (h) => {
        this.header = h;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load PO header.'));
      },
    });

    this.http.get<PoAmendmentType[]>(`${this.apiRoot}po-amendment/types`).subscribe({
      next: (res) => {
        this.types = Array.isArray(res) ? res : [];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load amendment types.')),
    });

    this.http.get<PoAmendmentHistoryRow[]>(`${this.apiRoot}po-amendment/history?poId=${poId}`).subscribe({
      next: (res) => {
        this.history = Array.isArray(res) ? res : [];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load amendment history.')),
    });
  }
}
