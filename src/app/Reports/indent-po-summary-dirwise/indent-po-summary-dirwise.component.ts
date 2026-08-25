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
import { IndentPOSummaryDirwiseDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-indent-po-summary-dirwise',
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
  templateUrl: './indent-po-summary-dirwise.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './indent-po-summary-dirwise.component.css',
  ],
})
export class IndentPoSummaryDirwiseComponent {
  Yearlist: any[] = [];
  Diectoratelist: any[] = [];
  selectedYear: any;
  selectedDirectorate: any;

  dmeData: IndentPOSummaryDirwiseDTO[] = [];
  dhsData: IndentPOSummaryDirwiseDTO[] = [];
  dmeDataSource = new MatTableDataSource<IndentPOSummaryDirwiseDTO>([]);
  dhsDataSource = new MatTableDataSource<IndentPOSummaryDirwiseDTO>([]);
  loading: boolean = false;

  @ViewChild('dmePaginator') dmePaginator!: MatPaginator;
  @ViewChild('dmeSort') dmeSort!: MatSort;
  @ViewChild('dhsPaginator') dhsPaginator!: MatPaginator;
  @ViewChild('dhsSort') dhsSort!: MatSort;

  displayedColumns: string[] = [
    'sno',
    'district_med_coll_hosp',
    'indent_year',
    'indent_letter_no',
    'indent_date',
    'po_no',
    'po_date',
    'eqp_code',
    'eqp_name',
    'eqp_type',
    'indent_qty',
    'po_qty',
    'no_of_consignee',
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {
    this.dmeDataSource = new MatTableDataSource<IndentPOSummaryDirwiseDTO>([]);
    this.dhsDataSource = new MatTableDataSource<IndentPOSummaryDirwiseDTO>([]);
  }

  ngOnInit() {
    this.GetYearsList();
    this.GetDiectorate();
  }

  GetYearsList() {
    this.api.get('Reports/GetFinancialYear').subscribe({
      next: (res: any) => { this.Yearlist = res; },
      error: (err: any) => { console.error(err); },
    });
  }

  GetDiectorate() {
    this.api.get('Reports/GetDiectorate').subscribe({
      next: (res: any) => { this.Diectoratelist = res; },
      error: (err: any) => { console.error(err); },
    });
  }

  onDirectorateChange() {
    if (this.selectedDirectorate === 5 || this.selectedDirectorate === '5') {
      this.selectedDirectorate = 5;
    } else if (this.selectedDirectorate === 12 || this.selectedDirectorate === '12') {
      this.selectedDirectorate = 12;
    }
  }

  loadData() {
    this.loading = true;
    const financialYearId = this.selectedYear || '';

    this.api.get(`Reports/GetIndentPOSummaryDirwise?directorateId=12&financialYearId=${financialYearId}`).subscribe({
      next: (dmeRes: any) => {
        this.dmeData = ((dmeRes as any[]) || []).map(
          (item: IndentPOSummaryDirwiseDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }),
        );
        this.dmeDataSource.data = this.dmeData;
        this.dmeDataSource.paginator = this.dmePaginator;
        this.dmeDataSource.sort = this.dmeSort;

        this.api.get(`Reports/GetIndentPOSummaryDirwise?directorateId=5&financialYearId=${financialYearId}`).subscribe({
          next: (dhsRes: any) => {
            this.dhsData = ((dhsRes as any[]) || []).map(
              (item: IndentPOSummaryDirwiseDTO, index: number) => ({
                ...item,
                sno: index + 1,
              }),
            );
            this.dhsDataSource.data = this.dhsData;
            this.dhsDataSource.paginator = this.dhsPaginator;
            this.dhsDataSource.sort = this.dhsSort;
            this.cdr.detectChanges();
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            this.toastr.error(err.error?.message || 'Error fetching DHS data');
            console.error(err);
          },
        });
      },
      error: (err: any) => {
        this.loading = false;
        this.toastr.error(err.error?.message || 'Error fetching DME data');
        console.error(err);
      },
    });
  }

  applyTextFilter(event: Event, source: 'dme' | 'dhs') {
    const filterValue = (event.target as HTMLInputElement).value;
    if (source === 'dme') {
      this.dmeDataSource.filter = filterValue.trim().toLowerCase();
    } else {
      this.dhsDataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  exportToExcel(section: 'dme' | 'dhs') {
    const selector =
      section === 'dme' ? '#dmeTable [matTableExporter]' : '#dhsTable [matTableExporter]';
    const exporter: any = document.querySelector(selector);
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: `IndentPOSummaryDirwise_${section.toUpperCase()}`,
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
