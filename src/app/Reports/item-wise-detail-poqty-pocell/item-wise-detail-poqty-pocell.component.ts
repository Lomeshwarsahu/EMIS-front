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
import { Router, ActivatedRoute } from '@angular/router';
import { ItemWiseFullDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-item-wise-detail-poqty-pocell',
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
  templateUrl: './item-wise-detail-poqty-pocell.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './item-wise-detail-poqty-pocell.component.css'
  ],
})
export class ItemWiseDetailPOQtyPOCellComponent {
  reportData: ItemWiseFullDTO[] = [];
  dataSource = new MatTableDataSource<ItemWiseFullDTO>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno',
    'tender_no',
    'po_no',
    'po_date',
    'authority',
    'item_code_as_per_tender',
    'item_name',
    'supplier',
    'district',
    'consignee',
    'po_qty',
    'supply_qty',
    'receipt_qty',
    'install_qty',
    'po_type',
    'balance_to_dispatch',
    'balance_to_receive',
    'balance_to_install',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    const finYrId = params['finYrId'] ? Number(params['finYrId']) : 0;
    const itemCode = params['itemCode'] || '0';
    const POid = params['POid'] ? Number(params['POid']) : 0;

    this.loadData(itemCode, finYrId, POid);
  }

  loadData(itemCode: string, financialYearId: number, poId: number) {
    this.loading = true;
    this.api.get(`Reports/itemfull/${itemCode}/${financialYearId}/${poId}`).subscribe({
      next: (res: any) => {
        this.reportData = (res || []).map(
          (item: ItemWiseFullDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }),
        );
        this.dataSource.data = this.reportData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        console.error(err);
        this.toastr.error(err.error?.message || 'Failed to load data.');
      },
    });
  }

  goBack() {
    this.router.navigate(['/reports/item-wise-detail-pocell']);
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'ItemWiseDetailPOQtyPOCell',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
