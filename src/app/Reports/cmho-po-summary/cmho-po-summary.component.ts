import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IndentItemSummaryDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-cmho-po-summary',
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
  templateUrl: './cmho-po-summary.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './cmho-po-summary.component.css'
  ],
})
export class CmhoPoSummaryComponent {
  Yearlist: any[] = [];
  selectedYear: any;
  summaryData: IndentItemSummaryDTO[] = [];
  dataSource!: MatTableDataSource<IndentItemSummaryDTO>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'Code', 'ItemName', 'Quantity',
    'BasicRate', 'Percentage', 'SingleUnitPrice', 'TotalPOValue'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<IndentItemSummaryDTO>([]);
  }

  ngOnInit() {
    this.GetYearsList();
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

  loadData() {
    this.loading = true;
    const financialYearId = this.selectedYear || '';

    this.api.get(`Reports/po-summary?financialYearId=${financialYearId}&directorateId=5`)
      .subscribe({
        next: (res: any) => {
          this.summaryData = res.map((item: IndentItemSummaryDTO, index: number) => ({
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

  onQuantityClick(element: IndentItemSummaryDTO) {
    this.router.navigate(['/reports/cmho-po-summary-drilldown'], {
      queryParams: {
        finYrId: this.selectedYear,
        itemCode: element.Code,
      },
    });
  }

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'CMHOPOSummary',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
