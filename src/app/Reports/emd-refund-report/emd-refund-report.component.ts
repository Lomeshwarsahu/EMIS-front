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

interface EmdRefundRow {
  sno: number;
  tender_no: string;
  requested_emd: number;
  emd_deposit_dt: string;
  refunded_emd: number;
  cheque_no: string;
  cheque_date: string;
  previous_refunded_amt: number;
  backlog_cheque_no: string;
  backlog_cheque_dt: string;
}

@Component({
  selector: 'app-emd-refund-report',
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
  templateUrl: './emd-refund-report.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './emd-refund-report.component.css'
  ],
})
export class EmdRefundReportComponent {
  emdData: EmdRefundRow[] = [];
  dataSource = new MatTableDataSource<EmdRefundRow>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'tender_no', 'requested_emd', 'emd_deposit_dt', 'refunded_emd',
    'cheque_no', 'cheque_date', 'previous_refunded_amt', 'backlog_cheque_no', 'backlog_cheque_dt',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.api.get('Reports/emd-refund-report').subscribe({
      next: (res: any) => {
        this.emdData = (res || []).map(
          (item: EmdRefundRow, index: number) => ({
            ...item,
            sno: index + 1,
          }),
        );
        this.dataSource.data = this.emdData;
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
        fileName: 'EMDRefundReport',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
