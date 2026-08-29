import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

export interface NodalInfoRow {
  LocationId: number;
  LocationName: string;
  FacilityTypeName: string;
  DistrictName: string;
  DistrictId: number;
  FacilityTypeId: number;
  UserId: number;
  Id: number;
  Name: string;
  Designation: string;
  MobileNo: string;
  EmailId: string;
  isNew?: boolean;
}

@Component({
  selector: 'app-nodal-information',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './nodal-information.component.html',
  styleUrls: ['./nodal-information.component.css'],
})
export class NodalInformationComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly apiRoot = `${environment.apiUrl}/DMEStock/`;

  displayedColumns = [
    'sno',
    'locationName',
    'districtName',
    'name',
    'designation',
    'emailId',
    'mobileNo',
    'action',
  ];

  dataSource = new MatTableDataSource<NodalInfoRow>([]);
  allRows: NodalInfoRow[] = [];
  loading = false;
  saving = false;
  userId = 0;

  // Filters
  searchQuery = '';
  selectedDistrict = 'ALL';
  districts: string[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    this.loadData();
  }

  loadData(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }
    this.loading = true;
    this.http.get<NodalInfoRow[]>(`${this.apiRoot}nodal-information?userId=${this.userId}`).subscribe({
      next: (res) => {
        this.allRows = this.mapRows(res);
        this.districts = Array.from(
          new Set(this.allRows.map((r) => r.DistrictName).filter(Boolean)),
        ).sort();
        this.applyFilter();
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load nodal officer information.'));
      },
    });
  }

  applyFilter(): void {
    let filtered = [...this.allRows];
    if (this.selectedDistrict !== 'ALL') {
      filtered = filtered.filter((r) => r.DistrictName === this.selectedDistrict);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.LocationName && r.LocationName.toLowerCase().includes(q)) ||
          (r.DistrictName && r.DistrictName.toLowerCase().includes(q)) ||
          (r.Name && r.Name.toLowerCase().includes(q)) ||
          (r.Designation && r.Designation.toLowerCase().includes(q)) ||
          (r.EmailId && r.EmailId.toLowerCase().includes(q)) ||
          (r.MobileNo && r.MobileNo.toLowerCase().includes(q)),
      );
    }

    this.dataSource.data = filtered;
    if (this.sort) this.dataSource.sort = this.sort;
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  onFilterChange(): void {
    this.applyFilter();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedDistrict = 'ALL';
    this.applyFilter();
  }

  hasActiveFilters(): boolean {
    return !!this.searchQuery.trim() || this.selectedDistrict !== 'ALL';
  }

  addRow(): void {
    const existingNew = this.dataSource.data.find((r) => r.isNew);
    if (existingNew) {
      this.toastr.warning('Please save the current new entry first.');
      return;
    }

    const firstUserId = this.allRows.find((r) => r.UserId)?.UserId || this.userId;
    const newRow: NodalInfoRow = {
      LocationId: 0,
      LocationName: '',
      FacilityTypeName: '',
      DistrictName: '',
      DistrictId: 0,
      FacilityTypeId: 0,
      UserId: firstUserId,
      Id: 0,
      Name: '',
      Designation: '',
      MobileNo: '',
      EmailId: '',
      isNew: true,
    };

    const updated = [newRow, ...this.dataSource.data];
    this.dataSource.data = updated;
  }

  saveNew(row: NodalInfoRow): void {
    const uid = row.UserId || this.userId;
    if (!uid) {
      this.toastr.warning('User id missing for this facility.');
      return;
    }
    if (!row.Name?.trim() || !row.Designation?.trim() || !row.EmailId?.trim() || !row.MobileNo?.trim()) {
      this.toastr.warning('Please fill Name, Designation, Email, and Mobile No.');
      return;
    }
    this.saving = true;
    this.http
      .post<{ message?: string }>(`${this.apiRoot}nodal-information`, {
        userId: uid,
        name: row.Name.trim(),
        designation: row.Designation.trim(),
        emailId: row.EmailId.trim(),
        mobileNo: row.MobileNo.trim(),
      })
      .subscribe({
        next: (res) => {
          this.toastr.success(res?.message ?? 'Saved Successfully');
          this.saving = false;
          this.loadData();
        },
        error: (e) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not save nodal officer information.'));
        },
      });
  }

  deleteRow(row: NodalInfoRow): void {
    if (row.isNew) {
      this.dataSource.data = this.dataSource.data.filter((r) => r !== row);
      return;
    }
    if (!row.Id) {
      this.toastr.warning('No record to delete.');
      return;
    }
    if (!confirm('Are you sure you want to delete this nodal officer?')) {
      return;
    }
    this.saving = true;
    this.http
      .delete<{ message?: string }>(`${this.apiRoot}nodal-information/${row.Id}`)
      .subscribe({
        next: (res) => {
          this.toastr.success(res?.message ?? 'Deleted Successfully');
          this.saving = false;
          this.loadData();
        },
        error: (e) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not delete nodal officer information.'));
        },
      });
  }

  exportCsv(): void {
    const data = this.dataSource.filteredData.length ? this.dataSource.filteredData : this.dataSource.data;
    if (!data.length) return;

    const headers = ['S.No', 'Facility Name', 'District', 'Nodal Officer Name', 'Designation', 'Email', 'Mobile'];
    const rows = data.map((r, i) => [
      i + 1,
      `"${(r.LocationName || '').replace(/"/g, '""')}"`,
      `"${(r.DistrictName || '').replace(/"/g, '""')}"`,
      `"${(r.Name || '').replace(/"/g, '""')}"`,
      `"${(r.Designation || '').replace(/"/g, '""')}"`,
      `"${(r.EmailId || '').replace(/"/g, '""')}"`,
      `"${(r.MobileNo || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Nodal_Officer_Information_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private mapRows(raw: unknown): NodalInfoRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((item: any) => ({
      LocationId: Number(item.locationId ?? item.LocationId ?? 0),
      LocationName: String(item.locationName ?? item.LocationName ?? ''),
      FacilityTypeName: String(item.facilityTypeName ?? item.FacilityTypeName ?? ''),
      DistrictName: String(item.districtName ?? item.DistrictName ?? ''),
      DistrictId: Number(item.districtId ?? item.DistrictId ?? 0),
      FacilityTypeId: Number(item.facilityTypeId ?? item.FacilityTypeId ?? 0),
      UserId: Number(item.userId ?? item.UserId ?? 0),
      Id: Number(item.id ?? item.Id ?? 0),
      Name: String(item.name ?? item.Name ?? ''),
      Designation: String(item.designation ?? item.Designation ?? ''),
      MobileNo: String(item.mobileNo ?? item.MobileNo ?? ''),
      EmailId: String(item.emailId ?? item.EmailId ?? ''),
      isNew: false,
    }));
  }
}
