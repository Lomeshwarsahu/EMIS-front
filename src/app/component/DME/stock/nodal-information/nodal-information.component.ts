import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

interface NodalInfoRow {
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
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './nodal-information.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './nodal-information.component.css'],
})
export class NodalInformationComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEStock/`;

  rows: NodalInfoRow[] = [];
  loading = false;
  saving = false;
  userId = 0;

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
        this.rows = this.mapRows(res);
        this.rows.push({} as NodalInfoRow);
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load nodal officer information.'));
      },
    });
  }

  addRow(): void {
    const last = this.rows[this.rows.length - 1];
    if (last && last.isNew) {
      this.toastr.warning('Please save the current entry first.');
      return;
    }
    const newRow: NodalInfoRow = {
      LocationId: 0,
      LocationName: '',
      FacilityTypeName: '',
      DistrictName: '',
      DistrictId: 0,
      FacilityTypeId: 0,
      UserId: 0,
      Id: 0,
      Name: '',
      Designation: '',
      MobileNo: '',
      EmailId: '',
      isNew: true,
    };
    this.rows.push(newRow);
  }

  saveNew(row: NodalInfoRow): void {
    if (!row.UserId) {
      this.toastr.warning('User id missing for this facility.');
      return;
    }
    if (!row.Name || !row.Designation || !row.EmailId || !row.MobileNo) {
      this.toastr.warning('Fill Name, Designation, Emailid, Mobile NO.');
      return;
    }
    this.saving = true;
    this.http
      .post<{ message?: string }>(`${this.apiRoot}nodal-information`, {
        userId: row.UserId,
        name: row.Name,
        designation: row.Designation,
        emailId: row.EmailId,
        mobileNo: row.MobileNo,
      })
      .subscribe({
        next: (res) => {
          this.toastr.success(res?.message ?? 'Save Successfully');
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
    if (!row.Id) {
      this.toastr.warning('No record to delete.');
      return;
    }
    if (!confirm('Are you sure, you want to delete?')) {
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

  private mapRows(raw: unknown): NodalInfoRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      LocationId: Number(r['LocationId'] ?? r['locationId'] ?? 0),
      LocationName: String(r['LocationName'] ?? r['locationName'] ?? ''),
      FacilityTypeName: String(r['FacilityTypeName'] ?? r['facilityTypeName'] ?? ''),
      DistrictName: String(r['DistrictName'] ?? r['districtName'] ?? ''),
      DistrictId: Number(r['DistrictId'] ?? r['districtId'] ?? 0),
      FacilityTypeId: Number(r['FacilityTypeId'] ?? r['facilityTypeId'] ?? 0),
      UserId: Number(r['UserId'] ?? r['userId'] ?? 0),
      Id: Number(r['Id'] ?? r['id'] ?? 0),
      Name: String(r['Name'] ?? r['name'] ?? ''),
      Designation: String(r['Designation'] ?? r['designation'] ?? ''),
      MobileNo: String(r['MobileNo'] ?? r['mobileNo'] ?? ''),
      EmailId: String(r['EmailId'] ?? r['emailId'] ?? ''),
      isNew: false,
    }));
  }
}
