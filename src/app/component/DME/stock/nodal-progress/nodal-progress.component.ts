import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

interface MainEquipmentType {
  Pid: number;
  PItemName: string;
}

interface NodalProgressRow {
  ExistingItemId: number;
  ItemName: string;
  ItemCode: string;
  Location: number;
  Make: string;
  ModelNo: string;
  InstallationDate?: string;
  WarrantyUpto?: string;
  MakeSerialNo: string;
  InstallLocation: string;
  SuppliedFrom: string;
  ReceiptDate?: string;
  checked: boolean;
  workingStatus: 'Y' | 'N';
  remark: string;
}

@Component({
  selector: 'app-nodal-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './nodal-progress.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './nodal-progress.component.css'],
})
export class NodalProgressComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEStock/`;

  equipmentTypes: MainEquipmentType[] = [];
  rows: NodalProgressRow[] = [];

  selectedPid = 0;
  loading = false;
  saving = false;
  sendingOtp = false;
  userId = 0;
  isDme = false;

  week = 1;
  month = 1;
  monthLabel = '';

  otpSent = false;
  otp = '';
  agreed = false;
  workingStatus: 'Y' | 'N' = 'Y';
  remark = '';

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    this.route.queryParamMap.subscribe((params) => {
      this.isDme = params.get('dme') === 'true';
    });
    const now = new Date();
    this.month = now.getMonth() + 1;
    this.week = Math.ceil(now.getDate() / 7);
    this.monthLabel = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
    this.loadEquipmentTypes();
  }

  onEquipmentChange(): void {
    if (!this.selectedPid) {
      return;
    }
    this.loadProgress();
  }

  loadProgress(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }
    this.loading = true;
    this.http
      .get<NodalProgressRow[]>(
        `${this.apiRoot}nodal-progress?userId=${this.userId}&pid=${this.selectedPid}&isDme=${this.isDme}`,
      )
      .subscribe({
        next: (res) => {
          this.rows = this.mapRows(res);
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.rows = [];
          this.toastr.error(apiErrorMessage(e, 'Could not load equipment checklist.'));
        },
      });
  }

  toggleAll(): void {
    const allChecked = this.rows.length > 0 && this.rows.every((r) => r.checked);
    this.rows.forEach((r) => (r.checked = !allChecked));
  }

  allChecked(): boolean {
    return this.rows.length > 0 && this.rows.every((r) => r.checked);
  }

  someChecked(): boolean {
    return this.rows.some((r) => r.checked);
  }

  sendOtp(): void {
    if (!this.userId) {
      return;
    }
    this.sendingOtp = true;
    this.http
      .post<{ message?: string }>(`${this.apiRoot}nodal-progress/send-otp`, {
        userId: this.userId,
      })
      .subscribe({
        next: (res) => {
          this.sendingOtp = false;
          this.otpSent = true;
          this.toastr.success(res?.message ?? 'OTP sent successfully.');
        },
        error: (e) => {
          this.sendingOtp = false;
          this.toastr.error(apiErrorMessage(e, 'Could not send OTP.'));
        },
      });
  }

  save(): void {
    if (!this.agreed) {
      this.toastr.warning('Please accept the declaration before saving.');
      return;
    }
    if (!this.otpSent) {
      this.toastr.warning('Please send OTP and verify before saving.');
      return;
    }
    const selected = this.rows.filter((r) => r.checked);
    if (!selected.length) {
      this.toastr.warning('Select at least one equipment row.');
      return;
    }
    if (this.workingStatus === 'N' && !this.remark.trim()) {
      this.toastr.warning('Please enter remark when marking Not Working.');
      return;
    }
    selected.forEach((r) => {
      r.workingStatus = this.workingStatus;
      r.remark = this.remark.trim();
    });
    this.saving = true;
    this.http
      .post<{ message?: string }>(`${this.apiRoot}nodal-progress`, {
        userId: this.userId,
        isDme: this.isDme,
        week: this.week,
        month: this.month,
        items: selected.map((r) => ({
          existingItemId: r.ExistingItemId,
          status: r.workingStatus,
          remark: r.remark,
        })),
      })
      .subscribe({
        next: (res) => {
          this.toastr.success(res?.message ?? 'Record Saved Successfully');
          this.saving = false;
          this.otpSent = false;
          this.otp = '';
          this.agreed = false;
          this.loadProgress();
        },
        error: (e) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not save progress.'));
        },
      });
  }

  private loadEquipmentTypes(): void {
    this.http.get<MainEquipmentType[]>(`${this.apiRoot}main-equipment-types`).subscribe({
      next: (res) => {
        this.equipmentTypes = [
          { Pid: 0, PItemName: 'Select Equipment' },
          ...this.mapTypes(res),
        ];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load equipment list.')),
    });
  }

  private mapTypes(raw: unknown): MainEquipmentType[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      Pid: Number(r['Pid'] ?? r['pid'] ?? 0),
      PItemName: String(r['PItemName'] ?? r['pItemName'] ?? ''),
    }));
  }

  private mapRows(raw: unknown): NodalProgressRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      ExistingItemId: Number(r['ExistingItemId'] ?? r['existingItemId'] ?? 0),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      ItemCode: String(r['ItemCode'] ?? r['itemCode'] ?? ''),
      Location: Number(r['Location'] ?? r['location'] ?? 0),
      Make: String(r['Make'] ?? r['make'] ?? ''),
      ModelNo: String(r['ModelNo'] ?? r['modelNo'] ?? ''),
      InstallationDate: this.optStr(r['InstallationDate'] ?? r['installationDate']),
      WarrantyUpto: this.optStr(r['WarrantyUpto'] ?? r['warrantyUpto']),
      MakeSerialNo: String(r['MakeSerialNo'] ?? r['makeSerialNo'] ?? ''),
      InstallLocation: String(r['InstallLocation'] ?? r['installLocation'] ?? ''),
      SuppliedFrom: String(r['SuppliedFrom'] ?? r['suppliedFrom'] ?? ''),
      ReceiptDate: this.optStr(r['ReceiptDate'] ?? r['receiptDate']),
      checked: false,
      workingStatus: 'Y',
      remark: '',
    }));
  }

  private optStr(v: unknown): string | undefined {
    if (v === null || v === undefined || v === '') {
      return undefined;
    }
    return String(v);
  }
}
