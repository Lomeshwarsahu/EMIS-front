import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';

interface FinancialYearOption {
  financialYearId: number;
  year: string;
}

interface PoOption {
  poId: number;
  displayText: string;
}

interface ReceiptBatch {
  issueId: number;
  poId: number;
  locationId: number;
  receiptId?: number;
  dispatchDate: string;
  receivedDate: string;
  supplyStatus: string;
}

interface ReceiptRow {
  poItemId: number;
  poId: number;
  consigneeId: number;
  locationName: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  supplyQty: number;
  receiptQty: number;
  instQty: number;
  deniedQty: number;
  deniedStatus: string;
  batches: ReceiptBatch[];
}

type PoTypeFilter = 'All' | 'PRI' | 'PD' | 'C';

@Component({
  selector: 'app-po-supply-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './po-supply-receipt.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './po-supply-receipt.component.css'],
})
export class PoSupplyReceiptComponent implements OnInit {
  loading = false;
  userId = 0;

  financialYears: FinancialYearOption[] = [];
  poOptions: PoOption[] = [];
  selectedFinancialYearId = 0;
  selectedPoId = 0;
  poType: PoTypeFilter = 'All';
  rows: ReceiptRow[] = [];

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveSupplierUserId();
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
      return;
    }
    this.loadFilters();
  }

  loadFilters(): void {
    this.loading = true;
    this.api.getSupplierPoReceiptFilters(this.userId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.financialYears = this.mapFinancialYears(
          (raw['financialYears'] ?? raw['FinancialYears'] ?? []) as unknown[],
        );
        this.loadPoOptions();
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load filters.');
      },
    });
  }

  onPoTypeChange(): void {
    this.selectedPoId = 0;
    this.rows = [];
    this.loadPoOptions();
  }

  onYearChange(): void {
    this.selectedPoId = 0;
    this.rows = [];
    this.loadPoOptions();
  }

  loadPoOptions(): void {
    this.api.getSupplierPoReceiptOptions(this.userId, this.selectedFinancialYearId, this.poType).subscribe({
      next: (raw) => {
        const list = Array.isArray(raw) ? raw : [];
        this.poOptions = list.map((item) => {
          const row = item as Record<string, unknown>;
          return {
            poId: Number(row['poId'] ?? row['PoId'] ?? 0),
            displayText: String(row['displayText'] ?? row['DisplayText'] ?? ''),
          };
        });
        if (!this.poOptions.length) {
          this.poOptions = [{ poId: 0, displayText: 'Select PO' }];
        }
      },
      error: (err) => {
        this.poOptions = [{ poId: 0, displayText: 'Select PO' }];
        this.toastr.error(err?.error?.message ?? 'Unable to load PO list.');
      },
    });
  }

  showDetails(): void {
    if (!this.selectedPoId) {
      this.toastr.warning('Please select PO.');
      return;
    }
    this.loading = true;
    this.api.getSupplierPoReceipt(this.userId, this.selectedPoId).subscribe({
      next: (raw) => {
        this.loading = false;
        const list = Array.isArray(raw) ? raw : [];
        this.rows = list.map((row) => this.mapRow(row as Record<string, unknown>));
      },
      error: (err) => {
        this.loading = false;
        this.rows = [];
        this.toastr.error(err?.error?.message ?? 'Unable to load receipt details.');
      },
    });
  }

  onBatchStatus(batch: ReceiptBatch, row: ReceiptRow): void {
    if (batch.supplyStatus === 'Installation Completed' && batch.receiptId) {
      this.toastr.info(`Installation report for receipt ${batch.receiptId} — migration pending.`);
      return;
    }
    this.toastr.info(
      `Receipt entry for PO ${row.poId}, consignee ${row.consigneeId}, issue ${batch.issueId} — migration pending.`,
    );
  }

  isStatusLink(batch: ReceiptBatch): boolean {
    return batch.supplyStatus !== 'Dispatch Pending';
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

  private mapRow(row: Record<string, unknown>): ReceiptRow {
    const batchesRaw = row['batches'] ?? row['Batches'] ?? [];
    const batches = Array.isArray(batchesRaw)
      ? batchesRaw.map((b) => this.mapBatch(b as Record<string, unknown>))
      : [];

    return {
      poItemId: Number(row['poItemId'] ?? row['PoItemId'] ?? 0),
      poId: Number(row['poId'] ?? row['PoId'] ?? 0),
      consigneeId: Number(row['consigneeId'] ?? row['ConsigneeId'] ?? 0),
      locationName: String(row['locationName'] ?? row['LocationName'] ?? ''),
      itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
      itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
      quantity: Number(row['quantity'] ?? row['Quantity'] ?? 0),
      supplyQty: Number(row['supplyQty'] ?? row['SupplyQty'] ?? 0),
      receiptQty: Number(row['receiptQty'] ?? row['ReceiptQty'] ?? 0),
      instQty: Number(row['instQty'] ?? row['InstQty'] ?? 0),
      deniedQty: Number(row['deniedQty'] ?? row['DeniedQty'] ?? 0),
      deniedStatus: String(row['deniedStatus'] ?? row['DeniedStatus'] ?? ''),
      batches,
    };
  }

  private mapBatch(row: Record<string, unknown>): ReceiptBatch {
    const receiptIdRaw = row['receiptId'] ?? row['ReceiptId'];
    return {
      issueId: Number(row['issueId'] ?? row['IssueId'] ?? 0),
      poId: Number(row['poId'] ?? row['PoId'] ?? 0),
      locationId: Number(row['locationId'] ?? row['LocationId'] ?? 0),
      receiptId: receiptIdRaw == null ? undefined : Number(receiptIdRaw),
      dispatchDate: String(row['dispatchDate'] ?? row['DispatchDate'] ?? ''),
      receivedDate: String(row['receivedDate'] ?? row['ReceivedDate'] ?? ''),
      supplyStatus: String(row['supplyStatus'] ?? row['SupplyStatus'] ?? ''),
    };
  }
}
