import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { DmePageSkeletonComponent } from '../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-po-details-rdlc',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatTabsModule, DmePageSkeletonComponent],
  template: `
<div class="it-page" style="--page-accent:#059669">
  <h2 class="page-title">PO Details Report</h2>
  <div class="filters--compact">
    <div class="filter-section">
      <span class="filter-label">PO ID</span>
      <input type="text" [(ngModel)]="poNoId" placeholder="Enter PO ID" style="min-width:180px">
    </div>
    <button type="button" class="show-btn" (click)="loadData()">Show</button>
    <button type="button" class="show-btn" style="background:#dc2626" (click)="downloadReport()" *ngIf="items.length">Download Report</button>
  </div>
  <div class="tabs-wrap" *ngIf="!loading">
    <mat-tab-group>
      <mat-tab label="PO Items ({{ items.length }})">
        <div class="table-wrap">
          <table mat-table [dataSource]="itemSource" matSort class="it-grid">
            <ng-container matColumnDef="sno"><th mat-header-cell *matHeaderCellDef>S.No</th><td mat-cell *matCellDef="let i = index">{{ i + 1 }}</td></ng-container>
            <ng-container matColumnDef="itemCode"><th mat-header-cell *matHeaderCellDef>Item Code</th><td mat-cell *matCellDef="let row">{{ row.itemCode }}</td></ng-container>
            <ng-container matColumnDef="itemName"><th mat-header-cell *matHeaderCellDef>Item Name</th><td mat-cell *matCellDef="let row">{{ row.itemName }}</td></ng-container>
            <ng-container matColumnDef="make"><th mat-header-cell *matHeaderCellDef>Make</th><td mat-cell *matCellDef="let row">{{ row.make }}</td></ng-container>
            <ng-container matColumnDef="model"><th mat-header-cell *matHeaderCellDef>Model</th><td mat-cell *matCellDef="let row">{{ row.model }}</td></ng-container>
            <ng-container matColumnDef="poQty"><th mat-header-cell *matHeaderCellDef>PO Qty</th><td mat-cell *matCellDef="let row">{{ row.poQty }}</td></ng-container>
            <ng-container matColumnDef="basicRate"><th mat-header-cell *matHeaderCellDef>Rate</th><td mat-cell *matCellDef="let row">{{ row.basicRate }}</td></ng-container>
            <ng-container matColumnDef="poValue"><th mat-header-cell *matHeaderCellDef>Value</th><td mat-cell *matCellDef="let row">{{ row.poValue | number:'1.2-2' }}</td></ng-container>
            <ng-container matColumnDef="received"><th mat-header-cell *matHeaderCellDef>Received</th><td mat-cell *matCellDef="let row">{{ row.receivedQty }}</td></ng-container>
            <ng-container matColumnDef="installed"><th mat-header-cell *matHeaderCellDef>Installed</th><td mat-cell *matCellDef="let row">{{ row.installedQty }}</td></ng-container>
            <ng-container matColumnDef="balance"><th mat-header-cell *matHeaderCellDef>Balance</th><td mat-cell *matCellDef="let row">{{ row.balanceQty }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="itemColumns; sticky: true"></tr>
            <tr mat-row *matRowDef="let row; columns: itemColumns;"></tr>
          </table>
          <div class="empty-row" *ngIf="!items.length">Enter PO ID and click Show.</div>
          <mat-paginator #itemPaginator [pageSizeOptions]="[10,15,30]" showFirstLastButtons></mat-paginator>
        </div>
      </mat-tab>
      <mat-tab label="Receipt Details ({{ receipts.length }})">
        <div class="table-wrap">
          <table mat-table [dataSource]="receiptSource" matSort class="it-grid">
            <ng-container matColumnDef="sno"><th mat-header-cell *matHeaderCellDef>S.No</th><td mat-cell *matCellDef="let i = index">{{ i + 1 }}</td></ng-container>
            <ng-container matColumnDef="location"><th mat-header-cell *matHeaderCellDef>Location</th><td mat-cell *matCellDef="let row">{{ row.locationName }}</td></ng-container>
            <ng-container matColumnDef="invoiceNo"><th mat-header-cell *matHeaderCellDef>Invoice No</th><td mat-cell *matCellDef="let row">{{ row.invoiceNo }}</td></ng-container>
            <ng-container matColumnDef="invoiceDate"><th mat-header-cell *matHeaderCellDef>Invoice Date</th><td mat-cell *matCellDef="let row">{{ row.invoiceDate }}</td></ng-container>
            <ng-container matColumnDef="qty"><th mat-header-cell *matHeaderCellDef>Qty</th><td mat-cell *matCellDef="let row">{{ row.invoiceAbsQty }}</td></ng-container>
            <ng-container matColumnDef="receivedDate"><th mat-header-cell *matHeaderCellDef>Received</th><td mat-cell *matCellDef="let row">{{ row.recievedDate }}</td></ng-container>
            <ng-container matColumnDef="installDate"><th mat-header-cell *matHeaderCellDef>Install Date</th><td mat-cell *matCellDef="let row">{{ row.installationDate }}</td></ng-container>
            <ng-container matColumnDef="days"><th mat-header-cell *matHeaderCellDef>Days</th><td mat-cell *matCellDef="let row">{{ row.daystaken }}</td></ng-container>
            <ng-container matColumnDef="logo"><th mat-header-cell *matHeaderCellDef>Logo</th><td mat-cell *matCellDef="let row">{{ row.logo }}</td></ng-container>
            <tr mat-header-row *matHeaderRowDef="receiptColumns; sticky: true"></tr>
            <tr mat-row *matRowDef="let row; columns: receiptColumns;"></tr>
          </table>
          <div class="empty-row" *ngIf="!receipts.length">No receipt data.</div>
          <mat-paginator #receiptPaginator [pageSizeOptions]="[10,15,30]" showFirstLastButtons></mat-paginator>
        </div>
      </mat-tab>
    </mat-tab-group>
  </div>
</div>`,
  styles: [`:host{display:block;width:100%;height:100%;overflow:hidden}
.it-page{--page-accent:#059669;--table-head-bg:var(--page-accent);--table-head-text:#fff;--table-cell-bg:#fff;--table-row-border:#e2e8f0;--table-wrap-border:#e2e8f0;display:flex;flex-direction:column;width:100%;height:100%;padding:8px 12px 12px;box-sizing:border-box;font-family:Inter,sans-serif;color:#334155;overflow:hidden}
:host-context(html[data-theme='dark']) .it-page{--page-accent:#10b981;--table-head-bg:#10b981;--table-cell-bg:#0c0e12;--table-row-border:#262b36;--table-wrap-border:#262b36;color:#e2e8f0}
.page-title{margin:0 0 8px;font-size:1.15rem;font-weight:700;color:#0f172a}
:host-context(html[data-theme='dark']) .page-title{color:#f8fafc}
.filters--compact{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:8px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;flex-shrink:0}
:host-context(html[data-theme='dark']) .filters--compact{background:#141820;border-color:#262b36}
.filter-section{display:flex;flex-direction:column;gap:4px}
.filter-label{font-size:11px;font-weight:600;text-transform:uppercase;color:#64748b}
input{min-height:34px;padding:0 12px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;font-size:13px;color:#334155;outline:none}
input:focus{border-color:var(--page-accent)}
:host-context(html[data-theme='dark']) input{background:#0c0e12;border-color:#262b36;color:#e2e8f0}
.show-btn{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:6px 20px;border-radius:999px;font-size:13px;font-weight:600;border:none;background:var(--page-accent);color:#fff;cursor:pointer;font-family:inherit}
.show-btn:hover{filter:brightness(.9)}
.tabs-wrap{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column}
:host ::ng-deep .mat-mdc-tab-body-wrapper{flex:1;min-height:0}
:host ::ng-deep .mat-mdc-tab-body-content{height:100%!important;overflow:auto!important}
.table-wrap{height:100%;overflow:auto;background:var(--table-cell-bg);border:1px solid var(--table-wrap-border);border-radius:10px;display:flex;flex-direction:column}
:host ::ng-deep .it-grid{width:100%;background:transparent}
:host ::ng-deep .it-grid .mat-mdc-header-cell{background:var(--table-head-bg);color:var(--table-head-text)!important;font-weight:700;font-size:12px;white-space:nowrap;padding:10px 12px}
:host ::ng-deep .it-grid .mat-mdc-cell{font-size:13px;color:#334155!important;border-bottom:1px solid var(--table-row-border)!important;padding:10px 12px;background:var(--table-cell-bg)}
:host-context(html[data-theme='dark']) ::ng-deep .it-grid .mat-mdc-cell{color:#e2e8f0!important}
:host ::ng-deep .it-grid .mat-mdc-row:nth-child(even) .mat-mdc-cell{background:#f8fafc}
:host-context(html[data-theme='dark']) ::ng-deep .it-grid .mat-mdc-row:nth-child(even) .mat-mdc-cell{background:#141820}
.empty-row{text-align:center;padding:28px 12px;color:#64748b;font-size:13px}`]
})
export class PoDetailsRdlcComponent {
  poNoId = '';
  loading = false;
  items: any[] = [];
  receipts: any[] = [];
  itemSource = new MatTableDataSource<any>([]);
  receiptSource = new MatTableDataSource<any>([]);
  itemColumns = ['sno', 'itemCode', 'itemName', 'make', 'model', 'poQty', 'basicRate', 'poValue', 'received', 'installed', 'balance'];
  receiptColumns = ['sno', 'location', 'invoiceNo', 'invoiceDate', 'qty', 'receivedDate', 'installDate', 'days', 'logo'];
  @ViewChild('itemPaginator') itemPaginator!: MatPaginator;
  @ViewChild('receiptPaginator') receiptPaginator!: MatPaginator;

  constructor(private readonly api: ApiService, private readonly toastr: ToastrService, route: ActivatedRoute) {
    route.queryParams.subscribe(p => {
      if (p['pono_id'] || p['Pono_ID']) { this.poNoId = p['pono_id'] || p['Pono_ID']; setTimeout(() => this.loadData()); }
    });
  }

  loadData() {
    if (!this.poNoId) return;
    this.loading = true;
    this.api.get('PODetailsRDLC/items', { params: { poNoId: this.poNoId } }).subscribe({
      next: (r: any) => {
        this.items = Array.isArray(r) ? r : r?.data || [];
        this.itemSource.data = this.items;
        setTimeout(() => this.itemSource.paginator = this.itemPaginator);
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Failed to load items.'); }
    });
    this.api.get('PODetailsRDLC/receipts', { params: { poNoId: this.poNoId } }).subscribe({
      next: (r: any) => {
        this.receipts = Array.isArray(r) ? r : r?.data || [];
        this.receiptSource.data = this.receipts;
        setTimeout(() => this.receiptSource.paginator = this.receiptPaginator);
      }
    });
  }

  downloadReport() {
    window.open(`/api/PODetailsRDLC/download?poNoId=${this.poNoId}`, '_blank');
  }
}
