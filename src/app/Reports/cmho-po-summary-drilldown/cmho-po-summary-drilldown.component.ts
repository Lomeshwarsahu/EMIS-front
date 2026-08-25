import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IndentDetailsDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-cmho-po-summary-drilldown',
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
  templateUrl: './cmho-po-summary-drilldown.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './cmho-po-summary-drilldown.component.css'
  ],
})
export class CmhoPoSummaryDrilldownComponent {
  finYrId!: string;
  itemCode!: string;
  drillData: IndentDetailsDTO[] = [];
  dataSource!: MatTableDataSource<IndentDetailsDTO>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'LocationName', 'Code', 'ItemName', 'OutwardNo', 'PoDate',
    'Quantity', 'BasicRate', 'Percentage', 'SingleUnitPrice', 'TotalPOValue',
    'SupplierName', 'MobileNo', 'TenderNo', 'Status'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<IndentDetailsDTO>([]);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.finYrId = params['finYrId'] || '';
      this.itemCode = params['itemCode'] || '';
      this.loadData();
    });
  }

  loadData() {
    if (!this.finYrId || !this.itemCode) return;
    this.loading = true;

    this.api.get(`Reports/po-summary-detail?finYrId=${this.finYrId}&itemCode=${this.itemCode}&directorateId=5`)
      .subscribe({
        next: (res: any) => {
          this.drillData = res.map((item: IndentDetailsDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          this.dataSource.data = this.drillData;
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

  goBack() {
    this.router.navigate(['/reports/cmho-po-summary']);
  }

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'CMHOPOSummaryDrilldown',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
