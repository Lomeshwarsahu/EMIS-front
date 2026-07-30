import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/service/api.service';
import { PODetails } from 'src/app/Model/models';
import { DmePageSkeletonComponent } from '../DME/shared/dme-page-skeleton/dme-page-skeleton.component';

@Component({
  selector: 'app-generation-file-nonasti',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    DmePageSkeletonComponent,
  ],
  template: `
<div class="it-page" style="--page-accent:#2563eb">
  <h2 class="page-title">Generation of File No / Nasti No</h2>

  <!-- Search Section -->
  <div class="card-section">
    <div class="filters--compact">
      <div class="filter-section">
        <span class="filter-label">Search Mode</span>
        <div class="radio-group">
          <label class="radio-pill" [class.active]="searchMode==='po'">
            <input type="radio" name="mode" value="po" [(ngModel)]="searchMode" /> PO No
          </label>
          <label class="radio-pill" [class.active]="searchMode==='outward'">
            <input type="radio" name="mode" value="outward" [(ngModel)]="searchMode" /> Outward + Year
          </label>
        </div>
      </div>
      <div class="filter-section" *ngIf="searchMode==='po'">
        <span class="filter-label">Type PO No</span>
        <input type="text" class="pill-input" placeholder="e.g. EQP/1000/..." [(ngModel)]="poNo" />
      </div>
      <ng-container *ngIf="searchMode==='outward'">
        <div class="filter-section">
          <span class="filter-label">Outward No</span>
          <input type="text" class="pill-input" placeholder="Outward No" [(ngModel)]="outwardNo" />
        </div>
        <div class="filter-section">
          <span class="filter-label">Financial Year</span>
          <select [(ngModel)]="selectedYear" class="pill-select">
            <option [ngValue]="null">Select Year</option>
            <option *ngFor="let y of yearList" [ngValue]="y">{{ y.year }}</option>
          </select>
        </div>
      </ng-container>
      <button type="button" class="show-btn" (click)="search()">Show File No</button>
    </div>

    <!-- PO Detail Card -->
    <div class="detail-card" *ngIf="poId">
      <div class="detail-grid">
        <div class="detail-item"><span class="dlbl">PO No</span><span class="dval">{{poNoVal}}</span></div>
        <div class="detail-item"><span class="dlbl">PO Date</span><span class="dval">{{podt}}</span></div>
        <div class="detail-item"><span class="dlbl">Tender Ref</span><span class="dval">{{schemeCode}}</span></div>
        <div class="detail-item"><span class="dlbl">Supplier</span><span class="dval">{{supplierName}}</span></div>
      </div>
      <div class="detail-actions">
        <div class="filter-section" style="flex:1">
          <span class="filter-label">File No</span>
          <input type="text" class="pill-input" placeholder="Enter File No" [(ngModel)]="fileNo" #fileNoRef="ngModel" required />
        </div>
        <div class="filter-section" style="flex:1">
          <span class="filter-label">File Creation Date</span>
          <input type="date" class="pill-input" [(ngModel)]="podt" />
        </div>
        <button type="button" class="show-btn" (click)="UpdateFileNo()" [disabled]="!fileNo">Save</button>
      </div>
    </div>
  </div>

  <!-- Grid -->
  <div class="datagrid">
    <app-dme-page-skeleton *ngIf="loading" type="table" [rows]="6" [cols]="5" />
    <div class="table-wrap" *ngIf="!loading">
      <table mat-table [dataSource]="dataSource" matSort #sort="matSort" class="it-grid">
        <ng-container matColumnDef="sno"><th mat-header-cell *matHeaderCellDef mat-sort-header>S.No</th><td mat-cell *matCellDef="let i = index">{{ i + 1 }}</td></ng-container>
        <ng-container matColumnDef="PONo"><th mat-header-cell *matHeaderCellDef mat-sort-header>PO No</th><td mat-cell *matCellDef="let row">{{ row.PONo }}</td></ng-container>
        <ng-container matColumnDef="PODT"><th mat-header-cell *matHeaderCellDef mat-sort-header>PO Date</th><td mat-cell *matCellDef="let row">{{ row.PODT }}</td></ng-container>
        <ng-container matColumnDef="ItemCode"><th mat-header-cell *matHeaderCellDef mat-sort-header>Code</th><td mat-cell *matCellDef="let row">{{ row.ItemCode }}</td></ng-container>
        <ng-container matColumnDef="SupplierName"><th mat-header-cell *matHeaderCellDef mat-sort-header>Supplier</th><td mat-cell *matCellDef="let row">{{ row.SupplierName }}</td></ng-container>
        <ng-container matColumnDef="FileNo"><th mat-header-cell *matHeaderCellDef mat-sort-header>File No</th><td mat-cell *matCellDef="let row">{{ row.FileNo }}</td></ng-container>
        <ng-container matColumnDef="FileDT"><th mat-header-cell *matHeaderCellDef mat-sort-header>File Date</th><td mat-cell *matCellDef="let row">{{ row.FileDT }}</td></ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div class="empty-row" *ngIf="!dataSource.data.length">Search PO to view file records.</div>
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
.filters--compact{display:flex;flex-wrap:wrap;align-items:end;gap:8px;margin-bottom:8px;padding:10px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}
:host-context(html[data-theme='dark']) .filters--compact{background:#141820;border-color:#262b36}
.filter-section{display:flex;flex-direction:column;gap:4px;min-width:140px}
.filter-label{font-size:11px;font-weight:600;text-transform:uppercase;color:#64748b}
.radio-group{display:flex;gap:4px}
.radio-pill{display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:999px;border:1px solid #cbd5e1;background:#fff;font-size:12px;cursor:pointer;color:#334155}
.radio-pill.active{border-color:var(--page-accent);background:var(--page-accent);color:#fff}
.radio-pill input{display:none}
:host-context(html[data-theme='dark']) .radio-pill{background:#0c0e12;border-color:#262b36;color:#e2e8f0}
.pill-input,.pill-select{min-height:34px;padding:0 12px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;font-size:13px;color:#334155;outline:none}
.pill-input:focus,.pill-select:focus{border-color:var(--page-accent)}
:host-context(html[data-theme='dark']) .pill-input,:host-context(html[data-theme='dark']) .pill-select{background:#0c0e12;border-color:#262b36;color:#e2e8f0}
.show-btn{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:6px 20px;border-radius:999px;font-size:13px;font-weight:600;border:none;background:var(--page-accent);color:#fff;cursor:pointer;font-family:inherit}
.show-btn:disabled{opacity:.5;cursor:default}
.show-btn:hover:not(:disabled){filter:brightness(.9)}
.detail-card{margin-bottom:8px;padding:12px 14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}
:host-context(html[data-theme='dark']) .detail-card{background:#141820;border-color:#262b36}
.detail-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px 16px;margin-bottom:10px}
.detail-item{display:flex;flex-direction:column;gap:1px}
.dlbl{font-size:10px;font-weight:600;text-transform:uppercase;color:#64748b}
.dval{font-size:13px;font-weight:500;color:#0f172a;word-break:break-all}
:host-context(html[data-theme='dark']) .dval{color:#f8fafc}
.detail-actions{display:flex;flex-wrap:wrap;align-items:end;gap:8px}
.datagrid{display:flex;flex-direction:column;flex:1;min-height:0;overflow:hidden}
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
export class GenerationFileNonastiComponent {
  yearList: any[] = [];
  searchMode: 'po' | 'outward' = 'po';
  poNo: string = '';
  outwardNo: string = '';
  selectedYear: any = null;
  financialyearid: any;
  fileNo: string = '';
  poId: number = 0;
  poNoVal: string = '';
  podt: string = '';
  schemeCode: string = '';
  supplierName: string = '';
  loading = false;
  dataSource = new MatTableDataSource<PODetails>([]);
  displayedColumns = ['sno', 'PONo', 'PODT', 'ItemCode', 'SupplierName', 'FileNo', 'FileDT'];
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.GETGetPODetails();
    this.Getyears();
  }

  Getyears() {
    this.api.get('GenerateNasti/Getyear').subscribe({
      next: (res: any) => { this.yearList = res; },
      error: (err: any) => console.error(err),
    });
  }

  search() {
    if (this.searchMode === 'po') {
      if (!this.poNo) { this.toastr.warning('Enter PO Number'); return; }
    } else {
      if (!this.outwardNo || !this.selectedYear) { this.toastr.warning('Enter Outward Number and Select Year'); return; }
    }
    this.GetPODetails();
  }

  GetPODetails() {
    this.loading = true;
    const params: any = { pono: this.poNo || '0', outwardNo: this.outwardNo || '0', financialYearId: this.selectedYear?.financial_year_id || '0' };
    this.api.get('GenerateNasti/GetPODetails', { params }).subscribe({
      next: (res: any) => {
        const data = res[0];
        if (data) {
          this.poId = data.PONOID;
          this.fileNo = data.FileNo !== '-' ? data.FileNo : '';
          this.poNoVal = data.PONo;
          this.schemeCode = data.SchemeCode;
          this.supplierName = data.SupplierName;
          this.podt = this.convertDate(data.PODT);
          if (data.FileNo !== '-') {
            this.toastr.info('File No already generated: ' + data.FileNo);
          }
        } else {
          this.toastr.warning('PO Not Found');
        }
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Error fetching PO details'); },
    });
  }

  GETGetPODetails() {
    this.loading = true;
    const params: any = { pono: '0', outwardNo: '0', financialYearId: '0' };
    this.api.get('GenerateNasti/GetPODetails', { params }).subscribe({
      next: (res: any) => {
        this.dataSource.data = (res || []).map((item: PODetails, index: number) => ({ ...item, sno: index + 1 }));
        setTimeout(() => { this.dataSource.sort = this.sort; this.dataSource.paginator = this.paginator; });
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  UpdateFileNo() {
    if (!this.fileNo) { this.toastr.warning('Please Enter File No'); return; }
    this.loading = true;
    const body = { poId: this.poId, fileNo: this.fileNo, fileDate: new Date().toISOString().split('T')[0] };
    this.api.put('GenerateNasti/UpdateFileNo', body).subscribe({
      next: () => {
        this.toastr.success('Generated Successfully');
        this.GETGetPODetails();
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Save failed'); },
    });
  }

  convertDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
  }
}
