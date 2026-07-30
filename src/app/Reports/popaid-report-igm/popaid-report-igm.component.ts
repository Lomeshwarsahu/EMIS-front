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
import { MatRadioModule } from '@angular/material/radio';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-popaid-report-igm',
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
    MatRadioModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './popaid-report-igm.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './popaid-report-igm.component.css'
  ],
})
export class PopaidReportIgmComponent {
  fromDate: string = '';
  toDate: string = '';
  poType: string = 'All';
  dispatchData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'poNo', 'poDate', 'outwardNo', 'supplierName', 'sanctionDate',
    'grossAmount', 'totalDeduction', 'totalAddition', 'chequeAmount',
    'aidNo', 'chequeDate', 'budgetName', 'poType'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {}

  loadData() {
    if (!this.fromDate || !this.toDate) {
      this.toastr.warning('Please select both from and to dates.');
      return;
    }
    this.loading = true;
    const apiUrl = `Reports/popaid-report-igm?poType=${this.poType}&fromDate=${this.fromDate}&toDate=${this.toDate}`;

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
        fileName: 'POPaidReportIGM',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
