import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service/api.service';

interface TenderOption {
  tenderId: number;
  tenderNo: string;
}

interface RcDetailRow {
  contractItemId: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  supplierName: string;
  tenderNo: string;
  tenderId: number;
  contractDate: string;
  contractEndDate: string;
  basicRate: number;
  percentage: number;
  singleUnitPrice: number;
  hasSpecification: boolean;
}

@Component({
  selector: 'app-supplier-rc-detail-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-rc-detail-report.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './supplier-rc-detail-report.component.css'],
})
export class SupplierRcDetailReportComponent implements OnInit {
  loading = false;
  userId = 0;
  showExport = false;

  tenders: TenderOption[] = [];
  selectedTenderId = 0;
  rows: RcDetailRow[] = [];

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
    this.loadTenders();
  }

  loadTenders(): void {
    this.loading = true;
    this.api.getSupplierRcDetailTenders(this.userId).subscribe({
      next: (raw) => {
        this.loading = false;
        const list = Array.isArray(raw) ? raw : [];
        this.tenders = [
          { tenderId: 0, tenderNo: '--All--' },
          ...list.map((item) => this.mapTender(item as Record<string, unknown>)),
        ];
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load tenders.');
      },
    });
  }

  showReport(): void {
    this.loading = true;
    this.api.getSupplierRcDetailReport(this.userId, this.selectedTenderId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.showExport = true;
        const list = Array.isArray(raw) ? raw : [];
        this.rows = list.map((row) => this.mapRow(row as Record<string, unknown>));
      },
      error: (err) => {
        this.loading = false;
        this.rows = [];
        this.toastr.error(err?.error?.message ?? 'Unable to load RC detail report.');
      },
    });
  }

  downloadSpecification(row: RcDetailRow): void {
    if (!row.hasSpecification) {
      this.toastr.warning('Specification file not found.');
      return;
    }
    window.open(`${environment.apiUrl}/ReportSpecification/items/${row.itemId}/download`, '_blank');
  }

  exportExcel(): void {
    if (!this.rows.length) {
      this.toastr.warning('No data to export.');
      return;
    }

    const headers = [
      'S.No',
      'Equipment Code',
      'Equipment Name',
      'Supplier',
      'Tender',
      'Contract Start Date',
      'Contract End Date',
      'Basic Price',
      'Tax',
      'Total Value',
    ];

    const lines = this.rows.map((row, index) =>
      [
        index + 1,
        row.itemCode,
        row.itemName,
        row.supplierName,
        row.tenderNo,
        row.contractDate,
        row.contractEndDate,
        row.basicRate,
        row.percentage,
        row.singleUnitPrice,
      ]
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(','),
    );

    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RCDetailReport_${Date.now()}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private mapTender(row: Record<string, unknown>): TenderOption {
    return {
      tenderId: Number(row['tenderId'] ?? row['TenderId'] ?? 0),
      tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
    };
  }

  private mapRow(row: Record<string, unknown>): RcDetailRow {
    return {
      contractItemId: Number(row['contractItemId'] ?? row['ContractItemId'] ?? 0),
      itemId: Number(row['itemId'] ?? row['ItemId'] ?? 0),
      itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
      itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
      supplierName: String(row['supplierName'] ?? row['SupplierName'] ?? ''),
      tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
      tenderId: Number(row['tenderId'] ?? row['TenderId'] ?? 0),
      contractDate: String(row['contractDate'] ?? row['ContractDate'] ?? ''),
      contractEndDate: String(row['contractEndDate'] ?? row['ContractEndDate'] ?? ''),
      basicRate: Number(row['basicRate'] ?? row['BasicRate'] ?? 0),
      percentage: Number(row['percentage'] ?? row['Percentage'] ?? 0),
      singleUnitPrice: Number(row['singleUnitPrice'] ?? row['SingleUnitPrice'] ?? 0),
      hasSpecification: Boolean(row['hasSpecification'] ?? row['HasSpecification'] ?? false),
    };
  }
}
