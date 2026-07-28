import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { MasterApiService } from '../../../service/master-api.service';
import {
  DistrictDto,
  FacilityTypeDto,
  DHSFacilityGridDto,
} from '../../../Model/models';

@Component({
  selector: 'app-dhs-facility-users-locations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './dhs-facility-users-locations.component.html',
  styleUrls: ['./dhs-facility-users-locations.component.css'],
})
export class DhsFacilityUsersLocationsComponent implements OnInit {
  loading = false;
  districts: DistrictDto[] = [];
  facilityTypes: FacilityTypeDto[] = [];
  selectedDistrictId = 0;
  selectedFacilityTypeId = 0;
  dataSource = new MatTableDataSource<DHSFacilityGridDto>([]);
  displayedColumns = ['sno', 'locationName', 'district', 'emailId', 'userId', 'action'];

  @ViewChild('sort') sort!: MatSort;

  constructor(
    private readonly api: MasterApiService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.api.getDistricts().subscribe({
      next: (res) => (this.districts = res),
      error: () => this.toastr.error('Failed to load districts.'),
    });

    this.api.getFacilityTypes(5).subscribe({
      next: (res) => (this.facilityTypes = res),
      error: () => this.toastr.error('Failed to load facility types.'),
    });
  }

  loadGrid(): void {
    if (!this.selectedDistrictId) {
      this.toastr.warning('Please select a district.');
      return;
    }
    if (!this.selectedFacilityTypeId) {
      this.toastr.warning('Please select a facility type.');
      return;
    }

    this.loading = true;
    this.api
      .getDHSFacilityGrid(this.selectedFacilityTypeId, this.selectedDistrictId)
      .subscribe({
        next: (res) => {
          this.dataSource.data = res;
          setTimeout(() => (this.dataSource.sort = this.sort));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toastr.error('Failed to load facility grid.');
        },
      });
  }

  addFacility(locationId: number): void {
    this.router.navigate(['/DHSAddFacility'], {
      queryParams: {
        locationId,
        districtId: this.selectedDistrictId,
        facilityTypeId: this.selectedFacilityTypeId,
      },
    });
  }
}
