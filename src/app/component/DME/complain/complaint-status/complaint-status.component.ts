import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';
import { SecureFileService } from '../../../../service/secure-file.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ListPager } from 'src/app/helper/list-pager';
import { SupplierPageSkeletonComponent } from '../../../Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

interface ComplainStatusRow {
  complaintId: number;
  complaintNo: string;
  status: string;
  complaintDate: string;
  notFunctionDate: string;
  itemName: string;
  itemCode: string;
  makeNo: string;
  complaintsTroubleshoot: string;
  locationName: string;
  storeName: string;
  complaintDetails: string;
}

@Component({
  selector: 'app-complaint-status',
  standalone: true,
  imports: [MatPaginatorModule, CommonModule, FormsModule, SupplierPageSkeletonComponent],
  templateUrl: './complaint-status.component.html',
  styleUrls: ['../../../Suppliers/supplier-po-pages.shared.css', './complaint-status.component.css'],
})
export class ComplaintStatusComponent implements OnInit {
  readonly pager = new ListPager();
  private readonly secureFile = inject(SecureFileService);
  private readonly apiRoot = `${environment.apiUrl}/DMEComplain/`;

  rows: ComplainStatusRow[] = [];
  status = 'Booked';
  loading = false;
  loaded = false;
  userId = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    if (this.userId) {
      this.load();
    }
  }

  onFilterChange(): void {
    this.load();
  }

  clearFilters(): void {
    this.status = 'Booked';
    this.load();
  }

  get hasActiveFilters(): boolean {
    return this.status !== 'Booked';
  }

  load(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again.');
      return;
    }
    this.loading = true;
    this.http
      .get<ComplainStatusRow[]>(
        `${this.apiRoot}status-list?userId=${this.userId}&status=${encodeURIComponent(this.status)}`,
      )
      .subscribe({
        next: (res) => {
          this.pager.reset();
          this.rows = this.mapRows(res);
          this.loaded = true;
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.pager.reset();
          this.rows = [];
          this.toastr.error(apiErrorMessage(e, 'Could not load complaints.'));
        },
      });
  }

  edit(row: ComplainStatusRow): void {
    if (row.status === 'Closed') {
      this.router.navigate(['/complain/complaint-status-edit', row.complaintId], {
        queryParams: { mode: 'Show' },
      });
    } else {
      this.router.navigate(['/complain/complaint-status-edit', row.complaintId]);
    }
  }

  download(row: ComplainStatusRow): void {
    this.secureFile.openInNewTab(`${this.apiRoot}letter/${row.complaintId}`);
  }

  exportExcel(): void {
    if (!this.rows.length) {
      this.toastr.warning('No data to export.');
      return;
    }

    const headers = [
      'S.No',
      'Complain no',
      'Item Code',
      'Item Name',
      'Make No',
      'Complain Trouble',
      'Complain Date',
      'Not Function Date',
      'Store Name',
      'Department Name',
      'Complain Details',
      'Status',
    ];

    const lines = this.rows.map((row, index) =>
      [
        index + 1,
        row.complaintNo,
        row.itemCode,
        row.itemName,
        row.makeNo,
        row.complaintsTroubleshoot,
        row.complaintDate,
        row.notFunctionDate,
        row.storeName,
        row.locationName,
        row.complaintDetails,
        row.status,
      ]
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(','),
    );

    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ComplaintStatus_${Date.now()}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private mapRows(raw: unknown): ComplainStatusRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      complaintId: Number(r['complaintId'] ?? r['ComplaintId'] ?? 0),
      complaintNo: String(r['complaintNo'] ?? r['ComplaintNo'] ?? ''),
      status: String(r['status'] ?? r['Status'] ?? ''),
      complaintDate: String(r['complaintDate'] ?? r['ComplaintDate'] ?? ''),
      notFunctionDate: String(r['notFunctionDate'] ?? r['NotFunctionDate'] ?? ''),
      itemName: String(r['itemName'] ?? r['ItemName'] ?? ''),
      itemCode: String(r['itemCode'] ?? r['ItemCode'] ?? ''),
      makeNo: String(r['makeNo'] ?? r['MakeNo'] ?? ''),
      complaintsTroubleshoot: String(r['complaintsTroubleshoot'] ?? r['ComplainTroubleshoot'] ?? ''),
      locationName: String(r['locationName'] ?? r['LocationName'] ?? ''),
      storeName: String(r['storeName'] ?? r['StoreName'] ?? ''),
      complaintDetails: String(r['complaintDetails'] ?? r['ComplaintDetails'] ?? ''),
    }));
  }
}
