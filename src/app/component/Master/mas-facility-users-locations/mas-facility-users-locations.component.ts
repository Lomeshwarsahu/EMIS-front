import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import {
  DistrictDto,
  FacilityTypeDto,
  MedFacilityGridDto,
  MedicalCollegeUserDto,
} from '../../../Model/models';
import { MasterApiService } from '../../../service/master-api.service';

@Component({
  selector: 'app-mas-facility-users-locations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './mas-facility-users-locations.component.html',
  styleUrls: ['./mas-facility-users-locations.component.css'],
})
export class MasFacilityUsersLocationsComponent implements OnInit {
  loading = false;
  saving = false;
  showForm = false;

  authorityId = 0;
  facilityTypeId = 0;

  districts: DistrictDto[] = [];
  medicalUsers: MedicalCollegeUserDto[] = [];
  facilityTypes: FacilityTypeDto[] = [];

  selectedDistrictId = 0;
  selectedMedicalUserId = 0;

  dataSource = new MatTableDataSource<MedFacilityGridDto>([]);
  displayedColumns = ['sno', 'locationName', 'district', 'emailId', 'userId'];

  formData = {
    LocationName: '',
    Address1: '',
    Address2: '',
    Address3: '',
    MobileNo: '',
    ContactPerson: '',
    EmailId: '',
  };

  @ViewChild('sort') sort!: MatSort;

  constructor(
    private readonly api: MasterApiService,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.authorityId = Number(this.route.snapshot.queryParams['DID']) || 0;
    this.facilityTypeId = Number(this.route.snapshot.queryParams['FTID']) || 0;

    this.api.getDistricts().subscribe((res) => (this.districts = res));

    if (this.authorityId === 12) {
      this.api.getMedicalCollegeUsers().subscribe((res) => (this.medicalUsers = res));
    }

    this.api.getFacilityTypes(this.facilityTypeId).subscribe((res) => (this.facilityTypes = res));
  }

  loadGrid(): void {
    if (this.authorityId === 12 && this.selectedMedicalUserId === 0) {
      this.toastr.warning('Please select a Medical College User');
      return;
    }
    if (this.authorityId !== 12 && this.selectedDistrictId === 0) {
      this.toastr.warning('Please select a District');
      return;
    }

    this.loading = true;
    this.api
      .getMedFacilityGrid(
        this.facilityTypeId,
        this.authorityId,
        this.selectedDistrictId,
        this.selectedMedicalUserId,
      )
      .subscribe({
        next: (res) => {
          this.dataSource.data = res;
          setTimeout(() => (this.dataSource.sort = this.sort));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toastr.error('Failed to load grid.');
        },
      });
  }

  save(): void {
    const d = this.formData;
    if (
      !d.LocationName ||
      !d.Address1 ||
      !d.MobileNo ||
      !d.EmailId
    ) {
      this.toastr.warning('Please Enter Location Name/Address1/Mobile No/Email');
      return;
    }

    this.saving = true;
    this.api
      .addMedFacility({
        LocationName: d.LocationName,
        DistrictId: this.authorityId === 12 ? 0 : this.selectedDistrictId,
        FacilityTypeId: this.facilityTypeId,
        Authority: this.authorityId,
        UserId: this.authorityId === 12 ? this.selectedMedicalUserId : 0,
        Address1: d.Address1,
        Address2: d.Address2,
        Address3: d.Address3,
        MobileNo: d.MobileNo,
        ContactPerson: d.ContactPerson,
        EmailId: d.EmailId,
      })
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.resetForm();
          this.loadGrid();
          this.saving = false;
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(err?.error?.message ?? 'Failed to save.');
        },
      });
  }

  resetForm(): void {
    this.formData = {
      LocationName: '',
      Address1: '',
      Address2: '',
      Address3: '',
      MobileNo: '',
      ContactPerson: '',
      EmailId: '',
    };
    this.showForm = false;
  }
}
