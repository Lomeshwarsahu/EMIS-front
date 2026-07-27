import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { MasterApiService } from '../../../service/master-api.service';
import { NodleMasterGridDto } from '../../../Model/models';

@Component({
  selector: 'app-health-facility-details',
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
  templateUrl: './health-facility-details.component.html',
  styleUrls: ['./health-facility-details.component.css'],
})
export class HealthFacilityDetailsComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = [
    'sno',
    'districtName',
    'locationName',
    'facilityType',
    'nodleName',
    'nodleDesignation',
    'nodleEmail',
    'nodleMobile',
    'action',
  ];

  dataSource = new MatTableDataSource<NodleMasterGridDto>([]);
  loading = false;
  userId = 0;

  // Filters & State
  searchQuery = '';
  selectedDistrict = 'ALL';
  selectedFacilityType = 'ALL';
  selectedStatus = 'ALL';

  // Options for Dropdowns
  districts: string[] = [];
  facilityTypes: string[] = [];

  // Metrics
  totalCount = 0;
  assignedCount = 0;
  pendingCount = 0;
  filteredCount = 0;

  constructor(
    private readonly api: MasterApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.userId = Number(loginData?.user_id) || 0;
    this.setupFilterPredicate();
    this.loadGrid();
  }

  setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: NodleMasterGridDto) => {
      // Check Search Query
      const q = this.searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (data.DistrictName && data.DistrictName.toLowerCase().includes(q)) ||
        (data.LocationName && data.LocationName.toLowerCase().includes(q)) ||
        (data.FacilityTypeName && data.FacilityTypeName.toLowerCase().includes(q)) ||
        (data.NodleName && data.NodleName.toLowerCase().includes(q)) ||
        (data.NodleDesignation && data.NodleDesignation.toLowerCase().includes(q)) ||
        (data.NodleEmail && data.NodleEmail.toLowerCase().includes(q)) ||
        (data.NodleMobile && data.NodleMobile.toLowerCase().includes(q));

      // Check District
      const matchesDistrict =
        this.selectedDistrict === 'ALL' || data.DistrictName === this.selectedDistrict;

      // Check Facility Type
      const matchesFacilityType =
        this.selectedFacilityType === 'ALL' || data.FacilityTypeName === this.selectedFacilityType;

      // Check Assignment Status
      const isAssigned = data.NodleId > 0 || Boolean(data.NodleName && data.NodleName.trim().length > 0);
      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        (this.selectedStatus === 'ASSIGNED' && isAssigned) ||
        (this.selectedStatus === 'PENDING' && !isAssigned);

      return Boolean(matchesSearch && matchesDistrict && matchesFacilityType && matchesStatus);
    };
  }

  loadGrid(): void {
    this.loading = true;
    this.api.getNodleMasterGrid(this.userId).subscribe({
      next: (res) => {
        const data = res ?? [];
        this.dataSource.data = data;

        // Extract Dropdown Options
        this.districts = Array.from(new Set(data.map((d) => d.DistrictName).filter(Boolean))).sort();
        this.facilityTypes = Array.from(new Set(data.map((d) => d.FacilityTypeName).filter(Boolean))).sort();

        // Calculate Metrics & Apply Filter
        this.updateMetrics();

        // Attach Paginator & Sort
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load facility grid.');
      },
    });
  }

  updateMetrics(): void {
    const data = this.dataSource.data;
    this.totalCount = data.length;
    this.assignedCount = data.filter(
      (d) => d.NodleId > 0 || Boolean(d.NodleName && d.NodleName.trim().length > 0)
    ).length;
    this.pendingCount = this.totalCount - this.assignedCount;
    this.filteredCount = this.dataSource.filteredData.length;
  }

  onFilterChange(): void {
    // Trigger filter update in MatTableDataSource
    this.dataSource.filter = `${this.searchQuery.trim()}-${this.selectedDistrict}-${this.selectedFacilityType}-${this.selectedStatus}-${Date.now()}`;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.filteredCount = this.dataSource.filteredData.length;
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedDistrict = 'ALL';
    this.selectedFacilityType = 'ALL';
    this.selectedStatus = 'ALL';
    this.onFilterChange();
  }

  hasActiveFilters(): boolean {
    return Boolean(
      this.searchQuery.trim().length > 0 ||
        this.selectedDistrict !== 'ALL' ||
        this.selectedFacilityType !== 'ALL' ||
        this.selectedStatus !== 'ALL'
    );
  }

  saveNodle(row: NodleMasterGridDto): void {
    if (!row.NodleName?.trim()) {
      this.toastr.warning('Please enter Nodal Name.');
      return;
    }
    if (!row.NodleDesignation?.trim()) {
      this.toastr.warning('Please enter Designation.');
      return;
    }
    if (!row.NodleEmail?.trim()) {
      this.toastr.warning('Please enter Email.');
      return;
    }
    if (!row.NodleMobile?.trim()) {
      this.toastr.warning('Please enter Mobile No.');
      return;
    }
    if (!this.isValidMobile(row.NodleMobile.trim())) {
      this.toastr.warning('Mobile No must start with 5, 6, 7, 8, or 9.');
      return;
    }

    this.loading = true;
    this.api
      .saveNodleMaster({
        UserId: row.UserId,
        Name: row.NodleName.trim(),
        Designation: row.NodleDesignation.trim(),
        EmailId: row.NodleEmail.trim(),
        MobileNo: row.NodleMobile.trim(),
      })
      .subscribe({
        next: () => {
          this.toastr.success('Nodal officer saved successfully.');
          this.loadGrid();
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error(err?.error?.message ?? 'Failed to save nodal officer.');
        },
      });
  }

  updateNodle(row: NodleMasterGridDto): void {
    if (!row.NodleName?.trim()) {
      this.toastr.warning('Please enter Nodal Name.');
      return;
    }
    if (!row.NodleDesignation?.trim()) {
      this.toastr.warning('Please enter Designation.');
      return;
    }
    if (!row.NodleEmail?.trim()) {
      this.toastr.warning('Please enter Email.');
      return;
    }
    if (!row.NodleMobile?.trim()) {
      this.toastr.warning('Please enter Mobile No.');
      return;
    }
    if (!this.isValidMobile(row.NodleMobile.trim())) {
      this.toastr.warning('Mobile No must start with 5, 6, 7, 8, or 9.');
      return;
    }

    this.loading = true;
    if (row.NodleId > 0) {
      this.api.deleteNodleMaster(row.NodleId).subscribe({
        next: () => {
          this.saveNodle(row);
        },
        error: () => {
          this.saveNodle(row);
        },
      });
    } else {
      this.saveNodle(row);
    }
  }

  deleteNodle(id: number): void {
    if (!confirm('Are you sure you want to delete this nodal officer?')) {
      return;
    }

    this.loading = true;
    this.api.deleteNodleMaster(id).subscribe({
      next: () => {
        this.toastr.success('Nodal officer deleted successfully.');
        this.loadGrid();
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Failed to delete nodal officer.');
      },
    });
  }

  isValidMobile(mob: string): boolean {
    if (!mob || mob.length === 0) return false;
    const first = mob.charAt(0);
    return first >= '5' && first <= '9';
  }

  exportCsv(): void {
    const data = this.dataSource.filteredData;
    if (!data.length) {
      this.toastr.warning('No records to export.');
      return;
    }

    const headers = ['S.No', 'District', 'Location', 'Facility Type', 'Nodal Name', 'Designation', 'Email', 'Mobile', 'Status'];
    const csvRows = [headers.join(',')];

    data.forEach((row, i) => {
      const isAssigned = row.NodleId > 0 || Boolean(row.NodleName && row.NodleName.trim().length > 0);
      const csvRow = [
        i + 1,
        `"${(row.DistrictName || '').replace(/"/g, '""')}"`,
        `"${(row.LocationName || '').replace(/"/g, '""')}"`,
        `"${(row.FacilityTypeName || '').replace(/"/g, '""')}"`,
        `"${(row.NodleName || '').replace(/"/g, '""')}"`,
        `"${(row.NodleDesignation || '').replace(/"/g, '""')}"`,
        `"${(row.NodleEmail || '').replace(/"/g, '""')}"`,
        `"${(row.NodleMobile || '').replace(/"/g, '""')}"`,
        `"${isAssigned ? 'Assigned' : 'Pending'}"`,
      ];
      csvRows.push(csvRow.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Health_Facilities_Nodal_Officers_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    this.toastr.info('Exported CSV file successfully.');
  }
}
