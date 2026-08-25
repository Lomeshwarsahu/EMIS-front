import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
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
import { IndentPoTenderStatusSummaryDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-indent-po-tender-status-summary',
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
  templateUrl: './indent-po-tender-status-summary.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './indent-po-tender-status-summary.component.css'
  ],
})
export class IndentPoTenderStatusSummaryComponent {
  yearlist: any[] = [];
  directoratelist: any[] = [];
  districtslist: any[] = [];

  selectedYear: any;
  selectedDirectorate: any;
  selectedDistrict: any;

  dispatchData: IndentPoTenderStatusSummaryDTO[] = [];
  dataSource = new MatTableDataSource<IndentPoTenderStatusSummaryDTO>([]);
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno',
    'Indent_Year',
    'description',
    'consolidated_date',
    'totalIndentitems',
    'indentqty',
    'poqty',
    'BalancePO',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.dataSource = new MatTableDataSource<IndentPoTenderStatusSummaryDTO>([]);
  }

  ngOnInit() {
    this.loadYears();
    this.loadDirectorates();
    this.loadDistricts();
  }

  loadYears() {
    this.api.get('GenerateNasti/Getyear').subscribe({
      next: (res: any) => {
        this.yearlist = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
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

  loadDistricts() {
    this.api.get('Reports/GetDistricts').subscribe({
      next: (res: any) => {
        this.districtslist = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  loadData() {
    this.loading = true;
    const dirId = this.selectedDirectorate ?? '';
    const yrId = this.selectedYear ?? '';
    const distId = this.selectedDistrict ?? '';

    this.api
      .get(
        `Reports/indentpotenderstatussummary?directorateId=${dirId}&financialYearId=${yrId}&districtId=${distId}`,
      )
      .subscribe({
        next: (res: any) => {
          this.dispatchData = (res || []).map(
            (item: IndentPoTenderStatusSummaryDTO, index: number) => ({
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
          this.toastr.error(
            err.error?.message || 'Failed to load data.',
          );
        },
      });
  }

  openDrillDown(element: IndentPoTenderStatusSummaryDTO) {
    this.router.navigate(['/reports/indent-po-tender-status-drilldown'], {
      queryParams: {
        userId: element.user_id,
        yearId: this.selectedYear,
        indentId: element.indent_consolidation_id,
        flag: 'EQP',
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
        fileName: 'IndentPOTenderStatusSummary',
        sheet: 'Summary',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
