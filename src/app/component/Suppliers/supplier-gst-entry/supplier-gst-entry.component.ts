import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

interface GstRow {
  gstId: number;
  gstNo: string;
  isEditing: boolean;
  isNew: boolean;
}

@Component({
  selector: 'app-supplier-gst-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-gst-entry.component.html',
  styleUrls: ['./supplier-gst-entry.component.css'],
})
export class SupplierGstEntryComponent implements OnInit {
  loading = false;
  saving = false;
  statusMessage = '';
  statusIsError = false;

  userId = 0;
  supplierId = 0;
  supplierCode = '';
  supplierName = '';

  rows: GstRow[] = [];
  newGstNo = '';

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
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.api.getSupplierGstEntries(this.userId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.supplierId = Number(raw['supplierId'] ?? raw['SupplierId'] ?? 0);
        this.supplierCode = String(raw['supplierCode'] ?? raw['SupplierCode'] ?? '');
        this.supplierName = String(raw['supplierName'] ?? raw['SupplierName'] ?? '');

        const entries = (raw['entries'] ?? raw['Entries'] ?? []) as Record<string, unknown>[];
        this.rows = entries.map((row) => ({
          gstId: Number(row['gstId'] ?? row['GstId'] ?? 0),
          gstNo: String(row['gstNo'] ?? row['GstNo'] ?? ''),
          isEditing: false,
          isNew: false,
        }));

        this.newGstNo = '';
        this.statusMessage = '';
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load GST entries.');
      },
    });
  }

  startEdit(row: GstRow): void {
    this.rows.forEach((item) => (item.isEditing = false));
    row.isEditing = true;
  }

  cancelEdit(row: GstRow): void {
    row.isEditing = false;
    if (!row.isNew) {
      this.loadData();
    }
  }

  saveRow(row: GstRow): void {
    const gstNo = row.gstNo?.trim();
    if (!gstNo) {
      this.toastr.warning('GST no is required.');
      return;
    }

    this.saving = true;
    const request = { userId: this.userId, supplierId: this.supplierId, gstNo };

    const handleSuccess = (message: string) => {
      this.saving = false;
      this.statusIsError = false;
      this.statusMessage = message;
      this.toastr.success(message);
      this.loadData();
    };

    const handleError = (err: { error?: { message?: string } }) => {
      this.saving = false;
      this.statusIsError = true;
      this.statusMessage = err?.error?.message ?? 'Save failed.';
      this.toastr.error(this.statusMessage);
    };

    if (row.isNew || row.gstId <= 0) {
      this.api.addSupplierGstEntry(request).subscribe({
        next: (res) => handleSuccess(res?.message ?? 'Added Successfully'),
        error: handleError,
      });
      return;
    }

    this.api.updateSupplierGstEntry(row.gstId, request).subscribe({
      next: (res) => handleSuccess(res?.message ?? 'Updated Successfully'),
      error: handleError,
    });
  }

  addNew(): void {
    const gstNo = this.newGstNo.trim();
    if (!gstNo) {
      this.toastr.warning('GST no is required.');
      return;
    }

    this.saving = true;
    this.api
      .addSupplierGstEntry({ userId: this.userId, supplierId: this.supplierId, gstNo })
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.statusIsError = false;
          this.statusMessage = res?.message ?? 'Added Successfully';
          this.toastr.success(this.statusMessage);
          this.loadData();
        },
        error: (err) => {
          this.saving = false;
          this.statusIsError = true;
          this.statusMessage = err?.error?.message ?? 'Add failed.';
          this.toastr.error(this.statusMessage);
        },
      });
  }

  deleteRow(row: GstRow): void {
    if (row.gstId <= 0) {
      return;
    }

    if (!confirm('Are you sure, you want to delete?')) {
      return;
    }

    this.saving = true;
    this.api.deleteSupplierGstEntry(row.gstId, this.userId).subscribe({
      next: (res) => {
        this.saving = false;
        this.statusIsError = false;
        this.statusMessage = res?.message ?? 'Deleted successfully';
        this.toastr.success(this.statusMessage);
        this.loadData();
      },
      error: (err) => {
        this.saving = false;
        this.statusIsError = true;
        this.statusMessage = err?.error?.message ?? 'Delete not allowed, references found';
        this.toastr.error(this.statusMessage);
      },
    });
  }
}
