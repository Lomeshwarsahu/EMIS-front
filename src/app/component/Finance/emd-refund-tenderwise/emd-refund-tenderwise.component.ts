import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import {
  EmdRefundApiService,
  EmdRefundPendingRow,
  EmdSupplierOption,
  EmdTenderOption,
} from '../../../service/emd-refund-api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-emd-refund-tenderwise',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './emd-refund-tenderwise.component.html',
  styleUrls: ['./emd-refund-tenderwise.component.css'],
})
export class EmdRefundTenderwiseComponent implements OnInit {
  loading = false;
  submitting = false;

  suppliers: EmdSupplierOption[] = [];
  tenders: EmdTenderOption[] = [];
  rows: EmdRefundPendingRow[] = [];

  selectedSupplierId = 0;
  selectedTenderId = 0;
  selectAll = false;

  constructor(
    private readonly api: EmdRefundApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadLookups();
    this.loadGrid();
  }

  loadLookups(): void {
    this.api.getSuppliers().subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : [];
        this.suppliers = list.map((item: any) => ({
          supplierId: Number(item['supplierId'] ?? item['SupplierId'] ?? item['supplier_id'] ?? 0),
          supplierName: String(item['supplierName'] ?? item['SupplierName'] ?? item['name'] ?? ''),
        }));
      },
      error: () => this.toastr.error('Failed to load suppliers.'),
    });

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

  loadGrid(): void {
    this.loading = true;
    this.selectAll = false;
    this.api.getPendingEmd(this.selectedSupplierId, this.selectedTenderId).subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : [];
        this.rows = list.map((r: any) => this.mapRow(r));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.rows = [];
        this.toastr.error('Failed to load EMD refund details.');
      },
    });
  }

  private mapRow(row: Record<string, any>): EmdRefundPendingRow {
    const doc = String(row['emdDocument'] ?? row['EmdDocument'] ?? row['EMDDocument'] ?? '');
    return {
      id: Number(row['id'] ?? row['Id'] ?? row['ID'] ?? 0),
      supId: Number(row['supId'] ?? row['SupId'] ?? row['SUPID'] ?? 0),
      supplierName: String(row['supplierName'] ?? row['SupplierName'] ?? row['name'] ?? row['Name'] ?? ''),
      tenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? row['Tender_NO'] ?? ''),
      emdAmt: Number(row['emdAmt'] ?? row['EmdAmt'] ?? row['EMDAmt'] ?? 0),
      emdType: String(row['emdType'] ?? row['EmdType'] ?? row['EMDType'] ?? ''),
      emdDocumentNo: String(row['emdDocumentNo'] ?? row['EmdDocumentNo'] ?? row['EMDDocumentNo'] ?? ''),
      emdDocument: doc,
      emdDepositDate: String(row['emdDepositDate'] ?? row['EmdDepositDate'] ?? row['emdDepositeDt'] ?? row['EMDDepositeDt'] ?? ''),
      entryDate: String(row['entryDate'] ?? row['EntryDate'] ?? ''),
      hasFile: Boolean(row['hasFile'] ?? row['HasFile'] ?? (doc && doc.trim().length > 0)),
      status: String(row['status'] ?? row['Status'] ?? 'Pending Approval'),
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

  clearFilters(): void {
    this.selectedSupplierId = 0;
    this.selectedTenderId = 0;
    this.loadGrid();
  }

  hasActiveFilters(): boolean {
    return this.selectedSupplierId > 0 || this.selectedTenderId > 0;
  }

  downloadFile(row: EmdRefundPendingRow): void {
    if (!row.hasFile) {
      this.toastr.warning('File not found.');
      return;
    }
    const userId = localStorage.getItem('userid') || '0';
    window.open(
      `${environment.apiUrl}/Auth/supplier/emd-deposit/file/by-user/${userId}?depositId=${row.id}`,
      '_blank'
    );
  }

  approveAndSend(): void {
    const selectedItems = this.rows.filter((r) => r.selected);
    if (!selectedItems.length) {
      this.toastr.warning('You have not selected any checkbox of EMD file for Approval.');
      return;
    }

    const payload = selectedItems.map((r) => ({ id: r.id, supId: r.supId }));
    this.submitting = true;

    this.api.approveEmd(payload).subscribe({
      next: (res) => {
        this.submitting = false;
        this.toastr.success(res?.message ?? 'Selected File Successfully Approved.');
        this.loadGrid();
      },
      error: (err) => {
        this.submitting = false;
        this.toastr.error(err?.error?.message ?? 'Failed to approve EMD files.');
      },
    });
  }
}
