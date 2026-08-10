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
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-po-receipt-summary',
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
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './po-receipt-summary.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './po-receipt-summary.component.css'
  ],
})
export class PoReceiptSummaryComponent {
  selectedYear: string = '';
  selectedDirectorate: string = '';
  exceededCancellationDays: boolean = false;
  showNonReceivedOnly: boolean = false;
  financialYears: any[] = [];
  directorates: any[] = [];
  dispatchData: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'tender_no', 'po_no', 'po_date', 'item_code', 'item_name',
    'supplier_name', 'po_qty', 'supply_qty', 'receipt_qty', 'install_qty',
    'cancellation_days', 'received_date', 'days_taken_to_receive', 'last_date_to_receive'
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
    this.loadFinancialYears();
    this.loadDirectorates();
  }

  loadFinancialYears() {
    this.api.get('GenerateNasti/Getyear').subscribe({
      next: (res: any) => { this.financialYears = res || []; },
      error: () => { this.financialYears = []; },
    });
  }

  loadDirectorates() {
    this.api.get('Reports/GetDiectorate').subscribe({
      next: (res: any) => { this.directorates = res || []; },
      error: () => { this.directorates = []; },
    });
  }

  loadData() {
    this.loading = true;
    const params = new URLSearchParams();
    if (this.selectedYear) params.set('financialYearId', this.selectedYear);
    if (this.selectedDirectorate) params.set('directorateId', this.selectedDirectorate);
    params.set('exceededCancellationDays', String(this.exceededCancellationDays));
    params.set('showNonReceivedOnly', String(this.showNonReceivedOnly));

    this.api.get(`Reports/po-receipt-summary?${params.toString()}`).subscribe({
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
        console.error(err);
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
        fileName: 'POReceiptSummary',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
