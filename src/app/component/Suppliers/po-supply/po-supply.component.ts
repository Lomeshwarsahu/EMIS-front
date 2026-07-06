import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

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

@Component({
  selector: 'app-po-supply',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './po-supply.component.html',
  styleUrls: ['./po-supply.component.css'],
})
export class PoSupplyComponent implements OnInit {
  loading = false;
  userId = 0;
  supplierId = 0;

  financialYears: FinancialYearOption[] = [];
  tenders: TenderOption[] = [];
  selectedFinancialYearId = 0;
  selectedTenderId = 0;

  rows: PoSupplyRow[] = [];

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userid') || localStorage.getItem('userid') || 0);
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
      return;
    }
    this.loadFilters();
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
        this.selectedFinancialYearId = currentYear > 0 ? currentYear : 0;
        this.selectedTenderId = 0;
        this.loadGrid();
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load filters.');
      },
    });
  }

  showOrders(): void {
    this.loadGrid();
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
    return row.submissionStatus?.toUpperCase() === 'Y' ? 'View' : 'Not Submitted';
  }

  isSdSubmitted(row: PoSupplyRow): boolean {
    return row.submissionStatus?.toUpperCase() === 'Y';
  }

  onPrint(row: PoSupplyRow): void {
    this.toastr.info(`Print PO report for PO ID ${row.poId} — legacy report migration pending.`);
  }

  onSdDetails(row: PoSupplyRow): void {
    this.router.navigate(['/orders/po-supply-sd-detail'], {
      queryParams: {
        poId: row.poId,
        supplierId: this.supplierId,
        gValue: row.totalPoValue,
        itemId: row.itemId,
      },
    });
  }

  onApplyExtension(row: PoSupplyRow): void {
    this.router.navigate(['/orders/po-supply-apply-extension'], {
      queryParams: { poId: row.poId },
    });
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
