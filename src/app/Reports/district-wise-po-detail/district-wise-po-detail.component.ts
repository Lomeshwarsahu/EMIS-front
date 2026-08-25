import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { CollapseModule } from 'src/app/collapse';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

interface DistrictWisePoRow {
  sno: number;
  potype: string;
  tender_no: string;
  po_no: string;
  po_date: string;
  supplier_name: string;
  item_code_as_per_tender: string;
  item_name: string;
  DBStart_Name_En: string;
  location_name: string;
  basicrate: number;
  percentage: number;
  totalprice: number;
  po_qty: number;
  supply_qty: number;
  receiptQTY: number;
  insqty: number;
  eqptype: string;
}

interface FinancialYear {
  financial_year_id: number;
  year: string;
}

interface Directorate {
  facility_aut_id: number;
  facility_aut_name: string;
}

interface District {
  DP_DistrictID: number;
  DBStart_Name_En: string;
}

@Component({
  selector: 'app-district-wise-po-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTableExporterModule,
    MatRadioModule,
    CollapseModule,
    NgbCollapseModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './district-wise-po-detail.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './district-wise-po-detail.component.css'
  ],
})
export class DistrictWisePoDetailComponent {
  financialYearId: number = 0;
  directorateId: number = 0;
  districtId: number = 0;
  fromDate: string = '';
  toDate: string = '';

  financialYears: FinancialYear[] = [];
  directorates: Directorate[] = [];
  districts: District[] = [];

  poData: DistrictWisePoRow[] = [];
  dataSource = new MatTableDataSource<DistrictWisePoRow>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'potype', 'tender_no', 'po_no', 'po_date', 'supplier_name',
    'item_code_as_per_tender', 'item_name', 'district', 'location_name',
    'basicrate', 'percentage', 'totalprice', 'po_qty', 'supply_qty',
    'receiptQTY', 'insqty', 'eqptype',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadDropdowns();
  }

  loadDropdowns() {
    this.api.get('Common/financial-years').subscribe({
      next: (res: any) => this.financialYears = res || [],
      error: () => this.toastr.error('Failed to load financial years.'),
    });
    this.api.get('Common/directorates').subscribe({
      next: (res: any) => this.directorates = res || [],
      error: () => this.toastr.error('Failed to load directorates.'),
    });
    this.api.get('Reports/GetDistricts').subscribe({
      next: (res: any) => this.districts = res || [],
      error: () => this.toastr.error('Failed to load districts.'),
    });
  }

  loadData() {
    if (this.fromDate && !this.toDate) {
      this.toastr.warning('Please select both From and To dates (or leave both empty).');
      return;
    }
    if (!this.fromDate && this.toDate) {
      this.toastr.warning('Please select both From and To dates (or leave both empty).');
      return;
    }
    this.loading = true;
    const params = new URLSearchParams();
    if (this.financialYearId) params.set('financialYearId', String(this.financialYearId));
    if (this.directorateId) params.set('directorateId', String(this.directorateId));
    if (this.districtId) params.set('districtId', String(this.districtId));
    if (this.fromDate && this.toDate) {
      params.set('fromDate', this.fromDate);
      params.set('toDate', this.toDate);
    }
    const url = `Reports/GetDistrictWiseDetails?${params.toString()}`;
    this.api.get(url).subscribe({
      next: (res: any) => {
        this.poData = (res || []).map(
          (item: DistrictWisePoRow, index: number) => ({
            ...item,
            sno: index + 1,
          }),
        );
        this.dataSource.data = this.poData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        console.error(err);
        this.toastr.error(err.error?.message || 'Failed to load data.');
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
        fileName: 'DistrictWisePODetail',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
