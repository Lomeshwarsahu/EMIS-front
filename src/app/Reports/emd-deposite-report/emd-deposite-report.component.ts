import { CommonModule, DatePipe } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { CollapseModule } from 'src/app/collapse';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-emd-deposite-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTableExporterModule,
    CollapseModule,
    NgbCollapseModule,
    MatSelectModule,
    MatOptionModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './emd-deposite-report.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './emd-deposite-report.component.css'
  ],
})
export class EmdDepositeReportComponent {
  supplierList: any[] = [];
  tenderList: any[] = [];
  selectedSupplierId: string = '';
  selectedTenderId: string = '';
  dispatchData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'id', 'supplierName', 'tenderNo', 'emdAmount',
    'emdType', 'documentNo', 'depositDate', 'entryDate'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.api.get('Reports/GetSuppliers').subscribe({
      next: (res: any) => {
        this.supplierList = res || [];
      },
      error: (err: any) => {
        console.error('Error loading suppliers:', err);
      },
    });
  }

  onSupplierChange() {
    this.selectedTenderId = '';
    this.tenderList = [];
    if (!this.selectedSupplierId) return;
    this.api.get(`Reports/GetTendersBySupplier?supplierId=${this.selectedSupplierId}`).subscribe({
      next: (res: any) => {
        this.tenderList = res || [];
      },
      error: (err: any) => {
        console.error('Error loading tenders:', err);
      },
    });
  }

  loadData() {
    this.loading = true;
    const supplierId = this.selectedSupplierId || '';
    const tenderId = this.selectedTenderId || '';
    const apiUrl = `Reports/emd-deposite-report?supplierId=${supplierId}&tenderId=${tenderId}`;

    this.api.get(apiUrl).subscribe({
      next: (res: any) => {
        this.dispatchData = (res || []).map((item: any, index: number) => ({
          ...item,
          sno: index + 1,
        }));
        this.dataSource.data = this.dispatchData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Error fetching data');
        console.error('Error fetching data:', err);
      },
    });
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'EMDDepositReport',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
