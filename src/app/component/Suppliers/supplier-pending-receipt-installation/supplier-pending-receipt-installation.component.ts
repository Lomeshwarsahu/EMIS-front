import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';
import { resolveSupplierUserId } from '../supplier-user.util';

interface BalanceStatusRow {
  poId: number;
  directorateId: number;
  tenderNo: string;
  year: string;
  poNo: string;
  poDate: string;
  facilityAutName: string;
  itemCode: string;
  itemName: string;
  supplier: string;
  poQty: number;
  supplyQty: number;
  receiptQty: number;
  instQty: number;
  poType: string;
  balanceQty: number;
}

type BalanceTypeFilter = 'R' | 'I';

@Component({
  selector: 'app-supplier-pending-receipt-installation',
  standalone: true,
  imports: [CommonModule, FormsModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-pending-receipt-installation.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './supplier-pending-receipt-installation.component.css'],
})
export class SupplierPendingReceiptInstallationComponent implements OnInit {
  loading = false;
  userId = 0;
  showExport = false;

  balanceType: BalanceTypeFilter = 'R';
  rows: BalanceStatusRow[] = [];

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = resolveSupplierUserId();
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
      return;
    }
    this.loadReport();
  }

  onFilterChange(): void {
    this.loadReport();
  }

  clearFilters(): void {
    this.balanceType = 'R';
    this.loadReport();
  }

  loadReport(): void {
    this.userId = resolveSupplierUserId();
    if (!this.userId) {
      this.loading = false;
      this.rows = [];
      this.toastr.error('Please login as supplier.');
      return;
    }

    this.loading = true;
    this.api.getSupplierBalanceStatus(this.userId, this.balanceType).subscribe({
      next: (raw) => {
        this.loading = false;
        this.showExport = true;
        const list = Array.isArray(raw) ? raw : [];
        this.rows = list.map((row) => this.mapRow(row as Record<string, unknown>));
      },
      error: (err) => {
        this.loading = false;
        this.rows = [];
        this.toastr.error(err?.error?.message ?? 'Unable to load pending receipt/installation report.');
      },
    });
  }

  onBalanceQtyClick(row: BalanceStatusRow): void {
    if (!row.poId) {
      this.toastr.warning('PO id is missing for this row.');
      return;
    }

    void this.router.navigate(['/reports/pending-install-drill-down'], {
      queryParams: { poId: row.poId },
    });
  }

  exportExcel(): void {
    if (!this.rows.length) {
      this.toastr.warning('No data to export.');
      return;
    }

    const headers = [
      'S.No',
      'Tender No',
      'Year',
      'PO No',
      'PO Date',
      'Authority',
      'Item Code',
      'Item',
      'Supplier',
      'PO Qty',
      'Supply Qty',
      'Receipt QTY',
      'Installed Qty',
      'PO Type',
      'Balance Qty',
    ];

    const lines = this.rows.map((row, index) =>
      [
        index + 1,
        row.tenderNo,
        row.year,
        row.poNo,
        row.poDate,
        row.facilityAutName,
        row.itemCode,
        row.itemName,
        row.supplier,
        row.poQty,
        row.supplyQty,
        row.receiptQty,
        row.instQty,
        row.poType,
        row.balanceQty,
      ]
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(','),
    );

    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pending_Receipt_Installation_${Date.now()}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private mapRow(row: Record<string, unknown>): BalanceStatusRow {
    return {
      poId: Number(row['poId'] ?? row['PoId'] ?? 0),
      directorateId: Number(row['directorateId'] ?? row['DirectorateId'] ?? 0),
      tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
      year: String(row['year'] ?? row['Year'] ?? ''),
      poNo: String(row['poNo'] ?? row['PoNo'] ?? ''),
      poDate: String(row['poDate'] ?? row['PoDate'] ?? ''),
      facilityAutName: String(row['facilityAutName'] ?? row['FacilityAutName'] ?? ''),
      itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
      itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
      supplier: String(row['supplier'] ?? row['Supplier'] ?? ''),
      poQty: Number(row['poQty'] ?? row['PoQty'] ?? 0),
      supplyQty: Number(row['supplyQty'] ?? row['SupplyQty'] ?? 0),
      receiptQty: Number(row['receiptQty'] ?? row['ReceiptQty'] ?? 0),
      instQty: Number(row['instQty'] ?? row['InstQty'] ?? 0),
      poType: String(row['poType'] ?? row['PoType'] ?? ''),
      balanceQty: Number(row['balanceQty'] ?? row['BalanceQty'] ?? 0),
    };
  }
}
