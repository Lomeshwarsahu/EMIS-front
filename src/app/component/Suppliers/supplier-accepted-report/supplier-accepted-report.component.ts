import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';

interface TenderOption {
  tenderId: number;
  tenderNo: string;
}

interface SupplierOption {
  supplierId: number;
  name: string;
}

interface AcceptedReportRow {
  itemId: number;
  itemCode: string;
  itemName: string;
  supplierName: string;
  tenderNo: string;
  tenderDate: string;
  tenderQuantity: number;
  basicRate: number;
  gst: number;
  acceptedBasicRate: number;
}

type FilterMode = 'tender' | 'supplier';

@Component({
  selector: 'app-supplier-accepted-report',
  standalone: true,
  imports: [CommonModule, FormsModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-accepted-report.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './supplier-accepted-report.component.css'],
})
export class SupplierAcceptedReportComponent implements OnInit {
  loading = false;
  userId = 0;
  showExport = false;
  showFilters = false;

  filterMode: FilterMode | null = null;
  tenders: TenderOption[] = [];
  supplierOption: SupplierOption | null = null;
  selectedTenderId = 0;
  selectedSupplierId = 0;
  rows: AcceptedReportRow[] = [];

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userid') || localStorage.getItem('userid') || 0);
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
    }
  }

  onFilterModeChange(): void {
    this.rows = [];
    this.showExport = false;
    this.showFilters = this.filterMode !== null;

    if (this.filterMode === 'tender') {
      this.loadTenders();
      return;
    }

    if (this.filterMode === 'supplier') {
      this.loadSupplierOption();
    }
  }

  loadTenders(): void {
    this.loading = true;
    this.api.getSupplierAcceptedTenders(this.userId).subscribe({
      next: (raw) => {
        this.loading = false;
        const list = Array.isArray(raw) ? raw : [];
        this.tenders = [
          { tenderId: 0, tenderNo: '--Select--' },
          ...list.map((item) => this.mapTender(item as Record<string, unknown>)),
        ];
        this.selectedTenderId = 0;
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load tenders.');
      },
    });
  }

  loadSupplierOption(): void {
    this.loading = true;
    this.api.getSupplierAcceptedSupplierOption(this.userId).subscribe({
      next: (raw) => {
        this.loading = false;
        const row = raw as Record<string, unknown>;
        this.supplierOption = {
          supplierId: Number(row['supplierId'] ?? row['SupplierId'] ?? 0),
          name: String(row['name'] ?? row['Name'] ?? ''),
        };
        this.selectedSupplierId = this.supplierOption.supplierId;
        this.loadReport();
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load supplier.');
      },
    });
  }

  onFilterChange(): void {
    if (this.filterMode === 'tender' && !this.selectedTenderId) {
      this.rows = [];
      this.showExport = false;
      return;
    }
    this.loadReport();
  }

  clearFilters(): void {
    this.selectedTenderId = 0;
    this.rows = [];
    this.showExport = false;
  }

  loadReport(): void {
    if (this.filterMode === 'tender' && !this.selectedTenderId) {
      return;
    }

    if (this.filterMode === 'supplier' && !this.selectedSupplierId) {
      return;
    }

    this.loading = true;
    this.api
      .getSupplierAcceptedReport(
        this.userId,
        this.filterMode ?? 'tender',
        this.selectedTenderId,
        this.selectedSupplierId,
      )
      .subscribe({
        next: (raw) => {
          this.loading = false;
          this.showExport = true;
          const list = Array.isArray(raw) ? raw : [];
          this.rows = list.map((row) => this.mapRow(row as Record<string, unknown>));
        },
        error: (err) => {
          this.loading = false;
          this.rows = [];
          this.toastr.error(err?.error?.message ?? 'Unable to load accepted report.');
        },
      });
  }

  exportExcel(): void {
    if (!this.rows.length) {
      this.toastr.warning('No data to export.');
      return;
    }

    const headers = [
      'S.No',
      'Item code as per tender',
      'Equipment Name',
      'Supplier',
      'Tender',
      'Tender Date',
      'Tender Quantity',
      'Basic Price',
      'Tax',
      'Accepted Basic Rate',
    ];

    const lines = this.rows.map((row, index) =>
      [
        index + 1,
        row.itemCode,
        row.itemName,
        row.supplierName,
        row.tenderNo,
        row.tenderDate,
        row.tenderQuantity,
        row.basicRate,
        row.gst,
        row.acceptedBasicRate,
      ]
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(','),
    );

    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AcceptedReport_${Date.now()}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private mapTender(row: Record<string, unknown>): TenderOption {
    return {
      tenderId: Number(row['tenderId'] ?? row['TenderId'] ?? 0),
      tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
    };
  }

  private mapRow(row: Record<string, unknown>): AcceptedReportRow {
    return {
      itemId: Number(row['itemId'] ?? row['ItemId'] ?? 0),
      itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
      itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
      supplierName: String(row['supplierName'] ?? row['SupplierName'] ?? ''),
      tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
      tenderDate: String(row['tenderDate'] ?? row['TenderDate'] ?? ''),
      tenderQuantity: Number(row['tenderQuantity'] ?? row['TenderQuantity'] ?? 0),
      basicRate: Number(row['basicRate'] ?? row['BasicRate'] ?? 0),
      gst: Number(row['gst'] ?? row['Gst'] ?? 0),
      acceptedBasicRate: Number(row['acceptedBasicRate'] ?? row['AcceptedBasicRate'] ?? 0),
    };
  }
}
