import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage, resolveLoginAuthorityId } from '../../shared/session.util';

interface FinancialYear {
  Key: number;
  Value: string;
}

interface ItemOption {
  ItemCode: string;
  ItemName: string;
}

interface FacilityReceiptRow {
  PoId: number;
  PoNo: string;
  PoDate?: string;
  ItemDetailId: number;
  ItemId: number;
  ItemCode: string;
  ItemName: string;
  ModelNo: string;
  MakeNo: string;
  InstallationDate?: string;
  InstallLocation: string;
  WarrantyFrom?: string;
  WarrantyTo?: string;
  ConsigneeId: number;
  LocationName: string;
  SupplierName: string;
  Quantity: number;
  ReceiptQty: number;
  ReceivedQty: number;
  Batches: FacilityReceiptBatch[];
  tagOptions: { label: string; value: string }[];
  selectedTag: string;
}

interface FacilityReceiptBatch {
  IssueId: number;
  TentativeStartDate?: string;
  ReceiptNo: string;
  SupplyStatus: string;
  DispatchDate?: string;
  DispatchNo: string;
  Quantity: number;
  PoId: number;
  LocationId: number;
  ReceivedDate: string;
  ReceiptId: number;
}

@Component({
  selector: 'app-facility-receipts',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './facility-receipts.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './facility-receipts.component.css'],
})
export class FacilityReceiptsComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEStock/`;

  financialYears: FinancialYear[] = [];
  itemOptions: ItemOption[] = [];

  selectedFinancialYear = 0;
  selectedItemCode = '0';

  rows: FacilityReceiptRow[] = [];
  loading = false;
  saving = false;
  locationId = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.locationId = Number(resolveLoginAuthorityId()) || 0;
    this.loadFinancialYears();
    this.loadItems();
    if (this.locationId) {
      this.loadReceipts();
    }
  }

  onYearChange(): void {
    this.loadReceipts();
  }

  onItemChange(): void {
    this.loadReceipts();
  }

  loadReceipts(): void {
    if (!this.locationId) {
      this.toastr.warning('Facility location id missing. Please login again.');
      return;
    }

    this.loading = true;
    const yearParam =
      this.selectedFinancialYear > 0 ? `&financialYearId=${this.selectedFinancialYear}` : '';
    const itemParam =
      this.selectedItemCode && this.selectedItemCode !== '0'
        ? `&itemCode=${encodeURIComponent(this.selectedItemCode)}`
        : '';
    this.http
      .get<FacilityReceiptRow[]>(
        `${this.apiRoot}facility-receipts?locationId=${this.locationId}${yearParam}${itemParam}`,
      )
      .subscribe({
        next: (res) => {
          this.rows = this.mapRows(res);
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.rows = [];
          this.toastr.error(apiErrorMessage(e, 'Could not load receipt details.'));
        },
      });
  }

  toggleBatches(row: FacilityReceiptRow): void {
    if (row.Batches.length) {
      row.Batches = [];
      return;
    }
    this.http
      .get<FacilityReceiptBatch[]>(
        `${this.apiRoot}facility-receipt-batches?poId=${row.PoId}&locationId=${row.ConsigneeId || this.locationId}`,
      )
      .subscribe({
        next: (res) => {
          row.Batches = this.mapBatches(res);
        },
        error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load batch details.')),
      });
  }

  saveTag(row: FacilityReceiptRow): void {
    if (!row.ItemDetailId) {
      this.toastr.warning('Item detail id missing.');
      return;
    }
    this.saving = true;
    this.http
      .post<{ message?: string }>(`${this.apiRoot}facility-receipts/tag`, {
        itemDetailId: row.ItemDetailId,
        tagged: row.selectedTag === 'Y' ? 'Y' : 'N',
      })
      .subscribe({
        next: (res) => {
          this.toastr.success(res?.message ?? 'Update Successfully');
          this.saving = false;
          this.loadReceipts();
        },
        error: (e) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not update tagging status.'));
        },
      });
  }

  private loadFinancialYears(): void {
    this.http.get<FinancialYear[]>(`${this.apiRoot}financial-years`).subscribe({
      next: (res) => {
        this.financialYears = [{ Key: 0, Value: 'Select Fin Year' }, ...this.mapYears(res)];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load financial years.')),
    });
  }

  private loadItems(): void {
    this.http
      .get<{ itemCode: string; itemName: string }[]>(
        `${this.apiRoot}facility-receipt-items`,
      )
      .subscribe({
        next: (res) => {
          this.itemOptions = [
            { ItemCode: '0', ItemName: '--All--' },
            ...(Array.isArray(res)
              ? res.map((r: Record<string, unknown>) => ({
                  ItemCode: String(r['itemCode'] ?? r['ItemCode'] ?? ''),
                  ItemName: String(r['itemName'] ?? r['ItemName'] ?? ''),
                }))
              : []),
          ];
        },
        error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load item list.')),
      });
  }

  private mapYears(raw: unknown): FinancialYear[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      Key: Number(r['Key'] ?? r['key'] ?? 0),
      Value: String(r['Value'] ?? r['value'] ?? ''),
    }));
  }

  private mapBatches(raw: unknown): FacilityReceiptBatch[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      IssueId: Number(r['IssueId'] ?? r['issueId'] ?? 0),
      TentativeStartDate: this.optStr(r['TentativeStartDate'] ?? r['tentativeStartDate']),
      ReceiptNo: String(r['ReceiptNo'] ?? r['receiptNo'] ?? ''),
      SupplyStatus: String(r['SupplyStatus'] ?? r['supplyStatus'] ?? ''),
      DispatchDate: this.optStr(r['DispatchDate'] ?? r['dispatchDate']),
      DispatchNo: String(r['DispatchNo'] ?? r['dispatchNo'] ?? ''),
      Quantity: Number(r['Quantity'] ?? r['quantity'] ?? 0),
      PoId: Number(r['PoId'] ?? r['poId'] ?? 0),
      LocationId: Number(r['LocationId'] ?? r['locationId'] ?? 0),
      ReceivedDate: String(r['ReceivedDate'] ?? r['receivedDate'] ?? ''),
      ReceiptId: Number(r['ReceiptId'] ?? r['receiptId'] ?? 0),
    }));
  }

  private mapRows(raw: unknown): FacilityReceiptRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      PoId: Number(r['PoId'] ?? r['poId'] ?? 0),
      PoNo: String(r['PoNo'] ?? r['poNo'] ?? ''),
      PoDate: this.optStr(r['PoDate'] ?? r['poDate']),
      ItemDetailId: Number(r['ItemDetailId'] ?? r['itemDetailId'] ?? 0),
      ItemId: Number(r['ItemId'] ?? r['itemId'] ?? 0),
      ItemCode: String(r['ItemCode'] ?? r['itemCode'] ?? ''),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      ModelNo: String(r['ModelNo'] ?? r['modelNo'] ?? ''),
      MakeNo: String(r['MakeNo'] ?? r['makeNo'] ?? ''),
      InstallationDate: this.optStr(r['InstallationDate'] ?? r['installationDate']),
      InstallLocation: String(r['InstallLocation'] ?? r['installLocation'] ?? ''),
      WarrantyFrom: this.optStr(r['WarrantyFrom'] ?? r['warrantyFrom']),
      WarrantyTo: this.optStr(r['WarrantyTo'] ?? r['warrantyTo']),
      ConsigneeId: Number(r['ConsigneeId'] ?? r['consigneeId'] ?? 0),
      LocationName: String(r['LocationName'] ?? r['locationName'] ?? ''),
      SupplierName: String(r['SupplierName'] ?? r['supplierName'] ?? ''),
      Quantity: Number(r['Quantity'] ?? r['quantity'] ?? 0),
      ReceiptQty: Number(r['ReceiptQty'] ?? r['receiptQty'] ?? 0),
      ReceivedQty: Number(r['ReceivedQty'] ?? r['receivedQty'] ?? 0),
      Batches: [],
      tagOptions: [
        { label: 'Select', value: '' },
        { label: 'Tagged', value: 'Y' },
        { label: 'Not Tagged', value: 'N' },
      ],
      selectedTag: '',
    }));
  }

  private optStr(v: unknown): string | undefined {
    if (v === null || v === undefined || v === '') {
      return undefined;
    }
    return String(v);
  }
}
