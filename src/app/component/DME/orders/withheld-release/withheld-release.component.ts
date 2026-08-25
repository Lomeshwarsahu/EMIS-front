import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage } from '../../shared/session.util';

interface WithheldReleaseRow {
  SupplierName: string;
  SanctionDate: string;
  GrossAmt: number;
  ChequeAmt: number;
  AidNo: string;
  ChequeDate: string;
  Witheld20: number;
  WithledQty: number;
  PoType: string;
  BudgetId: number;
  BudgetName: string;
  SanctionId: number;
  PoId: number;
  SupplierId: number;
  PaymentId: number;
  AidDate: string;
  ReleaseAmt: number;
  PoNo: string;
  PoDate: string;
  checked: boolean;
}

interface BankOption {
  BankAccountId: number;
  AccountNo: string;
}

interface BankDetail {
  AccountName: string;
  IfscCode: string;
  Branch: string;
}

interface SelectionResult {
  Valid: boolean;
  Message: string;
  SupplierId: number;
  SupplierName: string;
  PaidAmount: number;
  AccountName: string;
  IfscCode: string;
  Branch: string;
  PaymentId: number;
}

@Component({
  selector: 'app-withheld-release',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent, RouterModule],
  templateUrl: './withheld-release.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './withheld-release.component.css'],
})
export class WithheldReleaseComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/WithheldRelease/`;

  rows: WithheldReleaseRow[] = [];
  loading = false;
  saving = false;

  supplierBanks: BankOption[] = [];
  cgmscBanks: BankOption[] = [];
  bankDetail: BankDetail | null = null;

  supplierBankAccountId = 0;
  cgmscBankAccountId = 0;
  payMode = 1;
  chequeNo = '';
  chequeDate = '';
  remarks = '';
  payDate = '';
  amountPaid = 0;
  supplierId = 0;
  paymentId = 0;

  paymentCompleted = false;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadRows();
    this.loadCgmscBanks();
  }

  loadRows(): void {
    this.loading = true;
    this.http.get<WithheldReleaseRow[]>(`${this.apiRoot}rows`).subscribe({
      next: (res) => {
        this.rows = (Array.isArray(res) ? res : []).map((r) => ({ ...r, checked: false }));
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load pending withheld releases.'));
      },
    });
  }

  loadCgmscBanks(): void {
    this.http.get<BankOption[]>(`${this.apiRoot}cgmsc-banks`).subscribe({
      next: (res) => {
        this.cgmscBanks = Array.isArray(res) ? res : [];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load CGMSC bank accounts.')),
    });
  }

  onSupplierBankChange(): void {
    this.bankDetail = null;
    if (!this.supplierBankAccountId) return;
    this.http
      .get<BankDetail>(`${this.apiRoot}supplier-bank-detail?bankAccountId=${this.supplierBankAccountId}`)
      .subscribe({
        next: (res) => {
          this.bankDetail = res;
        },
        error: (e) => this.toastr.error(apiErrorMessage(e, 'Supplier does not have any registered accounts.')),
      });
  }

  hasSelection(): boolean {
    return this.rows.some((r) => r.checked);
  }

  releaseAmount(): void {
    const selected = this.rows.filter((r) => r.checked);
    if (!selected.length) {
      this.toastr.warning('Please Select Checkbox');
      return;
    }
    this.http
      .post<SelectionResult>(`${this.apiRoot}validate-selection`, selected.map((r) => r.SanctionId))
      .subscribe({
        next: (res) => {
          if (!res.Valid) {
            this.toastr.warning(res.Message || 'Invalid selection.');
            return;
          }
          this.supplierId = res.SupplierId;
          this.amountPaid = res.PaidAmount;
          this.paymentId = res.PaymentId;
          this.bankDetail = {
            AccountName: res.AccountName,
            IfscCode: res.IfscCode,
            Branch: res.Branch,
          };
          if (this.paymentId) {
            this.loadSupplierBanks(this.supplierId);
          } else {
            this.loadSupplierBanks(this.supplierId);
            this.chequeNo = '';
            this.chequeDate = '';
            this.remarks = '';
          }
        },
        error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not validate selection.')),
      });
  }

  loadSupplierBanks(supplierId: number): void {
    this.http.get<BankOption[]>(`${this.apiRoot}supplier-banks?supplierId=${supplierId}`).subscribe({
      next: (res) => {
        this.supplierBanks = Array.isArray(res) ? res : [];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load supplier bank accounts.')),
    });
  }

  canSave(): boolean {
    return !!(
      this.amountPaid > 0 &&
      this.chequeNo.trim() &&
      this.chequeDate &&
      this.supplierBankAccountId > 0 &&
      this.cgmscBankAccountId > 0
    );
  }

  save(): void {
    if (!this.hasSelection()) {
      this.toastr.warning('Please Select Checkbox');
      return;
    }
    this.saving = true;
    const payload = {
      PayMode: this.payMode,
      PayDocumentNo: this.chequeNo,
      PayDocumentDate: this.chequeDate,
      Remarks: this.remarks,
      SupplierBankAccountId: this.supplierBankAccountId,
      CgmscBankAccountId: this.cgmscBankAccountId,
      SupplierId: this.supplierId,
      AmountPaid: this.amountPaid,
      SanctionIds: this.rows.filter((r) => r.checked).map((r) => r.SanctionId),
    };
    this.http.post<SelectionResult>(`${this.apiRoot}save`, payload).subscribe({
      next: (res) => {
        this.saving = false;
        this.paymentId = res.PaymentId;
        this.toastr.success(res.Message || 'Saved Successfully');
      },
      error: (e) => {
        this.saving = false;
        this.toastr.error(apiErrorMessage(e, 'Could not save payment.'));
      },
    });
  }

  completePayment(): void {
    if (!this.payDate) {
      this.toastr.warning('Pay Date is required.');
      return;
    }
    this.saving = true;
    const payload = {
      PayMode: this.payMode,
      PayDocumentNo: this.chequeNo,
      PayDocumentDate: this.chequeDate,
      AmountPaid: this.amountPaid,
      PaidOn: this.payDate,
    };
    this.http.post<{ message?: string }>(`${this.apiRoot}complete`, payload).subscribe({
      next: (res) => {
        this.saving = false;
        this.paymentCompleted = true;
        this.toastr.success(res?.message ?? 'Payment completed.');
        this.loadRows();
      },
      error: (e) => {
        this.saving = false;
        this.toastr.error(apiErrorMessage(e, 'Could not complete payment.'));
      },
    });
  }

  viewBankLetter(): void {
    if (this.paymentId > 0) {
      this.router.navigate(['/payment-letter'], { queryParams: { Paymentid: this.paymentId, Is20: 'Y' } });
    }
  }

  resetSelection(): void {
    this.rows.forEach((r) => (r.checked = false));
    this.supplierBankAccountId = 0;
    this.cgmscBankAccountId = 0;
    this.chequeNo = '';
    this.chequeDate = '';
    this.remarks = '';
    this.amountPaid = 0;
    this.supplierId = 0;
    this.paymentId = 0;
    this.bankDetail = null;
    this.supplierBanks = [];
    this.payDate = '';
    this.paymentCompleted = false;
  }
}
