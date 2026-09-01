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
import { Router } from '@angular/router';
import { IndentItemSummaryDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-po-summary',
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
  templateUrl: './po-summary.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './po-summary.component.css',
  ],
})
export class PoSummaryComponent {
  Yearlist: any[] = [];
  Diectoratelist: any[] = [];
  Itemlist: any[] = [];
  selectedYear: any;
  selectedDirectorate: any;
  selectedItem: any;
  summaryData: IndentItemSummaryDTO[] = [];
  dataSource = new MatTableDataSource<IndentItemSummaryDTO>([]);
  loading: boolean = false;

  totalQuantity: number = 0;
  totalPOValue: number = 0;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno',
    'Code',
    'ItemName',
    'Quantity',
    'BasicRate',
    'Percentage',
    'SingleUnitPrice',
    'TotalPOValue',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.GetYearsList();
    this.GetDiectorate();
  }

  GetYearsList() {
    this.api.get('Reports/GetFinancialYear').subscribe({
      next: (res: any) => { this.Yearlist = res; },
      error: (err: any) => { console.error(err); },
    });
  }

  GetDiectorate() {
    this.api.get('Reports/GetDiectorate').subscribe({
      next: (res: any) => { this.Diectoratelist = res; },
      error: (err: any) => { console.error(err); },
    });
  }

  onDirectorateChange() {
    if (this.selectedDirectorate) {
      this.api.get(`Reports/items/${this.selectedDirectorate}`).subscribe({
        next: (res: any) => { this.Itemlist = res; },
        error: (err: any) => { console.error(err); },
      });
    } else {
      this.Itemlist = [];
    }
  }

  loadData() {
    this.loading = true;
    const financialYearId = this.selectedYear || '';
    const directorateId = this.selectedDirectorate || '';
    const itemCode = this.selectedItem || '';

    this.api
      .get(
        `Reports/po-summary?financialYearId=${financialYearId}&directorateId=${directorateId}&itemCode=${itemCode}`,
      )
      .subscribe({
        next: (res: any) => {
          this.summaryData = (res || []).map((item: any, index: number) => ({
            sno: index + 1,
            Code: item.Code ?? item.code ?? item.CODE ?? '',
            ItemName: item.ItemName ?? item.itemName ?? item.item_name ?? item.ITEM_NAME ?? '',
            Quantity: item.Quantity ?? item.quantity ?? 0,
            BasicRate: item.BasicRate ?? item.basicRate ?? item.basic_rate ?? 0,
            Percentage: item.Percentage ?? item.percentage ?? 0,
            SingleUnitPrice: item.SingleUnitPrice ?? item.singleUnitPrice ?? item.single_unit_price ?? 0,
            TotalPOValue: item.TotalPOValue ?? item.totalPOValue ?? item.totalPoValue ?? item.total_po_value ?? 0,
          }));
          this.dataSource.data = this.summaryData;
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
    this.totalQuantity = this.summaryData.reduce(
      (sum, item) => sum + (item.Quantity || 0),
      0,
    );
    this.totalPOValue = this.summaryData.reduce(
      (sum, item) => sum + (item.TotalPOValue || 0),
      0,
    );
  }

  onQuantityClick(element: IndentItemSummaryDTO) {
    this.router.navigate(['/reports/po-summary-drilldown-qty'], {
      queryParams: {
        finYrId: this.selectedYear,
        itemCode: element.Code,
        directorateId: this.selectedDirectorate,
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
        fileName: 'POSummary',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
