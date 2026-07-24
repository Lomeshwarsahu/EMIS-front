import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';
import {
  navigateToPoSupply,
  readPoSupplyListFilters,
  type PoSupplyListFilters,
} from '../supplier-po-supply-state.util';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';

interface ExtensionRow {
  extensionId: number;
  remark: string;
  days: number;
  extendedDate: string;
  poEndDate: string;
  hasFile: boolean;
  letterDate: string;
  letterNo: string;
  applyDate: string;
  status: string;
}

@Component({
  selector: 'app-supplier-po-apply-extension',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-po-apply-extension.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './supplier-po-apply-extension.component.css'],
})
export class SupplierPoApplyExtensionComponent implements OnInit {
  loading = false;
  saving = false;
  userId = 0;
  poId = 0;

  equipmentName = '';
  poNo = '';
  poDate = '';
  supplyDays = 0;
  poEndDate = '';
  baseEndDate = '';
  canApply = true;
  hasPendingExtension = false;
  showExtensionForm = false;

  extensionDays: number | null = null;
  extensionDate = '';
  letterDate = '';
  remark = '';
  selectedFile: File | null = null;
  rows: ExtensionRow[] = [];
  returnFilters: PoSupplyListFilters = { financialYearId: 0, tenderId: 0 };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveSupplierUserId();
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
      return;
    }

    this.route.queryParams.subscribe((params) => {
      this.poId = Number(params['poId'] ?? params['POID'] ?? 0);
      this.returnFilters = readPoSupplyListFilters(params);
      if (!this.poId) {
        this.toastr.error('Missing PO id.');
        return;
      }
      this.loadPage();
    });
  }

  onExtensionDaysChange(): void {
    const days = Number(this.extensionDays ?? 0);
    if (!this.baseEndDate || days <= 0) {
      this.extensionDate = '';
      return;
    }
    const base = this.parseDisplayDate(this.baseEndDate);
    if (!base) {
      this.extensionDate = '';
      return;
    }
    const result = new Date(base);
    result.setDate(result.getDate() + days);
    this.extensionDate = this.formatDisplayDate(result);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  openExtensionForm(): void {
    if (!this.canApply) {
      this.toastr.warning('An extension request is already pending for this PO.');
      return;
    }
    this.showExtensionForm = true;
    document.body.classList.add('emis-modal-open');
  }

  closeExtensionForm(): void {
    this.showExtensionForm = false;
    document.body.classList.remove('emis-modal-open');
    this.resetForm();
  }

  loadPage(): void {
    this.loading = true;
    this.api.getSupplierPoExtensionPage(this.userId, this.poId).subscribe({
      next: (raw) => {
        this.loading = false;
        const data = raw as Record<string, unknown>;
        this.equipmentName = String(data['equipmentName'] ?? data['EquipmentName'] ?? '');
        this.poNo = String(data['poNo'] ?? data['PoNo'] ?? '');
        this.poDate = String(data['poDate'] ?? data['PoDate'] ?? '');
        this.supplyDays = Number(data['supplyDays'] ?? data['SupplyDays'] ?? 0);
        this.poEndDate = String(data['poEndDate'] ?? data['PoEndDate'] ?? '');
        this.baseEndDate = String(data['baseEndDate'] ?? data['BaseEndDate'] ?? this.poEndDate);
        this.canApply = Boolean(data['canApply'] ?? data['CanApply']);
        this.hasPendingExtension = Boolean(data['hasPendingExtension'] ?? data['HasPendingExtension']);
        this.rows = this.mapRows((data['extensions'] ?? data['Extensions'] ?? []) as unknown[]);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load extension page.');
      },
    });
  }

  save(): void {
    if (!this.canApply) {
      this.toastr.warning('An extension request is already pending for this PO.');
      return;
    }

    const days = Number(this.extensionDays ?? 0);
    if (!days) {
      this.toastr.warning('Extension Days Should Not be Empty.');
      return;
    }
    if (!this.letterDate.trim()) {
      this.toastr.warning('Letter Date Should Not be Empty.');
      return;
    }
    if (!this.remark.trim()) {
      this.toastr.warning('Remark Should Not be Empty');
      return;
    }
    if (!this.selectedFile) {
      this.toastr.warning('You are not selected any File yet.');
      return;
    }

    const formData = new FormData();
    formData.append('poId', String(this.poId));
    formData.append('extensionDays', String(days));
    formData.append('letterDate', this.fromIsoDate(this.letterDate));
    formData.append('remark', this.remark.trim());
    formData.append('file', this.selectedFile);

    this.saving = true;
    this.api.saveSupplierPoExtension(this.userId, formData).subscribe({
      next: (res) => {
        this.saving = false;
        this.toastr.success(res?.message ?? 'Successfully Saved.');
        this.resetForm();
        this.showExtensionForm = false;
        document.body.classList.remove('emis-modal-open');
        this.loadPage();
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(err?.error?.message ?? 'Unable to save extension request.');
      },
    });
  }

  downloadFile(row: ExtensionRow): void {
    const url = `${environment.apiUrl}/Auth/supplier/po-extension/file/by-user/${this.userId}?extensionId=${row.extensionId}`;
    window.open(url, '_blank');
  }

  resetForm(): void {
    this.extensionDays = null;
    this.extensionDate = '';
    this.letterDate = '';
    this.remark = '';
    this.selectedFile = null;
  }

  goBack(): void {
    navigateToPoSupply(this.router, this.returnFilters);
  }

  private mapRows(list: unknown[]): ExtensionRow[] {
    return list.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        extensionId: Number(row['extensionId'] ?? row['ExtensionId'] ?? 0),
        remark: String(row['remark'] ?? row['Remark'] ?? ''),
        days: Number(row['days'] ?? row['Days'] ?? 0),
        extendedDate: String(row['extendedDate'] ?? row['ExtendedDate'] ?? ''),
        poEndDate: String(row['poEndDate'] ?? row['PoEndDate'] ?? ''),
        hasFile: Boolean(row['hasFile'] ?? row['HasFile']),
        letterDate: String(row['letterDate'] ?? row['LetterDate'] ?? ''),
        letterNo: String(row['letterNo'] ?? row['LetterNo'] ?? ''),
        applyDate: String(row['applyDate'] ?? row['ApplyDate'] ?? ''),
        status: String(row['status'] ?? row['Status'] ?? ''),
      };
    });
  }

  private parseDisplayDate(value: string): Date | null {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const slashParts = trimmed.split('/');
    if (slashParts.length === 3) {
      const [day, month, year] = slashParts.map((part) => Number(part));
      if (day && month && year) {
        return new Date(year, month - 1, day);
      }
    }
    const dashParts = trimmed.split('-');
    if (dashParts.length === 3) {
      const [day, month, year] = dashParts.map((part) => Number(part));
      if (day && month && year) {
        return new Date(year, month - 1, day);
      }
    }
    return null;
  }

  private formatDisplayDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private toIsoDate(displayDate: string): string {
    const trimmed = displayDate.trim();
    if (!trimmed) {
      return '';
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const dashParts = trimmed.split('-');
    if (dashParts.length === 3) {
      const [day, month, year] = dashParts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    const slashParts = trimmed.split('/');
    if (slashParts.length === 3) {
      const [day, month, year] = slashParts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  }

  private fromIsoDate(isoDate: string): string {
    if (!isoDate) {
      return '';
    }
    const [year, month, day] = isoDate.split('-');
    return `${day}-${month}-${year}`;
  }
}
