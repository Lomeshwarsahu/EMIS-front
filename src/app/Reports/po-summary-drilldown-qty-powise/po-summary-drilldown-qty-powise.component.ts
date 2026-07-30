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
import { ActivatedRoute, Router } from '@angular/router';
import { POSummaryPOWiseDetailDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-po-summary-drilldown-qty-powise',
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
  templateUrl: './po-summary-drilldown-qty-powise.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './po-summary-drilldown-qty-powise.component.css',
  ],
})
export class PoSummaryDrilldownQtyPowiseComponent {
  finYrId: string = '';
  directorateId: string = '';
  poType: string = '';

  detailData: POSummaryPOWiseDetailDTO[] = [];
  dataSource = new MatTableDataSource<POSummaryPOWiseDetailDTO>([]);
  loading: boolean = false;

  totalQuantity: number = 0;
  totalPOValue: number = 0;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno',
    'po_number',
    'po_date',
    'item_name',
    'quantity',
    'basic_rate',
    'percentage',
    'total_po_value',
    'supplier_name',
    'tender_no',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.finYrId = params['finYrId'] || '';
      this.directorateId = params['directorateId'] || '';
      this.poType = params['Potype'] || '';
      this.loadData();
    });
  }

  loadData() {
    this.loading = true;
    this.api
      .get(
        `Reports/po-summary-powise-detail?finYrId=${this.finYrId}&directorateId=${this.directorateId}&poType=${this.poType}`,
      )
      .subscribe({
        next: (res: any) => {
          this.detailData = (res || []).map(
            (item: POSummaryPOWiseDetailDTO, index: number) => ({
              ...item,
              sno: index + 1,
            }),
          );
          this.dataSource.data = this.detailData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.calcTotals();
          this.cdr.detectChanges();
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.toastr.error(err.error?.message || 'Error fetching data');
          console.error(err);
        },
      });
  }

  calcTotals() {
    this.totalQuantity = this.detailData.reduce(
      (sum, item) => sum + (item.Quantity || 0),
      0,
    );
    this.totalPOValue = this.detailData.reduce(
      (sum, item) => sum + (item.TotalPOValue || 0),
      0,
    );
  }

  goBack() {
    this.router.navigate(['/reports/po-summary']);
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'POSummaryDrilldownQtyPOWise',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
