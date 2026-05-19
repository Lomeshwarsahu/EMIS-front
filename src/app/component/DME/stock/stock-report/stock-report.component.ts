import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';

interface MainEquipmentType {
  Pid: number;
  PItemName: string;
}

interface CovidStockRow {
  ExistingItemId: number;
  ItemName: string;
  ItemCode: string;
  MakeSerialNo: string;
  Make: string;
  ModelNo: string;
  InstallLocation: string;
  ReceiptDate?: string;
  InstallationDate?: string;
  WarrantyUpto?: string;
  SuppliedFrom: string;
  Remarks: string;
}

@Component({
  selector: 'app-stock-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-report.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css', './stock-report.component.css'],
})
export class StockReportComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEStock/`;

  equipmentTypes: MainEquipmentType[] = [];
  rows: CovidStockRow[] = [];

  selectedPid = 0;
  filterType: 'All' | 'OR' | 'RI' = 'All';
  loading = false;
  userId = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = this.resolveUserId();
    this.loadEquipmentTypes();
  }

  showDetails(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }

    this.loading = true;
    const pidParam = this.selectedPid > 0 ? `&pid=${this.selectedPid}` : '';
    this.http
      .get<CovidStockRow[]>(
        `${this.apiRoot}covid-stock?userId=${this.userId}&filterType=${this.filterType}${pidParam}`,
      )
      .subscribe({
        next: (res) => {
          this.rows = this.mapRows(res);
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.rows = [];
          this.toastr.error(this.apiError(e, 'Could not load stock details.'));
        },
      });
  }

  private loadEquipmentTypes(): void {
    this.http.get<MainEquipmentType[]>(`${this.apiRoot}main-equipment-types`).subscribe({
      next: (res) => {
        this.equipmentTypes = [
          { Pid: 0, PItemName: 'All Equipment' },
          ...this.mapTypes(res),
        ];
      },
      error: (e) => this.toastr.error(this.apiError(e, 'Could not load equipment list.')),
    });
  }

  private resolveUserId(): number {
    const login = JSON.parse(localStorage.getItem('loginData') || '{}');
    return Number(login.user_id ?? login.userId ?? login.DistId ?? 0);
  }

  private mapTypes(raw: unknown): MainEquipmentType[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      Pid: Number(r['Pid'] ?? r['pid'] ?? 0),
      PItemName: String(r['PItemName'] ?? r['pItemName'] ?? ''),
    }));
  }

  private mapRows(raw: unknown): CovidStockRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      ExistingItemId: Number(r['ExistingItemId'] ?? r['existingItemId'] ?? 0),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      ItemCode: String(r['ItemCode'] ?? r['itemCode'] ?? ''),
      MakeSerialNo: String(r['MakeSerialNo'] ?? r['makeSerialNo'] ?? ''),
      Make: String(r['Make'] ?? r['make'] ?? ''),
      ModelNo: String(r['ModelNo'] ?? r['modelNo'] ?? ''),
      InstallLocation: String(r['InstallLocation'] ?? r['installLocation'] ?? ''),
      ReceiptDate: r['ReceiptDate'] ?? r['receiptDate'] ? String(r['ReceiptDate'] ?? r['receiptDate']) : undefined,
      InstallationDate: r['InstallationDate'] ?? r['installationDate']
        ? String(r['InstallationDate'] ?? r['installationDate'])
        : undefined,
      WarrantyUpto: r['WarrantyUpto'] ?? r['warrantyUpto'] ? String(r['WarrantyUpto'] ?? r['warrantyUpto']) : undefined,
      SuppliedFrom: String(r['SuppliedFrom'] ?? r['suppliedFrom'] ?? ''),
      Remarks: String(r['Remarks'] ?? r['remarks'] ?? ''),
    }));
  }

  private apiError(err: { error?: { message?: string; detail?: string } }, fallback: string): string {
    const detail = err?.error?.detail?.trim();
    const message = err?.error?.message?.trim();
    return detail ? (message ? `${message} (${detail})` : detail) : message || fallback;
  }
}
