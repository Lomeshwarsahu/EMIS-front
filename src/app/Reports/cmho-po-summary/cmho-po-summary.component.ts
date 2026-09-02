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
  Itemlist: any[] = [];
  selectedYear: any;
  selectedItem: any;
  summaryData: IndentItemSummaryDTO[] = [];
  dataSource!: MatTableDataSource<IndentItemSummaryDTO>;
  loading: boolean = false;
  totalQuantity: number = 0;
  totalPOValue: number = 0;

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
    this.GetItemsList();
  }

  GetYearsList() {
    this.api.get(`Reports/GetFinancialYear`).subscribe({
      next: (res: any) => {
        this.Yearlist = res || [];
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  GetItemsList() {
    this.api.get(`Reports/items/5`).subscribe({
      next: (res: any) => {
        this.Itemlist = res || [];
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  loadData() {
    this.loading = true;
    const financialYearId = this.selectedYear || '';
    const itemCode = this.selectedItem || '';

    this.api.get(`Reports/po-summary?financialYearId=${financialYearId}&directorateId=5&itemCode=${itemCode}`)
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
            TotalPOValue: item.TotalPOValue ?? item.totalPOValue ?? item.totalPOvalue ?? item.totalPoValue ?? item.total_po_value ?? 0,
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
          console.error('Error fetching data:', err);
        },
      });
  }

  calcTotals() {
    this.totalQuantity = this.summaryData.reduce((sum, item) => sum + (Number(item.Quantity) || 0), 0);
    this.totalPOValue = this.summaryData.reduce((sum, item) => sum + (Number(item.TotalPOValue) || 0), 0);
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
