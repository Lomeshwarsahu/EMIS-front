import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableExporterDirective, MatTableExporterModule } from 'mat-table-exporter';
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
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatTableExporterModule, DmePageSkeletonComponent],
  template: `
<div class="supplier-po-page">
  <h2 class="page-title wide">{{ config.title }}</h2>
  <div class="datagrid">
    <div class="table-toolbar filters">
      <select [(ngModel)]="selectedSupplierId" (change)="onSupplierChange()" aria-label="Supplier">
        <option [ngValue]="0">Select Supplier</option>
        <option *ngFor="let s of suppliers" [ngValue]="s.supplierId">{{ s.supplierName }}</option>
      </select>
      <select [(ngModel)]="selectedTenderId" (change)="onTenderChange()" aria-label="Tender">
        <option [ngValue]="0">Select Tender</option>
        <option *ngFor="let t of tenders" [ngValue]="t.tenderId">{{ t.tenderNo }}</option>
      </select>
      <button type="button" class="show-btn" (click)="loadGrid()">Show Data</button>
      <input type="text" class="toolbar-search" placeholder="Search..." aria-label="Search" (keyup)="applyTextFilter($event)" />
      <button type="button" class="export-btn" (click)="exportExcel()" [disabled]="!dataSource.data.length">Export Excel</button>
    </div>
    <app-dme-page-skeleton *ngIf="loading" type="table" [rows]="6" [cols]="5" />
    <div class="table-wrap" *ngIf="!loading">
      <table class="po-grid" mat-table matTableExporter #exporter="matTableExporter" [dataSource]="dataSource" matSort #sort="matSort">
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
  styleUrls: ['../Suppliers/supplier-po-pages.shared.css'],
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
  // Table sits under *ngIf, so the toolbar reaches the exporter through ViewChild.
  @ViewChild('exporter') exporter?: MatTableExporterDirective;

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

  exportExcel() {
    this.exporter?.exportTable('xlsx', { fileName: 'EMDApproval', sheet: 'EMDApproval', Props: { Author: 'cgmsc' } });
  }

  applyTextFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
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

