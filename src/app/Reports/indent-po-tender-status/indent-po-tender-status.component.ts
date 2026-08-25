import { CommonModule, DatePipe } from '@angular/common';
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
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { IndentPoTenderStatusDTO } from 'src/app/Model/models';
import { SupplierPageSkeletonComponent } from '../../component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-indent-po-tender-status',
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
    MatSelectModule,
    MatOptionModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './indent-po-tender-status.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './indent-po-tender-status.component.css'
  ],
})
export class IndentPoTenderStatusComponent {
  Yearlist: any = [];
  Diectoratelist: any = [];
  Districtslist: any = [];
  selectedYear: any;
  selectedDirectorate: any;
  selectedDistrict: any;
  searchBy: string = '';
  dispatchData: IndentPoTenderStatusDTO[] = [];
  dataSource!: MatTableDataSource<IndentPoTenderStatusDTO>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'user_name', 'year', 'consolidated_date', 'description',
    'item_code_as_per_tender', 'item_name', 'location_name', 'indentQTY',
    'POYear', 'po_date', 'po_no', 'POQTY', 'BalancePO', 'supplier_name',
    'tender_no', 'basic_rate', 'dispatchQTY', 'installedQTY'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<IndentPoTenderStatusDTO>([]);
  }

  ngOnInit() {
    this.GetYearsList();
    this.GetDiectorate();
    this.GetDistricts();
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

  GetDiectorate() {
    this.api.get(`Reports/GetDiectorate`).subscribe({
      next: (res: any) => {
        this.Diectoratelist = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  GetDistricts() {
    this.api.get(`Reports/GetDistricts`).subscribe({
      next: (res: any) => {
        this.Districtslist = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  loadData() {
    this.loading = true;
    const directorateId = this.selectedDirectorate || '';
    const financialYearId = this.selectedYear || '';
    const districtId = this.selectedDistrict || '';
    const searchBy = this.searchBy || '';

    this.api.get(`Reports/indentpotenderstatus?directorateId=${directorateId}&financialYearId=${financialYearId}&districtId=${districtId}&searchBy=${searchBy}`)
      .subscribe({
        next: (res: any) => {
          this.dispatchData = res.map((item: IndentPoTenderStatusDTO, index: number) => ({
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

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'IndentPoTenderStatus',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
