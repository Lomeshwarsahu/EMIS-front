import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DmePageSkeletonComponent } from '../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-invoices-by-so',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, DmePageSkeletonComponent],
  template: `
<div class="it-page" style="--page-accent:#0891b2">
  <h2 class="page-title">Invoices by Supply Order</h2>
  <div class="datagrid">
    <div class="filters--compact" *ngIf="!poNoId">
      <div class="filter-section">
        <span class="filter-label">PO ID</span>
        <input type="text" [(ngModel)]="searchPoId" placeholder="Enter PO ID" style="min-width:180px">
      </div>
      <button type="button" class="show-btn" (click)="loadInvoices()">Show Invoices</button>
    </div>
    <div class="header-info" *ngIf="headerData">
      <div class="info-badge"><strong>PO No:</strong> {{ headerData.poNo }}</div>
      <div class="info-badge"><strong>Supplier:</strong> {{ headerData.supplierName }}</div>
      <div class="info-badge"><strong>PO Date:</strong> {{ headerData.poDate }}</div>
    </div>
    <app-dme-page-skeleton *ngIf="loading" type="table" [rows]="6" [cols]="6" />
    <div class="table-wrap" *ngIf="!loading">
      <table mat-table [dataSource]="dataSource" matSort #sort="matSort" class="it-grid">
        <ng-container matColumnDef="sno"><th mat-header-cell *matHeaderCellDef>S.No</th><td mat-cell *matCellDef="let i = index">{{ i + 1 }}</td></ng-container>
        <ng-container matColumnDef="invoiceNo"><th mat-header-cell *matHeaderCellDef>Invoice No</th>
          <td mat-cell *matCellDef="let row"><input type="text" [(ngModel)]="row.invoiceNo" style="width:120px;border:none;background:transparent;border-bottom:1px solid"></td>
        </ng-container>
        <ng-container matColumnDef="invoiceDate"><th mat-header-cell *matHeaderCellDef>Invoice Date</th>
          <td mat-cell *matCellDef="let row"><input type="date" [(ngModel)]="row.invoiceDate" style="width:130px"></td>
        </ng-container>
        <ng-container matColumnDef="invoiceValue"><th mat-header-cell *matHeaderCellDef>Invoice Value</th>
          <td mat-cell *matCellDef="let row"><input type="number" [(ngModel)]="row.invoiceValue" style="width:100px;text-align:right;"></td>
        </ng-container>
        <ng-container matColumnDef="cgst"><th mat-header-cell *matHeaderCellDef>CGST</th>
          <td mat-cell *matCellDef="let row"><input type="number" [(ngModel)]="row.cgst" style="width:70px;text-align:right;"></td>
        </ng-container>
        <ng-container matColumnDef="sgst"><th mat-header-cell *matHeaderCellDef>SGST</th>
          <td mat-cell *matCellDef="let row"><input type="number" [(ngModel)]="row.sgst" style="width:70px;text-align:right;"></td>
        </ng-container>
        <ng-container matColumnDef="total"><th mat-header-cell *matHeaderCellDef>Total</th>
          <td mat-cell *matCellDef="let row">{{ ((row.invoiceValue||0)+(row.cgst||0)+(row.sgst||0)) | number:'1.2-2' }}</td>
        </ng-container>
        <ng-container matColumnDef="action"><th mat-header-cell *matHeaderCellDef>Action</th>
          <td mat-cell *matCellDef="let row">
            <button type="button" class="link-btn" (click)="saveInvoice(row)">Save</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div class="empty-row" *ngIf="!dataSource.data.length">Enter PO ID and click Show Invoices.</div>
      <mat-paginator #paginator [pageSizeOptions]="[10,15,30]" showFirstLastButtons></mat-paginator>
    </div>
  </div>
</div>`,
  styles: [`:host{display:block;width:100%;height:100%;overflow:hidden}
.it-page{--page-accent:#0891b2;--table-head-bg:var(--page-accent);--table-head-text:#fff;--table-cell-bg:#fff;--table-row-border:#e2e8f0;--table-wrap-border:#e2e8f0;display:flex;flex-direction:column;width:100%;height:100%;padding:8px 12px 12px;box-sizing:border-box;font-family:Inter,sans-serif;color:#334155;overflow:hidden}
:host-context(html[data-theme='dark']) .it-page{--page-accent:#06b6d4;--table-head-bg:#06b6d4;--table-cell-bg:#0c0e12;--table-row-border:#262b36;--table-wrap-border:#262b36;color:#e2e8f0}
.page-title{margin:0 0 8px;font-size:1.15rem;font-weight:700;color:#0f172a}
:host-context(html[data-theme='dark']) .page-title{color:#f8fafc}
.datagrid{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}
.filters--compact{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:8px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;flex-shrink:0}
:host-context(html[data-theme='dark']) .filters--compact{background:#141820;border-color:#262b36}
.header-info{display:flex;flex-wrap:wrap;gap:14px;padding:10px 14px;margin-bottom:8px;border:1px solid #e2e8f0;border-radius:10px;background:#f0f9ff;flex-shrink:0}
:host-context(html[data-theme='dark']) .header-info{background:#0c2430;border-color:#262b36}
.info-badge{font-size:13px}
.filter-section{display:flex;flex-direction:column;gap:4px}
.filter-label{font-size:11px;font-weight:600;text-transform:uppercase;color:#64748b}
input{min-height:34px;padding:0 12px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;font-size:13px;color:#334155;outline:none}
input:focus{border-color:var(--page-accent)}
:host-context(html[data-theme='dark']) input{background:#0c0e12;border-color:#262b36;color:#e2e8f0}
.show-btn{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:6px 20px;border-radius:999px;font-size:13px;font-weight:600;border:none;background:var(--page-accent);color:#fff;cursor:pointer;font-family:inherit;margin-left:auto}
.show-btn:hover{filter:brightness(.9)}
.table-wrap{flex:1;min-height:0;overflow:auto;background:var(--table-cell-bg);border:1px solid var(--table-wrap-border);border-radius:10px;display:flex;flex-direction:column}
:host ::ng-deep .it-grid{width:100%;background:transparent}
:host ::ng-deep .it-grid .mat-mdc-header-cell{background:var(--table-head-bg);color:var(--table-head-text)!important;font-weight:700;font-size:12px;white-space:nowrap;padding:10px 12px}
:host ::ng-deep .it-grid .mat-mdc-cell{font-size:13px;color:#334155!important;border-bottom:1px solid var(--table-row-border)!important;padding:6px 8px;background:var(--table-cell-bg)}
:host-context(html[data-theme='dark']) ::ng-deep .it-grid .mat-mdc-cell{color:#e2e8f0!important}
:host ::ng-deep .it-grid .mat-mdc-row:nth-child(even) .mat-mdc-cell{background:#f8fafc}
:host-context(html[data-theme='dark']) ::ng-deep .it-grid .mat-mdc-row:nth-child(even) .mat-mdc-cell{background:#141820}
.link-btn{background:none;border:none;color:var(--page-accent);font-weight:600;font-size:12px;cursor:pointer;font-family:inherit;text-decoration:underline}
.empty-row{text-align:center;padding:28px 12px;color:#64748b;font-size:13px}`]
})
export class InvoicesBySoComponent {
  searchPoId = '';
  poNoId = '';
  loading = false;
  headerData: any = null;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['sno', 'invoiceNo', 'invoiceDate', 'invoiceValue', 'cgst', 'sgst', 'total', 'action'];
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private readonly api: ApiService, private readonly toastr: ToastrService, route: ActivatedRoute) {
    route.queryParams.subscribe(p => {
      if (p['pono_id'] || p['PoNoID']) {
        this.poNoId = p['pono_id'] || p['PoNoID'];
        setTimeout(() => this.loadInvoices());
      }
    });
  }

  loadInvoices() {
    const id = this.poNoId || this.searchPoId;
    if (!id) return;
    this.loading = true;
    this.api.get('InvoicesBySO/header', { params: { poNoId: id } }).subscribe({
      next: (h: any) => this.headerData = h,
      error: () => {}
    });
    this.api.get('InvoicesBySO/list', { params: { poNoId: id } }).subscribe({
      next: (res: any) => {
        this.dataSource.data = (res || []).map((r: any) => ({
          invoiceId: r.invoiceId || 0,
          invoiceNo: r.invoiceNo || '',
          invoiceDate: r.invoiceDate || '',
          invoiceValue: r.invoiceValue || 0,
          cgst: r.cgst || 0,
          sgst: r.sgst || 0,
        }));
        setTimeout(() => { this.dataSource.sort = this.sort; this.dataSource.paginator = this.paginator; });
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Failed to load.'); }
    });
  }

  saveInvoice(row: any) {
    const payload = { ...row, poNoId: this.poNoId || this.searchPoId };
    this.api.post1('InvoicesBySO/save', payload).subscribe({
      next: () => this.toastr.success('Invoice saved!'),
      error: () => this.toastr.error('Save failed.')
    });
  }
}
