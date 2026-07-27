import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import {
  EmdRefundApiService,
  EmdSupplierOption,
  EmdTenderOption,
  SdReleasePendingRow,
} from '../../../service/emd-refund-api.service';

@Component({
  selector: 'app-sd-release-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './sd-release-finance.component.html',
  styleUrls: ['./sd-release-finance.component.css'],
})
export class SdReleaseFinanceComponent implements OnInit {
  loading = false;
  saving = false;
  showReleasePanel = false;

  tenders: EmdTenderOption[] = [];
  suppliers: EmdSupplierOption[] = [];
  rows: SdReleasePendingRow[] = [];

  selectedTenderId = 0;
  selectedSupplierId = 0;
  selectAll = false;

  // Release Panel Form Fields
  releaseAmount = 0;
  recoveredAmount = 0;
  releaseType = 'Document Form'; // 'Document Form' | 'Core Transfer'
  refundDate = new Date().toISOString().slice(0, 10);
  chequeNo = '';
  remarks = '';

  constructor(
    private readonly api: EmdRefundApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadTenders();
    this.loadSuppliers();
    this.loadGrid();
  }

  loadTenders(): void {
    this.api.getTenders().subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : [];
        this.tenders = list.map((item: any) => ({
          tenderId: Number(item['tenderId'] ?? item['TenderId'] ?? item['tender_id'] ?? 0),
          tenderNo: String(item['tenderNo'] ?? item['TenderNo'] ?? item['tender_no'] ?? ''),
        }));
      },
      error: () => this.toastr.error('Failed to load tenders.'),
    });
  }

  loadSuppliers(): void {
    this.api.getSdSuppliers(this.selectedTenderId).subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : [];
        this.suppliers = list.map((item: any) => ({
          supplierId: Number(item['supplierId'] ?? item['SupplierId'] ?? item['supplier_id'] ?? 0),
          supplierName: String(item['supplierName'] ?? item['SupplierName'] ?? item['name'] ?? ''),
        }));
      },
      error: () => this.toastr.error('Failed to load suppliers.'),
    });
  }

  onTenderChange(): void {
    this.selectedSupplierId = 0;
    this.loadSuppliers();
    this.loadGrid();
  }

  loadGrid(): void {
    this.loading = true;
    this.selectAll = false;
    this.showReleasePanel = false;
    this.api.getPendingSd(this.selectedSupplierId, this.selectedTenderId).subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : [];
        this.rows = list.map((r: any) => this.mapRow(r));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.rows = [];
        this.toastr.error('Failed to load SD release details.');
      },
    });
  }

  private mapRow(row: Record<string, any>): SdReleasePendingRow {
    return {
      poId: Number(row['poId'] ?? row['PoId'] ?? row['po_id'] ?? row['PO_ID'] ?? 0),
      tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? row['Tender_NO'] ?? ''),
      poNo: String(row['poNo'] ?? row['PoNo'] ?? row['PONO'] ?? ''),
      poDate: String(row['poDate'] ?? row['PoDate'] ?? row['PO_Date'] ?? ''),
      supplierName: String(row['supplierName'] ?? row['SupplierName'] ?? row['Supplier_Name'] ?? row['name'] ?? ''),
      sdAmount: Number(row['sdAmount'] ?? row['SdAmount'] ?? row['SDAmount'] ?? 0),
      sdType: String(row['sdType'] ?? row['SdType'] ?? row['SDType'] ?? ''),
      sdIssueDate: String(row['sdIssueDate'] ?? row['SdIssueDate'] ?? row['SDIssueDate'] ?? ''),
      sdMaturityDate: String(row['sdMaturityDate'] ?? row['SdMaturityDate'] ?? row['SDMaturityDate'] ?? ''),
      sdEntryDate: String(row['sdEntryDate'] ?? row['SdEntryDate'] ?? row['SDEntryDate'] ?? ''),
      sdDetailsId: Number(row['sdDetailsId'] ?? row['SdDetailsId'] ?? row['SDDetailsID'] ?? 0),
      selected: false,
    };
  }

  toggleAll(): void {
    this.rows.forEach((r) => (r.selected = this.selectAll));
  }

  onRowSelectChange(): void {
    this.selectAll = this.rows.length > 0 && this.rows.every((r) => r.selected);
  }

  get selectedCount(): number {
    return this.rows.filter((r) => r.selected).length;
  }

  get sumSdAmount(): number {
    return this.rows
      .filter((r) => r.selected)
      .reduce((sum, r) => sum + (Number(r.sdAmount) || 0), 0);
  }

  clearFilters(): void {
    this.selectedTenderId = 0;
    this.selectedSupplierId = 0;
    this.loadSuppliers();
    this.loadGrid();
  }

  hasActiveFilters(): boolean {
    return this.selectedTenderId > 0 || this.selectedSupplierId > 0;
  }

  openReleasePanel(): void {
    if (this.selectedCount === 0) {
      this.toastr.warning('Please select at least one row to release.');
      return;
    }

    this.releaseAmount = this.sumSdAmount;
    this.recoveredAmount = 0;
    this.showReleasePanel = true;
  }

  closeReleasePanel(): void {
    this.showReleasePanel = false;
  }

  onRecoveredAmountChange(): void {
    const total = this.sumSdAmount;
    const rec = Number(this.recoveredAmount) || 0;
    this.releaseAmount = Math.max(0, total - rec);
  }

  saveRelease(): void {
    const selectedItems = this.rows.filter((r) => r.selected);
    if (!selectedItems.length) {
      this.toastr.warning('Please select at least one row to release.');
      return;
    }

    if (this.releaseAmount <= 0) {
      this.toastr.warning('Release amount must be greater than 0.');
      return;
    }

    const payload = {
      poIds: selectedItems.map((r) => r.poId),
      releaseAmount: this.releaseAmount,
      recoveredAmount: Number(this.recoveredAmount) || 0,
      releaseType: this.releaseType,
      refundDate: this.refundDate,
      chequeNo: this.chequeNo.trim(),
      remarks: this.remarks.trim(),
    };

    this.saving = true;
    this.api.releaseSd(payload).subscribe({
      next: (res) => {
        this.saving = false;
        this.toastr.success(res?.message ?? 'Selected File Successfully Approved.');
        this.showReleasePanel = false;
        this.loadGrid();
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(err?.error?.message ?? 'Failed to release SD.');
      },
    });
  }
}
