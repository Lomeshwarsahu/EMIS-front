import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  poSupplyListQuery,
  readPoSupplyListFilters,
} from '../supplier-po-supply-state.util';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service/api.service';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';

interface FinancialYearOption {
  financialYearId: number;
  year: string;
}

interface TenderOption {
  tenderId: number;
  tenderNo: string;
}

interface PoSupplyRow {
  poId: number;
  itemId: number;
  outwardNo: string;
  poNo: string;
  poDate: string;
  itemCode: string;
  itemName: string;
  basicRate: number;
  percentage: number;
  quantity: number;
  totalPoValue: number;
  tenderNo: string;
  noOfConsignee: number;
  status: string;
  sdName: string;
  submissionStatus: string;
}

interface SdPaymentMode {
  sdMode: string;
  sdName: string;
  maturityOptional: boolean;
}

@Component({
  selector: 'app-po-supply',
  standalone: true,
  imports: [CommonModule, FormsModule, SupplierPageSkeletonComponent],
  templateUrl: './po-supply.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './po-supply.component.css'],
})
export class PoSupplyComponent implements OnInit, OnDestroy {
  loading = false;
  userId = 0;
  supplierId = 0;

  financialYears: FinancialYearOption[] = [];
  tenders: TenderOption[] = [];
  selectedFinancialYearId = 0;
  selectedTenderId = 0;
  selectedSdFilter: 'all' | 'submitted' | 'not-submitted' = 'all';
  defaultFinancialYearId = 0;

  rows: PoSupplyRow[] = [];

  showExtensionForm = false;
  extensionLoading = false;
  extensionSaving = false;
  extensionPoId = 0;
  extensionEquipmentName = '';
  extensionPoNo = '';
  extensionPoDate = '';
  extensionSupplyDays = 0;
  extensionPoEndDate = '';
  extensionBaseEndDate = '';
  extensionCanApply = true;
  extensionHasPending = false;
  extensionDays: number | null = null;
  extensionDate = '';
  extensionLetterDate = '';
  extensionRemark = '';
  extensionFile: File | null = null;

  showSdForm = false;
  sdLoading = false;
  sdSaving = false;
  sdPoId = 0;
  sdItemId = 0;
  sdGrossValue = 0;
  sdEquipmentName = '';
  sdAmount = 0;
  sdHasExisting = false;
  sdHasFile = false;
  sdIsSubmitted = false;
  sdPaymentModes: SdPaymentMode[] = [];
  sdSelectedPaymentMode = '0';
  sdIssueDate = '';
  sdMaturityDate = '';
  sdDocumentNo = '';
  sdFileMode: 'UPLOAD' | 'VIEW' = 'VIEW';
  sdSelectedFile: File | null = null;

  private restoreFilters = { financialYearId: 0, tenderId: 0 };

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userid') || localStorage.getItem('userid') || 0);
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
      return;
    }
    this.restoreFilters = readPoSupplyListFilters(this.route.snapshot.queryParams);
    this.loadFilters();
  }

  ngOnDestroy(): void {
    this.setModalOpenClass(false);
  }

  loadFilters(): void {
    this.loading = true;
    this.api.getSupplierPoSupplyFilters(this.userId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.supplierId = Number(raw['supplierId'] ?? raw['SupplierId'] ?? 0);
        this.financialYears = this.mapFinancialYears(
          (raw['financialYears'] ?? raw['FinancialYears'] ?? []) as unknown[],
        );
        this.tenders = this.mapTenders((raw['tenders'] ?? raw['Tenders'] ?? []) as unknown[]);

        const currentYear = Number(raw['currentFinancialYearId'] ?? raw['CurrentFinancialYearId'] ?? 0);
        this.defaultFinancialYearId = currentYear > 0 ? currentYear : 0;
        this.selectedFinancialYearId =
          this.restoreFilters.financialYearId > 0
            ? this.restoreFilters.financialYearId
            : this.defaultFinancialYearId;
        this.selectedTenderId = this.restoreFilters.tenderId;
        this.loadGrid();
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load filters.');
      },
    });
  }

  onFilterChange(): void {
    this.restoreFilters = {
      financialYearId: this.selectedFinancialYearId,
      tenderId: this.selectedTenderId,
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: poSupplyListQuery(this.restoreFilters),
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.loadGrid();
  }

  clearFilters(): void {
    this.selectedFinancialYearId = this.defaultFinancialYearId;
    this.selectedTenderId = 0;
    this.selectedSdFilter = 'all';
    this.restoreFilters = { financialYearId: 0, tenderId: 0 };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { financialYearId: null, tenderId: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.loadGrid();
  }

  get hasActiveFilters(): boolean {
    return (
      this.selectedTenderId !== 0 ||
      this.selectedSdFilter !== 'all' ||
      this.selectedFinancialYearId !== this.defaultFinancialYearId
    );
  }

  loadGrid(): void {
    this.loading = true;
    this.api
      .getSupplierPoSupply(this.userId, this.selectedFinancialYearId, this.selectedTenderId)
      .subscribe({
        next: (raw) => {
          this.loading = false;
          const list = Array.isArray(raw) ? raw : [];
          this.rows = list.map((row: Record<string, unknown>) => this.mapRow(row));
        },
        error: (err) => {
          this.loading = false;
          this.rows = [];
          this.toastr.error(err?.error?.message ?? 'Unable to load purchase orders.');
        },
      });
  }

  sdStatusLabel(row: PoSupplyRow): string {
    return this.isSdSubmitted(row) ? 'Submitted' : 'Not Submitted';
  }

  isSdSubmitted(row: PoSupplyRow): boolean {
    return row.submissionStatus?.toUpperCase() === 'Y';
  }

  get displayedRows(): PoSupplyRow[] {
    if (this.selectedSdFilter === 'submitted') {
      return this.rows.filter((row) => this.isSdSubmitted(row));
    }
    if (this.selectedSdFilter === 'not-submitted') {
      return this.rows.filter((row) => !this.isSdSubmitted(row));
    }
    return this.rows;
  }

  onPrint(row: PoSupplyRow): void {
    const urlTree = this.router.createUrlTree(['/transaction/po-supply-po-print'], {
      queryParams: { poId: row.poId },
    });
    const path = this.router.serializeUrl(urlTree);
    const fullUrl = `${window.location.origin}${path}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  }

  onSdDetails(row: PoSupplyRow): void {
    this.closeExtensionForm();
    this.sdPoId = row.poId;
    this.sdItemId = row.itemId;
    this.sdGrossValue = row.totalPoValue;
    this.showSdForm = true;
    this.setModalOpenClass(true);
    this.sdLoading = true;
    this.resetSdFormFields();
    this.api.getSupplierPoSdDetail(this.userId, row.poId, row.itemId, row.totalPoValue).subscribe({
      next: (raw) => {
        this.sdLoading = false;
        const data = raw as Record<string, unknown>;
        this.sdEquipmentName = String(data['equipmentName'] ?? data['EquipmentName'] ?? row.itemName);
        this.sdAmount = Number(data['sdAmount'] ?? data['SdAmount'] ?? 0);
        this.sdHasExisting = Boolean(data['hasExisting'] ?? data['HasExisting']);
        this.sdHasFile = Boolean(data['hasFile'] ?? data['HasFile']);
        this.sdIsSubmitted = Boolean(data['isSubmitted'] ?? data['IsSubmitted']);
        this.supplierId = Number(data['supplierId'] ?? data['SupplierId'] ?? this.supplierId);
        this.sdGrossValue = Number(data['grossValue'] ?? data['GrossValue'] ?? this.sdGrossValue);
        this.sdSelectedPaymentMode = String(data['paymentMode'] ?? data['PaymentMode'] ?? '0') || '0';
        this.sdIssueDate = this.toIsoDate(String(data['issueDate'] ?? data['IssueDate'] ?? ''));
        this.sdMaturityDate = this.toIsoDate(String(data['maturityDate'] ?? data['MaturityDate'] ?? ''));
        this.sdDocumentNo = String(data['documentNo'] ?? data['DocumentNo'] ?? '');
        this.sdPaymentModes = this.mapSdPaymentModes(
          (data['paymentModes'] ?? data['PaymentModes'] ?? []) as unknown[],
        );
        this.sdFileMode = this.sdIsSubmitted || this.sdHasFile ? 'VIEW' : 'UPLOAD';
      },
      error: (err) => {
        this.sdLoading = false;
        this.showSdForm = false;
        this.setModalOpenClass(false);
        this.toastr.error(err?.error?.message ?? 'Unable to load SD detail.');
      },
    });
  }

  closeSdForm(): void {
    this.showSdForm = false;
    this.setModalOpenClass(false);
    this.resetSdFormFields();
  }

  get sdShowSubmit(): boolean {
    return !this.sdHasExisting;
  }

  get sdShowUpdate(): boolean {
    return this.sdHasExisting && !this.sdIsSubmitted;
  }

  get sdIsViewOnly(): boolean {
    return this.sdHasExisting && this.sdIsSubmitted;
  }

  get sdShowFileUpload(): boolean {
    if (this.sdIsViewOnly) {
      return false;
    }
    if (!this.sdHasExisting) {
      return true;
    }
    return this.sdFileMode === 'UPLOAD';
  }

  get sdIsMaturityOptional(): boolean {
    const mode = this.sdPaymentModes.find((item) => item.sdMode === this.sdSelectedPaymentMode);
    return mode ? mode.maturityOptional : false;
  }

  onSdFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.sdSelectedFile = input.files?.[0] ?? null;
  }

  onSdFileModeChange(): void {
    if (this.sdFileMode === 'VIEW') {
      this.sdSelectedFile = null;
    }
  }

  saveSd(): void {
    if (this.sdHasExisting) {
      this.updateSd();
      return;
    }

    if (this.sdSelectedPaymentMode === '0') {
      this.toastr.warning('Please select Payment mode.');
      return;
    }
    if (!this.sdIssueDate) {
      this.toastr.warning('Please fill Issue Date');
      return;
    }
    if (!this.sdIsMaturityOptional && !this.sdMaturityDate) {
      this.toastr.warning('Please fill Maturity Date');
      return;
    }
    if (!this.sdDocumentNo.trim()) {
      this.toastr.warning('Please SD Document Ref. No');
      return;
    }
    if (!this.sdSelectedFile) {
      this.toastr.warning('Please select document to be uplaoded.');
      return;
    }

    const formData = new FormData();
    formData.append('poId', String(this.sdPoId));
    formData.append('itemId', String(this.sdItemId));
    formData.append('supplierId', String(this.supplierId));
    formData.append('paymentMode', this.sdSelectedPaymentMode);
    formData.append('issueDate', this.fromIsoDateSlash(this.sdIssueDate));
    formData.append('sdAmount', String(this.sdAmount));
    formData.append('documentNo', this.sdDocumentNo.trim());
    if (this.sdMaturityDate) {
      formData.append('maturityDate', this.fromIsoDateSlash(this.sdMaturityDate));
    }
    formData.append('file', this.sdSelectedFile);

    this.sdSaving = true;
    this.api.saveSupplierPoSdDetail(this.userId, formData).subscribe({
      next: (res) => {
        this.sdSaving = false;
        this.toastr.success(res?.message ?? 'Successfully Saved.');
        this.closeSdForm();
        this.loadGrid();
      },
      error: (err) => {
        this.sdSaving = false;
        this.toastr.error(err?.error?.message ?? 'Unable to save SD detail.');
      },
    });
  }

  updateSd(): void {
    if (this.sdSelectedPaymentMode === '0') {
      this.toastr.warning('Please select Payment mode.');
      return;
    }
    if (!this.sdIssueDate) {
      this.toastr.warning('Please fill Issue Date');
      return;
    }
    if (!this.sdIsMaturityOptional && !this.sdMaturityDate) {
      this.toastr.warning('Please fill Maturity Date');
      return;
    }
    if (this.sdFileMode === 'UPLOAD' && !this.sdSelectedFile) {
      this.toastr.warning('Please select document to be uplaoded.');
      return;
    }

    const formData = new FormData();
    formData.append('poId', String(this.sdPoId));
    formData.append('itemId', String(this.sdItemId));
    formData.append('supplierId', String(this.supplierId));
    formData.append('paymentMode', this.sdSelectedPaymentMode);
    formData.append('issueDate', this.fromIsoDateSlash(this.sdIssueDate));
    formData.append('sdAmount', String(this.sdAmount));
    formData.append('fileMode', this.sdFileMode);
    if (this.sdMaturityDate) {
      formData.append('maturityDate', this.fromIsoDateSlash(this.sdMaturityDate));
    }
    if (this.sdSelectedFile) {
      formData.append('file', this.sdSelectedFile);
    }

    this.sdSaving = true;
    this.api.updateSupplierPoSdDetail(this.userId, formData).subscribe({
      next: (res) => {
        this.sdSaving = false;
        this.toastr.success(res?.message ?? 'Successfully Saved.');
        this.closeSdForm();
        this.loadGrid();
      },
      error: (err) => {
        this.sdSaving = false;
        this.toastr.error(err?.error?.message ?? 'Unable to update SD detail.');
      },
    });
  }

  downloadSdFile(): void {
    const url = `${environment.apiUrl}/Auth/supplier/po-sd-detail/file/by-user/${this.userId}?poId=${this.sdPoId}`;
    window.open(url, '_blank');
  }

  resetSdForm(): void {
    this.sdSelectedPaymentMode = '0';
    this.sdIssueDate = '';
    this.sdMaturityDate = '';
    this.sdDocumentNo = '';
    this.sdSelectedFile = null;
    this.sdFileMode = this.sdHasFile ? 'VIEW' : 'UPLOAD';
    if (this.sdHasExisting && this.sdPoId && this.sdItemId) {
      this.sdLoading = true;
      this.api.getSupplierPoSdDetail(this.userId, this.sdPoId, this.sdItemId, this.sdGrossValue).subscribe({
        next: (raw) => {
          this.sdLoading = false;
          const data = raw as Record<string, unknown>;
          this.sdSelectedPaymentMode = String(data['paymentMode'] ?? data['PaymentMode'] ?? '0') || '0';
          this.sdIssueDate = this.toIsoDate(String(data['issueDate'] ?? data['IssueDate'] ?? ''));
          this.sdMaturityDate = this.toIsoDate(String(data['maturityDate'] ?? data['MaturityDate'] ?? ''));
          this.sdDocumentNo = String(data['documentNo'] ?? data['DocumentNo'] ?? '');
          this.sdFileMode = this.sdIsSubmitted || this.sdHasFile ? 'VIEW' : 'UPLOAD';
        },
        error: () => {
          this.sdLoading = false;
        },
      });
    }
  }

  onApplyExtension(row: PoSupplyRow): void {
    this.closeSdForm();
    this.extensionPoId = row.poId;
    this.showExtensionForm = true;
    this.setModalOpenClass(true);
    this.extensionLoading = true;
    this.resetExtensionForm();
    this.api.getSupplierPoExtensionPage(this.userId, row.poId).subscribe({
      next: (raw) => {
        this.extensionLoading = false;
        const data = raw as Record<string, unknown>;
        this.extensionEquipmentName = String(data['equipmentName'] ?? data['EquipmentName'] ?? row.itemName);
        this.extensionPoNo = String(data['poNo'] ?? data['PoNo'] ?? row.poNo);
        this.extensionPoDate = String(data['poDate'] ?? data['PoDate'] ?? row.poDate);
        this.extensionSupplyDays = Number(data['supplyDays'] ?? data['SupplyDays'] ?? 0);
        this.extensionPoEndDate = String(data['poEndDate'] ?? data['PoEndDate'] ?? '');
        this.extensionBaseEndDate = String(
          data['baseEndDate'] ?? data['BaseEndDate'] ?? this.extensionPoEndDate,
        );
        this.extensionCanApply = Boolean(data['canApply'] ?? data['CanApply'] ?? true);
        this.extensionHasPending = Boolean(
          data['hasPendingExtension'] ?? data['HasPendingExtension'] ?? false,
        );
        if (!this.extensionCanApply) {
          this.toastr.warning('An extension request is already pending for this PO.');
        }
      },
      error: (err) => {
        this.extensionLoading = false;
        this.showExtensionForm = false;
        this.setModalOpenClass(false);
        this.toastr.error(err?.error?.message ?? 'Unable to load extension form.');
      },
    });
  }

  closeExtensionForm(): void {
    this.showExtensionForm = false;
    this.setModalOpenClass(false);
    this.resetExtensionForm();
  }

  onExtensionDaysChange(): void {
    const days = Number(this.extensionDays ?? 0);
    if (!this.extensionBaseEndDate || days <= 0) {
      this.extensionDate = '';
      return;
    }
    const base = this.parseDisplayDate(this.extensionBaseEndDate);
    if (!base) {
      this.extensionDate = '';
      return;
    }
    const result = new Date(base);
    result.setDate(result.getDate() + days);
    this.extensionDate = this.formatDisplayDate(result);
  }

  onExtensionFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.extensionFile = input.files?.[0] ?? null;
  }

  saveExtension(): void {
    if (!this.extensionCanApply) {
      this.toastr.warning('An extension request is already pending for this PO.');
      return;
    }
    const days = Number(this.extensionDays ?? 0);
    if (!days) {
      this.toastr.warning('Extension Days Should Not be Empty.');
      return;
    }
    if (!this.extensionLetterDate.trim()) {
      this.toastr.warning('Letter Date Should Not be Empty.');
      return;
    }
    if (!this.extensionRemark.trim()) {
      this.toastr.warning('Remark Should Not be Empty');
      return;
    }
    if (!this.extensionFile) {
      this.toastr.warning('You are not selected any File yet.');
      return;
    }

    const formData = new FormData();
    formData.append('poId', String(this.extensionPoId));
    formData.append('extensionDays', String(days));
    formData.append('letterDate', this.fromIsoDate(this.extensionLetterDate));
    formData.append('remark', this.extensionRemark.trim());
    formData.append('file', this.extensionFile);

    this.extensionSaving = true;
    this.api.saveSupplierPoExtension(this.userId, formData).subscribe({
      next: (res) => {
        this.extensionSaving = false;
        this.toastr.success(res?.message ?? 'Successfully Saved.');
        this.closeExtensionForm();
        this.loadGrid();
      },
      error: (err) => {
        this.extensionSaving = false;
        this.toastr.error(err?.error?.message ?? 'Unable to save extension request.');
      },
    });
  }

  private resetExtensionForm(): void {
    this.extensionDays = null;
    this.extensionDate = '';
    this.extensionLetterDate = '';
    this.extensionRemark = '';
    this.extensionFile = null;
  }

  private resetSdFormFields(): void {
    this.sdEquipmentName = '';
    this.sdAmount = 0;
    this.sdHasExisting = false;
    this.sdHasFile = false;
    this.sdIsSubmitted = false;
    this.sdPaymentModes = [];
    this.sdSelectedPaymentMode = '0';
    this.sdIssueDate = '';
    this.sdMaturityDate = '';
    this.sdDocumentNo = '';
    this.sdFileMode = 'VIEW';
    this.sdSelectedFile = null;
  }

  private setModalOpenClass(open: boolean): void {
    if (open) {
      document.body.classList.add('emis-modal-open');
      return;
    }
    if (!this.showExtensionForm && !this.showSdForm) {
      document.body.classList.remove('emis-modal-open');
    }
  }

  private mapSdPaymentModes(list: unknown[]): SdPaymentMode[] {
    return list.map((item) => {
      const row = item as Record<string, unknown>;
      const sdName = String(row['sdName'] ?? row['SdName'] ?? '');
      const upper = sdName.toUpperCase();
      return {
        sdMode: String(row['sdMode'] ?? row['SdMode'] ?? ''),
        sdName,
        maturityOptional:
          Boolean(row['maturityOptional'] ?? row['MaturityOptional']) ||
          upper.includes('NEFT') ||
          upper.includes('RTGS'),
      };
    });
  }

  private toIsoDate(displayDate: string): string {
    const trimmed = displayDate.trim();
    if (!trimmed) {
      return '';
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const parts = trimmed.split('/');
    if (parts.length !== 3) {
      return '';
    }
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private fromIsoDateSlash(isoDate: string): string {
    if (!isoDate) {
      return '';
    }
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  private parseDisplayDate(value: string): Date | null {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const slashParts = trimmed.split('/');
    if (slashParts.length === 3) {
      const [day, month, year] = slashParts.map((part) => Number(part));
      if (day && month && year) {
        return new Date(year, month - 1, day);
      }
    }
    const dashParts = trimmed.split('-');
    if (dashParts.length === 3) {
      const [day, month, year] = dashParts.map((part) => Number(part));
      if (day && month && year) {
        return new Date(year, month - 1, day);
      }
    }
    return null;
  }

  private formatDisplayDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private fromIsoDate(isoDate: string): string {
    if (!isoDate) {
      return '';
    }
    const [year, month, day] = isoDate.split('-');
    return `${day}-${month}-${year}`;
  }

  goToGstDetails(): void {
    this.router.navigate(['/masters/supplier-gst-entry']);
  }

  private mapFinancialYears(list: unknown[]): FinancialYearOption[] {
    return list.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        financialYearId: Number(row['financialYearId'] ?? row['FinancialYearId'] ?? 0),
        year: String(row['year'] ?? row['Year'] ?? ''),
      };
    });
  }

  private mapTenders(list: unknown[]): TenderOption[] {
    return list.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        tenderId: Number(row['tenderId'] ?? row['TenderId'] ?? 0),
        tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
      };
    });
  }

  private mapRow(row: Record<string, unknown>): PoSupplyRow {
    return {
      poId: Number(row['poId'] ?? row['PoId'] ?? 0),
      itemId: Number(row['itemId'] ?? row['ItemId'] ?? 0),
      outwardNo: String(row['outwardNo'] ?? row['OutwardNo'] ?? ''),
      poNo: String(row['poNo'] ?? row['PoNo'] ?? ''),
      poDate: String(row['poDate'] ?? row['PoDate'] ?? ''),
      itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
      itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
      basicRate: Number(row['basicRate'] ?? row['BasicRate'] ?? 0),
      percentage: Number(row['percentage'] ?? row['Percentage'] ?? 0),
      quantity: Number(row['quantity'] ?? row['Quantity'] ?? 0),
      totalPoValue: Number(row['totalPoValue'] ?? row['TotalPoValue'] ?? 0),
      tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
      noOfConsignee: Number(row['noOfConsignee'] ?? row['NoOfConsignee'] ?? 0),
      status: String(row['status'] ?? row['Status'] ?? ''),
      sdName: String(row['sdName'] ?? row['SdName'] ?? ''),
      submissionStatus: String(row['submissionStatus'] ?? row['SubmissionStatus'] ?? ''),
    };
  }
}
