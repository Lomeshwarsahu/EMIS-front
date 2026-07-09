import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service/api.service';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';

interface TenderOption {
  tenderId: number;
  tenderNo: string;
}

interface EmdTypeOption {
  dtypeId: number;
  dtypeName: string;
}

interface EmdDepositRow {
  id: number;
  supId: number;
  tenderNo: string;
  emdAmt: number;
  emdType: string;
  emdDocumentNo: string;
  emdDepositeDt: string;
  emdDocument: string;
  hasFile: boolean;
}

@Component({
  selector: 'app-supplier-emd-deposit',
  standalone: true,
  imports: [CommonModule, FormsModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-emd-deposit.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './supplier-emd-deposit.component.css'],
})
export class SupplierEmdDepositComponent implements OnInit {
  loading = false;
  saving = false;
  showRefundForm = false;
  userId = 0;

  tenders: TenderOption[] = [];
  emdTypes: EmdTypeOption[] = [];
  rows: EmdDepositRow[] = [];

  selectedTenderId = -1;
  otherTenderNo = '';
  emdAmount: number | null = null;
  selectedEmdType = 0;
  emdDocNo = '';
  emdDepositDate = '';
  selectedFile: File | null = null;

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userid') || localStorage.getItem('userid') || 0);
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
      return;
    }
    this.loadLookups();
    this.loadGrid();
  }

  get showOtherTender(): boolean {
    return this.selectedTenderId === 0;
  }

  get maxDepositDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  onTenderChange(): void {
    if (!this.showOtherTender) {
      this.otherTenderNo = '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  openRefundForm(): void {
    this.showRefundForm = true;
  }

  closeRefundForm(): void {
    this.showRefundForm = false;
    this.resetForm();
  }

  loadLookups(): void {
    this.api.getSupplierEmdDepositTenders(this.userId).subscribe({
      next: (raw) => {
        const list = Array.isArray(raw) ? raw : [];
        this.tenders = list.map((item) => this.mapTender(item as Record<string, unknown>));
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Unable to load tenders.');
      },
    });

    this.api.getSupplierEmdDocumentTypes().subscribe({
      next: (raw) => {
        const list = Array.isArray(raw) ? raw : [];
        this.emdTypes = list.map((item) => this.mapEmdType(item as Record<string, unknown>));
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Unable to load EMD types.');
      },
    });
  }

  loadGrid(): void {
    this.loading = true;
    this.api.getSupplierEmdDeposits(this.userId).subscribe({
      next: (raw) => {
        this.loading = false;
        const list = Array.isArray(raw) ? raw : [];
        this.rows = list.map((row) => this.mapRow(row as Record<string, unknown>));
      },
      error: (err) => {
        this.loading = false;
        this.rows = [];
        this.toastr.error(err?.error?.message ?? 'Unable to load EMD deposits.');
      },
    });
  }

  save(): void {
    if (this.selectedTenderId < 0) {
      this.toastr.warning('Please select tender No.');
      return;
    }
    if (this.showOtherTender && !this.otherTenderNo.trim()) {
      this.toastr.warning('Please insert Other Tender No.');
      return;
    }
    if (!this.emdAmount || this.emdAmount <= 0) {
      this.toastr.warning('Please insert EMD Amount.');
      return;
    }
    if (!this.selectedEmdType) {
      this.toastr.warning('Please select EMD Type.');
      return;
    }
    if (!this.emdDocNo.trim()) {
      this.toastr.warning('Please insert EMD Document Number.');
      return;
    }
    if (!this.emdDepositDate) {
      this.toastr.warning('Please insert EMD Deposite Date.');
      return;
    }
    if (!this.selectedFile) {
      this.toastr.warning('Please Upload PDF File for EMD Document/Letter.');
      return;
    }
    if (!this.selectedFile.name.toLowerCase().endsWith('.pdf')) {
      this.toastr.warning('Please upload pdf file only.');
      return;
    }
    if (this.selectedFile.size >= 3_000_000) {
      this.toastr.warning("You can't upload file more than 3mb.");
      return;
    }

    const formData = new FormData();
    formData.append('tenderId', String(this.selectedTenderId));
    formData.append('otherTenderNo', this.otherTenderNo.trim());
    formData.append('emdAmount', String(this.emdAmount));
    formData.append('emdType', String(this.selectedEmdType));
    formData.append('emdDocNo', this.emdDocNo.trim());
    formData.append('emdDepositDate', this.formatDateForApi(this.emdDepositDate));
    formData.append('file', this.selectedFile);

    this.saving = true;
    this.api.saveSupplierEmdDeposit(this.userId, formData).subscribe({
      next: (res) => {
        this.saving = false;
        const message = String((res as Record<string, unknown>)['message'] ?? 'Record Successfully Inserted');
        this.toastr.success(message);
        this.resetForm();
        this.showRefundForm = false;
        this.loadLookups();
        this.loadGrid();
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(err?.error?.message ?? 'Unable to save EMD deposit.');
      },
    });
  }

  downloadFile(row: EmdDepositRow): void {
    if (!row.hasFile) {
      this.toastr.warning('File not found.');
      return;
    }
    window.open(
      `${environment.apiUrl}/Auth/supplier/emd-deposit/file/by-user/${this.userId}?depositId=${row.id}`,
      '_blank',
    );
  }

  private resetForm(): void {
    this.selectedTenderId = -1;
    this.otherTenderNo = '';
    this.emdAmount = null;
    this.selectedEmdType = 0;
    this.emdDocNo = '';
    this.emdDepositDate = '';
    this.selectedFile = null;
  }

  private formatDateForApi(value: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-');
      return `${day}/${month}/${year}`;
    }
    return value;
  }

  private mapTender(row: Record<string, unknown>): TenderOption {
    return {
      tenderId: Number(row['tenderId'] ?? row['TenderId'] ?? 0),
      tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
    };
  }

  private mapEmdType(row: Record<string, unknown>): EmdTypeOption {
    return {
      dtypeId: Number(row['dtypeId'] ?? row['DtypeId'] ?? 0),
      dtypeName: String(row['dtypeName'] ?? row['DtypeName'] ?? ''),
    };
  }

  private mapRow(row: Record<string, unknown>): EmdDepositRow {
    return {
      id: Number(row['id'] ?? row['Id'] ?? 0),
      supId: Number(row['supId'] ?? row['SupId'] ?? 0),
      tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
      emdAmt: Number(row['emdAmt'] ?? row['EmdAmt'] ?? 0),
      emdType: String(row['emdType'] ?? row['EmdType'] ?? ''),
      emdDocumentNo: String(row['emdDocumentNo'] ?? row['EmdDocumentNo'] ?? ''),
      emdDepositeDt: String(row['emdDepositeDt'] ?? row['EmdDepositeDt'] ?? ''),
      emdDocument: String(row['emdDocument'] ?? row['EmdDocument'] ?? ''),
      hasFile: Boolean(row['hasFile'] ?? row['HasFile'] ?? false),
    };
  }
}
