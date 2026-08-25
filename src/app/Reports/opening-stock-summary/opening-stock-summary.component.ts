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
import { Router } from '@angular/router';
import { OpeningStockSummaryDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-opening-stock-summary',
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
  templateUrl: './opening-stock-summary.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './opening-stock-summary.component.css'
  ],
})
export class OpeningStockSummaryComponent {
  directoratelist: any[] = [];
  selectedDirectorate: any;
  dispatchData: OpeningStockSummaryDTO[] = [];
  dataSource = new MatTableDataSource<OpeningStockSummaryDTO>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno',
    'user_name',
    'nos',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadDirectorates();
  }

  loadDirectorates() {
    this.api.get('Reports/GetDiectorate').subscribe({
      next: (res: any) => {
        this.directoratelist = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  loadData() {
    this.loading = true;
    const directorateId = this.selectedDirectorate ?? '';
    this.api.get(`Reports/opening-stock-summary?directorateId=${directorateId}`).subscribe({
      next: (res: any) => {
        this.dispatchData = (res || []).map(
          (item: OpeningStockSummaryDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }),
        );
        this.dataSource.data = this.dispatchData;
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

  openDrillDown(element: OpeningStockSummaryDTO) {
    this.router.navigate(['/reports/opening-stock-drilldown'], {
      queryParams: {
        userId: element.user_id,
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
        fileName: 'OpeningStockSummary',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
