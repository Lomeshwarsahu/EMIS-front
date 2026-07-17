import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

type ReceiptTab = 'receipt' | 'installation' | 'complete';

interface IssueDetailOption {
  issueDetailId: number;
  serialNo: string;
  warrantyCertificateNo: string;
  dispatchedQty: number;
}

interface InstallationLine {
  itemDetailId: number;
  issueDetailId: number;
  serialNo: string;
  warrantyCertificateNo: string;
  warrantyCardNo: string;
  receivedQty: number;
  installationDate: string;
  warrantyFromDate: string;
  warrantyToDate: string;
  installationBy: string;
  installationLocation: string;
  hasInstallationReport: boolean;
  hasInstallationPhoto: boolean;
  hasWarrantyCard: boolean;
  hasChallan: boolean;
}

@Component({
  selector: 'app-po-receipt-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DmePageSkeletonComponent],
  templateUrl: './po-receipt-entry.component.html',
  styleUrls: ['../dme-order-detail.shared.css', './po-receipt-entry.component.css'],
})
export class PoReceiptEntryComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  loading = false;
  saving = false;
  uploading = false;
  activeTab: ReceiptTab = 'receipt';
  userId = 0;

  poId = 0;
  locId = 0;
  issueId = 0;
  receiptId = 0;
  categoryId = 0;

  hasBulkInstallationReport = false;
  hasBulkInstallationPhoto = false;
  hasBulkWarrantyCard = false;
  hasBulkChallan = false;
  installDispatchNo = '';
  installDispatchDate = '';

  itemCode = '';
  itemName = '';
  taxPercent = '';
  poNo = '';
  poDate = '';
  tenderNo = '';
  consigneeName = '';
  modelNo = '';
  make = '';
  basicRate = 0;
  totalNetPoValue = 0;
  totalGrossPoValue = 0;
  poQtyAllConsignees = 0;
  poQtyConsignee = 0;
  dispatchedQty = 0;
  balanceQty = 0;
  supplyDays = '';
  warrantyYears = 1;
  cancellationDays = '';
  lastReceiptDate = '';

  challanNo = '';
  challanDate = '';
  invoiceNo = '';
  invoiceDate = '';
  dispatchNo = '';
  dispatchDate = '';
  supplierRemarks = '';
  receivedDate = '';
  receiptNo = '';
  receiptQty = '';
  receiptRemarks = '';

  issueDetailOptions: IssueDetailOption[] = [];
  installationLines: InstallationLine[] = [];

  selectedIssueDetailId = 0;
  selectedSerialNo = '';
  selectedWarrantyCertificateNo = '';
  selectedDispatchQty = 0;
  warrantyCardNo = '';
  installQty = 1;
  installationDate = '';
  warrantyFromDate = '';
  warrantyToDate = '';
  installationBy = '';
  installationLocation = '';
  bulkInst = false;

  cgmscLogoPrinted = 'N';
  warrantyValidity = 'N';
  serviceManual = 'N';
  operatingManual = 'N';
  calibrationCertificate = 'N';
  warrantyCard = 'N';
  otherStatutory = 'N';
  poDocuments = 'N';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    if (!this.userId) {
      this.toastr.error('Please login again — user id missing.');
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      this.poId = Number(params.get('poId') || params.get('POID') || 0);
      this.locId = Number(params.get('locId') || params.get('LOCID') || 0);
      this.issueId = Number(params.get('issueId') || params.get('Issue_ID') || 0);
      if (!this.poId || !this.locId || !this.issueId) {
        this.toastr.error('PO, consignee and issue are required.');
        return;
      }
      this.loadPage();
    });
  }

  setTab(tab: ReceiptTab): void {
    this.activeTab = tab;
  }

  get maxAllowedDaysDisplay(): string {
    return this.cancellationDays.trim() || '-';
  }

  get lastReceiptDateDisplay(): string {
    return this.lastReceiptDate.trim() || '-';
  }

  get minReceivedDate(): string {
    return this.toIsoDate(this.dispatchDate);
  }

  get maxReceivedDate(): string {
    const todayIso = this.toIsoFromDate(new Date());
    const lastIso = this.toIsoDate(this.lastReceiptDate);
    if (!lastIso) return todayIso;
    return lastIso < todayIso ? lastIso : todayIso;
  }

  get minInstallationDate(): string {
    return this.receivedDate || this.minReceivedDate;
  }

  onSerialSelected(): void {
    const selected = this.issueDetailOptions.find(
      (item) => item.issueDetailId === this.selectedIssueDetailId,
    );
    this.selectedSerialNo = selected?.serialNo ?? '';
    this.selectedWarrantyCertificateNo = selected?.warrantyCertificateNo ?? '';
    this.selectedDispatchQty = selected?.dispatchedQty ?? 0;
    if (this.selectedDispatchQty > 0 && this.installQty > this.selectedDispatchQty) {
      this.installQty = this.selectedDispatchQty;
    }
  }

  onInstallationDateChanged(): void {
    if (!this.installationDate) {
      this.warrantyFromDate = '';
      this.warrantyToDate = '';
      return;
    }
    const [year, month, day] = this.installationDate.split('-').map(Number);
    const fromDate = new Date(year, month - 1, day);
    const toDate = new Date(fromDate);
    toDate.setFullYear(toDate.getFullYear() + (this.warrantyYears > 0 ? this.warrantyYears : 1));
    this.warrantyFromDate = this.formatDisplayDate(fromDate);
    this.warrantyToDate = this.formatDisplayDate(toDate);
  }

  saveReceipt(): void {
    const receivedDate = this.fromIsoDate(this.receivedDate);
    const receiptNo = this.receiptNo.trim();
    const receiptQty = this.asTrimmedString(this.receiptQty);
    const receiptRemarks = this.receiptRemarks.trim();

    if (!receivedDate) {
      this.toastr.warning('Please enter received date.');
      return;
    }
    if (this.minReceivedDate && this.receivedDate < this.minReceivedDate) {
      this.toastr.warning('Received date cannot be before supplier dispatch date.');
      return;
    }
    if (this.maxReceivedDate && this.receivedDate > this.maxReceivedDate) {
      if (this.lastReceiptDate && this.lastReceiptDate !== '-') {
        this.toastr.warning(
          `Received date cannot be greater than last date to be received of PO (${this.lastReceiptDate}).`,
        );
      } else {
        this.toastr.warning('Received date cannot be greater than today.');
      }
      return;
    }
    if (!receiptNo) {
      this.toastr.warning('Please enter receipt no / stock book no.');
      return;
    }
    if (!receiptQty || Number(receiptQty) <= 0) {
      this.toastr.warning('Please enter receipt qty greater than zero.');
      return;
    }
    if (!receiptRemarks) {
      this.toastr.warning('Please enter receipt remarks.');
      return;
    }

    this.saving = true;
    this.http
      .post<{ message?: string; receiptId?: number }>(`${this.apiRoot}receipt-entry`, {
        userId: this.userId,
        poId: this.poId,
        locationId: this.locId,
        issueId: this.issueId,
        receivedDate,
        receiptNo,
        receiptQty,
        receiptRemarks,
      })
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.receiptId = Number(res?.receiptId ?? this.receiptId);
          this.toastr.success(res?.message ?? 'Receipt details saved.');
          this.activeTab = 'installation';
          this.loadPage();
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(err, 'Unable to save receipt details.'));
        },
      });
  }

  saveInstallationLine(): void {
    if (!this.receiptId) {
      this.toastr.warning('Please save receipt details first.');
      return;
    }
    if (!this.selectedIssueDetailId) {
      this.toastr.warning('Please select serial no.');
      return;
    }
    if (!this.warrantyCardNo.trim()) {
      this.toastr.warning('Please enter warranty card no.');
      return;
    }
    if (!this.installationDate) {
      this.toastr.warning('Please enter installation date.');
      return;
    }
    if (!this.installationBy.trim()) {
      this.toastr.warning('Please enter installation by / engineer name.');
      return;
    }
    if (!this.installationLocation.trim()) {
      this.toastr.warning('Please enter installation location.');
      return;
    }
    if (Number(this.installQty) <= 0) {
      this.toastr.warning('Installed qty should be greater than zero.');
      return;
    }
    if (this.selectedDispatchQty > 0 && Number(this.installQty) > this.selectedDispatchQty) {
      this.toastr.warning('Installed qty cannot be more than dispatched qty.');
      return;
    }

    this.saving = true;
    this.http
      .post<{ message?: string }>(`${this.apiRoot}receipt-entry/installation`, {
        userId: this.userId,
        receiptId: this.receiptId,
        issueDetailId: this.selectedIssueDetailId,
        warrantyCardNo: this.warrantyCardNo.trim(),
        receivedQty: Number(this.installQty),
        installationDate: this.fromIsoDate(this.installationDate),
        installationBy: this.installationBy.trim(),
        installationLocation: this.installationLocation.trim(),
        cgmscLogoPrinted: this.cgmscLogoPrinted,
        warrantyValidity: this.warrantyValidity,
        serviceManual: this.serviceManual,
        operatingManual: this.operatingManual,
        calibrationCertificate: this.calibrationCertificate,
        warrantyCard: this.warrantyCard,
        otherStatutory: this.otherStatutory,
        poDocuments: this.poDocuments,
        bulkInst: this.bulkInst,
      })
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.toastr.success(res?.message ?? 'Installation details saved.');
          this.resetInstallationForm();
          this.loadPage();
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(err, 'Unable to save installation details.'));
        },
      });
  }

  completeInstallation(): void {
    if (!this.receiptId) {
      this.toastr.warning('Please save receipt details first.');
      return;
    }
    if (!this.installDispatchNo.trim() || !this.installDispatchDate) {
      this.toastr.warning('Please enter installation dispatch no and date.');
      return;
    }
    this.saving = true;
    this.http
      .post<{ message?: string }>(`${this.apiRoot}receipt-entry/complete`, {
        userId: this.userId,
        poId: this.poId,
        locationId: this.locId,
        issueId: this.issueId,
        receiptId: this.receiptId,
        installDispatchNo: this.installDispatchNo.trim(),
        installDispatchDate: this.fromIsoDate(this.installDispatchDate),
      })
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.toastr.success(res?.message ?? 'Installation completed.');
          this.router.navigate(['/orders/purchase-order-receipts']);
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(err, 'Unable to complete installation.'));
        },
      });
  }

  uploadFile(
    input: HTMLInputElement,
    fileType: 'insreport' | 'insphoto' | 'waranty' | 'chalan',
    itemDetailId = 0,
    bulk = false,
  ): void {
    const file = input.files?.[0];
    if (!file) {
      this.toastr.warning('Please select a PDF file.');
      return;
    }
    if (!this.receiptId) {
      this.toastr.warning('Please save receipt details first.');
      return;
    }
    const formData = new FormData();
    formData.append('userId', String(this.userId));
    formData.append('receiptId', String(this.receiptId));
    formData.append('fileType', fileType);
    formData.append('itemDetailId', String(itemDetailId));
    formData.append('bulk', String(bulk));
    formData.append('file', file);
    this.uploading = true;
    this.http.post<{ message?: string }>(`${this.apiRoot}receipt-entry/file`, formData).subscribe({
      next: (res) => {
        this.uploading = false;
        input.value = '';
        this.toastr.success(res?.message ?? 'File uploaded.');
        this.loadPage();
      },
      error: (err) => {
        this.uploading = false;
        this.toastr.error(apiErrorMessage(err, 'Unable to upload file.'));
      },
    });
  }

  get bulkUploadRows(): { fileType: 'insreport' | 'insphoto' | 'waranty' | 'chalan'; label: string; hasFile: boolean }[] {
    return [
      { fileType: 'insreport', label: 'Combined Receipt / Installation Report', hasFile: this.hasBulkInstallationReport },
      { fileType: 'insphoto', label: 'Installation Photos', hasFile: this.hasBulkInstallationPhoto },
      { fileType: 'waranty', label: 'Warranty Cards', hasFile: this.hasBulkWarrantyCard },
      { fileType: 'chalan', label: 'Challan / Invoice Copies', hasFile: this.hasBulkChallan },
    ];
  }

  goBack(): void {
    this.router.navigate(['/orders/purchase-order-receipts']);
  }

  private loadPage(): void {
    this.loading = true;
    this.http
      .get<Record<string, unknown>>(
        `${this.apiRoot}receipt-entry?userId=${this.userId}&poId=${this.poId}&locId=${this.locId}&issueId=${this.issueId}`,
      )
      .subscribe({
        next: (raw) => {
          this.loading = false;
          this.applyPage(raw);
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error(apiErrorMessage(err, 'Unable to load receipt entry.'));
        },
      });
  }

  private applyPage(data: Record<string, unknown>): void {
    this.receiptId = Number(data['receiptId'] ?? data['ReceiptId'] ?? 0);
    this.categoryId = Number(data['categoryId'] ?? data['CategoryId'] ?? 0);
    this.itemCode = String(data['itemCode'] ?? data['ItemCode'] ?? '');
    this.itemName = String(data['itemName'] ?? data['ItemName'] ?? '');
    this.taxPercent = String(data['taxPercent'] ?? data['TaxPercent'] ?? '');
    this.poNo = String(data['poNo'] ?? data['PoNo'] ?? '');
    this.poDate = String(data['poDate'] ?? data['PoDate'] ?? '');
    this.tenderNo = String(data['tenderNo'] ?? data['TenderNo'] ?? '');
    this.consigneeName = String(data['consigneeName'] ?? data['ConsigneeName'] ?? '');
    this.modelNo = String(data['modelNo'] ?? data['ModelNo'] ?? '');
    this.make = String(data['make'] ?? data['Make'] ?? '');
    this.basicRate = Number(data['basicRate'] ?? data['BasicRate'] ?? 0);
    this.totalNetPoValue = Number(data['totalNetPoValue'] ?? data['TotalNetPoValue'] ?? 0);
    this.totalGrossPoValue = Number(data['totalGrossPoValue'] ?? data['TotalGrossPoValue'] ?? 0);
    this.poQtyAllConsignees = Number(data['poQtyAllConsignees'] ?? data['PoQtyAllConsignees'] ?? 0);
    this.poQtyConsignee = Number(data['poQtyConsignee'] ?? data['PoQtyConsignee'] ?? 0);
    this.dispatchedQty = Number(data['dispatchedQty'] ?? data['DispatchedQty'] ?? 0);
    this.balanceQty = Number(data['balanceQty'] ?? data['BalanceQty'] ?? 0);
    this.supplyDays = String(data['supplyDays'] ?? data['SupplyDays'] ?? '');
    this.warrantyYears = Number(data['warrantyYears'] ?? data['WarrantyYears'] ?? 1) || 1;
    this.cancellationDays = String(
      data['cancellationDays'] ?? data['CancellationDays'] ?? '',
    ).trim();
    this.lastReceiptDate = String(data['lastReceiptDate'] ?? data['LastReceiptDate'] ?? '');
    this.bulkInst = Boolean(data['bulkInst'] ?? data['BulkInst'] ?? false);
    this.hasBulkInstallationReport = Boolean(
      data['hasBulkInstallationReport'] ?? data['HasBulkInstallationReport'] ?? false,
    );
    this.hasBulkInstallationPhoto = Boolean(
      data['hasBulkInstallationPhoto'] ?? data['HasBulkInstallationPhoto'] ?? false,
    );
    this.hasBulkWarrantyCard = Boolean(
      data['hasBulkWarrantyCard'] ?? data['HasBulkWarrantyCard'] ?? false,
    );
    this.hasBulkChallan = Boolean(data['hasBulkChallan'] ?? data['HasBulkChallan'] ?? false);

    this.challanNo = String(data['challanNo'] ?? data['ChallanNo'] ?? '');
    this.challanDate = String(data['challanDate'] ?? data['ChallanDate'] ?? '');
    this.invoiceNo = String(data['invoiceNo'] ?? data['InvoiceNo'] ?? '');
    this.invoiceDate = String(data['invoiceDate'] ?? data['InvoiceDate'] ?? '');
    this.dispatchNo = String(data['dispatchNo'] ?? data['DispatchNo'] ?? '');
    this.dispatchDate = String(data['dispatchDate'] ?? data['DispatchDate'] ?? '');
    this.supplierRemarks = String(data['supplierRemarks'] ?? data['SupplierRemarks'] ?? '');
    this.receivedDate = this.toIsoDate(String(data['receivedDate'] ?? data['ReceivedDate'] ?? ''));
    this.receiptNo = String(data['receiptNo'] ?? data['ReceiptNo'] ?? '');
    this.receiptQty = String(data['receiptQty'] ?? data['ReceiptQty'] ?? '');
    this.receiptRemarks = String(data['receiptRemarks'] ?? data['ReceiptRemarks'] ?? '');
    this.installDispatchNo = String(data['installDispatchNo'] ?? data['InstallDispatchNo'] ?? '');
    this.installDispatchDate = this.toIsoDate(
      String(data['installDispatchDate'] ?? data['InstallDispatchDate'] ?? ''),
    );
    if (!this.receiptQty && this.dispatchedQty > 0) {
      this.receiptQty = String(this.dispatchedQty);
    }

    const issueRaw = (data['issueDetailOptions'] ?? data['IssueDetailOptions'] ?? []) as unknown[];
    this.issueDetailOptions = issueRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        issueDetailId: Number(row['issueDetailId'] ?? row['IssueDetailId'] ?? 0),
        serialNo: String(row['serialNo'] ?? row['SerialNo'] ?? ''),
        warrantyCertificateNo: String(
          row['warrantyCertificateNo'] ?? row['WarrantyCertificateNo'] ?? '',
        ),
        dispatchedQty: Number(row['dispatchedQty'] ?? row['DispatchedQty'] ?? 0),
      };
    });
    if (!this.selectedIssueDetailId && this.issueDetailOptions.length) {
      this.selectedIssueDetailId = this.issueDetailOptions[0].issueDetailId;
    }
    this.onSerialSelected();

    const linesRaw = (data['installationLines'] ?? data['InstallationLines'] ?? []) as unknown[];
    this.installationLines = linesRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        itemDetailId: Number(row['itemDetailId'] ?? row['ItemDetailId'] ?? 0),
        issueDetailId: Number(row['issueDetailId'] ?? row['IssueDetailId'] ?? 0),
        serialNo: String(row['serialNo'] ?? row['SerialNo'] ?? ''),
        warrantyCertificateNo: String(
          row['warrantyCertificateNo'] ?? row['WarrantyCertificateNo'] ?? '',
        ),
        warrantyCardNo: String(row['warrantyCardNo'] ?? row['WarrantyCardNo'] ?? ''),
        receivedQty: Number(row['receivedQty'] ?? row['ReceivedQty'] ?? 0),
        installationDate: String(row['installationDate'] ?? row['InstallationDate'] ?? ''),
        warrantyFromDate: String(row['warrantyFromDate'] ?? row['WarrantyFromDate'] ?? ''),
        warrantyToDate: String(row['warrantyToDate'] ?? row['WarrantyToDate'] ?? ''),
        installationBy: String(row['installationBy'] ?? row['InstallationBy'] ?? ''),
        installationLocation: String(
          row['installationLocation'] ?? row['InstallationLocation'] ?? '',
        ),
        hasInstallationReport: Boolean(
          row['hasInstallationReport'] ?? row['HasInstallationReport'] ?? false,
        ),
        hasInstallationPhoto: Boolean(
          row['hasInstallationPhoto'] ?? row['HasInstallationPhoto'] ?? false,
        ),
        hasWarrantyCard: Boolean(row['hasWarrantyCard'] ?? row['HasWarrantyCard'] ?? false),
        hasChallan: Boolean(row['hasChallan'] ?? row['HasChallan'] ?? false),
      };
    });
  }

  private resetInstallationForm(): void {
    this.warrantyCardNo = '';
    this.installQty = 1;
    this.installationDate = '';
    this.warrantyFromDate = '';
    this.warrantyToDate = '';
    this.installationBy = '';
    this.installationLocation = '';
  }

  private formatDisplayDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private toIsoDate(displayDate: string): string {
    const trimmed = displayDate.trim();
    if (!trimmed || trimmed === '-') return '';
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  }

  private toIsoFromDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private fromIsoDate(isoDate: string): string {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) return '';
    return `${day}/${month}/${year}`;
  }

  private asTrimmedString(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }
}
