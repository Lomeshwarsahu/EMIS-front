import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage } from '../../shared/session.util';

interface FinancialYear {
  Key: number;
  Value: string;
}

interface MasFileNoRow {
  PoId: number;
  PoNo: string;
  PoDate: string;
  SchemeCode: string;
  ItemCode: string;
  SupplierName: string;
  SupplierId: number;
  FileNo: string;
  FileDt: string;
}

@Component({
  selector: 'app-mas-file-no',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './mas-file-no.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './mas-file-no.component.css'],
})
export class MasFileNoComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  financialYears: FinancialYear[] = [];
  rows: MasFileNoRow[] = [];

  poNo = '';
  outwardNo = '';
  selectedFinancialYear = 0;
  fileNo = '';
  fileDt = '';

  selected?: MasFileNoRow;

  loading = false;
  searching = false;
  saving = false;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadYears();
    this.loadList();
  }

  search(): void {
    if (!this.poNo.trim() && !(this.outwardNo.trim() && this.selectedFinancialYear > 0)) {
      this.toastr.warning('Type PO No (After Last /) OR enter Outward No with financial year.');
      return;
    }
    this.searching = true;
    this.selected = undefined;
    let params = new HttpParams();
    if (this.poNo.trim()) {
      params = params.set('poNo', this.poNo.trim());
    } else {
      params = params.set('outwardNo', this.outwardNo.trim()).set('financialYearId', String(this.selectedFinancialYear));
    }
    this.http
      .get<MasFileNoRow[]>(`${this.apiRoot}file-no-search`, { params })
      .subscribe({
        next: (res) => {
          this.searching = false;
          if (res.length === 1) {
            const row = res[0];
            this.selected = row;
            if (row.FileNo && row.FileNo !== '-') {
              this.fileNo = row.FileNo;
              this.fileDt = row.FileDt;
              this.toastr.info('File No already Generated');
            } else {
              this.fileNo = '';
              this.fileDt = '';
              this.toastr.info('Please Generate File No');
            }
          } else if (res.length > 1) {
            this.toastr.warning('PO Not Found, Please Check PO number');
          } else {
            this.toastr.warning('No matching PO found.');
          }
        },
        error: (e) => {
          this.searching = false;
          this.toastr.error(apiErrorMessage(e, 'Could not search PO.'));
        },
      });
  }

  save(): void {
    if (!this.selected) {
      this.toastr.warning('Search for a PO first.');
      return;
    }
    if (!this.fileNo.trim()) {
      this.toastr.warning('Please Enter File No');
      return;
    }
    if (!this.fileDt) {
      this.toastr.warning('Please select File Creation Date.');
      return;
    }
    const iso = this.toDdMmYyyy(this.fileDt);
    this.saving = true;
    this.http
      .post<{ message?: string }>(`${this.apiRoot}file-no-save`, {
        poId: this.selected.PoId,
        fileNo: this.fileNo.trim(),
        fileDt: iso,
      })
      .subscribe({
        next: (res) => {
          this.toastr.success(res?.message ?? 'Generated Successfully');
          this.saving = false;
          this.fileNo = '';
          this.fileDt = '';
          this.selected = undefined;
          this.loadList();
        },
        error: (e) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not save file number.'));
        },
      });
  }

  private loadYears(): void {
    this.http.get<FinancialYear[]>(`${this.apiRoot}file-no-years`).subscribe({
      next: (res) => {
        this.financialYears = [{ Key: 0, Value: 'Select Fin Year' }, ...this.mapYears(res)];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load financial years.')),
    });
  }

  private loadList(): void {
    this.loading = true;
    this.http.get<MasFileNoRow[]>(`${this.apiRoot}file-no-list`).subscribe({
      next: (res) => {
        this.rows = this.mapRows(res);
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load file number list.'));
      },
    });
  }

  private toDdMmYyyy(v: string): string {
    if (!v) {
      return '';
    }
    const m = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/.exec(v);
    if (m) {
      return `${m[1].padStart(2, '0')}/${m[2].padStart(2, '0')}/${m[3]}`;
    }
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}/${d.getFullYear()}`;
    }
    return v;
  }

  private mapYears(raw: unknown): FinancialYear[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      Key: Number(r['Key'] ?? r['key'] ?? 0),
      Value: String(r['Value'] ?? r['value'] ?? ''),
    }));
  }

  private mapRows(raw: unknown): MasFileNoRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      PoId: Number(r['PoId'] ?? r['poId'] ?? 0),
      PoNo: String(r['PoNo'] ?? r['poNo'] ?? ''),
      PoDate: String(r['PoDate'] ?? r['poDate'] ?? ''),
      SchemeCode: String(r['SchemeCode'] ?? r['schemeCode'] ?? ''),
      ItemCode: String(r['ItemCode'] ?? r['itemCode'] ?? ''),
      SupplierName: String(r['SupplierName'] ?? r['supplierName'] ?? ''),
      SupplierId: Number(r['SupplierId'] ?? r['supplierId'] ?? 0),
      FileNo: String(r['FileNo'] ?? r['fileNo'] ?? ''),
      FileDt: String(r['FileDt'] ?? r['fileDt'] ?? ''),
    }));
  }
}
