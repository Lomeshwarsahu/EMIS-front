import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service/api.service';

interface ReceiptComplainRow {
  complaintId: number;
  complaintNo: string;
  poNo: string;
  poDate: string;
  itemCode: string;
  itemName: string;
  serialNo: string;
  complaintDate: string;
  notFunctionDate: string;
  locationName: string;
  facilityContactNo: string;
  complaintDetails: string;
  hasFile: boolean;
}

type ComplainStatus = 'Booked' | 'Closed';

@Component({
  selector: 'app-supplier-receipt-complain',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-receipt-complain.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './supplier-receipt-complain.component.css'],
})
export class SupplierReceiptComplainComponent implements OnInit {
  loading = false;
  userId = 0;
  showExport = false;

  status: ComplainStatus = 'Booked';
  rows: ReceiptComplainRow[] = [];

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userid') || localStorage.getItem('userid') || 0);
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
    }
  }

  showReport(): void {
    this.loading = true;
    this.api.getSupplierReceiptComplain(this.userId, this.status).subscribe({
      next: (raw) => {
        this.loading = false;
        this.showExport = true;
        const list = Array.isArray(raw) ? raw : [];
        this.rows = list.map((row) => this.mapRow(row as Record<string, unknown>));
      },
      error: (err) => {
        this.loading = false;
        this.rows = [];
        this.toastr.error(err?.error?.message ?? 'Unable to load complaints.');
      },
    });
  }

  downloadFile(row: ReceiptComplainRow): void {
    if (!row.hasFile) {
      this.toastr.warning('File not found.');
      return;
    }
    window.open(
      `${environment.apiUrl}/Auth/supplier/receipt-complain/file/by-user/${this.userId}?complaintId=${row.complaintId}`,
      '_blank',
    );
  }

  exportExcel(): void {
    if (!this.rows.length) {
      this.toastr.warning('No data to export.');
      return;
    }

    const headers = [
      'S.No',
      'Complain no',
      'PO NO',
      'Item Code',
      'Item Name',
      'Make No',
      'Complain Date',
      'Not Function Date',
      'Facility Name',
      'Facility Contact N0',
      'Complain Details',
    ];

    const lines = this.rows.map((row, index) =>
      [
        index + 1,
        row.complaintNo,
        row.poNo,
        row.itemCode,
        row.itemName,
        row.serialNo,
        row.complaintDate,
        row.notFunctionDate,
        row.locationName,
        row.facilityContactNo,
        row.complaintDetails,
      ]
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(','),
    );

    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ReceiptComplain_${Date.now()}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private mapRow(row: Record<string, unknown>): ReceiptComplainRow {
    return {
      complaintId: Number(row['complaintId'] ?? row['ComplaintId'] ?? 0),
      complaintNo: String(row['complaintNo'] ?? row['ComplaintNo'] ?? ''),
      poNo: String(row['poNo'] ?? row['PoNo'] ?? ''),
      poDate: String(row['poDate'] ?? row['PoDate'] ?? ''),
      itemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
      itemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
      serialNo: String(row['serialNo'] ?? row['SerialNo'] ?? ''),
      complaintDate: String(row['complaintDate'] ?? row['ComplaintDate'] ?? ''),
      notFunctionDate: String(row['notFunctionDate'] ?? row['NotFunctionDate'] ?? ''),
      locationName: String(row['locationName'] ?? row['LocationName'] ?? ''),
      facilityContactNo: String(row['facilityContactNo'] ?? row['FacilityContactNo'] ?? ''),
      complaintDetails: String(row['complaintDetails'] ?? row['ComplaintDetails'] ?? ''),
      hasFile: Boolean(row['hasFile'] ?? row['HasFile'] ?? false),
    };
  }
}
