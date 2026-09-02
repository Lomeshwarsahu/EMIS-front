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
import { BalanceStatusDTO } from 'src/app/Model/models';

@Component({
  selector: 'app-receipt-pending-cmho',
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
  templateUrl: './receipt-pending-cmho.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './receipt-pending-cmho.component.css'
  ],
})
export class ReceiptPendingCmhoComponent implements OnInit {
  balanceType: string = 'D';
  selectedDirectorate: number = 5;
  reportData: BalanceStatusDTO[] = [];
  dataSource!: MatTableDataSource<BalanceStatusDTO>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'district', 'location', 'item_code', 'item_name',
    'supplier', 'po_no', 'po_date', 'po_qty', 'supply_qty',
    'receipt_qty', 'install_qty', 'remarks'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<BalanceStatusDTO>([]);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const userId = sessionStorage.getItem('userid') || 0;
    this.api.get(`Reports/balance-status-cmho?balanceType=${this.balanceType}&userId=${userId}`)
      .subscribe({
        next: (res: any) => {
          this.reportData = (res || []).map((item: BalanceStatusDTO, index: number) => ({
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
        fileName: 'ReceiptPendingCMHO',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
