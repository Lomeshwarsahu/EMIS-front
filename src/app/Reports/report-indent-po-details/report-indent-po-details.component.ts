import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'src/app/collapse';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { SupplierPageSkeletonComponent } from 'src/app/component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-report-indent-po-details',
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
  templateUrl: './report-indent-po-details.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './report-indent-po-details.component.css'
  ],
})
export class ReportIndentPoDetailsComponent implements OnInit {
  Yearlist: any[] = [];
  Itemlist: any[] = [];
  Diectoratelist: any[] = [];
  Userlist: any[] = [];
  selectedYear: any;
  selectedItem: any;
  selectedDirectorate: any;
  selectedUser: any;
  reportData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'user_name', 'location', 'item_code', 'item_name',
    'indent_date', 'indent_year', 'tender_no', 'supplier_name',
    'po_no', 'po_date', 'po_year', 'qty', 'rate', 'total'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.GetYearsList();
    this.GetItems();
    this.GetDiectorate();
  }

  GetYearsList() {
    this.api.get(`Reports/GetFinancialYear`).subscribe({
      next: (res: any) => {
        this.Yearlist = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  GetItems() {
    this.api.get(`Reports/GetItems`).subscribe({
      next: (res: any) => {
        this.Itemlist = res || [];
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  GetDiectorate() {
    this.api.get(`Reports/GetDiectorate`).subscribe({
      next: (res: any) => {
        this.Diectoratelist = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  onDirectorateChange() {
    this.selectedUser = null;
    this.Userlist = [];
    if (this.selectedDirectorate) {
      this.api.get(`Reports/GetUsers?directorateId=${this.selectedDirectorate}`).subscribe({
        next: (res: any) => {
          this.Userlist = res || [];
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    }
  }

  loadData() {
    this.loading = true;
    const financialYearId = this.selectedYear || '';
    const directorateId = this.selectedDirectorate || '';
    const itemCode = this.selectedItem || '';

    this.api.get(`Reports/report-indent-po-details?financialYearId=${financialYearId}&directorateId=${directorateId}&itemCode=${itemCode}`)
      .subscribe({
        next: (res: any) => {
          this.reportData = (res || []).map((item: any, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          this.dataSource.data = this.reportData;
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

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'ReportIndentPODetails',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
