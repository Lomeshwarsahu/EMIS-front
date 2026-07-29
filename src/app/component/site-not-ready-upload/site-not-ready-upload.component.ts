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
  selector: 'app-site-not-ready-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, DmePageSkeletonComponent],
  template: `
<div class="it-page" style="--page-accent:#dc2626">
  <h2 class="page-title">Site Not Ready - Document Upload</h2>
  <div class="datagrid">
    <div class="filters--compact">
      <div class="filter-section">
        <span class="filter-label">PO ID</span>
        <input type="text" [(ngModel)]="poId" placeholder="Enter PO ID" style="min-width:180px">
      </div>
      <button type="button" class="show-btn" (click)="loadReceipts()">Show</button>
    </div>
    <app-dme-page-skeleton *ngIf="loading" type="table" [rows]="4" [cols]="6" />
    <div class="table-wrap" *ngIf="!loading">
      <table mat-table [dataSource]="dataSource" matSort #sort="matSort" class="it-grid">
        <ng-container matColumnDef="sno"><th mat-header-cell *matHeaderCellDef>S.No</th><td mat-cell *matCellDef="let i = index">{{ i + 1 }}</td></ng-container>
        <ng-container matColumnDef="receiptNo"><th mat-header-cell *matHeaderCellDef>Receipt No</th><td mat-cell *matCellDef="let row">{{ row.receipt_no }}</td></ng-container>
        <ng-container matColumnDef="receivedDate"><th mat-header-cell *matHeaderCellDef>Received Date</th><td mat-cell *matCellDef="let row">{{ row.recieved_date }}</td></ng-container>
        <ng-container matColumnDef="qty"><th mat-header-cell *matHeaderCellDef>Qty</th><td mat-cell *matCellDef="let row">{{ row.receipt_qty }}</td></ng-container>
        <ng-container matColumnDef="location"><th mat-header-cell *matHeaderCellDef>Location</th><td mat-cell *matCellDef="let row">{{ row.location_name }}</td></ng-container>
        <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let row">{{ row.siteNotFlag === 'Y' ? 'Uploaded' : 'Pending' }}</td></ng-container>
        <ng-container matColumnDef="file"><th mat-header-cell *matHeaderCellDef>File</th>
          <td mat-cell *matCellDef="let row">
            <input type="file" (change)="onFileSelected($event, row)" *ngIf="row.siteNotFlag !== 'Y'" accept=".pdf">
            <button type="button" class="link-btn" (click)="viewFile(row)" *ngIf="row.siteNotFlag === 'Y'">View</button>
          </td>
        </ng-container>
        <ng-container matColumnDef="action"><th mat-header-cell *matHeaderCellDef>Action</th>
          <td mat-cell *matCellDef="let row">
            <button type="button" class="link-btn" (click)="uploadFile(row)" [disabled]="!row._selectedFile">Upload</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div class="empty-row" *ngIf="!dataSource.data.length">Enter PO ID and click Show.</div>
      <mat-paginator #paginator [pageSizeOptions]="[10,15,30]" showFirstLastButtons></mat-paginator>
    </div>
  </div>
</div>`,
  styles: [`:host{display:block;width:100%;height:100%;overflow:hidden}
.it-page{--page-accent:#dc2626;--table-head-bg:var(--page-accent);--table-head-text:#fff;--table-cell-bg:#fff;--table-row-border:#e2e8f0;--table-wrap-border:#e2e8f0;display:flex;flex-direction:column;width:100%;height:100%;padding:8px 12px 12px;box-sizing:border-box;font-family:Inter,sans-serif;color:#334155;overflow:hidden}
:host-context(html[data-theme='dark']) .it-page{--page-accent:#ef4444;--table-head-bg:#ef4444;--table-cell-bg:#0c0e12;--table-row-border:#262b36;--table-wrap-border:#262b36;color:#e2e8f0}
.page-title{margin:0 0 8px;font-size:1.15rem;font-weight:700;color:#0f172a}
:host-context(html[data-theme='dark']) .page-title{color:#f8fafc}
.datagrid{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}
.filters--compact{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:8px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;flex-shrink:0}
:host-context(html[data-theme='dark']) .filters--compact{background:#141820;border-color:#262b36}
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
:host ::ng-deep .it-grid .mat-mdc-cell{font-size:13px;color:#334155!important;border-bottom:1px solid var(--table-row-border)!important;padding:10px 12px;background:var(--table-cell-bg)}
:host-context(html[data-theme='dark']) ::ng-deep .it-grid .mat-mdc-cell{color:#e2e8f0!important}
:host ::ng-deep .it-grid .mat-mdc-row:nth-child(even) .mat-mdc-cell{background:#f8fafc}
:host-context(html[data-theme='dark']) ::ng-deep .it-grid .mat-mdc-row:nth-child(even) .mat-mdc-cell{background:#141820}
.link-btn{background:none;border:none;color:var(--page-accent);font-weight:600;font-size:12px;cursor:pointer;font-family:inherit;text-decoration:underline}
.link-btn:disabled{opacity:.4;cursor:default}
.empty-row{text-align:center;padding:28px 12px;color:#64748b;font-size:13px}`]
})
export class SiteNotReadyUploadComponent {
  poId = '';
  loading = false;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['sno', 'receiptNo', 'receivedDate', 'qty', 'location', 'status', 'file', 'action'];
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private readonly api: ApiService, private readonly toastr: ToastrService, route: ActivatedRoute) {
    route.queryParams.subscribe(p => {
      if (p['pono_id']) { this.poId = p['pono_id']; setTimeout(() => this.loadReceipts()); }
    });
  }

  loadReceipts() {
    if (!this.poId) return;
    this.loading = true;
    this.api.get('SiteNotReady/receipts', { params: { poId: this.poId } }).subscribe({
      next: (res: any) => {
        this.dataSource.data = (res || []).map((r: any) => ({ ...r, _selectedFile: null }));
        setTimeout(() => { this.dataSource.sort = this.sort; this.dataSource.paginator = this.paginator; });
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Failed to load.'); }
    });
  }

  onFileSelected(event: any, row: any) {
    const file = event.target.files?.[0];
    if (file) row._selectedFile = file;
  }

  uploadFile(row: any) {
    if (!row._selectedFile) { this.toastr.warning('Select a file first.'); return; }
    const formData = new FormData();
    formData.append('file', row._selectedFile);
    formData.append('receiptId', row.receipt_id);
    this.api.post('SiteNotReady/upload', formData).subscribe({
      next: () => { this.toastr.success('Uploaded!'); this.loadReceipts(); },
      error: () => this.toastr.error('Upload failed.')
    });
  }

  viewFile(row: any) {
    if (row.siteNotReadyFile) window.open(row.siteNotReadyFile, '_blank');
    else this.toastr.warning('No file.');
  }
}
