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
import { TenderLiveStatusDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-tender-live-status',
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
  templateUrl: './tender-live-status.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './tender-live-status.component.css'
  ],
})
export class TenderLiveStatusComponent {
  dispatchData: TenderLiveStatusDTO[] = [];
  dataSource = new MatTableDataSource<TenderLiveStatusDTO>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno',
    'nos_of_tender',
    'cover_status',
    'items',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.api.get('Reports/tender-live-status').subscribe({
      next: (res: any) => {
        this.dispatchData = (res || []).map(
          (item: TenderLiveStatusDTO, index: number) => ({
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

  openDrillDown(element: TenderLiveStatusDTO) {
    this.router.navigate(['/reports/tender-live-status-drilldown'], {
      queryParams: { csid: element.cover_status },
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
        fileName: 'TenderLiveStatus',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
