import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { MasterApiService } from '../../../service/master-api.service';

@Component({
  selector: 'app-dhs-add-facility',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './dhs-add-facility.component.html',
  styleUrls: ['./dhs-add-facility.component.css'],
})
export class DhsAddFacilityComponent implements OnInit {
  loading = false;
  saving = false;
  emailId = '';

  locationId = 0;
  districtId = 0;
  facilityTypeId = 0;

  locationName = '';
  districtName = '';
  facilityTypeName = '';

  constructor(
    private readonly api: MasterApiService,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.locationId = Number(this.route.snapshot.queryParams['locationId']) || 0;
    this.districtId = Number(this.route.snapshot.queryParams['districtId']) || 0;
    this.facilityTypeId = Number(this.route.snapshot.queryParams['facilityTypeId']) || 0;

    this.loadHeaderInfo();
  }

  loadHeaderInfo(): void {
    this.loading = true;

    this.api.getFacilityTypes(0).subscribe({
      next: (res) => {
        const ft = res.find((f) => f.FacilityTypeId === this.facilityTypeId);
        this.facilityTypeName = ft ? ft.FacilityTypeName : '';
      },
    });

    this.api.getDistricts().subscribe({
      next: (res) => {
        const d = res.find((r) => r.DP_DistrictID === this.districtId);
        this.districtName = d ? d.DBStart_Name_En : '';
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  save(): void {
    if (!this.emailId.trim()) {
      this.toastr.warning('Please enter an email address.');
      return;
    }

    this.saving = true;
    this.api.addFacilityUser(this.locationId, this.emailId.trim()).subscribe({
      next: () => {
        this.toastr.success('Facility user added successfully.');
        this.saving = false;
        this.router.navigate(['/DHSFacilityUsersLocations']);
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(err?.error?.message ?? 'Failed to add facility user.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/DHSFacilityUsersLocations']);
  }
}
