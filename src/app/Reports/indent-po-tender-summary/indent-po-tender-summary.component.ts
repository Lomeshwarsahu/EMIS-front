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
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { IndentPoTenderSummaryDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-indent-po-tender-summary',
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
  templateUrl: './indent-po-tender-summary.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './indent-po-tender-summary.component.css'
  ],
})
export class IndentPoTenderSummaryComponent {
  Yearlist: any = [];
  yearId: number = 0;
  dispatchData: IndentPoTenderSummaryDTO[] = [];
  dataSource!: MatTableDataSource<IndentPoTenderSummaryDTO>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'user_name', 'noscountItem', 'NoofEqIndent',
    'NoofEqPO', 'NoofEqBal', 'netvalue', 'grossvalue', 'NoEQLivInTender'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource<IndentPoTenderSummaryDTO>([]);
  }

  ngOnInit() {
    this.GetYearsList();
  }

  GetYearsList() {
    this.api.get(`GenerateNasti/Getyear`).subscribe({
      next: (res: any) => {
        this.Yearlist = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  loadData() {
    if (!this.yearId) {
      this.toastr.warning('Please select a financial year.');
      return;
    }
    this.loading = true;
    this.api.get(`Reports/indentpotendersummary?financialYearId=${this.yearId}`).subscribe({
      next: (res: any) => {
        this.dispatchData = res.map((item: IndentPoTenderSummaryDTO, index: number) => ({
          ...item,
          sno: index + 1,
        }));
        this.dataSource.data = this.dispatchData;
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

  navigateToDrilldown(userId: number, flag: string) {
    this.router.navigate(['/reports/indent-po-tender-summary-drilldown'], {
      queryParams: { userId, flag, yearId: this.yearId },
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
        fileName: 'IndentPoTenderSummary',
        sheet: 'Summary',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
