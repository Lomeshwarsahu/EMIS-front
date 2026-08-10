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
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-pending-install-drilldown-dhs',
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
  templateUrl: './pending-install-drilldown-dhs.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './pending-install-drilldown-dhs.component.css'
  ],
})
export class PendingInstallDrilldownDhsComponent {
  poId: number = 0;
  dispatchData: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  loading: boolean = false;
  poHeader: any = {};

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'item_code', 'item_name', 'po_qty', 'receipt_qty',
    'install_qty', 'pending_receipt', 'pending_install', 'supplier_name'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.poId = params['POID'] ? Number(params['POID']) : (params['poId'] ? Number(params['poId']) : 0);
      if (this.poId) {
        this.loadData();
      }
    });
  }

  loadData() {
    this.loading = true;
    this.api.get(`Reports/pending-install-drilldown-dhs?POID=${this.poId}`).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res?.data || []);
        this.dispatchData = data.map((item: any, index: number) => ({
          ...item,
          sno: index + 1,
        }));
        this.dataSource.data = this.dispatchData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (res?.header || this.dispatchData.length > 0) {
          this.poHeader = res?.header || this.dispatchData[0];
        }
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Error loading data');
        console.error(err);
      },
    });
  }

  goBack() {
    this.location.back();
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'PendingInstallDrilldownDHS',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
