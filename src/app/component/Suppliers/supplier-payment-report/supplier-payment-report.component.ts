import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';

interface PaymentReportRow {
  poId: number;
  sanctionId: number;
  supplierId: number;
  budgetId: number;
  paymentId: number;
  poNo: string;
  poDate: string;
  supplierName: string;
  grossAmt: number;
  totalDed: number;
  totalAddition: number;
  chequeAmt: number;
  chequeDate: string;
  aidNo: string;
  paymentType: string;
}

type PoTypeFilter = 'All' | 'NP' | 'CP';

@Component({
  selector: 'app-supplier-payment-report',
  standalone: true,
  imports: [CommonModule, FormsModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-payment-report.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './supplier-payment-report.component.css'],
})
export class SupplierPaymentReportComponent implements OnInit {
  loading = false;
  userId = 0;
  showExport = false;

  poType: PoTypeFilter = 'NP';
  rows: PaymentReportRow[] = [];
  readonly defaultPoType: PoTypeFilter = 'NP';

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userid') || localStorage.getItem('userid') || 0);
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
      return;
    }
    this.loadDetails();
  }

  onFilterChange(): void {
    this.loadDetails();
  }

  clearFilters(): void {
    this.poType = this.defaultPoType;
    this.loadDetails();
  }

  get hasActiveFilters(): boolean {
    return this.poType !== this.defaultPoType;
  }

  loadDetails(): void {
    this.loading = true;
    this.api.getSupplierPaymentReport(this.userId, this.poType).subscribe({
      next: (raw) => {
        this.loading = false;
        this.showExport = true;
        const list = Array.isArray(raw) ? raw : [];
        this.rows = list.map((row) => this.mapRow(row as Record<string, unknown>));
      },
      error: (err) => {
        this.loading = false;
        this.rows = [];
        this.toastr.error(err?.error?.message ?? 'Unable to load payment report.');
      },
    });
  }

  downloadSanction(row: PaymentReportRow): void {
    this.toastr.info(
      `Sanction report for PO ${row.poNo}, sanction ${row.sanctionId} — migration pending.`,
    );
  }

  exportExcel(): void {
    if (!this.rows.length) {
      this.toastr.warning('No data to export.');
      return;
    }

    const headers = [
      'S.No',
      'PO No',
      'PO Date',
      'Supplier',
      'Gross Amount',
      'Total Deduction',
      'Total Addition',
      'Cheque Amount',
      'Cheque Date',
      'Cheque No',
    ];

    const lines = this.rows.map((row, index) =>
      [
        index + 1,
        row.poNo,
        row.poDate,
        row.supplierName,
        row.grossAmt,
        row.totalDed,
        row.totalAddition,
        row.chequeAmt,
        row.chequeDate,
        row.aidNo,
      ]
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(','),
    );

    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Paid_PO_Report_${Date.now()}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private mapRow(row: Record<string, unknown>): PaymentReportRow {
    return {
      poId: Number(row['poId'] ?? row['PoId'] ?? 0),
      sanctionId: Number(row['sanctionId'] ?? row['SanctionId'] ?? 0),
      supplierId: Number(row['supplierId'] ?? row['SupplierId'] ?? 0),
      budgetId: Number(row['budgetId'] ?? row['BudgetId'] ?? 0),
      paymentId: Number(row['paymentId'] ?? row['PaymentId'] ?? 0),
      poNo: String(row['poNo'] ?? row['PoNo'] ?? ''),
      poDate: String(row['poDate'] ?? row['PoDate'] ?? ''),
      supplierName: String(row['supplierName'] ?? row['SupplierName'] ?? ''),
      grossAmt: Number(row['grossAmt'] ?? row['GrossAmt'] ?? 0),
      totalDed: Number(row['totalDed'] ?? row['TotalDed'] ?? 0),
      totalAddition: Number(row['totalAddition'] ?? row['TotalAddition'] ?? 0),
      chequeAmt: Number(row['chequeAmt'] ?? row['ChequeAmt'] ?? 0),
      chequeDate: String(row['chequeDate'] ?? row['ChequeDate'] ?? ''),
      aidNo: String(row['aidNo'] ?? row['AidNo'] ?? ''),
      paymentType: String(row['paymentType'] ?? row['PaymentType'] ?? ''),
    };
  }
}
