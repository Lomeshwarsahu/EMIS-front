import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableExporterDirective, MatTableExporterModule } from 'mat-table-exporter';
import { DmePageSkeletonComponent } from '../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { ApiService } from '../../service/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-po-report-new',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatTableExporterModule, DmePageSkeletonComponent],
  template: `
<div class="supplier-po-page">
  <h2 class="page-title wide">PO Report</h2>
  <div class="datagrid">
    <div class="table-toolbar filters">
      <select [(ngModel)]="filter.itemId" aria-label="Item">
        <option value="0">All Items</option>
        <option *ngFor="let i of items" [value]="i.item_id">{{ i.item_name }}</option>
      </select>
      <select [(ngModel)]="filter.districtId" aria-label="District">
        <option value="0">All Districts</option>
        <option *ngFor="let d of districts" [value]="d.dp_DistrictID">{{ d.dBStart_Name_En }}</option>
      </select>
      <select [(ngModel)]="filter.facilityId" aria-label="Facility">
        <option value="0">All Facilities</option>
        <option *ngFor="let f of facilities" [value]="f.facility_aut_id">{{ f.facility_aut_name }}</option>
      </select>
      <button type="button" class="show-btn" (click)="loadReport()">Show Data</button>
      <input type="text" class="toolbar-search" placeholder="Search..." aria-label="Search" (keyup)="applyTextFilter($event)" />
      <button type="button" class="export-btn" (click)="exportExcel()" [disabled]="!dataSource.data.length">Export Excel</button>
    </div>
    <app-dme-page-skeleton *ngIf="loading" type="table" [rows]="8" [cols]="8" />
    <div class="table-wrap" *ngIf="!loading">
      <table class="po-grid" mat-table matTableExporter #exporter="matTableExporter" [dataSource]="dataSource" matSort #sort="matSort">
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
  styleUrls: ['../Suppliers/supplier-po-pages.shared.css'],
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
  // Table sits under *ngIf, so the toolbar reaches the exporter through ViewChild.
  @ViewChild('exporter') exporter?: MatTableExporterDirective;

  constructor(private readonly api: ApiService, private readonly toastr: ToastrService) {}

  ngOnInit() {
    this.api.get('PoReportNew/items').subscribe({ next: (r: any) => this.items = r || [] });
    this.api.get('PoReportNew/districts').subscribe({ next: (r: any) => this.districts = r || [] });
    this.api.get('PoReportNew/facilities').subscribe({ next: (r: any) => this.facilities = r || [] });
  }

  exportExcel() {
    this.exporter?.exportTable('xlsx', { fileName: 'POReport', sheet: 'POReport', Props: { Author: 'cgmsc' } });
  }

  applyTextFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
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
