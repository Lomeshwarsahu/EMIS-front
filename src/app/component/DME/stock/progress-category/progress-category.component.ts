import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

interface MainEquipmentType {
  Pid: number;
  PItemName: string;
}

interface ProgressMonthYear {
  Id: number;
  MonthYear: string;
}

interface ProgressCategoryRow {
  PItemName: string;
  ItemName: string;
  ItemCode: string;
  ExistingItemId: number;
  Location: number;
  ItemId: number;
  Make: string;
  ModelNo: string;
  InstallationDate?: string;
  WarrantyUpto?: string;
  MakeSerialNo: string;
  Supplied: string;
  InstallLocation: string;
  SuppliedFrom: string;
  SupId: number;
  ReceiptDate?: string;
  Week1: string;
  Week2: string;
  Week3: string;
  Week4: string;
}

@Component({
  selector: 'app-progress-category',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './progress-category.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './progress-category.component.css'],
})
export class ProgressCategoryComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEStock/`;

  equipmentTypes: MainEquipmentType[] = [];
  monthYears: ProgressMonthYear[] = [];

  selectedPid = 0;
  selectedMonthYear = 0;

  rows: ProgressCategoryRow[] = [];
  loading = false;
  hasSearched = false;
  userId = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    this.loadEquipmentTypes();
    this.loadMonthYears();
  }

  onEquipmentChange(): void {
    this.loadProgress();
  }

  onMonthYearChange(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }
    if (!this.selectedPid) {
      return;
    }

    this.loading = true;
    const monthParam = this.selectedMonthYear > 0 ? `&monthYearId=${this.selectedMonthYear}` : '';
    this.http
      .get<ProgressCategoryRow[]>(
        `${this.apiRoot}progress-category?userId=${this.userId}&pid=${this.selectedPid}${monthParam}`,
      )
      .subscribe({
        next: (res) => {
          this.rows = this.mapRows(res);
          this.hasSearched = true;
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.rows = [];
          this.hasSearched = true;
          this.toastr.error(apiErrorMessage(e, 'Could not load progress report.'));
        },
      });
  }

  private loadEquipmentTypes(): void {
    this.http.get<MainEquipmentType[]>(`${this.apiRoot}main-equipment-types`).subscribe({
      next: (res) => {
        this.equipmentTypes = [
          { Pid: 0, PItemName: 'Select Equipment Category' },
          ...this.mapTypes(res),
        ];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load equipment list.')),
    });
  }

  private loadMonthYears(): void {
    this.http.get<ProgressMonthYear[]>(`${this.apiRoot}progress-month-years`).subscribe({
      next: (res) => {
        this.monthYears = [
          { Id: 0, MonthYear: 'Select Month/Year' },
          ...this.mapMonthYears(res),
        ];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load month/year list.')),
    });
  }

  private mapTypes(raw: unknown): MainEquipmentType[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      Pid: Number(r['Pid'] ?? r['pid'] ?? 0),
      PItemName: String(r['PItemName'] ?? r['pItemName'] ?? ''),
    }));
  }

  private mapMonthYears(raw: unknown): ProgressMonthYear[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      Id: Number(r['Id'] ?? r['id'] ?? 0),
      MonthYear: String(r['MonthYear'] ?? r['monthYear'] ?? ''),
    }));
  }

  private mapRows(raw: unknown): ProgressCategoryRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      PItemName: String(r['PItemName'] ?? r['pItemName'] ?? ''),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      ItemCode: String(r['ItemCode'] ?? r['itemCode'] ?? ''),
      ExistingItemId: Number(r['ExistingItemId'] ?? r['existingItemId'] ?? 0),
      Location: Number(r['Location'] ?? r['location'] ?? 0),
      ItemId: Number(r['ItemId'] ?? r['itemId'] ?? 0),
      Make: String(r['Make'] ?? r['make'] ?? ''),
      ModelNo: String(r['ModelNo'] ?? r['modelNo'] ?? ''),
      InstallationDate: this.optStr(r['InstallationDate'] ?? r['installationDate']),
      WarrantyUpto: this.optStr(r['WarrantyUpto'] ?? r['warrantyUpto']),
      MakeSerialNo: String(r['MakeSerialNo'] ?? r['makeSerialNo'] ?? ''),
      Supplied: String(r['Supplied'] ?? r['supplied'] ?? ''),
      InstallLocation: String(r['InstallLocation'] ?? r['installLocation'] ?? ''),
      SuppliedFrom: String(r['SuppliedFrom'] ?? r['suppliedFrom'] ?? ''),
      SupId: Number(r['SupId'] ?? r['supId'] ?? 0),
      ReceiptDate: this.optStr(r['ReceiptDate'] ?? r['receiptDate']),
      Week1: String(r['Week1'] ?? r['week1'] ?? ''),
      Week2: String(r['Week2'] ?? r['week2'] ?? ''),
      Week3: String(r['Week3'] ?? r['week3'] ?? ''),
      Week4: String(r['Week4'] ?? r['week4'] ?? ''),
    }));
  }

  private optStr(v: unknown): string | undefined {
    if (v === null || v === undefined || v === '') {
      return undefined;
    }
    return String(v);
  }
}
