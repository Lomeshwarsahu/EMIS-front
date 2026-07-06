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

interface PoDispatchRow {
  poId: number;
  outwardNo: string;
  poNo: string;
  poDate: string;
  itemCode: string;
  itemName: string;
  basicRate: number;
  percentage: number;
  noOfConsignee: number;
  quantity: number;
  totalPoValue: number;
  dispatchedQty: number;
  supplyStatus: string;
}

@Component({
  selector: 'app-po-supply-dispatch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './po-supply-dispatch.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './po-supply-dispatch.component.css'],
})
export class PoSupplyDispatchComponent implements OnInit {
  loading = false;
  userId = 0;

  financialYears: FinancialYearOption[] = [];
  tenders: TenderOption[] = [];
  selectedFinancialYearId = 0;
  selectedTenderId = 0;
  rows: PoDispatchRow[] = [];

  constructor(
    private readonly api: ApiService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
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

  onFilterChange(): void {
    this.loadGrid();
  }

  clearFilters(): void {
    this.selectedFinancialYearId = 0;
    this.selectedTenderId = 0;
    this.loadGrid();
  }

  loadGrid(): void {
    this.loading = true;
    this.api
      .getSupplierPoDispatch(this.userId, this.selectedFinancialYearId, this.selectedTenderId)
      .subscribe({
        next: (raw) => {
          this.loading = false;
          const list = Array.isArray(raw) ? raw : [];
          this.rows = list.map((row) => this.mapRow(row as Record<string, unknown>));
        },
        error: (err) => {
          this.loading = false;
          this.rows = [];
          this.toastr.error(err?.error?.message ?? 'Unable to load dispatch orders.');
        },
      });
  }

  rowStatusClass(status: string): string {
    if (status === 'Not Supplied') return 'status-not-supplied';
    if (status === 'Partial Spplied') return 'status-partial';
    if (status === 'Complete Supplied') return 'status-complete';
    return '';
  }

  onSupplyStatus(row: PoDispatchRow): void {
    this.router.navigate(['/transaction/po-supply-dispatch-edit'], {
      queryParams: { poId: row.poId },
    });
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

  private mapRow(row: Record<string, unknown>): PoDispatchRow {
    return {
      poId: Number(row['poId'] ?? row['PoId'] ?? 0),
      outwardNo: String(row['outwardNo'] ?? row['OutwardNo'] ?? ''),
      poNo: String(row['poNo'] ?? row['PoNo'] ?? ''),
      poDate: String(row['poDate'] ?? row['PoDate'] ?? ''),
      itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
      itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
      basicRate: Number(row['basicRate'] ?? row['BasicRate'] ?? 0),
      percentage: Number(row['percentage'] ?? row['Percentage'] ?? 0),
      noOfConsignee: Number(row['noOfConsignee'] ?? row['NoOfConsignee'] ?? 0),
      quantity: Number(row['quantity'] ?? row['Quantity'] ?? 0),
      totalPoValue: Number(row['totalPoValue'] ?? row['TotalPoValue'] ?? 0),
      dispatchedQty: Number(row['dispatchedQty'] ?? row['DispatchedQty'] ?? 0),
      supplyStatus: String(row['supplyStatus'] ?? row['SupplyStatus'] ?? ''),
    };
  }
}
