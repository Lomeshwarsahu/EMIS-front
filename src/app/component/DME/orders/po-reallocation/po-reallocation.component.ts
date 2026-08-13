import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage } from '../../shared/session.util';

interface PoReallocationHeader {
  PoId: number;
  ItemName: string;
  ItemCode: string;
  PoNo: string;
  PoDate: string;
  SupplierName: string;
  TotalPoQty: number;
  DirectorateName: string;
  DirectorateId: number;
}

interface PoReallocationRow {
  PoId: number;
  PoItemId: number;
  ConsigneeId: number;
  IndentItemId: number;
  IndentId: number;
  IndentConsolidationId: number;
  LocationName: string;
  Quantity: number;
  IssueId: number;
  DLocation: string;
  ReceiptId: number;
  RLocation: string;
  CanReallocate: boolean;
  checked: boolean;
  selectedDistrict: number;
  selectedLocation: number;
}

interface DistrictOption {
  DistrictId: number;
  DistrictName: string;
}

interface LocationOption {
  LocationId: number;
  LocationName: string;
}

interface HistoryRow {
  PoNo: string;
  OldLocation: string;
  NewLocation: string;
  Remark: string;
  EntryDate: string;
  ExtensionId: number;
  Path: string;
  Ext: string;
}

@Component({
  selector: 'app-po-reallocation',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './po-reallocation.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './po-reallocation.component.css'],
})
export class PoReallocationComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  get downloadUrl(): string {
    return `${this.apiRoot}po-reallocation/file/`;
  }

  header: PoReallocationHeader | null = null;
  rows: PoReallocationRow[] = [];
  history: HistoryRow[] = [];
  districts: DistrictOption[] = [];
  locationsByDistrict = new Map<number, LocationOption[]>();

  remark = '';
  selectedFile: File | null = null;
  loading = false;
  saving = false;

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const poId = Number(params.get('PoNoID') || params.get('poId') || 0);
      if (!poId) {
        this.toastr.error('PO id is required.');
        return;
      }
      this.loadAll(poId);
    });
  }

  onDistrictChange(row: PoReallocationRow): void {
    row.selectedLocation = 0;
    if (!row.selectedDistrict) {
      this.locationsByDistrict.delete(row.ConsigneeId);
      return;
    }
    const authorityId = this.header?.DirectorateId ?? 0;
    this.http
      .get<LocationOption[]>(
        `${this.apiRoot}po-reallocation/locations?districtId=${row.selectedDistrict}&authorityId=${authorityId}`,
      )
      .subscribe({
        next: (res) => {
          this.locationsByDistrict.set(row.ConsigneeId, Array.isArray(res) ? res : []);
        },
        error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load locations.')),
      });
  }

  toggleAll(): void {
    const checkable = this.rows.filter((r) => r.CanReallocate);
    const allChecked = checkable.length > 0 && checkable.every((r) => r.checked);
    checkable.forEach((r) => (r.checked = !allChecked));
  }

  allRowsChecked(): boolean {
    const checkable = this.rows.filter((r) => r.CanReallocate);
    return checkable.length > 0 && checkable.every((r) => r.checked);
  }

  canSave(): boolean {
    return this.rows.some((r) => r.checked);
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

  save(): void {
    if (!this.selectedFile) {
      this.toastr.warning('Upload Approval Notesheet/Letter in PDF Format.');
      return;
    }
    const selected = this.rows.filter((r) => r.checked);
    if (!selected.length) {
      this.toastr.warning('No Checkbox is selected.');
      return;
    }
    for (const row of selected) {
      if (!row.selectedLocation) {
        this.toastr.warning('Please Select Location.');
        return;
      }
    }

    const items = selected.map((r) => ({
      PoId: r.PoId,
      PoItemId: r.PoItemId,
      ConsigneeId: r.ConsigneeId,
      IndentItemId: r.IndentItemId,
      IndentId: r.IndentId,
      IndentConsolidationId: r.IndentConsolidationId,
      IssueId: r.IssueId,
      NewLocationId: r.selectedLocation,
    }));

    const formData = new FormData();
    formData.append('poId', String(this.header?.PoId ?? 0));
    formData.append('remark', this.remark);
    formData.append('items', JSON.stringify(items));
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.saving = true;
    this.http
      .post<{ message?: string }>(`${this.apiRoot}po-reallocation`, formData)
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.toastr.success(res?.message ?? 'Reallocation has been Saved Successfully');
          this.remark = '';
          this.selectedFile = null;
          this.loadAll(this.header?.PoId ?? 0);
        },
        error: (e) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not save reallocation.'));
        },
      });
  }

  private loadAll(poId: number): void {
    this.loading = true;
    this.http.get<PoReallocationHeader>(`${this.apiRoot}po-reallocation/header?poId=${poId}`).subscribe({
      next: (h) => {
        this.header = h;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load PO header.'));
      },
    });

    this.http.get<PoReallocationRow[]>(`${this.apiRoot}po-reallocation/rows?poId=${poId}`).subscribe({
      next: (res) => {
        this.rows = (Array.isArray(res) ? res : []).map((r) => ({
          ...r,
          checked: false,
          selectedDistrict: 0,
          selectedLocation: 0,
        }));
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load PO rows.')),
    });

    this.http.get<HistoryRow[]>(`${this.apiRoot}po-reallocation/history?poId=${poId}`).subscribe({
      next: (res) => {
        this.history = Array.isArray(res) ? res : [];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load reallocation history.')),
    });

    this.http.get<DistrictOption[]>(`${this.apiRoot}po-reallocation/districts`).subscribe({
      next: (res) => {
        this.districts = Array.isArray(res) ? res : [];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load districts.')),
    });
  }
}
