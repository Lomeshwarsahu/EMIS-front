import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DmePageSkeletonComponent } from '../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-po-report-new',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, DmePageSkeletonComponent],
  template: `
<div class="it-page" style="--page-accent:#f59e0b">
  <h2 class="page-title">PO Report</h2>
  <div class="datagrid">
    <div class="filters--compact">
      <div class="filter-section">
        <span class="filter-label">Item</span>
        <select [(ngModel)]="filter.itemId" style="min-width:180px">
          <option value="0">--All--</option>
          <option *ngFor="let i of items" [value]="i.item_id">{{ i.item_name }}</option>
        </select>
      </div>
      <div class="filter-section">
        <span class="filter-label">District</span>
        <select [(ngModel)]="filter.districtId" style="min-width:150px">
          <option value="0">--All--</option>
          <option *ngFor="let d of districts" [value]="d.dp_DistrictID">{{ d.dBStart_Name_En }}</option>
        </select>
      </div>
      <div class="filter-section">
        <span class="filter-label">Facility</span>
        <select [(ngModel)]="filter.facilityId" style="min-width:180px">
          <option value="0">--All--</option>
          <option *ngFor="let f of facilities" [value]="f.facility_aut_id">{{ f.facility_aut_name }}</option>
        </select>
      </div>
      <button type="button" class="show-btn" (click)="loadReport()">Show</button>
    </div>
    <app-dme-page-skeleton *ngIf="loading" type="table" [rows]="8" [cols]="8" />
    <div class="table-wrap" *ngIf="!loading">
      <table mat-table [dataSource]="dataSource" matSort #sort="matSort" class="it-grid">
        <ng-container matColumnDef="sno"><th mat-header-cell *matHeaderCellDef>S.No</th><td mat-cell *matCellDef="let i = index">{{ i + 1 }}</td></ng-container>
        <ng-container matColumnDef="tenderNo"><th mat-header-cell *matHeaderCellDef>Tender No</th><td mat-cell *matCellDef="let row">{{ row.tender_no }}</td></ng-container>
        <ng-container matColumnDef="poNo"><th mat-header-cell *matHeaderCellDef>PO No</th><td mat-cell *matCellDef="let row">{{ row.po_no }}</td></ng-container>
        <ng-container matColumnDef="supplier"><th mat-header-cell *matHeaderCellDef>Supplier</th><td mat-cell *matCellDef="let row">{{ row.supplier }}</td></ng-container>
        <ng-container matColumnDef="poDate"><th mat-header-cell *matHeaderCellDef>PO Date</th><td mat-cell *matCellDef="let row">{{ row.po_date }}</td></ng-container>
        <ng-container matColumnDef="itemName"><th mat-header-cell *matHeaderCellDef>Item</th><td mat-cell *matCellDef="let row">{{ row.item_name }}</td></ng-container>
        <ng-container matColumnDef="qty"><th mat-header-cell *matHeaderCellDef>Qty</th><td mat-cell *matCellDef="let row">{{ row.poqty }}</td></ng-container>
        <ng-container matColumnDef="value"><th mat-header-cell *matHeaderCellDef>Value</th><td mat-cell *matCellDef="let row">{{ row.poValue | number:'1.2-2' }}</td></ng-container>
        <ng-container matColumnDef="receiptQty"><th mat-header-cell *matHeaderCellDef>Receipt Qty</th><td mat-cell *matCellDef="let row">{{ row.receiptQTY }}</td></ng-container>
        <ng-container matColumnDef="instQty"><th mat-header-cell *matHeaderCellDef>Inst Qty</th><td mat-cell *matCellDef="let row">{{ row.instalationQty }}</td></ng-container>
        <ng-container matColumnDef="lastReceipt"><th mat-header-cell *matHeaderCellDef>Last Receipt</th><td mat-cell *matCellDef="let row">{{ row.lastRDate1 }}</td></ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div class="empty-row" *ngIf="!dataSource.data.length">Select filters and click Show.</div>
      <mat-paginator #paginator [pageSizeOptions]="[15,30,50]" showFirstLastButtons></mat-paginator>
    </div>
  </div>
</div>`,
  styles: [`:host{display:block;width:100%;height:100%;overflow:hidden}
.it-page{--page-accent:#f59e0b;--table-head-bg:var(--page-accent);--table-head-text:#fff;--table-cell-bg:#fff;--table-row-border:#e2e8f0;--table-wrap-border:#e2e8f0;display:flex;flex-direction:column;width:100%;height:100%;padding:8px 12px 12px;box-sizing:border-box;font-family:Inter,sans-serif;color:#334155;overflow:hidden}
:host-context(html[data-theme='dark']) .it-page{--page-accent:#fbbf24;--table-head-bg:#fbbf24;--table-head-text:#000;--table-cell-bg:#0c0e12;--table-row-border:#262b36;--table-wrap-border:#262b36;color:#e2e8f0}
.page-title{margin:0 0 8px;font-size:1.15rem;font-weight:700;color:#0f172a}
:host-context(html[data-theme='dark']) .page-title{color:#f8fafc}
.datagrid{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}
.filters--compact{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:8px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;flex-shrink:0}
:host-context(html[data-theme='dark']) .filters--compact{background:#141820;border-color:#262b36}
.filter-section{display:flex;flex-direction:column;gap:4px}
.filter-label{font-size:11px;font-weight:600;text-transform:uppercase;color:#64748b}
select{min-height:34px;padding:0 12px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;font-size:13px;color:#334155;outline:none;cursor:pointer}
select:focus{border-color:var(--page-accent)}
:host-context(html[data-theme='dark']) select{background:#0c0e12;border-color:#262b36;color:#e2e8f0}
.show-btn{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:6px 20px;border-radius:999px;font-size:13px;font-weight:600;border:none;background:var(--page-accent);color:#fff;cursor:pointer;font-family:inherit;margin-left:auto}
.show-btn:hover{filter:brightness(.9)}
.table-wrap{flex:1;min-height:0;overflow:auto;background:var(--table-cell-bg);border:1px solid var(--table-wrap-border);border-radius:10px;display:flex;flex-direction:column}
:host ::ng-deep .it-grid{width:100%;background:transparent}
:host ::ng-deep .it-grid .mat-mdc-header-cell{background:var(--table-head-bg);color:var(--table-head-text)!important;font-weight:700;font-size:12px;white-space:nowrap;padding:10px 12px}
:host ::ng-deep .it-grid .mat-mdc-cell{font-size:13px;color:#334155!important;border-bottom:1px solid var(--table-row-border)!important;padding:10px 12px;background:var(--table-cell-bg)}
:host-context(html[data-theme='dark']) ::ng-deep .it-grid .mat-mdc-cell{color:#e2e8f0!important}
:host ::ng-deep .it-grid .mat-mdc-row:nth-child(even) .mat-mdc-cell{background:#f8fafc}
:host-context(html[data-theme='dark']) ::ng-deep .it-grid .mat-mdc-row:nth-child(even) .mat-mdc-cell{background:#141820}
.empty-row{text-align:center;padding:28px 12px;color:#64748b;font-size:13px}`]
})
export class PoReportNewComponent {
  items: any[] = [];
  districts: any[] = [];
  facilities: any[] = [];
  filter = { itemId: '0', districtId: '0', facilityId: '0' };
  loading = false;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['sno', 'tenderNo', 'poNo', 'supplier', 'poDate', 'itemName', 'qty', 'value', 'receiptQty', 'instQty', 'lastReceipt'];
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private readonly api: ApiService, private readonly toastr: ToastrService) {}

  ngOnInit() {
    this.api.get('PoReportNew/items').subscribe({ next: (r: any) => this.items = r || [] });
    this.api.get('PoReportNew/districts').subscribe({ next: (r: any) => this.districts = r || [] });
    this.api.get('PoReportNew/facilities').subscribe({ next: (r: any) => this.facilities = r || [] });
  }

  loadReport() {
    this.loading = true;
    this.api.get('PoReportNew/report', { params: this.filter }).subscribe({
      next: (res: any) => {
        this.dataSource.data = res || [];
        setTimeout(() => { this.dataSource.sort = this.sort; this.dataSource.paginator = this.paginator; });
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Failed to load.'); }
    });
  }
}
