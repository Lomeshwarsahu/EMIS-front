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
import { OpeningStockDrillDownDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-opening-stock-drilldown',
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
  templateUrl: './opening-stock-drilldown.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './opening-stock-drilldown.component.css'
  ],
})
export class OpeningStockDrilldownComponent {
  userId: string = '';
  directorateId: string = '';
  dispatchData: OpeningStockDrillDownDTO[] = [];
  dataSource = new MatTableDataSource<OpeningStockDrillDownDTO>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno',
    'item_id',
    'item_name',
    'item_code',
    'make_no',
    'model',
    'make',
    'location_name',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userId = params['userId'] || '';
      this.directorateId = params['directorateId'] || '';
      this.loadData();
    });
  }

  loadData() {
    this.loading = true;
    this.api.get(`Reports/opening-stock-detail?userId=${this.userId}&directorateId=${this.directorateId}`).subscribe({
      next: (res: any) => {
        this.dispatchData = (res || []).map(
          (item: OpeningStockDrillDownDTO, index: number) => ({
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

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'OpeningStockDrilldown',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
