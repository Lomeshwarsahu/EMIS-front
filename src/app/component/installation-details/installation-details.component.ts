import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DmePageSkeletonComponent } from '../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { ApiService } from 'src/app/service/api.service';
import { CRIDetailDTO } from 'src/app/Model/models';
import { ActivatedRoute } from '@angular/router';

interface VariantConfig {
  title: string;
  accent: string;
  variant: string;
}

const VARIANT_MAP: Record<string, VariantConfig> = {
  bme: { title: 'Installation Documents (BME)', accent: '#7c3aed', variant: 'bme' },
  deo: { title: 'Installation Documents (DEO)', accent: '#0891b2', variant: 'deo' },
  deonew: { title: 'Installation Documents (DEO New)', accent: '#059669', variant: 'deonew' },
  finctrl: { title: 'Installation Documents (Finance Control)', accent: '#dc2626', variant: 'finctrl' },
  gmt: { title: 'Installation Documents (GMT)', accent: '#ea580c', variant: 'gmt' },
};

@Component({
  selector: 'app-installation-details',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    DmePageSkeletonComponent,
  ],
  template: `
<div class="it-page" [style.--page-accent]="config.accent">
  <h2 class="page-title">{{ config.title }}</h2>

  <div class="card-section">
    <!-- PO Detail Card -->
    <div class="detail-card" *ngIf="headerPo.PoId">
      <div class="detail-grid">
        <div class="detail-item"><span class="dlbl">Item Code</span><span class="dval">{{ headerPo.itemcode }}</span></div>
        <div class="detail-item"><span class="dlbl">Item Name</span><span class="dval">{{ headerPo.ItemName }}</span></div>
        <div class="detail-item"><span class="dlbl">Tax</span><span class="dval">{{ headerPo.Percentage }}%</span></div>
        <div class="detail-item"><span class="dlbl">PO No</span><span class="dval">{{ headerPo.PoNo }}</span></div>
        <div class="detail-item"><span class="dlbl">PO Date</span><span class="dval">{{ headerPo.PoDate }}</span></div>
        <div class="detail-item"><span class="dlbl">Tender No</span><span class="dval">{{ headerPo.TenderNo }}</span></div>
        <div class="detail-item"><span class="dlbl">No of Consignee</span><span class="dval">{{ headerPo.Nosco }}</span></div>
        <div class="detail-item"><span class="dlbl">Model No</span><span class="dval">{{ headerPo.Model }}</span></div>
        <div class="detail-item"><span class="dlbl">Make</span><span class="dval">{{ headerPo.Make }}</span></div>
        <div class="detail-item"><span class="dlbl">Basic Rate</span><span class="dval">{{ headerPo.BasicRate }}</span></div>
        <div class="detail-item"><span class="dlbl">PO Quantity</span><span class="dval">{{ headerPo.Poq }}</span></div>
        <div class="detail-item"><span class="dlbl">Dispatched</span><span class="dval">{{ headerPo.Dispatched }}</span></div>
        <div class="detail-item"><span class="dlbl">Received QTY</span><span class="dval">{{ headerPo.ReceiptQty }}</span></div>
        <div class="detail-item"><span class="dlbl">Installed QTY</span><span class="dval">{{ headerPo.InsQty }}</span></div>
        <div class="detail-item"><span class="dlbl">Supply allowed Days</span><span class="dval">{{ headerPo.TrancheDays }}</span></div>
        <div class="detail-item"><span class="dlbl">Warranty Year</span><span class="dval">{{ headerPo.WarrantyYear }}</span></div>
      </div>
    </div>

    <!-- Denied Quantity -->
    <div class="detail-card" *ngIf="deniedDetail?.DeniedQty">
      <div class="detail-grid">
        <div class="detail-item"><span class="dlbl">Denied Qty</span><span class="dval">{{ deniedDetail.DeniedQty }}</span></div>
        <div class="detail-item"><span class="dlbl">Location</span><span class="dval">{{ deniedDetail.LocationName }}</span></div>
        <div class="detail-item"><span class="dlbl">Denied Letter</span><span class="dval">{{ deniedDetail.DeniedLetter }}</span></div>
        <div class="detail-item"><span class="dlbl">Receipt Copy</span><span class="dval">{{ deniedDetail.ReceiptCopy }}</span></div>
      </div>
    </div>
  </div>

  <!-- Grid -->
  <div class="datagrid">
    <div class="table-toolbar" *ngIf="dataSource.data.length">
      <input type="text" class="pill-input" placeholder="Search..." (keyup)="applyFilter($event)" style="max-width:260px" />
    </div>
    <app-dme-page-skeleton *ngIf="loading" type="table" [rows]="6" [cols]="5" />
    <div class="table-wrap" *ngIf="!loading">
      <table mat-table [dataSource]="dataSource" matSort #sort="matSort" class="it-grid">
        <ng-container matColumnDef="sno"><th mat-header-cell *matHeaderCellDef mat-sort-header>S.No</th><td mat-cell *matCellDef="let i = index">{{ i + 1 }}</td></ng-container>
        <ng-container matColumnDef="MakeNo"><th mat-header-cell *matHeaderCellDef mat-sort-header>Serial No</th><td mat-cell *matCellDef="let r">{{ r.MakeNo }}</td></ng-container>
        <ng-container matColumnDef="InstallationDate"><th mat-header-cell *matHeaderCellDef mat-sort-header>Installation Date</th><td mat-cell *matCellDef="let r">{{ r.InstallationDate }}</td></ng-container>
        <ng-container matColumnDef="WarentyFrom"><th mat-header-cell *matHeaderCellDef mat-sort-header>Warranty From/To</th><td mat-cell *matCellDef="let r">{{ r.WarentyFrom }} / {{ r.WarentyTo }}</td></ng-container>
        <ng-container matColumnDef="RecievedDate"><th mat-header-cell *matHeaderCellDef mat-sort-header>Received Date</th><td mat-cell *matCellDef="let r">{{ r.RecievedDate }}</td></ng-container>
        <ng-container matColumnDef="ReceivedQty"><th mat-header-cell *matHeaderCellDef mat-sort-header>Receipt QTY</th><td mat-cell *matCellDef="let r">{{ r.ReceivedQty }}</td></ng-container>
        <ng-container matColumnDef="WarrantyCardNo"><th mat-header-cell *matHeaderCellDef mat-sort-header>Warranty Card No</th><td mat-cell *matCellDef="let r">{{ r.WarrantyCardNo }}</td></ng-container>
        <ng-container matColumnDef="LocationName"><th mat-header-cell *matHeaderCellDef mat-sort-header>Installation Location</th><td mat-cell *matCellDef="let r">{{ r.LocationName }}</td></ng-container>
        <ng-container matColumnDef="UType"><th mat-header-cell *matHeaderCellDef mat-sort-header>Upload Type</th><td mat-cell *matCellDef="let r">{{ r.UType }}</td></ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div class="empty-row" *ngIf="!dataSource.data.length">No installation records found.</div>
      <mat-paginator #paginator [pageSizeOptions]="[10,15,30]" showFirstLastButtons></mat-paginator>
    </div>
  </div>
</div>`,
  styles: [`
:host{display:block;width:100%;height:100%;overflow:hidden}
.it-page{--page-accent:#2563eb;--table-head-bg:var(--page-accent);--table-head-text:#fff;--table-cell-bg:#fff;--table-row-border:#e2e8f0;--table-wrap-border:#e2e8f0;display:flex;flex-direction:column;width:100%;height:100%;padding:8px 12px 12px;box-sizing:border-box;font-family:Inter,sans-serif;color:#334155;overflow:hidden}
:host-context(html[data-theme='dark']) .it-page{--page-accent:#3b82f6;--table-head-bg:#3b82f6;--table-cell-bg:#0c0e12;--table-row-border:#262b36;--table-wrap-border:#262b36;color:#e2e8f0}
.page-title{margin:0 0 8px;font-size:1.15rem;font-weight:700;color:#0f172a}
:host-context(html[data-theme='dark']) .page-title{color:#f8fafc}
.card-section{flex-shrink:0}
.detail-card{margin-bottom:8px;padding:12px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}
:host-context(html[data-theme='dark']) .detail-card{background:#141820;border-color:#262b36}
.detail-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:4px 16px}
.detail-item{display:flex;flex-direction:column;gap:1px}
.dlbl{font-size:10px;font-weight:600;text-transform:uppercase;color:#64748b}
.dval{font-size:13px;font-weight:500;color:#0f172a;word-break:break-all}
:host-context(html[data-theme='dark']) .dval{color:#f8fafc}
.datagrid{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}
.table-toolbar{display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-shrink:0}
.pill-input{min-height:34px;padding:0 12px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;font-size:13px;color:#334155;outline:none}
.pill-input:focus{border-color:var(--page-accent)}
:host-context(html[data-theme='dark']) .pill-input{background:#0c0e12;border-color:#262b36;color:#e2e8f0}
.table-wrap{flex:1;min-height:0;overflow:auto;background:var(--table-cell-bg);border:1px solid var(--table-wrap-border);border-radius:10px;display:flex;flex-direction:column}
:host ::ng-deep .it-grid{width:100%;background:transparent}
:host ::ng-deep .it-grid .mat-mdc-header-cell{background:var(--table-head-bg);color:var(--table-head-text)!important;font-weight:700;font-size:12px;white-space:nowrap;padding:10px 12px}
:host ::ng-deep .it-grid .mat-mdc-cell{font-size:13px;color:#334155!important;border-bottom:1px solid var(--table-row-border)!important;padding:10px 12px;background:var(--table-cell-bg)}
:host-context(html[data-theme='dark']) ::ng-deep .it-grid .mat-mdc-cell{color:#e2e8f0!important}
:host ::ng-deep .it-grid .mat-mdc-row:nth-child(even) .mat-mdc-cell{background:#f8fafc}
:host-context(html[data-theme='dark']) ::ng-deep .it-grid .mat-mdc-row:nth-child(even) .mat-mdc-cell{background:#141820}
.empty-row{text-align:center;padding:28px 12px;color:#64748b;font-size:13px}
`]
})
export class InstallationDetailsComponent {
  config: VariantConfig = VARIANT_MAP['bme'];
  variant = 'bme';
  headerPo: any = {};
  deniedDetail: any = {};
  loading = false;
  dataSource = new MatTableDataSource<CRIDetailDTO>([]);
  displayedColumns = ['sno', 'MakeNo', 'InstallationDate', 'WarentyFrom', 'RecievedDate', 'ReceivedQty', 'WarrantyCardNo', 'LocationName', 'UType'];
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private api: ApiService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.route.data.subscribe(d => {
      this.variant = d['variant'] || 'bme';
      this.config = VARIANT_MAP[this.variant] || VARIANT_MAP['bme'];
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const poId = params['poId'];
      if (poId) {
        this.GetHeaderPO(poId);
        this.GetCRIDetail(poId);
        this.GetFillDeniedDetail(poId);
      }
    });
  }

  GetHeaderPO(poId: number) {
    this.api.get('Payment/GetHeaderPO', { params: { poId } }).subscribe({
      next: (res: any) => { this.headerPo = res[0] || {}; },
      error: () => this.toastr.error('Failed to load header'),
    });
  }

  GetCRIDetail(poId: number) {
    this.loading = true;
    this.api.get('Payment/GetCRIDetail', { params: { poId } }).subscribe({
      next: (res: any) => {
        this.dataSource.data = (res || []).map((item: CRIDetailDTO, index: number) => ({ ...item, sno: index + 1 }));
        setTimeout(() => { this.dataSource.sort = this.sort; this.dataSource.paginator = this.paginator; });
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Failed to load installation details'); },
    });
  }

  GetFillDeniedDetail(poId: number) {
    this.api.get('Payment/FillDeniedDetail', { params: { poId } }).subscribe({
      next: (res: any) => { this.deniedDetail = res[0] || {}; },
      error: () => {},
    });
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
