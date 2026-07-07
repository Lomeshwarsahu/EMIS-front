import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';
import {
  PoSupplyDispatchFilters,
  navigateToPoSupplyDispatch,
  poSupplyDispatchQuery,
  readPoSupplyDispatchFilters,
} from '../supplier-transaction-state.util';

interface DispatchEditBatch {
  issueId: number;
  poId: number;
  locationId: number;
  categoryId: number;
  dispatchNo: string;
  dispatchDate: string;
  tentativeSupplyDate: string;
  receivedDate: string;
  quantity: number;
  supplyStatus: string;
}

interface DispatchEditRow {
  poItemId: number;
  poId: number;
  itemId: number;
  consigneeId: number;
  categoryId: number;
  itemName: string;
  itemCode: string;
  locationName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  canAddDispatch: boolean;
  batches: DispatchEditBatch[];
}

@Component({
  selector: 'app-po-supply-dispatch-edit',
  standalone: true,
  imports: [CommonModule, SupplierPageSkeletonComponent],
  templateUrl: './po-supply-dispatch-edit.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './po-supply-dispatch-edit.component.css'],
})
export class PoSupplyDispatchEditComponent implements OnInit {
  loading = false;
  userId = 0;
  poId = 0;
  poNo = '';
  poDate = '';
  rows: DispatchEditRow[] = [];
  private returnFilters: PoSupplyDispatchFilters = {
    financialYearId: 0,
    tenderId: 0,
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveSupplierUserId();
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      this.returnFilters = readPoSupplyDispatchFilters({
        financialYearId: params.get('financialYearId') ?? 0,
        tenderId: params.get('tenderId') ?? 0,
      });
      this.poId = Number(params.get('poId') || params.get('POID') || 0);
      if (!this.poId) {
        this.toastr.error('PO id is required.');
        return;
      }
      this.loadDesk();
    });
  }

  loadDesk(): void {
    this.loading = true;
    this.api.getSupplierPoDispatchEdit(this.userId, this.poId).subscribe({
      next: (raw) => {
        this.loading = false;
        const data = raw as Record<string, unknown>;
        this.poNo = String(data['poNo'] ?? data['PoNo'] ?? '');
        this.poDate = String(data['poDate'] ?? data['PoDate'] ?? '');
        const rowsRaw = data['rows'] ?? data['Rows'] ?? [];
        this.rows = Array.isArray(rowsRaw)
          ? rowsRaw.map((row) => this.mapRow(row as Record<string, unknown>))
          : [];
      },
      error: (err) => {
        this.loading = false;
        this.rows = [];
        this.toastr.error(err?.error?.message ?? 'Unable to load dispatch equipment desk.');
      },
    });
  }

  backToDispatchDesk(): void {
    navigateToPoSupplyDispatch(this.router, this.returnFilters);
  }

  onAddDispatch(row: DispatchEditRow): void {
    this.navigateToDispatchEntry(row, 0);
  }

  onBatchStatus(batch: DispatchEditBatch, row: DispatchEditRow): void {
    if (this.isCompleteStatus(batch.supplyStatus)) {
      this.openDispatchReportInNewTab(batch);
      return;
    }
    this.navigateToDispatchEntry(row, batch.issueId, batch.categoryId);
  }

  openDispatchReportInNewTab(batch: DispatchEditBatch): void {
    const urlTree = this.router.createUrlTree(['/transaction/po-supply-dispatch-report'], {
      queryParams: {
        poId: batch.poId,
        locId: batch.locationId,
        issueId: batch.issueId,
      },
    });
    const path = this.router.serializeUrl(urlTree);
    const fullUrl = `${window.location.origin}${path}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  }

  isCompleteStatus(status: string): boolean {
    return status.trim().toLowerCase() === 'complete';
  }

  private navigateToDispatchEntry(
    row: DispatchEditRow,
    issueId: number,
    categoryId = row.categoryId,
  ): void {
    if (categoryId === 2) {
      this.toastr.info('Reagent dispatch entry is not migrated yet.');
      return;
    }

    this.router.navigate(['/transaction/po-supply-dispatch-entry'], {
      queryParams: {
        poId: row.poId,
        locId: row.consigneeId,
        itemId: row.itemId,
        issueId,
        ...poSupplyDispatchQuery(this.returnFilters),
      },
    });
  }

  private mapRow(row: Record<string, unknown>): DispatchEditRow {
    const batchesRaw = row['batches'] ?? row['Batches'] ?? [];
    const batches = Array.isArray(batchesRaw)
      ? batchesRaw.map((b) => this.mapBatch(b as Record<string, unknown>))
      : [];

    return {
      poItemId: Number(row['poItemId'] ?? row['PoItemId'] ?? 0),
      poId: Number(row['poId'] ?? row['PoId'] ?? 0),
      itemId: Number(row['itemId'] ?? row['ItemId'] ?? 0),
      consigneeId: Number(row['consigneeId'] ?? row['ConsigneeId'] ?? 0),
      categoryId: Number(row['categoryId'] ?? row['CategoryId'] ?? 0),
      itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
      itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
      locationName: String(row['locationName'] ?? row['LocationName'] ?? ''),
      unitPrice: Number(row['unitPrice'] ?? row['UnitPrice'] ?? 0),
      quantity: Number(row['quantity'] ?? row['Quantity'] ?? 0),
      totalPrice: Number(row['totalPrice'] ?? row['TotalPrice'] ?? 0),
      canAddDispatch: Boolean(row['canAddDispatch'] ?? row['CanAddDispatch'] ?? false),
      batches,
    };
  }

  private mapBatch(row: Record<string, unknown>): DispatchEditBatch {
    return {
      issueId: Number(row['issueId'] ?? row['IssueId'] ?? 0),
      poId: Number(row['poId'] ?? row['PoId'] ?? 0),
      locationId: Number(row['locationId'] ?? row['LocationId'] ?? 0),
      categoryId: Number(row['categoryId'] ?? row['CategoryId'] ?? 0),
      dispatchNo: String(row['dispatchNo'] ?? row['DispatchNo'] ?? ''),
      dispatchDate: String(row['dispatchDate'] ?? row['DispatchDate'] ?? ''),
      tentativeSupplyDate: String(row['tentativeSupplyDate'] ?? row['TentativeSupplyDate'] ?? ''),
      receivedDate: String(row['receivedDate'] ?? row['ReceivedDate'] ?? ''),
      quantity: Number(row['quantity'] ?? row['Quantity'] ?? 0),
      supplyStatus: String(row['supplyStatus'] ?? row['SupplyStatus'] ?? ''),
    };
  }
}
