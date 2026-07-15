import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { NewOpeningStockEntryComponent } from '../new-opening-stock-entry/new-opening-stock-entry.component';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';

interface MainEquipmentType {
  Pid: number;
  PItemName: string;
}

interface OpeningStockRow {
  ExistingItemId: number;
  Pid: number;
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
  selector: 'app-opening-stock-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, NewOpeningStockEntryComponent, DmePageSkeletonComponent],
  templateUrl: './opening-stock-entry.component.html',
  styleUrls: ['./opening-stock-entry.component.css'],
})
export class OpeningStockEntryComponent implements OnInit, OnDestroy {
  private readonly apiRoot = `${environment.apiUrl}/DMEStock/`;

  equipmentTypes: MainEquipmentType[] = [];
  /** Full dataset for this DME user (loaded once; filter applied locally). */
  allRows: OpeningStockRow[] = [];
  rows: OpeningStockRow[] = [];

  selectedPid = 0;
  loading = false;
  userId = 0;

  showFormModal = false;
  formEditItemId = 0;
  /** Bumps so embedded form remounts cleanly each open. */
  formInstanceKey = 0;

  get hasActiveFilter(): boolean {
    return this.selectedPid > 0;
  }

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = this.resolveUserId();
    this.loadEquipmentTypes();
    this.loadAllData();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('emis-modal-open');
  }

  onEquipmentChange(): void {
    this.applyFilter();
  }

  clearFilters(): void {
    this.selectedPid = 0;
    this.applyFilter();
  }

  addNew(): void {
    this.formEditItemId = 0;
    this.formInstanceKey += 1;
    this.showFormModal = true;
    document.body.classList.add('emis-modal-open');
  }

  editRow(row: OpeningStockRow): void {
    this.formEditItemId = row.ExistingItemId;
    this.formInstanceKey += 1;
    this.showFormModal = true;
    document.body.classList.add('emis-modal-open');
  }

  closeFormModal(): void {
    this.showFormModal = false;
    document.body.classList.remove('emis-modal-open');
  }

  onFormSaved(): void {
    this.closeFormModal();
    this.loadAllData();
  }

  /** Always fetches full opening stock for this user; filter is optional client-side. */
  loadAllData(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }

    this.loading = true;
    this.http.get<OpeningStockRow[]>(`${this.apiRoot}opening-stock?userId=${this.userId}`).subscribe({
      next: (res) => {
        this.allRows = this.mapRows(res);
        this.applyFilter();
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.allRows = [];
        this.rows = [];
        this.toastr.error(this.apiError(e, 'Could not load opening stock.'));
      },
    });
  }

  private applyFilter(): void {
    this.rows =
      this.selectedPid > 0 ? this.allRows.filter((r) => r.Pid === this.selectedPid) : [...this.allRows];
  }

  private loadEquipmentTypes(): void {
    this.http.get<MainEquipmentType[]>(`${this.apiRoot}main-equipment-types`).subscribe({
      next: (res) => {
        this.equipmentTypes = [
          { Pid: 0, PItemName: 'All Equipment Types' },
          ...this.mapTypes(res),
        ];
      },
      error: (e) => this.toastr.error(this.apiError(e, 'Could not load equipment types.')),
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

  private mapRows(raw: unknown): OpeningStockRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      ExistingItemId: Number(r['ExistingItemId'] ?? r['existingItemId'] ?? 0),
      Pid: Number(r['Pid'] ?? r['pid'] ?? 0),
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
