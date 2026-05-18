import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  styleUrls: ['../../shared/legacy-ems-page.css', './consolidated-indent-dme.component.css'],
})
export class ConsolidatedIndentDmeComponent implements OnInit {
  private readonly indentApi = `${environment.apiUrl}/DMEIndent/`;
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
  newIndentDate = '';
  newAsLetterNo = '';
  newAsDate = '';
  saving = false;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    this.loadFinancialYears();
    this.loadBudgetHeads();
    this.show();
  }

  show(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }

    this.loading = true;
    const yearQ = this.selectedFinancialYearId > 0 ? `&financialYearId=${this.selectedFinancialYearId}` : '';
    this.http
      .get<FacilityIndentRow[]>(`${this.indentApi}facility-indents?userId=${this.userId}${yearQ}`)
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
    this.newFinancialYearId = this.selectedFinancialYearId || this.financialYears[1]?.FinancialYearId || 0;
    this.newBudgetId = 0;
    this.newIndentDate = this.todayDdMmYyyy();
    this.newAsLetterNo = '';
    this.newAsDate = '';
    this.showNewModal = true;
  }

  closeNewIndent(): void {
    this.showNewModal = false;
  }

  saveNewIndent(): void {
    if (!this.newBudgetId || !this.newFinancialYearId) {
      this.toastr.warning('Select Financial Year and Fund/Budget.');
      return;
    }
    if (!this.newIndentDate || !this.newAsLetterNo.trim() || !this.newAsDate) {
      this.toastr.warning('Fill Indent Date, AS Letter No and AS Date.');
      return;
    }

    this.saving = true;
    this.http
      .post(`${this.indentApi}facility-indents`, {
        UserId: this.userId,
        BudgetId: this.newBudgetId,
        FinancialYearId: this.newFinancialYearId,
        IndentDate: this.newIndentDate,
        AsLetterNo: this.newAsLetterNo.trim(),
        AsDate: this.newAsDate,
      })
      .subscribe({
        next: (res: { message?: string }) => {
          this.saving = false;
          this.showNewModal = false;
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
    this.toastr.info(`Add indent items for #${row.IndentId} — detail screen coming soon.`);
  }

  onShowIndent(row: FacilityIndentRow): void {
    this.toastr.info(`Indent report for #${row.IndentId} — coming soon.`);
  }

  onDownload(row: FacilityIndentRow): void {
    if (row.UploadStatus !== 'Uploaded') {
      this.toastr.warning('File not uploaded for this indent.');
      return;
    }
    this.toastr.info('Download requires legacy file path — coming soon.');
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
    this.http.get<BudgetHeadOption[]>(`${this.indentApi}budget-heads?userId=${this.userId}`).subscribe({
      next: (res) => (this.budgetHeads = this.mapHeads(res)),
      error: () => (this.budgetHeads = []),
    });
  }

  private todayDdMmYyyy(): string {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
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
