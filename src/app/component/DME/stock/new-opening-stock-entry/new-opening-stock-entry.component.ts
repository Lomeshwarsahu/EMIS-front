import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';

interface OptionItem {
  id: number;
  label: string;
}

@Component({
  selector: 'app-new-opening-stock-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-opening-stock-entry.component.html',
  styleUrls: ['./new-opening-stock-entry.component.css'],
})
export class NewOpeningStockEntryComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEStock/`;

  /** When true, form is shown inside Opening Stock Reports popup (no route navigation). */
  @Input() embedded = false;
  @Input() editExistingItemId = 0;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  userId = 0;
  existingItemId = 0;
  isEdit = false;
  saving = false;
  isBulkEntry = false;
  showOtherLocation = false;
  showAmcFields = false;

  pageTitle = 'Opening Stock Entry';
  saveLabel = 'Save';

  equipmentTypes: OptionItem[] = [];
  equipmentItems: OptionItem[] = [];
  supplySources: OptionItem[] = [];
  wards: OptionItem[] = [];

  selectedPid = 0;
  selectedItemId = 0;
  selectedSupId = 0;
  selectedWardId = 0;

  make = '';
  model = '';
  serialNo = '';
  qty = 1;
  receiptDate = '';
  installationDate = '';
  warrantyYear: number | null = null;
  warrantyUpto = '';
  installLocationOther = '';
  amcFlag = 'N';
  amcValidDate = '';
  amcFirm = '';
  workingStatus = '';
  remarks = '';

  warrantyYears = [0, 1, 2, 3, 4, 5];

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = this.resolveUserId();

    if (this.embedded) {
      this.existingItemId = Number(this.editExistingItemId || 0);
      this.isEdit = this.existingItemId > 0;
    } else {
      this.existingItemId = Number(this.route.snapshot.queryParamMap.get('existingItemId') ?? 0);
      this.isEdit = this.route.snapshot.queryParamMap.get('mode') === 'Edit' && this.existingItemId > 0;
    }

    if (this.isEdit) {
      this.pageTitle = 'Updation of Existing Equipment';
      this.saveLabel = 'Update';
    }

    this.loadLookups();
    if (this.isEdit) {
      this.loadDetail();
    }
  }

  onMainEquipmentChange(): void {
    this.selectedItemId = 0;
    this.equipmentItems = [];
    this.isBulkEntry = false;
    if (this.selectedPid > 0) {
      this.loadEquipmentItems();
      this.loadBulkFlag();
    }
  }

  onWardChange(): void {
    this.showOtherLocation = this.selectedWardId === 30;
    if (!this.showOtherLocation) {
      this.installLocationOther = '';
    }
  }

  onAmcChange(): void {
    this.showAmcFields = this.amcFlag === 'Y';
    if (!this.showAmcFields) {
      this.amcValidDate = '';
      this.amcFirm = '';
    }
  }

  onInstallationDateChange(): void {
    this.warrantyYear = null;
    this.warrantyUpto = '';
  }

  onWarrantyYearChange(): void {
    if (!this.installationDate) {
      this.toastr.warning('Please select installation date first.');
      this.warrantyYear = null;
      return;
    }
    if (this.warrantyYear === null || this.warrantyYear === undefined) {
      this.warrantyUpto = '';
      return;
    }
    const install = new Date(this.installationDate);
    if (Number.isNaN(install.getTime())) {
      return;
    }
    if (this.warrantyYear === 0) {
      this.warrantyUpto = this.installationDate;
      return;
    }
    const warranty = new Date(install);
    warranty.setFullYear(warranty.getFullYear() + this.warrantyYear);
    warranty.setDate(warranty.getDate() - 1);
    this.warrantyUpto = warranty.toISOString().slice(0, 10);
  }

  save(): void {
    if (!this.userId) {
      this.toastr.error('Please login again.');
      return;
    }

    this.saving = true;
    const payload = {
      userId: this.userId,
      existingItemId: this.isEdit ? this.existingItemId : null,
      pid: this.selectedPid,
      itemId: this.selectedItemId,
      supId: this.selectedSupId,
      make: this.make,
      model: this.model,
      serialNo: this.serialNo,
      qty: this.isBulkEntry ? this.qty : null,
      receiptDate: this.receiptDate || null,
      installationDate: this.installationDate || null,
      warrantyYear: this.warrantyYear,
      warrantyUpto: this.warrantyUpto || null,
      wardId: this.selectedWardId,
      installLocationOther: this.installLocationOther,
      amcFlag: this.amcFlag,
      amcValidDate: this.amcValidDate || null,
      amcFirm: this.amcFirm,
      workingStatus: this.workingStatus,
      remarks: this.remarks,
    };

    const request$ = this.isEdit
      ? this.http.put<{ message: string }>(`${this.apiRoot}opening-stock/${this.existingItemId}`, payload)
      : this.http.post<{ message: string }>(`${this.apiRoot}opening-stock`, payload);

    request$.subscribe({
      next: (res) => {
        this.saving = false;
        this.toastr.success(res?.message ?? 'Saved successfully');
        if (this.embedded) {
          this.saved.emit();
        } else {
          void this.router.navigate(['/stock/opening-stock-entry']);
        }
      },
      error: (e) => {
        this.saving = false;
        this.toastr.error(this.apiError(e, 'Save failed.'));
      },
    });
  }

  back(): void {
    if (this.embedded) {
      this.closed.emit();
      return;
    }
    void this.router.navigate(['/stock/opening-stock-entry']);
  }

  private loadLookups(): void {
    this.http.get<unknown[]>(`${this.apiRoot}main-equipment-types`).subscribe({
      next: (res) => {
        this.equipmentTypes = [
          { id: 0, label: '-Select-' },
          ...this.mapOptions(res, 'Pid', 'pid', 'PItemName', 'pitemname'),
        ];
      },
      error: (e) => this.toastr.error(this.apiError(e, 'Could not load equipment types.')),
    });

    this.http.get<unknown[]>(`${this.apiRoot}supply-sources`).subscribe({
      next: (res) => {
        this.supplySources = [
          { id: 0, label: '-Select-' },
          ...this.mapOptions(res, 'SupId', 'supId', 'Name', 'name'),
        ];
      },
      error: (e) => this.toastr.error(this.apiError(e, 'Could not load supply sources.')),
    });

    this.http.get<unknown[]>(`${this.apiRoot}wards`).subscribe({
      next: (res) => {
        this.wards = [{ id: 0, label: 'select' }, ...this.mapOptions(res, 'WardId', 'wardId', 'WardName', 'wardName')];
      },
      error: (e) => this.toastr.error(this.apiError(e, 'Could not load wards.')),
    });
  }

  private loadEquipmentItems(): void {
    this.http.get<unknown[]>(`${this.apiRoot}equipment-items?pid=${this.selectedPid}`).subscribe({
      next: (res) => {
        this.equipmentItems = [
          { id: 0, label: '-Select-' },
          ...this.mapOptions(res, 'ItemId', 'itemId', 'ItemName', 'itemName'),
        ];
      },
      error: (e) => this.toastr.error(this.apiError(e, 'Could not load equipment items.')),
    });
  }

  private loadBulkFlag(): void {
    this.http.get<{ isBulk?: boolean; IsBulk?: boolean }>(`${this.apiRoot}main-equipment-types/${this.selectedPid}/bulk-entry`).subscribe({
      next: (res) => {
        this.isBulkEntry = Boolean(res?.isBulk ?? res?.IsBulk);
        if (this.isBulkEntry) {
          this.serialNo = 'NA';
        } else if (!this.isEdit) {
          this.serialNo = '';
        }
      },
    });
  }

  private loadDetail(): void {
    this.http.get<Record<string, unknown>>(`${this.apiRoot}opening-stock/${this.existingItemId}?userId=${this.userId}`).subscribe({
      next: (d) => {
        this.selectedPid = Number(d['pid'] ?? d['Pid'] ?? 0);
        this.selectedItemId = Number(d['itemId'] ?? d['ItemId'] ?? 0);
        this.selectedSupId = Number(d['supId'] ?? d['SupId'] ?? 0);
        this.make = String(d['make'] ?? d['Make'] ?? '');
        this.model = String(d['model'] ?? d['Model'] ?? '');
        this.serialNo = String(d['serialNo'] ?? d['SerialNo'] ?? '');
        this.qty = Number(d['qty'] ?? d['Qty'] ?? 1);
        this.receiptDate = String(d['receiptDate'] ?? d['ReceiptDate'] ?? '');
        this.installationDate = String(d['installationDate'] ?? d['InstallationDate'] ?? '');
        this.warrantyYear = d['warrantyYear'] != null || d['WarrantyYear'] != null ? Number(d['warrantyYear'] ?? d['WarrantyYear']) : null;
        this.warrantyUpto = String(d['warrantyUpto'] ?? d['WarrantyUpto'] ?? '');
        this.selectedWardId = Number(d['wardId'] ?? d['WardId'] ?? 0);
        this.installLocationOther = String(d['installLocationOther'] ?? d['InstallLocationOther'] ?? '');
        this.amcFlag = String(d['amcFlag'] ?? d['AmcFlag'] ?? 'N');
        this.amcValidDate = String(d['amcValidDate'] ?? d['AmcValidDate'] ?? '');
        this.amcFirm = String(d['amcFirm'] ?? d['AmcFirm'] ?? '');
        this.workingStatus = String(d['workingStatus'] ?? d['WorkingStatus'] ?? '');
        this.remarks = String(d['remarks'] ?? d['Remarks'] ?? '');
        this.isBulkEntry = Boolean(d['isBulkEntry'] ?? d['IsBulkEntry']);
        this.onWardChange();
        this.onAmcChange();
        if (this.selectedPid > 0) {
          this.loadEquipmentItems();
        }
      },
      error: (e) => this.toastr.error(this.apiError(e, 'Could not load record.')),
    });
  }

  private mapOptions(raw: unknown, idKey1: string, idKey2: string, labelKey1: string, labelKey2?: string): OptionItem[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((row) => {
      const item = row as Record<string, unknown>;
      const id = Number(item[idKey1] ?? item[idKey2] ?? 0);
      const label = String(item[labelKey1] ?? (labelKey2 ? item[labelKey2] : '') ?? '');
      return { id, label };
    });
  }

  private resolveUserId(): number {
    const login = JSON.parse(localStorage.getItem('loginData') || '{}');
    return Number(login.user_id ?? login.userId ?? login.DistId ?? 0);
  }

  private apiError(err: { error?: { message?: string; detail?: string } }, fallback: string): string {
    const detail = err?.error?.detail?.trim();
    const message = err?.error?.message?.trim();
    return detail ? (message ? `${message} (${detail})` : detail) : message || fallback;
  }
}
