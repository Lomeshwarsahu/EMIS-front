import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import {
  apiErrorMessage,
  resolveLoginAuthorityId,
  resolveLoginUserId,
} from '../../shared/session.util';

interface FinancialYearOption {
  FinancialYearId: number;
  Year: string;
}

interface PoEquipmentOption {
  ItemName: string;
  ItemCodeAsPerTender: string;
}

interface PoReceiptBatch {
  IssueId: string;
  DispatchNo: string;
  DispatchDate: string;
  TentativeSupplyDate: string;
  ReceiptNo: string;
  ReceiptDate: string;
  SuppliedQty: number;
  SupplyStatus: string;
  ReceiptId?: number;
}

interface PoReceiptDeskRow {
  PoItemId: number;
  PoId: number;
  ConsigneeId: number;
  LocationName: string;
  PoNo: string;
  PoDate: string;
  ItemName: string;
  ItemCode: string;
  SupplierName: string;
  Quantity: number;
  TotalPrice?: number;
  Batches: PoReceiptBatch[];
}

@Component({
  selector: 'app-purchase-order-receipts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-order-receipts.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './purchase-order-receipts.component.css'],
})
export class PurchaseOrderReceiptsComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  financialYears: FinancialYearOption[] = [];
  itemOptions: PoEquipmentOption[] = [];
  rows: PoReceiptDeskRow[] = [];

  selectedFinancialYearId = 0;
  selectedItemCode = '0';
  loading = false;
  userId = 0;
  authorityId = '';

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    this.authorityId = resolveLoginAuthorityId();
    this.loadFinancialYears();
    this.loadItemOptions();
  }

  show(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }

    this.loading = true;
    const authQ = this.authorityId ? `&authorityId=${encodeURIComponent(this.authorityId)}` : '';
    const yearQ = this.selectedFinancialYearId > 0 ? `&financialYearId=${this.selectedFinancialYearId}` : '';
    const itemQ =
      this.selectedItemCode && this.selectedItemCode !== '0'
        ? `&itemCode=${encodeURIComponent(this.selectedItemCode)}`
        : '';

    this.http
      .get<PoReceiptDeskRow[]>(
        `${this.apiRoot}po-receipt-desk?userId=${this.userId}${authQ}${yearQ}${itemQ}`,
      )
      .subscribe({
        next: (res) => {
          this.rows = this.mapRows(res);
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.rows = [];
          this.toastr.error(apiErrorMessage(e, 'Could not load PO receipt desk.'));
        },
      });
  }

  onReceiptAction(row: PoReceiptDeskRow, batch: PoReceiptBatch): void {
    this.toastr.info(
      `Receipt detail (${batch.SupplyStatus}) — PO ${row.PoNo}, Issue ${batch.IssueId}. Full receipt screen coming soon.`,
    );
  }

  formatPrice(value?: number): string {
    if (value == null || Number.isNaN(value)) return '—';
    return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private loadFinancialYears(): void {
    this.http.get<FinancialYearOption[]>(`${this.apiRoot}financial-years`).subscribe({
      next: (res) => {
        this.financialYears = this.mapYears(res);
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load financial years.')),
    });
  }

  private loadItemOptions(): void {
    this.http.get<PoEquipmentOption[]>(`${this.apiRoot}po-receipt-items`).subscribe({
      next: (res) => {
        this.itemOptions = this.mapItems(res);
        this.selectedItemCode = '0';
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load items.')),
    });
  }

  private mapYears(raw: unknown): FinancialYearOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      FinancialYearId: Number(r['FinancialYearId'] ?? r['financialYearId'] ?? 0),
      Year: String(r['Year'] ?? r['year'] ?? ''),
    }));
  }

  private mapItems(raw: unknown): PoEquipmentOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      ItemCodeAsPerTender: String(r['ItemCodeAsPerTender'] ?? r['itemCodeAsPerTender'] ?? '0'),
    }));
  }

  private mapRows(raw: unknown): PoReceiptDeskRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      PoItemId: Number(r['PoItemId'] ?? r['poItemId'] ?? 0),
      PoId: Number(r['PoId'] ?? r['poId'] ?? 0),
      ConsigneeId: Number(r['ConsigneeId'] ?? r['consigneeId'] ?? 0),
      LocationName: String(r['LocationName'] ?? r['locationName'] ?? ''),
      PoNo: String(r['PoNo'] ?? r['poNo'] ?? ''),
      PoDate: String(r['PoDate'] ?? r['poDate'] ?? ''),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      ItemCode: String(r['ItemCode'] ?? r['itemCode'] ?? ''),
      SupplierName: String(r['SupplierName'] ?? r['supplierName'] ?? ''),
      Quantity: Number(r['Quantity'] ?? r['quantity'] ?? 0),
      TotalPrice:
        r['TotalPrice'] != null || r['totalPrice'] != null
          ? Number(r['TotalPrice'] ?? r['totalPrice'])
          : undefined,
      Batches: this.mapBatches(r['Batches'] ?? r['batches']),
    }));
  }

  private mapBatches(raw: unknown): PoReceiptBatch[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((b: Record<string, unknown>) => ({
      IssueId: String(b['IssueId'] ?? b['issueId'] ?? ''),
      DispatchNo: String(b['DispatchNo'] ?? b['dispatchNo'] ?? ''),
      DispatchDate: String(b['DispatchDate'] ?? b['dispatchDate'] ?? ''),
      TentativeSupplyDate: String(b['TentativeSupplyDate'] ?? b['tentativeSupplyDate'] ?? ''),
      ReceiptNo: String(b['ReceiptNo'] ?? b['receiptNo'] ?? ''),
      ReceiptDate: String(b['ReceiptDate'] ?? b['receiptDate'] ?? ''),
      SuppliedQty: Number(b['SuppliedQty'] ?? b['suppliedQty'] ?? 0),
      SupplyStatus: String(b['SupplyStatus'] ?? b['supplyStatus'] ?? ''),
      ReceiptId:
        b['ReceiptId'] != null || b['receiptId'] != null
          ? Number(b['ReceiptId'] ?? b['receiptId'])
          : undefined,
    }));
  }
}
