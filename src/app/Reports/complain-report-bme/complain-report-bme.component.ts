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
import { ComplaintDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

interface ComplainReportRow {
  sno: number;
  complaint_no: string;
  item_code_as_per_tender: string;
  item_name: string;
  serial_no: string;
  complaint_date: string;
  not_function_date: string;
  district: string;
  department_name: string;
  complaint_details: string;
  supplier: string;
  email_id: string;
  mobile_no: string;
}

@Component({
  selector: 'app-complain-report-bme',
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
  templateUrl: './complain-report-bme.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './complain-report-bme.component.css'
  ],
})
export class ComplainReportBmeComponent {
  statusFilter: string = '';
  complainData: ComplainReportRow[] = [];
  dataSource = new MatTableDataSource<ComplainReportRow>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'complaint_no', 'item_code_as_per_tender', 'item_name',
    'serial_no', 'complaint_date', 'not_function_date', 'district',
    'department_name', 'complaint_details', 'supplier', 'email_id', 'mobile_no',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  loadData() {
    this.loading = true;
    let url = 'Reports/complain-report';
    if (this.statusFilter) url += `?status=${this.statusFilter}`;
    this.api.get(url).subscribe({
      next: (res: any) => {
        this.complainData = (res || []).map(
          (item: any, index: number) => ({
            ...item,
            sno: index + 1,
          }),
        );
        this.dataSource.data = this.complainData;
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
        fileName: 'ComplainReportBME',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
