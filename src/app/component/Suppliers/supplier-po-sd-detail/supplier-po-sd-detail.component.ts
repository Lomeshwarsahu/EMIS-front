import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';

interface SdPaymentMode {
  sdMode: string;
  sdName: string;
}

@Component({
  selector: 'app-supplier-po-sd-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './supplier-po-sd-detail.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './supplier-po-sd-detail.component.css'],
})
export class SupplierPoSdDetailComponent implements OnInit {
  loading = false;
  saving = false;
  userId = 0;

  poId = 0;
  itemId = 0;
  supplierId = 0;
  grossValue = 0;

  equipmentName = '';
  sdAmount = 0;
  hasExisting = false;
  hasFile = false;

  paymentModes: SdPaymentMode[] = [];
  selectedPaymentMode = '0';
  issueDate = '';
  maturityDate = '';
  documentNo = '';
  fileMode: 'UPLOAD' | 'VIEW' = 'VIEW';
  selectedFile: File | null = null;

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
      this.itemId = Number(params['itemId'] ?? params['ITEMID'] ?? 0);
      this.supplierId = Number(params['supplierId'] ?? params['SUPID'] ?? 0);
      this.grossValue = Number(params['gValue'] ?? params['GValue'] ?? 0);

      if (!this.poId || !this.itemId || !this.supplierId) {
        this.toastr.error('Missing PO parameters.');
        return;
      }

      this.loadDetail();
    });
  }

  get showSubmit(): boolean {
    return !this.hasExisting;
  }

  get showUpdate(): boolean {
    return this.hasExisting;
  }

  get showFileUpload(): boolean {
    return !this.hasExisting || this.fileMode === 'UPLOAD';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  onFileModeChange(): void {
    if (this.fileMode === 'VIEW') {
      this.selectedFile = null;
    }
  }

  loadDetail(): void {
    this.loading = true;
    this.api.getSupplierPoSdDetail(this.userId, this.poId, this.itemId, this.grossValue).subscribe({
      next: (raw) => {
        this.loading = false;
        const data = raw as Record<string, unknown>;
        this.equipmentName = String(data['equipmentName'] ?? data['EquipmentName'] ?? '');
        this.sdAmount = Number(data['sdAmount'] ?? data['SdAmount'] ?? 0);
        this.hasExisting = Boolean(data['hasExisting'] ?? data['HasExisting']);
        this.hasFile = Boolean(data['hasFile'] ?? data['HasFile']);
        this.supplierId = Number(data['supplierId'] ?? data['SupplierId'] ?? this.supplierId);
        this.grossValue = Number(data['grossValue'] ?? data['GrossValue'] ?? this.grossValue);
        this.selectedPaymentMode = String(data['paymentMode'] ?? data['PaymentMode'] ?? '0') || '0';
        this.issueDate = this.toIsoDate(String(data['issueDate'] ?? data['IssueDate'] ?? ''));
        this.maturityDate = this.toIsoDate(String(data['maturityDate'] ?? data['MaturityDate'] ?? ''));
        this.documentNo = String(data['documentNo'] ?? data['DocumentNo'] ?? '');
        this.paymentModes = this.mapPaymentModes(
          (data['paymentModes'] ?? data['PaymentModes'] ?? []) as unknown[],
        );
        this.fileMode = this.hasFile ? 'VIEW' : 'UPLOAD';
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load SD detail.');
      },
    });
  }

  save(): void {
    if (this.hasExisting) {
      this.update();
      return;
    }

    if (this.selectedPaymentMode === '0') {
      this.toastr.warning('Please select Payment mode.');
      return;
    }
    if (!this.issueDate) {
      this.toastr.warning('Please fill Issue Date');
      return;
    }
    if (!this.documentNo.trim()) {
      this.toastr.warning('Please SD Document Ref. No');
      return;
    }
    if (!this.selectedFile) {
      this.toastr.warning('Please select document to be uplaoded.');
      return;
    }

    const formData = new FormData();
    formData.append('poId', String(this.poId));
    formData.append('itemId', String(this.itemId));
    formData.append('supplierId', String(this.supplierId));
    formData.append('paymentMode', this.selectedPaymentMode);
    formData.append('issueDate', this.fromIsoDate(this.issueDate));
    formData.append('sdAmount', String(this.sdAmount));
    formData.append('documentNo', this.documentNo.trim());
    if (this.maturityDate) {
      formData.append('maturityDate', this.fromIsoDate(this.maturityDate));
    }
    formData.append('file', this.selectedFile);

    this.saving = true;
    this.api.saveSupplierPoSdDetail(this.userId, formData).subscribe({
      next: (res) => {
        this.saving = false;
        this.toastr.success(res?.message ?? 'Successfully Saved.');
        this.router.navigate(['/orders/po-supply']);
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(err?.error?.message ?? 'Unable to save SD detail.');
      },
    });
  }

  update(): void {
    if (this.selectedPaymentMode === '0') {
      this.toastr.warning('Please select Payment mode.');
      return;
    }
    if (!this.issueDate) {
      this.toastr.warning('Please fill Issue Date');
      return;
    }
    if (this.fileMode === 'UPLOAD' && !this.selectedFile) {
      this.toastr.warning('Please select document to be uplaoded.');
      return;
    }

    const formData = new FormData();
    formData.append('poId', String(this.poId));
    formData.append('itemId', String(this.itemId));
    formData.append('supplierId', String(this.supplierId));
    formData.append('paymentMode', this.selectedPaymentMode);
    formData.append('issueDate', this.fromIsoDate(this.issueDate));
    formData.append('sdAmount', String(this.sdAmount));
    formData.append('fileMode', this.fileMode);
    if (this.maturityDate) {
      formData.append('maturityDate', this.fromIsoDate(this.maturityDate));
    }
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.saving = true;
    this.api.updateSupplierPoSdDetail(this.userId, formData).subscribe({
      next: (res) => {
        this.saving = false;
        this.toastr.success(res?.message ?? 'Successfully Saved.');
        this.loadDetail();
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(err?.error?.message ?? 'Unable to update SD detail.');
      },
    });
  }

  downloadFile(): void {
    const url = `${environment.apiUrl}/Auth/supplier/po-sd-detail/file/by-user/${this.userId}?poId=${this.poId}`;
    window.open(url, '_blank');
  }

  resetForm(): void {
    this.selectedPaymentMode = '0';
    this.issueDate = '';
    this.maturityDate = '';
    this.documentNo = '';
    this.selectedFile = null;
    this.fileMode = this.hasFile ? 'VIEW' : 'UPLOAD';
    if (this.hasExisting) {
      this.loadDetail();
    }
  }

  goBack(): void {
    this.router.navigate(['/orders/po-supply']);
  }

  private mapPaymentModes(list: unknown[]): SdPaymentMode[] {
    return list.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        sdMode: String(row['sdMode'] ?? row['SdMode'] ?? ''),
        sdName: String(row['sdName'] ?? row['SdName'] ?? ''),
      };
    });
  }

  private toIsoDate(displayDate: string): string {
    const trimmed = displayDate.trim();
    if (!trimmed) {
      return '';
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const parts = trimmed.split('/');
    if (parts.length !== 3) {
      return '';
    }
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  private fromIsoDate(isoDate: string): string {
    if (!isoDate) {
      return '';
    }
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }
}
