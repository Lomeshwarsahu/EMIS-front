import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage, resolveLoginAuthorityId } from '../../shared/session.util';

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
  supplierName: string;
  supplierMobile: string;
  supplierEmail: string;
  complaintDetails: string;
  hasLetter: boolean;
}

@Component({
  selector: 'app-complaint-status-facility',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaint-status-facility.component.html',
  styleUrls: ['./complaint-status-facility.component.css'],
})
export class ComplaintStatusFacilityComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEComplain/`;

  rows: ComplainStatusRow[] = [];
  status = 'Booked';
  loading = false;
  loaded = false;
  locationId = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.locationId = Number(resolveLoginAuthorityId()) || 0;
  }

  load(): void {
    if (!this.locationId) {
      this.toastr.warning('Could not resolve facility location.');
      return;
    }
    this.loading = true;
    this.http
      .get<ComplainStatusRow[]>(
        `${this.apiRoot}facility-status-list?locationId=${this.locationId}&status=${encodeURIComponent(this.status)}`,
      )
      .subscribe({
        next: (res) => {
          this.rows = this.mapRows(res);
          this.loaded = true;
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.toastr.error(apiErrorMessage(e, 'Could not load complaints.'));
        },
      });
  }

  edit(row: ComplainStatusRow): void {
    this.router.navigate(['/complain/complaint-status-facility-edit', row.complaintId]);
  }

  download(row: ComplainStatusRow): void {
    if (!row.hasLetter) {
      this.toastr.warning('Complaint letter not uploaded.');
      return;
    }
    window.open(`${this.apiRoot}letter/${row.complaintId}`, '_blank');
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
      makeNo: String(r['makeNo'] ?? r['MakeNo'] ?? r['serialNo'] ?? r['SerialNo'] ?? ''),
      complaintsTroubleshoot: String(r['complaintsTroubleshoot'] ?? r['ComplainTroubleshoot'] ?? ''),
      locationName: String(r['locationName'] ?? r['LocationName'] ?? ''),
      storeName: String(r['storeName'] ?? r['StoreName'] ?? ''),
      supplierName: String(r['supplierName'] ?? r['SupplierName'] ?? ''),
      supplierMobile: String(r['supplierMobile'] ?? r['SupplierMobile'] ?? ''),
      supplierEmail: String(r['supplierEmail'] ?? r['SupplierEmail'] ?? ''),
      complaintDetails: String(r['complaintDetails'] ?? r['ComplaintDetails'] ?? ''),
      hasLetter: Boolean(r['path'] ?? r['Path'] ?? ''),
    }));
  }
}
