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

export interface PoSummaryDirectorateDrilldownDTO extends IndentDetailsDTO {
  DistrictName?: string;
}

@Component({
  selector: 'app-po-summary-directorate-drilldown',
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
  templateUrl: './po-summary-directorate-drilldown.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './po-summary-directorate-drilldown.component.css'
  ],
})
export class PoSummaryDirectorateDrilldownComponent {
  finYrId!: string;
  itemCode!: string;
  directorateId!: string;
  showAllItems: boolean = false;
  drillData: PoSummaryDirectorateDrilldownDTO[] = [];
  dataSource!: MatTableDataSource<PoSummaryDirectorateDrilldownDTO>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'LocationName', 'DistrictName', 'Code', 'ItemName', 'OutwardNo', 'PoDate',
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
    this.dataSource = new MatTableDataSource<PoSummaryDirectorateDrilldownDTO>([]);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.finYrId = params['finYrId'] || '';
      this.itemCode = params['itemCode'] || '';
      this.directorateId = params['directorateId'] || '';
      this.loadData();
    });
  }

  loadData() {
    if (!this.finYrId || !this.directorateId) return;
    this.loading = true;

    let url = `Reports/po-summary-detail?finYrId=${this.finYrId}&directorateId=${this.directorateId}`;
    if (!this.showAllItems && this.itemCode) {
      url += `&itemCode=${this.itemCode}`;
    }

    this.api.get(url).subscribe({
      next: (res: any) => {
        this.drillData = res.map((item: PoSummaryDirectorateDrilldownDTO, index: number) => ({
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

  onShowAllToggle() {
    this.loadData();
  }

  goBack() {
    this.router.navigate(['/reports/po-summary-directorate']);
  }

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'POSummaryDirectorateDrilldown',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
