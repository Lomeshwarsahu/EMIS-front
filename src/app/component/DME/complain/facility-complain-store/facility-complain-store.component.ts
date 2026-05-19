import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

interface ItemOption {
  ItemId: number;
  ItemName: string;
}

interface TroubleOption {
  TroubleId: number;
  TroubleText: string;
}

interface DepartmentOption {
  ItemDetailId: number;
  Label: string;
}

interface EquipmentDetail {
  LocationId: number;
  LocationName: string;
  SupplierId: number;
  SupplierName: string;
  SupplierMobile: string;
  SupplierEmail: string;
  WarrantyValidDate: string;
}

@Component({
  selector: 'app-facility-complain-store',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facility-complain-store.component.html',
  styleUrls: ['../../shared/legacy-ems-page.css'],
})
export class FacilityComplainStoreComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEComplain/`;

  items: ItemOption[] = [];
  troubles: TroubleOption[] = [];
  departments: DepartmentOption[] = [];

  selectedItemId = 0;
  selectedTroubleId = 0;
  selectedDeptId = 0;
  complainDate = '';
  notFunctionDate = '';
  complainDetails = '';
  selectedFile: File | null = null;

  detail: EquipmentDetail | null = null;
  userId = 0;
  saving = false;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    this.complainDate = this.todayStr();
    this.loadItems();
    this.loadTroubles();
  }

  onItemChange(): void {
    this.selectedDeptId = 0;
    this.detail = null;
    this.departments = [];
    if (!this.selectedItemId) return;
    this.http
      .get<DepartmentOption[]>(
        `${this.apiRoot}departments?userId=${this.userId}&itemId=${this.selectedItemId}`,
      )
      .subscribe({
        next: (res) => (this.departments = this.mapDepts(res)),
        error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load departments.')),
      });
  }

  onDeptChange(): void {
    this.detail = null;
    if (!this.selectedDeptId || !this.selectedItemId) return;
    this.http
      .get<EquipmentDetail>(
        `${this.apiRoot}equipment-detail?userId=${this.userId}&itemId=${this.selectedItemId}&itemDetailId=${this.selectedDeptId}`,
      )
      .subscribe({
        next: (res) => (this.detail = this.mapDetail(res)),
        error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load supplier details.')),
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.selectedFile = null;
      return;
    }
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.toastr.warning('Please upload PDF file only.');
      input.value = '';
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
  }

  sendComplain(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again.');
      return;
    }
    if (!this.selectedItemId || !this.selectedDeptId || !this.selectedTroubleId) {
      this.toastr.warning('Please select Equipment, Department and Problem.');
      return;
    }
    if (!this.notFunctionDate || !this.complainDetails.trim()) {
      this.toastr.warning('Please fill required fields.');
      return;
    }
    if (!this.selectedFile) {
      this.toastr.warning('Please upload PDF signed copy.');
      return;
    }
    if (!this.detail) {
      this.toastr.warning('Select equipment department to load supplier details.');
      return;
    }

    const form = new FormData();
    form.append('UserId', String(this.userId));
    form.append('ItemId', String(this.selectedItemId));
    form.append('ItemDetailId', String(this.selectedDeptId));
    form.append('TroubleId', String(this.selectedTroubleId));
    form.append('LocationId', String(this.detail.LocationId));
    form.append('SupplierId', String(this.detail.SupplierId));
    form.append('ComplainDate', this.complainDate);
    form.append('NotFunctionDate', this.notFunctionDate);
    form.append('ComplainDetails', this.complainDetails.trim());
    form.append('SupplierEmail', this.detail.SupplierEmail);
    form.append('SupplierMobile', this.detail.SupplierMobile);
    form.append('file', this.selectedFile, this.selectedFile.name);

    this.saving = true;
    this.http.post(`${this.apiRoot}facility-complain`, form).subscribe({
      next: (res: { message?: string }) => {
        this.saving = false;
        this.toastr.success(res?.message ?? 'Complain Booked Successfully.');
        this.reset();
      },
      error: (e) => {
        this.saving = false;
        this.toastr.error(apiErrorMessage(e, 'Could not book complaint.'));
      },
    });
  }

  reset(): void {
    this.selectedItemId = 0;
    this.selectedTroubleId = 0;
    this.selectedDeptId = 0;
    this.notFunctionDate = '';
    this.complainDetails = '';
    this.selectedFile = null;
    this.detail = null;
    this.departments = [];
    this.complainDate = this.todayStr();
  }

  private loadItems(): void {
    if (!this.userId) return;
    this.http.get<ItemOption[]>(`${this.apiRoot}items?userId=${this.userId}`).subscribe({
      next: (res) => (this.items = this.mapItems(res)),
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load equipment.')),
    });
  }

  private loadTroubles(): void {
    this.http.get<TroubleOption[]>(`${this.apiRoot}troubles`).subscribe({
      next: (res) => (this.troubles = this.mapTroubles(res)),
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load problems.')),
    });
  }

  private todayStr(): string {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getFullYear()}`;
  }

  private mapItems(raw: unknown): ItemOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return [{ ItemId: 0, ItemName: 'select' }, ...arr.map((r: Record<string, unknown>) => ({
      ItemId: Number(r['ItemId'] ?? r['itemId'] ?? 0),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
    }))];
  }

  private mapTroubles(raw: unknown): TroubleOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return [{ TroubleId: 0, TroubleText: 'select' }, ...arr.map((r: Record<string, unknown>) => ({
      TroubleId: Number(r['TroubleId'] ?? r['troubleId'] ?? 0),
      TroubleText: String(r['TroubleText'] ?? r['troubleText'] ?? ''),
    }))];
  }

  private mapDepts(raw: unknown): DepartmentOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return [{ ItemDetailId: 0, Label: 'select' }, ...arr.map((r: Record<string, unknown>) => ({
      ItemDetailId: Number(r['ItemDetailId'] ?? r['itemDetailId'] ?? 0),
      Label: String(r['Label'] ?? r['label'] ?? ''),
    }))];
  }

  private mapDetail(raw: unknown): EquipmentDetail {
    const r = (raw ?? {}) as Record<string, unknown>;
    return {
      LocationId: Number(r['LocationId'] ?? r['locationId'] ?? 0),
      LocationName: String(r['LocationName'] ?? r['locationName'] ?? '---'),
      SupplierId: Number(r['SupplierId'] ?? r['supplierId'] ?? 0),
      SupplierName: String(r['SupplierName'] ?? r['supplierName'] ?? '---'),
      SupplierMobile: String(r['SupplierMobile'] ?? r['supplierMobile'] ?? '---'),
      SupplierEmail: String(r['SupplierEmail'] ?? r['supplierEmail'] ?? '---'),
      WarrantyValidDate: String(r['WarrantyValidDate'] ?? r['warrantyValidDate'] ?? '---'),
    };
  }
}
