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

interface PoPaidRow {
  sno: number;
  po_no: string;
  po_date: string;
  supplier: string;
  gross_amount: number;
  total_deduction: number;
  total_addition: number;
  supplier_cheque_amount: number;
  admin_charges: number;
  total_cheque_amount: number;
  cheque_date: string;
  cheque_no: string;
  budget: string;
  payment_type: string;
}

@Component({
  selector: 'app-po-paid-report',
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
  templateUrl: './po-paid-report.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './po-paid-report.component.css'
  ],
})
export class PoPaidReportComponent {
  poType: string = 'All';
  fromDate: string = '';
  toDate: string = '';

  paidData: PoPaidRow[] = [];
  dataSource = new MatTableDataSource<PoPaidRow>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'po_no', 'po_date', 'supplier', 'gross_amount', 'total_deduction',
    'total_addition', 'supplier_cheque_amount', 'admin_charges',
    'total_cheque_amount', 'cheque_date', 'cheque_no', 'budget', 'payment_type',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  loadData() {
    this.loading = true;
    let url = `Reports/po-paid-report?poType=${this.poType}`;
    if (this.fromDate) url += `&fromDate=${this.fromDate}`;
    if (this.toDate) url += `&toDate=${this.toDate}`;
    this.api.get(url).subscribe({
      next: (res: any) => {
        this.paidData = (res || []).map(
          (item: PoPaidRow, index: number) => ({
            ...item,
            sno: index + 1,
          }),
        );
        this.dataSource.data = this.paidData;
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
        fileName: 'POPaidReport',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
