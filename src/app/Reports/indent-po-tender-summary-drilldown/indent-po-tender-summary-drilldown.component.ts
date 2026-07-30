import { CommonModule, Location } from '@angular/common';
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
import { RouterModule, ActivatedRoute } from '@angular/router';
import { IndentPoTenderSummaryDrillDownDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-indent-po-tender-summary-drilldown',
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
    RouterModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './indent-po-tender-summary-drilldown.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './indent-po-tender-summary-drilldown.component.css'
  ],
})
export class IndentPoTenderSummaryDrilldownComponent {
  userId: number = 0;
  flag: string = '';
  yearId: number = 0;
  userName: string = '';
  year: string = '';
  dispatchData: IndentPoTenderSummaryDrillDownDTO[] = [];
  dataSource!: MatTableDataSource<IndentPoTenderSummaryDrillDownDTO>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'item_code_as_per_tender', 'item_name', 'indentQTY',
    'POQTY', 'BalancePO', 'basic_rate', 'netvalue', 'grossvalue', 'tenderstatus'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.dataSource = new MatTableDataSource<IndentPoTenderSummaryDrillDownDTO>([]);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = +params['userId'] || 0;
      this.flag = params['flag'] || '';
      this.yearId = +params['yearId'] || 0;
      this.loadData();
    });
  }

  loadData() {
    this.loading = true;
    this.api.get(`Reports/indentpotendersummarydrilldown?userId=${this.userId}&flag=${this.flag}&yearId=${this.yearId}`)
      .subscribe({
        next: (res: any) => {
          this.dispatchData = res.map((item: IndentPoTenderSummaryDrillDownDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          if (this.dispatchData.length > 0) {
            this.userName = this.dispatchData[0].user_name || '';
            this.year = this.dispatchData[0].year || '';
          }
          this.dataSource.data = this.dispatchData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cdr.detectChanges();
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.toastr.error(err.error?.message || 'Error fetching drilldown data');
          console.error('Error fetching drilldown data:', err);
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
        fileName: 'IndentPoTenderSummaryDrilldown',
        sheet: 'DrillDown',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
