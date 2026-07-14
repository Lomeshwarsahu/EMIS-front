import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';

interface FinancialYearOption {
  FinancialYearId: number;
  Year: string;
}

interface PoEquipmentOption {
  ItemId: number;
  ItemName: string;
  ItemCodeAsPerTender: string;
}

interface PoDashboardRow {
  PoId: number;
  ItemName: string;
  Code: string;
  IndentDt: string;
  IndentYear: string;
  IndentQuantity: number;
  PoNo: string;
  PoDate: string;
  PoYear: string;
  PoQty: number;
  TenderNo: string;
  TenderDate: string;
  SupplierName: string;
  FilePathReagent?: string;
  FilePathAccessories?: string;
}

@Component({
  selector: 'app-purchase-order-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './purchase-order-dashboard.component.html',
  styleUrls: ['./purchase-order-dashboard.component.css'],
})
export class PurchaseOrderDashboardComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  financialYears: FinancialYearOption[] = [];
  equipmentOptions: PoEquipmentOption[] = [];
  rows: PoDashboardRow[] = [];

  selectedFinancialYearId = 0;
  selectedItemCode = '0';
  loading = false;
  userId = 0;

  get hasActiveFilter(): boolean {
    return this.selectedFinancialYearId > 0 || (this.selectedItemCode !== '0' && !!this.selectedItemCode);
  }

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = this.resolveUserId();
    this.loadFinancialYears();
    this.loadEquipmentOptions();
    this.loadOrders();
  }

  onFilterChange(): void {
    this.loadOrders();
  }

  clearFilters(): void {
    this.selectedFinancialYearId = 0;
    this.selectedItemCode = '0';
    this.loadOrders();
  }

  loadOrders(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }

    this.loading = true;
    const itemQ =
      this.selectedItemCode && this.selectedItemCode !== '0'
        ? `&itemCode=${encodeURIComponent(this.selectedItemCode)}`
        : '';
    this.http
      .get<PoDashboardRow[]>(
        `${this.apiRoot}po-dashboard?userId=${this.userId}&financialYearId=${this.selectedFinancialYearId}${itemQ}`,
      )
      .subscribe({
        next: (res) => {
          this.rows = this.mapRows(res);
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.rows = [];
          this.toastr.error(this.apiError(e, 'Could not load purchase orders.'));
        },
      });
  }

  hasFile(path?: string): boolean {
    return Boolean(path?.trim());
  }

  private loadFinancialYears(): void {
    this.http.get<FinancialYearOption[]>(`${this.apiRoot}financial-years`).subscribe({
      next: (res) => {
        this.financialYears = this.mapYears(res);
        this.selectedFinancialYearId = 0;
      },
      error: (e) => this.toastr.error(this.apiError(e, 'Could not load financial years.')),
    });
  }

  private loadEquipmentOptions(): void {
    this.http.get<PoEquipmentOption[]>(`${this.apiRoot}po-equipment-options`).subscribe({
      next: (res) => {
        this.equipmentOptions = this.mapEquipment(res);
        this.selectedItemCode = '0';
      },
      error: (e) => this.toastr.error(this.apiError(e, 'Could not load equipment list.')),
    });
  }

  private resolveUserId(): number {
    const login = JSON.parse(localStorage.getItem('loginData') || '{}');
    return Number(login.user_id ?? login.userId ?? login.DistId ?? 0);
  }

  private mapYears(raw: unknown): FinancialYearOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      FinancialYearId: Number(r['FinancialYearId'] ?? r['financialYearId'] ?? 0),
      Year: String(r['Year'] ?? r['year'] ?? ''),
    }));
  }

  private mapEquipment(raw: unknown): PoEquipmentOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      ItemId: Number(r['ItemId'] ?? r['itemId'] ?? 0),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      ItemCodeAsPerTender: String(r['ItemCodeAsPerTender'] ?? r['itemCodeAsPerTender'] ?? '0'),
    }));
  }

  private mapRows(raw: unknown): PoDashboardRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      PoId: Number(r['PoId'] ?? r['poId'] ?? 0),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      Code: String(r['Code'] ?? r['code'] ?? ''),
      IndentDt: String(r['IndentDt'] ?? r['indentDt'] ?? ''),
      IndentYear: String(r['IndentYear'] ?? r['indentYear'] ?? ''),
      IndentQuantity: Number(r['IndentQuantity'] ?? r['indentQuantity'] ?? 0),
      PoNo: String(r['PoNo'] ?? r['poNo'] ?? ''),
      PoDate: String(r['PoDate'] ?? r['poDate'] ?? ''),
      PoYear: String(r['PoYear'] ?? r['poYear'] ?? ''),
      PoQty: Number(r['PoQty'] ?? r['poQty'] ?? 0),
      TenderNo: String(r['TenderNo'] ?? r['tenderNo'] ?? ''),
      TenderDate: String(r['TenderDate'] ?? r['tenderDate'] ?? ''),
      SupplierName: String(r['SupplierName'] ?? r['supplierName'] ?? ''),
      FilePathReagent: r['FilePathReagent'] ?? r['filePathReagent'] ? String(r['FilePathReagent'] ?? r['filePathReagent']) : undefined,
      FilePathAccessories: r['FilePathAccessories'] ?? r['filePathAccessories']
        ? String(r['FilePathAccessories'] ?? r['filePathAccessories'])
        : undefined,
    }));
  }

  private apiError(err: { error?: { message?: string; detail?: string } }, fallback: string): string {
    const detail = err?.error?.detail?.trim();
    const message = err?.error?.message?.trim();
    return detail ? (message ? `${message} (${detail})` : detail) : message || fallback;
  }
}
