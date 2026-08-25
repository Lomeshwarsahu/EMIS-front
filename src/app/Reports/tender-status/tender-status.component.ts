import { CommonModule } from '@angular/common';
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
import { MatRadioModule } from '@angular/material/radio';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

interface TenderStatusRow {
  sno: number;
  tender_no: string;
  tender_date: string;
  no_of_items: number;
  cover_a_entry: string;
  cover_b_entry: string;
  cover_demo: string;
  cover_c: string;
  tender_status: string;
  price_not_found: number;
  price_found: number;
  price_entry: string;
  accept_reject: string;
  tender_description: string;
}

interface FinancialYear {
  financial_year_id: number;
  year: string;
}

@Component({
  selector: 'app-tender-status',
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
    MatRadioModule,
    CollapseModule,
    NgbCollapseModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './tender-status.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './tender-status.component.css'
  ],
})
export class TenderStatusComponent {
  yearId: number = 0;
  statusId: number = 0;

  financialYears: FinancialYear[] = [];

  tenderData: TenderStatusRow[] = [];
  dataSource = new MatTableDataSource<TenderStatusRow>([]);
  loading: boolean = false;
  searchText: string = '';

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'tender_no', 'tender_date', 'no_of_items', 'cover_a_entry',
    'cover_b_entry', 'cover_demo', 'cover_c', 'tender_status',
    'price_not_found', 'price_found', 'price_entry', 'accept_reject', 'tender_description',
  ];

  statusOptions = [
    { value: 0, label: 'All' },
    { value: 1, label: 'Live' },
    { value: 2, label: 'Cover-A' },
    { value: 3, label: 'Cover-B' },
    { value: 4, label: 'Under Demo' },
    { value: 5, label: 'Price Opened' },
    { value: 6, label: 'Cancelled' },
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadFinancialYears();
  }

  loadFinancialYears() {
    this.api.get('Common/financial-years').subscribe({
      next: (res: any) => {
        this.financialYears = res || [];
        if (this.financialYears.length > 0) {
          this.yearId = this.financialYears[0].financial_year_id;
          this.loadData();
        }
      },
      error: () => this.toastr.error('Failed to load financial years.'),
    });
  }

  loadData() {
    if (!this.yearId) {
      this.toastr.warning('Please select a financial year.');
      return;
    }
    this.loading = true;
    this.api.get(`Reports/tender-status?yearId=${this.yearId}&statusId=${this.statusId}`).subscribe({
      next: (res: any) => {
        this.tenderData = (res || []).map(
          (item: TenderStatusRow, index: number) => ({
            ...item,
            sno: index + 1,
          }),
        );
        this.dataSource.data = this.tenderData;
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
        fileName: 'TenderStatus',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s.includes('live')) return 'status-live';
    if (s.includes('cover-a')) return 'status-cover-a';
    if (s.includes('cover-b')) return 'status-cover-b';
    if (s.includes('demo')) return 'status-demo';
    if (s.includes('price')) return 'status-price-opened';
    if (s.includes('cancel')) return 'status-cancelled';
    return '';
  }
}
