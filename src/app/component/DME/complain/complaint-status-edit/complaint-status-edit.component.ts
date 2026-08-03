import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage } from '../../shared/session.util';

interface ComplainDetail {
  complaintId: number;
  complaintNo: string;
  itemName: string;
  complaintDate: string;
  notFunctionDate: string;
  complaintsTroubleshoot: string;
  locationName: string;
  supplierName: string;
  supplierMobile: string;
  supplierEmail: string;
  warrantyValidDate: string;
  makeNo: string;
  serialNo: string;
  complaintDetails: string;
  status: string;
  compClosedOn: string;
  supplierServiceDate: string;
  correctiveActionTaken: string;
  preventiveAction: string;
  changedParts: string;
  partsReplaced: string;
}

@Component({
  selector: 'app-complaint-status-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complaint-status-edit.component.html',
  styleUrls: ['./complaint-status-edit.component.css'],
})
export class ComplaintStatusEditComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEComplain/`;

  complaintId = 0;
  detail: ComplainDetail | null = null;
  loading = true;
  saving = false;
  viewOnly = false;

  closeDateIso = '';
  status = 'Closed';
  supplierServiceDateIso = '';
  correctiveActionTaken = 'No';
  preventiveAction = '';
  changedParts = 'NotChanged';
  partsReplaced = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.complaintId = Number(this.route.snapshot.paramMap.get('compId') ?? 0);
    this.viewOnly = this.route.snapshot.queryParamMap.get('mode') === 'Show';
    if (!this.complaintId) {
      this.toastr.error('Complaint id is required.');
      this.loading = false;
      return;
    }
    this.loadDetail();
  }

  loadDetail(): void {
    this.http.get<ComplainDetail>(`${this.apiRoot}detail/${this.complaintId}`).subscribe({
      next: (res) => {
        this.detail = this.mapDetail(res);
        this.closeDateIso = this.toIsoDate(this.detail.compClosedOn) || this.todayIso();
        if (this.detail.status) {
          this.status = this.detail.status;
        }
        this.supplierServiceDateIso = this.toIsoDate(this.detail.supplierServiceDate);
        this.correctiveActionTaken = this.detail.correctiveActionTaken || 'No';
        this.preventiveAction = this.detail.preventiveAction || '';
        this.changedParts = this.detail.changedParts || 'NotChanged';
        this.partsReplaced = Number(this.detail.partsReplaced) || 0;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load complaint.'));
      },
    });
  }

  submit(): void {
    if (!this.detail) {
      return;
    }
    if (!this.closeDateIso) {
      this.toastr.warning('Complain Close Date is required.');
      return;
    }
    if (!this.supplierServiceDateIso) {
      this.toastr.warning('Supplier Service Date cannot be null.');
      return;
    }
    if (this.correctiveActionTaken === 'Yes' && !this.preventiveAction.trim()) {
      this.toastr.warning('Corrective Taken Textbox cannot be null.');
      return;
    }
    if (this.changedParts === 'Changed' && this.partsReplaced < 0) {
      this.toastr.warning('Please fill No of Parts Replaced.');
      return;
    }

    this.saving = true;
    this.http
      .post(`${this.apiRoot}close-complaint`, {
        complaintId: this.detail.complaintId,
        compClosedOn: this.fromIsoDate(this.closeDateIso),
        status: this.status,
        supplierServiceDate: this.fromIsoDate(this.supplierServiceDateIso),
        correctiveActionTaken: this.correctiveActionTaken,
        preventiveAction: this.preventiveAction.trim(),
        changedParts: this.changedParts,
        partsReplaced: this.changedParts === 'NotChanged' ? 0 : this.partsReplaced,
        userId: 0,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.toastr.success('Complaint Status Successfully Changed.');
          this.router.navigate(['/complain/complaint-status']);
        },
        error: (e) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not update complaint.'));
        },
      });
  }

  onCorrectiveChange(): void {
    if (this.correctiveActionTaken !== 'Yes') {
      this.preventiveAction = '';
    }
  }

  onChangedPartsChange(): void {
    if (this.changedParts === 'NotChanged') {
      this.partsReplaced = 0;
    }
  }

  back(): void {
    this.router.navigate(['/complain/complaint-status']);
  }

  private mapDetail(raw: unknown): ComplainDetail {
    const r = (raw ?? {}) as Record<string, unknown>;
    const get = (k: string) => String(r[k] ?? '');
    return {
      complaintId: Number(r['complaintId'] ?? r['ComplaintId'] ?? 0),
      complaintNo: get('complaintNo') || get('ComplaintNo'),
      itemName: get('itemName') || get('ItemName'),
      complaintDate: get('complaintDate') || get('ComplaintDate'),
      notFunctionDate: get('notFunctionDate') || get('NotFunctionDate'),
      complaintsTroubleshoot: get('complaintsTroubleshoot') || get('ComplainTroubleshoot'),
      locationName: get('locationName') || get('LocationName'),
      supplierName: get('supplierName') || get('SupplierName'),
      supplierMobile: get('supplierMobile') || get('SupplierMobile'),
      supplierEmail: get('supplierEmail') || get('SupplierEmail'),
      warrantyValidDate: get('warrantyValidDate') || get('WarrantyValidDate'),
      makeNo: get('makeNo') || get('MakeNo') || get('serialNo') || get('SerialNo'),
      serialNo: get('serialNo') || get('SerialNo'),
      complaintDetails: get('complaintDetails') || get('ComplaintDetails'),
      status: get('status') || get('Status'),
      compClosedOn: get('compClosedOn') || get('CompClosedOn'),
      supplierServiceDate: get('supplierServiceDate') || get('SupplierServiceDate'),
      correctiveActionTaken: get('correctiveActionTaken') || get('CorrectiveActionTaken'),
      preventiveAction: get('preventiveAction') || get('PreventiveAction'),
      changedParts: get('changedParts') || get('ChangedParts'),
      partsReplaced: get('partsReplaced') || get('PartsReplaced'),
    };
  }

  private todayIso(): string {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  private toIsoDate(ddmmyyyy: string): string {
    if (!ddmmyyyy || !ddmmyyyy.trim()) {
      return '';
    }
    const m = ddmmyyyy.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) {
      return '';
    }
    return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }

  private fromIsoDate(isoDate: string): string {
    if (!isoDate) {
      return '';
    }
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }
}
