import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { DmePageSkeletonComponent } from '../shared/dme-page-skeleton/dme-page-skeleton.component';

/** Medical College/Hospital contact details (Master/StoreHome.aspx). */
export interface ConsigneeInformationViewModel {
  UserId: number;
  LoginEmail: string;
  DeanName: string;
  DeanMobile: string;
  StoreOfficerName: string;
  StoreOfficerMobile: string;
  OfficeEmail: string;
  OfficeContactNo: string;
  AddressLine1: string;
  AddressLine2: string;
  AddressLine3: string;
}

@Component({
  selector: 'app-consigee-information',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './consigee-information.component.html',
  styleUrls: ['./consigee-information.component.css'],
})
export class ConsigeeInformationComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DME/`;

  loading = false;
  saving = false;

  model: ConsigneeInformationViewModel = {
    UserId: 0,
    LoginEmail: '',
    DeanName: '',
    DeanMobile: '',
    StoreOfficerName: '',
    StoreOfficerMobile: '',
    OfficeEmail: '',
    OfficeContactNo: '',
    AddressLine1: '',
    AddressLine2: '',
    AddressLine3: '',
  };

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const login = JSON.parse(localStorage.getItem('loginData') || '{}');
    const userId = Number(login.user_id ?? login.userId ?? 0);
    const loginEmail = String(
      login.email ?? login.username ?? login.e_mail_id ?? '',
    ).trim();

    if (!userId && !loginEmail) {
      this.toastr.warning('User id missing; please login again.');
      return;
    }

    const url = userId
      ? `${this.apiRoot}consignee/${userId}`
      : `${this.apiRoot}consignee/by-email/${encodeURIComponent(loginEmail)}`;

    this.loading = true;
    this.http.get<Record<string, unknown>>(url).subscribe({
      next: (res) => {
        const mapped = this.mapFromApi(res, userId, loginEmail);
        const missingCore =
          !mapped.DeanName &&
          !mapped.DeanMobile &&
          !mapped.StoreOfficerName &&
          loginEmail;

        if (missingCore && userId) {
          this.loadByEmail(loginEmail, userId);
          return;
        }

        this.model = mapped;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        if (userId && loginEmail) {
          this.loadByEmail(loginEmail, userId);
          return;
        }
        this.toastr.error(e?.error?.message ?? 'Could not load contact details.');
      },
    });
  }

  private loadByEmail(email: string, fallbackUserId: number): void {
    this.http
      .get<Record<string, unknown>>(
        `${this.apiRoot}consignee/by-email/${encodeURIComponent(email)}`,
      )
      .subscribe({
        next: (res) => {
          this.model = this.mapFromApi(res, fallbackUserId, email);
          this.loading = false;
        },
        error: () => {
          this.toastr.error('Could not load contact details.');
        },
      });
  }

  /** API uses PascalCase; Angular HttpClient may surface camelCase — map all variants. */
  private mapFromApi(
    raw: Record<string, unknown>,
    userId: number,
    loginEmail: string,
  ): ConsigneeInformationViewModel {
    const asString = (v: unknown): string => {
      if (v == null) return '';
      if (typeof v === 'string') return v.trim();
      if (typeof v === 'number' || typeof v === 'boolean') return String(v);
      if (Array.isArray(v) && v.length) return String(v[0]);
      if (v && typeof (v as any).toString === 'function') {
        const s = (v as any).toString();
        if (s && s !== '[object Object]') return s.trim();
      }
      return '';
    };

    const pick = (...keys: string[]) => {
      for (const key of keys) {
        const s = asString(raw[key]);
        if (s) return s;
      }
      return '';
    };

    const resolvedUserId = Number(pick('UserId', 'userId', 'user_id')) || userId;

    return {
      UserId: resolvedUserId,
      LoginEmail: pick('LoginEmail', 'loginEmail', 'e_mail_id') || loginEmail,
      DeanName: pick('DeanName', 'deanName', 'HODName', 'hodName'),
      DeanMobile: pick('DeanMobile', 'deanMobile', 'HODNo', 'hodNo'),
      StoreOfficerName: pick(
        'StoreOfficerName',
        'storeOfficerName',
        'storeOfficer',
      ),
      StoreOfficerMobile: pick(
        'StoreOfficerMobile',
        'storeOfficerMobile',
        'storeOfficerMob',
      ),
      OfficeEmail: pick('OfficeEmail', 'officeEmail', 'emailID', 'emailId'),
      OfficeContactNo: pick(
        'OfficeContactNo',
        'officeContactNo',
        'storelandline',
      ),
      AddressLine1: pick('AddressLine1', 'addressLine1', 'user_name'),
      AddressLine2: pick('AddressLine2', 'addressLine2', 'address'),
      AddressLine3: pick('AddressLine3', 'addressLine3', 'address2'),
    };
  }

  private validate(): boolean {
    const required: { key: keyof ConsigneeInformationViewModel; label: string }[] = [
      { key: 'DeanName', label: 'Dean/Superintendent Name' },
      { key: 'DeanMobile', label: 'Dean Mobile No' },
      { key: 'StoreOfficerName', label: 'Store Officer' },
      { key: 'StoreOfficerMobile', label: 'Store Officer Mobile No' },
      { key: 'OfficeEmail', label: 'Email (office)' },
      { key: 'AddressLine1', label: 'Address Line 1' },
      { key: 'AddressLine2', label: 'Address Line 2' },
    ];

    for (const f of required) {
      const v = String(this.model[f.key] ?? '').trim();
      if (!v) {
        this.toastr.warning(`Please enter ${f.label}.`);
        return false;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.model.OfficeEmail.trim())) {
      this.toastr.warning('Please enter a valid office email.');
      return false;
    }

    return true;
  }

  save(): void {
    if (!this.model.UserId) {
      this.toastr.warning('Nothing to save.');
      return;
    }
    if (!this.validate()) {
      return;
    }

    const payload = {
      UserId: this.model.UserId,
      DeanName: this.model.DeanName.trim(),
      DeanMobile: this.model.DeanMobile.trim(),
      StoreOfficerName: this.model.StoreOfficerName.trim(),
      StoreOfficerMobile: this.model.StoreOfficerMobile.trim(),
      OfficeEmail: this.model.OfficeEmail.trim(),
      OfficeContactNo: (this.model.OfficeContactNo ?? '').trim(),
      AddressLine1: this.model.AddressLine1.trim(),
      AddressLine2: this.model.AddressLine2.trim(),
      AddressLine3: (this.model.AddressLine3 ?? '').trim(),
    };

    this.saving = true;
    this.http.put(`${this.apiRoot}consignee`, payload).subscribe({
      next: (res: { message?: string }) => {
        this.saving = false;
        this.toastr.success(res?.message ?? 'Contact Updated Successfully');
        this.load();
      },
      error: (e) => {
        this.saving = false;
        this.toastr.error(e?.error?.message ?? 'Could not save changes.');
      },
    });
  }

  digitsOnly(event: KeyboardEvent): boolean {
    const key = event.key;
    // allow control keys (Backspace, Tab, arrows) and single-digit keys
    if (key.length === 1 && !/\d/.test(key)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
