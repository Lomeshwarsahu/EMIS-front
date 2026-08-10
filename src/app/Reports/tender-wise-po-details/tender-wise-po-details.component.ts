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
  selector: 'app-tender-wise-po-details',
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
  templateUrl: './tender-wise-po-details.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './tender-wise-po-details.component.css'
  ],
})
export class TenderWisePoDetailsComponent {
  tenderList: any[] = [];
  selectedTenderId: string = '';
  dispatchData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'directorate', 'supplierName', 'tenderNo', 'tenderDate',
    'poNo', 'poDate', 'contractDate', 'contractEndDate', 'poQty',
    'supplyQty', 'receiptQty', 'installQty', 'basicRate',
    'percentage', 'unitPrice', 'itemCode', 'itemName'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.loadTenders();
  }

  loadTenders() {
    this.api.get('Reports/GetTenders').subscribe({
      next: (res: any) => {
        this.tenderList = res || [];
      },
      error: (err: any) => {
        console.error('Error loading tenders:', err);
      },
    });
  }

  loadData() {
    if (!this.selectedTenderId) {
      this.toastr.warning('Please select a tender.');
      return;
    }
    this.loading = true;
    const apiUrl = `Reports/tender-wise-po-details?tenderId=${this.selectedTenderId}`;

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
        fileName: 'TenderWisePODetails',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
