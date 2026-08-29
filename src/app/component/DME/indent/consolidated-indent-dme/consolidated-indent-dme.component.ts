import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';

export interface FinancialYearOption {
  FinancialYearId: number;
  Year: string;
}

export interface BudgetHeadOption {
  HeadId: number;
  HeadNo: string;
  HeadName: string;
}

export interface FacilityIndentRow {
  IndentId: number;
  McName: string;
  ConsolidatedDate: string;
  AsLetterNo: string;
  AsDate: string;
  DispatchNo: string;
  DispatchDate: string;
  NosIndentQty: number;
  EStatus: string;
  UploadStatus: string;
}

@Component({
  selector: 'app-consolidated-indent-dme',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './consolidated-indent-dme.component.html',
  styleUrls: ['./consolidated-indent-dme.component.css'],
})
export class ConsolidatedIndentDmeComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly orderApi = `${environment.apiUrl}/DMEOrder/`;

  displayedColumns = [
    'sno',
    'indentId',
    'mcName',
    'consolidatedDate',
    'asLetterNo',
    'asDate',
    'dispatchNo',
    'nosIndentQty',
    'eStatus',
    'uploadStatus',
    'actions',
  ];

  dataSource = new MatTableDataSource<FacilityIndentRow>([]);
  allRows: FacilityIndentRow[] = [];

  financialYears: FinancialYearOption[] = [];
  budgetHeads: BudgetHeadOption[] = [];

  selectedFinancialYearId = 0;
  searchQuery = '';
  loading = false;
  userId = 0;

  // New Indent Modal
  showNewModal = false;
  newFinancialYearId = 0;
  newBudgetId = 0;
  newIndentDateIso = '';
  newAsLetterNo = '';
  newAsDateIso = '';
  saving = false;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    this.loadFinancialYears();
    this.loadBudgetHeads();
    this.show();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('emis-modal-open');
  }

  show(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }

    this.loading = true;
    const yearQ = this.selectedFinancialYearId > 0 ? `&financialYearId=${this.selectedFinancialYearId}` : '';
    this.http
      .get<FacilityIndentRow[]>(`${this.orderApi}facility-indents?userId=${this.userId}${yearQ}`)
      .subscribe({
        next: (res) => {
          this.allRows = this.mapIndents(res);
          this.applyFilter();
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.toastr.error(apiErrorMessage(e, 'Could not load indents.'));
        },
      });
  }

  applyFilter(): void {
    let filtered = [...this.allRows];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          String(r.IndentId).includes(q) ||
          (r.McName && r.McName.toLowerCase().includes(q)) ||
          (r.AsLetterNo && r.AsLetterNo.toLowerCase().includes(q)) ||
          (r.DispatchNo && r.DispatchNo.toLowerCase().includes(q)) ||
          (r.EStatus && r.EStatus.toLowerCase().includes(q)) ||
          (r.ConsolidatedDate && r.ConsolidatedDate.toLowerCase().includes(q)),
      );
    }

    this.dataSource.data = filtered;
    if (this.sort) this.dataSource.sort = this.sort;
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedFinancialYearId = 0;
    this.show();
  }

  hasActiveFilters(): boolean {
    return !!this.searchQuery.trim() || this.selectedFinancialYearId > 0;
  }

  openNewIndent(): void {
    this.newFinancialYearId = this.selectedFinancialYearId || this.financialYears[0]?.FinancialYearId || 0;
    this.newBudgetId = 0;
    this.newIndentDateIso = this.todayIso();
    this.newAsLetterNo = '';
    this.newAsDateIso = '';
    this.showNewModal = true;
    document.body.classList.add('emis-modal-open');
  }

  closeNewIndent(): void {
    this.showNewModal = false;
    document.body.classList.remove('emis-modal-open');
  }

  saveNewIndent(): void {
    if (!this.newBudgetId || !this.newFinancialYearId) {
      this.toastr.warning('Select Financial Year and Fund/Budget.');
      return;
    }
    if (!this.newIndentDateIso || !this.newAsLetterNo.trim() || !this.newAsDateIso) {
      this.toastr.warning('Fill Indent Date, AS Letter No and AS Date.');
      return;
    }

    this.saving = true;
    this.http
      .post(`${this.orderApi}facility-indents`, {
        UserId: this.userId,
        BudgetId: this.newBudgetId,
        FinancialYearId: this.newFinancialYearId,
        IndentDate: this.fromIsoDate(this.newIndentDateIso),
        AsLetterNo: this.newAsLetterNo.trim(),
        AsDate: this.fromIsoDate(this.newAsDateIso),
      })
      .subscribe({
        next: (res: { message?: string }) => {
          this.saving = false;
          this.closeNewIndent();
          this.toastr.success(res?.message ?? 'Indent created successfully.');
          this.show();
        },
        error: (e) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not create indent.'));
        },
      });
  }

  onAddIndent(row: FacilityIndentRow): void {
    if (this.isCompleted(row.EStatus)) {
      this.toastr.warning('Indent is completed. Items cannot be added.');
      return;
    }
    this.router.navigate(['/indents/annual-indent-items'], {
      queryParams: { indentId: row.IndentId },
    });
  }

  onShowIndent(row: FacilityIndentRow): void {
    this.router.navigate(['/indents/annual-indent-report'], {
      queryParams: { indentId: row.IndentId },
    });
  }

  onDownload(row: FacilityIndentRow): void {
    if (row.UploadStatus !== 'Uploaded') {
      this.toastr.warning('File not uploaded for this indent.');
      return;
    }
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }

    this.http
      .get(`${this.orderApi}facility-indents/${row.IndentId}/download?userId=${this.userId}`, {
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: (res) => {
          const blob = res.body;
          if (!blob || blob.size === 0) {
            this.toastr.error('File not found.');
            return;
          }
          if (blob.type && blob.type.includes('application/json')) {
            blob.text().then((t) => {
              try {
                const parsed = JSON.parse(t) as { message?: string };
                this.toastr.error(parsed.message || 'Could not download file.');
              } catch {
                this.toastr.error('Could not download file.');
              }
            });
            return;
          }

          const cd = res.headers.get('content-disposition') || '';
          const match = /filename\*?=(?:UTF-8''|")?([^\";]+)/i.exec(cd);
          const fileName = match
            ? decodeURIComponent(match[1].replace(/"/g, '').trim())
            : `indent_${row.IndentId}.pdf`;

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: async (e) => {
          let msg = 'Could not download file.';
          const errBlob = e?.error;
          if (errBlob instanceof Blob) {
            try {
              const parsed = JSON.parse(await errBlob.text()) as { message?: string };
              if (parsed.message) {
                msg = parsed.message;
              }
            } catch {
              /* ignore parse error */
            }
          }
          this.toastr.error(msg);
        },
      });
  }

  exportCsv(): void {
    const data = this.dataSource.filteredData.length ? this.dataSource.filteredData : this.dataSource.data;
    if (!data.length) return;

    const headers = [
      'S.No',
      'Indent Id',
      'MC/MCH Name',
      'Indent Date',
      'AS Letter No',
      'AS Date',
      'Dispatch No',
      'No of Items',
      'Status',
      'Upload Status',
    ];

    const rows = data.map((r, i) => [
      i + 1,
      r.IndentId,
      `"${(r.McName || '').replace(/"/g, '""')}"`,
      `"${(r.ConsolidatedDate || '').replace(/"/g, '""')}"`,
      `"${(r.AsLetterNo || '').replace(/"/g, '""')}"`,
      `"${(r.AsDate || '').replace(/"/g, '""')}"`,
      `"${(r.DispatchNo || '').replace(/"/g, '""')}"`,
      r.NosIndentQty,
      `"${(r.EStatus || '').replace(/"/g, '""')}"`,
      `"${(r.UploadStatus || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Annual_Indents_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  isCompleted(status: string | null | undefined): boolean {
    return (status || '').toLowerCase().includes('completed');
  }

  private loadFinancialYears(): void {
    this.http.get<unknown[]>(`${this.orderApi}financial-years`).subscribe({
      next: (res) => {
        const arr = Array.isArray(res) ? res : [];
        this.financialYears = arr.map((item: any) => ({
          FinancialYearId: Number(item.financialYearId ?? item.FinancialYearId ?? 0),
          Year: String(item.year ?? item.Year ?? ''),
        }));
      },
      error: () => {
        this.financialYears = [];
      },
    });
  }

  private loadBudgetHeads(): void {
    this.http.get<unknown[]>(`${this.orderApi}budget-heads`).subscribe({
      next: (res) => {
        const arr = Array.isArray(res) ? res : [];
        this.budgetHeads = arr.map((item: any) => ({
          HeadId: Number(item.headId ?? item.HeadId ?? 0),
          HeadNo: String(item.headNo ?? item.HeadNo ?? ''),
          HeadName: String(item.headName ?? item.HeadName ?? ''),
        }));
      },
      error: () => {
        this.budgetHeads = [];
      },
    });
  }

  private mapIndents(raw: unknown): FacilityIndentRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((item: any) => ({
      IndentId: Number(item.indentId ?? item.IndentId ?? 0),
      McName: String(item.mcName ?? item.McName ?? ''),
      ConsolidatedDate: String(item.consolidatedDate ?? item.ConsolidatedDate ?? ''),
      AsLetterNo: String(item.asLetterNo ?? item.AsLetterNo ?? ''),
      AsDate: String(item.asDate ?? item.AsDate ?? ''),
      DispatchNo: String(item.dispatchNo ?? item.DispatchNo ?? ''),
      DispatchDate: String(item.dispatchDate ?? item.DispatchDate ?? ''),
      NosIndentQty: Number(item.nosIndentQty ?? item.NosIndentQty ?? 0),
      EStatus: String(item.eStatus ?? item.EStatus ?? ''),
      UploadStatus: String(item.uploadStatus ?? item.UploadStatus ?? ''),
    }));
  }

  private todayIso(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  private fromIsoDate(iso: string): string {
    if (!iso) return '';
    const parts = iso.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return iso;
  }
}
