import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTableExporterDirective, MatTableExporterModule } from 'mat-table-exporter';
import { ToastrService } from 'ngx-toastr';
import { IndentConsolidationDTO } from 'src/app/Model/models';
import { MaterialModule } from 'src/app/material-module';
import { ApiService } from 'src/app/service/api.service';
import { DmePageSkeletonComponent } from '../DME/shared/dme-page-skeleton/dme-page-skeleton.component';

interface YearOption {
  financial_year_id: number;
  year: string;
}

interface ItemOption {
  ItemId: number;
  ItemName: string;
}

interface DirectorateOption {
  facility_aut_id: number;
  facility_aut_name: string;
}

interface UserOption {
  UserId: number;
  UserName: string;
}

@Component({
  selector: 'app-indent-from-facilities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTableExporterModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './indent-from-facilities.component.html',
  styleUrls: ['./indent-from-facilities.component.css'],
})
export class IndentFromFacilitiesComponent {
  ItemsList: ItemOption[] = [];
  UsersByAuthoritylist: UserOption[] = [];
  yearlist: YearOption[] = [];
  Diectoratelist: DirectorateOption[] = [];

  financial_year_id = 0;
  facility_aut_id = 0;
  ItemId = 0;
  UserId = 0;
  loading = false;

  dataSource = new MatTableDataSource<IndentConsolidationDTO>([]);

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  @ViewChild(MatTableExporterDirective) exporter?: MatTableExporterDirective;

  displayedColumns: string[] = [
    'sno',
    'IndentConsolidationId',
    'IndentConNo',
    'IndentDate',
    'ItemCount',
    'Status',
    'FacilityAutName',
    'Description',
    'Path',
    'UserType',
    'Designation',
    'UserId',
    'UserName',
  ];

  get hasActiveFilter(): boolean {
    return this.financial_year_id > 0 || this.ItemId > 0 || this.facility_aut_id > 0 || this.UserId > 0;
  }

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.GetItemsList();
    this.Getyear();
    this.GetDiectorate();
    this.loadRows();
  }

  onFilterChange(): void {
    this.loadRows();
  }

  clearFilters(): void {
    this.financial_year_id = 0;
    this.ItemId = 0;
    this.facility_aut_id = 0;
    this.UserId = 0;
    this.UsersByAuthoritylist = [];
    this.loadRows();
  }

  onDirectorateChange(authorityId: number): void {
    this.UserId = 0;
    this.UsersByAuthoritylist = [];
    if (authorityId > 0) {
      this.GetUsersByAuthority(authorityId);
    }
    this.loadRows();
  }

  GetItemsList(): void {
    this.api.get('Contract/Indent/GetItemsList').subscribe({
      next: (res: unknown) => {
        const arr = Array.isArray(res) ? res : [];
        this.ItemsList = arr.map((r: Record<string, unknown>) => ({
          ItemId: Number(r['ItemId'] ?? r['itemId'] ?? 0),
          ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
        }));
      },
      error: () => this.toastr.error('Could not load items.'),
    });
  }

  GetUsersByAuthority(id: number): void {
    this.api.get('Contract/Indent/GetUsersByAuthority', { params: { authority_id: id } }).subscribe({
      next: (res: unknown) => {
        const arr = Array.isArray(res) ? res : [];
        this.UsersByAuthoritylist = arr.map((r: Record<string, unknown>) => ({
          UserId: Number(r['UserId'] ?? r['userId'] ?? 0),
          UserName: String(r['UserName'] ?? r['userName'] ?? ''),
        }));
      },
      error: () => this.toastr.error('Could not load facilities.'),
    });
  }

  Getyear(): void {
    this.api.get('GenerateNasti/Getyear').subscribe({
      next: (res: unknown) => {
        const arr = Array.isArray(res) ? res : [];
        this.yearlist = arr.map((r: Record<string, unknown>) => ({
          financial_year_id: Number(r['financial_year_id'] ?? r['FinancialYearId'] ?? 0),
          year: String(r['year'] ?? r['Year'] ?? ''),
        }));
      },
      error: () => this.toastr.error('Could not load financial years.'),
    });
  }

  GetDiectorate(): void {
    this.api.get('Reports/GetDiectorate').subscribe({
      next: (res: unknown) => {
        const arr = Array.isArray(res) ? res : [];
        this.Diectoratelist = arr.map((r: Record<string, unknown>) => ({
          facility_aut_id: Number(r['facility_aut_id'] ?? r['FacilityAutId'] ?? 0),
          facility_aut_name: String(r['facility_aut_name'] ?? r['FacilityAutName'] ?? ''),
        }));
      },
      error: () => this.toastr.error('Could not load directorates.'),
    });
  }

  loadRows(): void {
    this.loading = true;
    const params = {
      FinancialYearId: this.financial_year_id || 0,
      ItemId: this.ItemId || 0,
      AuthorityId: this.facility_aut_id || 0,
      UserId: this.UserId || 0,
    };

    this.api.get('Contract/Indent/GetIndentConsolidation', { params }).subscribe({
      next: (res: unknown) => {
        const arr = Array.isArray(res) ? res : [];
        const rows = arr.map((item: IndentConsolidationDTO, index: number) => ({
          ...item,
          sno: index + 1,
        }));
        this.dataSource.data = rows;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.dataSource.data = [];
        this.toastr.error('Could not load indent consolidation.');
      },
    });
  }

  applyTextFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportExcel(): void {
    if (!this.exporter || !this.dataSource.data.length) {
      this.toastr.warning('No data to export.');
      return;
    }
    this.exporter.exportTable('xlsx', {
      fileName: 'IndentFromFacilities',
      sheet: 'IndentFromFacilities',
      Props: { Author: 'cgmsc' },
    });
  }
}
