import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

export interface PoSummaryConsigneeHoDTO {
  sno: number;
  OutwardNo?: string;
  potype?: string;
  po_no?: string;
  po_date?: string;
  supplier_name?: string;
  item_code_as_per_tender?: string;
  item_name?: string;
  DBStart_Name_En?: string;
  location_name?: string;
  po_qty?: number;
  supply_qty?: number;
  receiptQTY?: number;
  insqty?: number;
  Eqptype?: string;
}

@Component({
  selector: 'app-po-summary-consignee-ho',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTableExporterModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './po-summary-consignee-ho.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './po-summary-consignee-ho.component.css'
  ],
})
export class PoSummaryConsigneeHoComponent {
  Yearlist: any[] = [];
  Diectoratelist: any[] = [];
  selectedYear: any;
  selectedDirectorate: any;
  summaryData: PoSummaryConsigneeHoDTO[] = [];
  dataSource!: MatTableDataSource<PoSummaryConsigneeHoDTO>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'OutwardNo', 'potype', 'po_no', 'po_date', 'supplier_name',
    'item_code_as_per_tender', 'item_name', 'DBStart_Name_En', 'location_name',
    'po_qty', 'supply_qty', 'receiptQTY', 'insqty', 'Eqptype'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<PoSummaryConsigneeHoDTO>([]);
  }

  ngOnInit() {
    this.GetYearsList();
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

  loadData() {
    this.loading = true;
    const financialYearId = this.selectedYear || '';
    const directorateId = this.selectedDirectorate || '';

    this.api.get(`Reports/po-summary-consignee-ho?financialYearId=${financialYearId}&directorateId=${directorateId}`)
      .subscribe({
        next: (res: any) => {
          this.summaryData = res.map((item: PoSummaryConsigneeHoDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          this.dataSource.data = this.summaryData;
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
        fileName: 'POSummaryConsigneeHO',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
