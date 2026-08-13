import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DmePageSkeletonComponent } from '../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute } from '@angular/router';

const VARIANT_CONFIG: Record<string, { title: string; accent: string; approvalType: string }> = {
  bme: { title: 'EMD Deposit BME Approval', accent: '#7c3aed', approvalType: 'BME' },
  bankletter: { title: 'EMD Deposit Bank Letter/GMF Approval', accent: '#0891b2', approvalType: 'BANKLETTER' },
  gmf: { title: 'EMD Deposit GMF Approval', accent: '#ea580c', approvalType: 'GMF' },
  gmfsanction: { title: 'EMD Deposit GMF Sanction', accent: '#dc2626', approvalType: 'GMF_SANCTION' },
  gmt: { title: 'EMD Deposit GMT Approval', accent: '#059669', approvalType: 'GMT' },
};

@Component({
  selector: 'app-emd-file-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, DmePageSkeletonComponent],
  template: `
<div class="it-page" [style.--page-accent]="config.accent">
  <h2 class="page-title">{{ config.title }}</h2>
  <div class="datagrid">
    <div class="filters--compact">
      <div class="filter-section">
        <span class="filter-label">Supplier</span>
        <select [(ngModel)]="selectedSupplierId" (change)="onSupplierChange()" style="min-width:220px">
          <option [ngValue]="0">Select Supplier</option>
          <option *ngFor="let s of suppliers" [ngValue]="s.supplierId">{{ s.supplierName }}</option>
        </select>
      </div>
      <div class="filter-section">
        <span class="filter-label">Tender</span>
        <select [(ngModel)]="selectedTenderId" (change)="onTenderChange()" style="min-width:220px">
          <option [ngValue]="0">Select Tender</option>
          <option *ngFor="let t of tenders" [ngValue]="t.tenderId">{{ t.tenderNo }}</option>
        </select>
      </div>
      <button type="button" class="show-btn" (click)="loadGrid()">Show Details</button>
    </div>
    <app-dme-page-skeleton *ngIf="loading" type="table" [rows]="6" [cols]="5" />
    <div class="table-wrap" *ngIf="!loading">
      <table mat-table [dataSource]="dataSource" matSort #sort="matSort" class="it-grid">
        <ng-container matColumnDef="sno"><th mat-header-cell *matHeaderCellDef>S.No</th><td mat-cell *matCellDef="let row; let i = index">{{ i + 1 }}</td></ng-container>
        <ng-container matColumnDef="tenderNo"><th mat-header-cell *matHeaderCellDef>Tender No</th><td mat-cell *matCellDef="let row">{{ row.tenderNo }}</td></ng-container>
        <ng-container matColumnDef="supplier"><th mat-header-cell *matHeaderCellDef>Supplier</th><td mat-cell *matCellDef="let row">{{ row.supplierName }}</td></ng-container>
        <ng-container matColumnDef="emdAmount"><th mat-header-cell *matHeaderCellDef>EMD Amount</th><td mat-cell *matCellDef="let row">₹{{ row.emdAmount | number: '1.2-2' }}</td></ng-container>
        <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let row">{{ row.status }}</td></ng-container>
        <ng-container matColumnDef="action"><th mat-header-cell *matHeaderCellDef>Action</th>
          <td mat-cell *matCellDef="let row">
            <button type="button" class="link-btn" (click)="approveEmd(row)">Approve</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div class="empty-row" *ngIf="!dataSource.data.length">Select supplier/tender and click Show.</div>
      <mat-paginator #paginator [pageSizeOptions]="[10,15,30]" showFirstLastButtons></mat-paginator>
    </div>
  </div>
</div>`,
  styles: [`:host{display:block;width:100%;height:100%;overflow:hidden}
.it-page{--page-accent:#2563eb;--table-head-bg:var(--page-accent);--table-head-text:#fff;--table-cell-bg:#fff;--table-row-border:#e2e8f0;--table-wrap-border:#e2e8f0;display:flex;flex-direction:column;width:100%;height:100%;padding:8px 12px 12px;box-sizing:border-box;font-family:Inter,sans-serif;color:#334155;overflow:hidden}
:host-context(html[data-theme='dark']) .it-page{--page-accent:#3b82f6;--table-head-bg:#3b82f6;--table-cell-bg:#0c0e12;--table-row-border:#262b36;--table-wrap-border:#262b36;color:#e2e8f0}
.page-title{margin:0 0 8px;font-size:1.15rem;font-weight:700;color:#0f172a}
:host-context(html[data-theme='dark']) .page-title{color:#f8fafc}
.datagrid{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}
.filters--compact{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:8px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;flex-shrink:0}
:host-context(html[data-theme='dark']) .filters--compact{background:#141820;border-color:#262b36}
.filter-section{display:flex;flex-direction:column;gap:4px}
.filter-label{font-size:11px;font-weight:600;text-transform:uppercase;color:#64748b}
select{min-height:34px;padding:0 12px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;font-size:13px;color:#334155;outline:none;cursor:pointer}
select option{background:#ffffff;color:#0f172a}
select:focus{border-color:var(--page-accent)}
:host-context(html[data-theme='dark']) select{background:#0c0e12;border-color:#262b36;color:#e2e8f0}
:host-context(html[data-theme='dark']) select option{background:#1e293b;color:#f8fafc}
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
.empty-row{text-align:center;padding:28px 12px;color:#64748b;font-size:13px}`]
})
export class EmdFileApprovalComponent implements OnInit {
  variant = 'bme';
  config = VARIANT_CONFIG['bme'];
  selectedSupplierId = 0;
  selectedTenderId = 0;
  suppliers: any[] = [];
  tenders: any[] = [];
  loading = false;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['sno', 'tenderNo', 'supplier', 'emdAmount', 'status', 'action'];
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private readonly api: ApiService, private readonly toastr: ToastrService, route: ActivatedRoute) {
    route.data.subscribe(d => {
      this.variant = d['variant'] || 'bme';
      this.config = VARIANT_CONFIG[this.variant] || VARIANT_CONFIG['bme'];
    });
  }

  ngOnInit() {
    this.loadGrid();

    this.api.get('EMDRefund/suppliers').subscribe({
      next: (r: any) => {
        const list = Array.isArray(r) ? r : (r as any)?.data || [];
        this.suppliers = list.map((s: any) => ({
          supplierId: Number(s['supplierId'] ?? s['SupplierId'] ?? s['supplier_id'] ?? s['id'] ?? 0),
          supplierName: String(s['supplierName'] ?? s['SupplierName'] ?? s['supplier_name'] ?? s['name'] ?? '')
        }));
      }
    });

    this.api.get('EMDRefund/tenders').subscribe({
      next: (r: any) => {
        const list = Array.isArray(r) ? r : (r as any)?.data || [];
        this.tenders = list.map((t: any) => ({
          tenderId: Number(t['tenderId'] ?? t['TenderId'] ?? t['tender_id'] ?? t['id'] ?? 0),
          tenderNo: String(t['tenderNo'] ?? t['TenderNo'] ?? t['tender_no'] ?? '')
        }));
      }
    });
  }

  onSupplierChange() {
    if (this.selectedSupplierId) {
      this.loadTenders();
    }
    this.loadGrid();
  }

  onTenderChange() {
    this.loadGrid();
  }

  loadTenders() {
    if (!this.selectedSupplierId) return;
    this.api.get('EMDRefund/tenders', { params: { supplierId: String(this.selectedSupplierId) } }).subscribe({
      next: (r: any) => {
        const list = Array.isArray(r) ? r : (r as any)?.data || [];
        this.tenders = list.map((t: any) => ({
          tenderId: Number(t['tenderId'] ?? t['TenderId'] ?? t['tender_no'] ?? t['id'] ?? 0),
          tenderNo: String(t['tenderNo'] ?? t['TenderNo'] ?? t['tender_no'] ?? '')
        }));
      }
    });
  }

  loadGrid() {
    this.loading = true;
    this.api.get('EMDRefund/pending-emd', { params: { supplierId: String(this.selectedSupplierId), tenderId: String(this.selectedTenderId) } }).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : (res as any)?.data || [];
        this.dataSource.data = list.map((row: any) => ({
          ...row,
          emdId: Number(row['id'] ?? row['Id'] ?? row['emdId'] ?? 0),
          tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? row['Tender_NO'] ?? ''),
          supplierName: String(row['supplierName'] ?? row['SupplierName'] ?? row['name'] ?? ''),
          emdAmount: Number(row['emdAmt'] ?? row['EmdAmt'] ?? row['EMDAmt'] ?? row['emdAmount'] ?? 0),
          status: String(row['status'] ?? row['Status'] ?? 'Pending Approval')
        }));
        setTimeout(() => { this.dataSource.sort = this.sort; this.dataSource.paginator = this.paginator; });
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Failed to load data.'); }
    });
  }

  approveEmd(row: any) {
    this.api.post1('EMDRefund/approve-emd', { emdId: row.emdId, approvalType: this.config.approvalType }).subscribe({
      next: () => { this.toastr.success('Approved!'); this.loadGrid(); },
      error: () => this.toastr.error('Approval failed.')
    });
  }
}

