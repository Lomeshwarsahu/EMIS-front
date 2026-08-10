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
  selector: 'app-dispatch-detail',
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
  templateUrl: './dispatch-detail.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './dispatch-detail.component.css'
  ],
})
export class DispatchDetailComponent implements OnInit {
  Itemlist: any[] = [];
  Diectoratelist: any[] = [];
  Userlist: any[] = [];
  selectedItem: any;
  selectedDirectorate: any;
  selectedUser: any;
  reportData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  loading: boolean = false;
  expandedElement: any | null = null;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  parentColumns: string[] = [
    'sno', 'po_id', 'item_name', 'item_code', 'quantity',
    'consignee', 'location', 'unit_price', 'total_price', 'po_date'
  ];
  childColumns: string[] = [
    'issue_id', 'tentative_date', 'supply_status', 'dispatch_date', 'dispatch_no', 'qty'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.GetItems();
    this.GetDiectorate();
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

  isExpansionDetailRow = (_index: number, row: any) => row.detailRow === true;

  toggleDetails(element: any) {
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement) {
      const updatedRows: any[] = [];
      this.dataSource.data.forEach(r => {
        updatedRows.push(r);
        if (r === element) {
          updatedRows.push({
            detailRow: true,
            parentData: element,
          });
        }
      });
      this.dataSource.data = updatedRows;
      this.cdr.detectChanges();
    } else {
      this.dataSource.data = this.dataSource.data.filter(r => !r.detailRow);
    }
  }

  loadData() {
    this.loading = true;
    const directorateId = this.selectedDirectorate || '';
    const userId = this.selectedUser || '';

    this.api.get(`Reports/dispatch-detail?directorateId=${directorateId}&userId=${userId}`)
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
        fileName: 'DispatchDetail',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
