import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { CollapseModule } from 'src/app/collapse';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { IndentPoTenderStatusDrillDownDTO } from 'src/app/Model/models';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-indent-po-tender-status-drilldown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule,
    NgbCollapseModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatTableExporterModule,
    RouterModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './indent-po-tender-status-drilldown.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './indent-po-tender-status-drilldown.component.css'
  ],
})
export class IndentPoTenderStatusDrilldownComponent {
  userId = 0;
  yearId = 0;
  indentId = 0;
  flag = 'EQP';
  headerUserName = '';
  headerIndentNo = '';
  headerIndentDate = '';

  data: IndentPoTenderStatusDrillDownDTO[] = [];
  dataSource = new MatTableDataSource<IndentPoTenderStatusDrillDownDTO>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'item_code_as_per_tender', 'item_name', 'location_name',
    'indentQTY', 'POQTY', 'BalancePO', 'supplier_name', 'basic_rate',
    'tender_no_drill', 'tenderDT', 'finalstatus', 'remarks',
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
      this.userId = params['userId'] ? Number(params['userId']) : 0;
      this.yearId = params['yearId'] ? Number(params['yearId']) : 0;
      this.indentId = params['indentId'] ? Number(params['indentId']) : 0;
      this.flag = params['flag'] || 'EQP';
      this.loadData();
    });
  }

  loadData() {
    if (!this.indentId) return;
    this.loading = true;
    this.api.get(`Reports/indentpotenderstatussummarydrilldown?userId=${this.userId}&flag=${this.flag}&yearId=${this.yearId}&indentId=${this.indentId}`).subscribe({
      next: (res: any) => {
        this.data = (res || []).map((item: IndentPoTenderStatusDrillDownDTO, i: number) => ({
          ...item, sno: i + 1,
        }));
        this.dataSource.data = this.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.data.length > 0) {
          this.headerUserName = this.data[0].user_name || '';
          this.headerIndentNo = this.data[0].description || '';
          this.headerIndentDate = this.data[0].consolidated_date || '';
        }
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.toastr.error('Error loading drill-down data');
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
    const exporter = document.querySelector('matTableExporter') as any;
    if (exporter?.exportTable) {
      exporter.exportTable('xlsx', { fileName: 'IndentPOStatusDrillDown', sheet: 'Details' });
    }
  }
}
