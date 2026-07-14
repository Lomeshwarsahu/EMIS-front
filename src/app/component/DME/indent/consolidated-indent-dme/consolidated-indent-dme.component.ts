import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

interface FinancialYearOption {
  FinancialYearId: number;
  Year: string;
}

interface BudgetHeadOption {
  HeadId: number;
  HeadNo: string;
  HeadName: string;
}

interface FacilityIndentRow {
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
  imports: [CommonModule, FormsModule],
  templateUrl: './consolidated-indent-dme.component.html',
  styleUrls: ['./consolidated-indent-dme.component.css'],
})
export class ConsolidatedIndentDmeComponent implements OnInit, OnDestroy {
  private readonly orderApi = `${environment.apiUrl}/DMEOrder/`;

  financialYears: FinancialYearOption[] = [];
  budgetHeads: BudgetHeadOption[] = [];
  rows: FacilityIndentRow[] = [];

  selectedFinancialYearId = 0;
  loading = false;
  userId = 0;

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
          this.rows = this.mapIndents(res);
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.toastr.error(apiErrorMessage(e, 'Could not load indents.'));
        },
      });
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
          // API may return JSON error with blob content-type mistaken — check JSON.
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
              /* keep default */
            }
          }
          this.toastr.error(msg);
        },
      });
  }

  isCompleted(status: string): boolean {
    return status?.trim().toLowerCase() === 'completed';
  }

  private loadFinancialYears(): void {
    this.http.get<FinancialYearOption[]>(`${this.orderApi}financial-years`).subscribe({
      next: (res) => {
        this.financialYears = this.mapYears(res).filter((y) => y.FinancialYearId > 0);
        if (this.financialYears.length) {
          this.selectedFinancialYearId = this.financialYears[0].FinancialYearId;
        }
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load financial years.')),
    });
  }

  private loadBudgetHeads(): void {
    if (!this.userId) return;
    this.http.get<BudgetHeadOption[]>(`${this.orderApi}budget-heads?userId=${this.userId}`).subscribe({
      next: (res) => (this.budgetHeads = this.mapHeads(res)),
      error: () => (this.budgetHeads = []),
    });
  }

  private todayIso(): string {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  private fromIsoDate(isoDate: string): string {
    if (!isoDate) {
      return '';
    }
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  private mapYears(raw: unknown): FinancialYearOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      FinancialYearId: Number(r['FinancialYearId'] ?? r['financialYearId'] ?? 0),
      Year: String(r['Year'] ?? r['year'] ?? ''),
    }));
  }

  private mapHeads(raw: unknown): BudgetHeadOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      HeadId: Number(r['HeadId'] ?? r['headId'] ?? 0),
      HeadNo: String(r['HeadNo'] ?? r['headNo'] ?? ''),
      HeadName: String(r['HeadName'] ?? r['headName'] ?? ''),
    }));
  }

  private mapIndents(raw: unknown): FacilityIndentRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      IndentId: Number(r['IndentId'] ?? r['indentId'] ?? 0),
      McName: String(r['McName'] ?? r['mcName'] ?? ''),
      ConsolidatedDate: String(r['ConsolidatedDate'] ?? r['consolidatedDate'] ?? ''),
      AsLetterNo: String(r['AsLetterNo'] ?? r['asLetterNo'] ?? ''),
      AsDate: String(r['AsDate'] ?? r['asDate'] ?? ''),
      DispatchNo: String(r['DispatchNo'] ?? r['dispatchNo'] ?? ''),
      DispatchDate: String(r['DispatchDate'] ?? r['dispatchDate'] ?? ''),
      NosIndentQty: Number(r['NosIndentQty'] ?? r['nosIndentQty'] ?? 0),
      EStatus: String(r['EStatus'] ?? r['eStatus'] ?? ''),
      UploadStatus: String(r['UploadStatus'] ?? r['uploadStatus'] ?? ''),
    }));
  }
}
