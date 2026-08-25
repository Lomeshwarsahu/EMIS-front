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
import { POSummaryReagentDetailDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-po-summary-drilldown-qty-reagent',
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
  templateUrl: './po-summary-drilldown-qty-reagent.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './po-summary-drilldown-qty-reagent.component.css',
  ],
})
export class PoSummaryDrilldownQtyReagentComponent {
  detailData: POSummaryReagentDetailDTO[] = [];
  dataSource = new MatTableDataSource<POSummaryReagentDetailDTO>([]);
  loading: boolean = false;

  totalQuantity: number = 0;
  totalPOValue: number = 0;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno',
    'item_name',
    'location_name',
    'po_date',
    'quantity',
    'basic_rate',
    'percentage',
    'single_unit_price',
    'total_po_value',
    'supplier_name',
    'tender_no',
    'po_number',
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
      this.loadData();
    });
  }

  loadData() {
    this.loading = true;
    const queryParams = this.route.snapshot.queryParams;
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) params.set(key, value as string);
    });
    this.api
      .get(`Reports/po-summary-reagent-detail?${params.toString()}`)
      .subscribe({
        next: (res: any) => {
          this.detailData = (res || []).map(
            (item: POSummaryReagentDetailDTO, index: number) => ({
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
        fileName: 'POSummaryDrilldownQtyReagent',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
