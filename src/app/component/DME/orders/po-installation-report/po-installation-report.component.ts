import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

type InstallationFileType = 'insReport' | 'insPhoto' | 'waranty' | 'chalan';

interface InstallationReportRow {
  slNo: number;
  itemDetailId: number;
  serialNo: string;
  installationDate: string;
  warrantyFrom: string;
  warrantyTo: string;
  receivedQty: number;
  warrantyCardNo: string;
  installationLocation: string;
  isMongo: boolean;
  hasInstallationReport: boolean;
  hasInstallationPhoto: boolean;
  hasWarrantyCard: boolean;
  hasChallan: boolean;
}

interface InstallationReportPage {
  receiptId: number;
  receivedDate: string;
  bulkInst: boolean;
  hasBulkInstallationReport: boolean;
  hasBulkInstallationPhoto: boolean;
  hasBulkWarrantyCard: boolean;
  hasBulkChallan: boolean;
  rows: InstallationReportRow[];
}

@Component({
  selector: 'app-po-installation-report',
  standalone: true,
  imports: [CommonModule, DmePageSkeletonComponent],
  templateUrl: './po-installation-report.component.html',
  styleUrls: ['../dme-order-detail.shared.css', './po-installation-report.component.css'],
})
export class PoInstallationReportComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  loading = false;
  userId = 0;
  receiptId = 0;
  page: InstallationReportPage | null = null;
  loadError = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    if (!this.userId) {
      this.loadError = 'Please login again — user id missing.';
      this.toastr.error(this.loadError);
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      this.receiptId = Number(
        params.get('receiptId') || params.get('Receipt_id') || params.get('ReceiptId') || 0,
      );
      if (!this.receiptId) {
        this.loadError = 'Receipt id is required.';
        this.toastr.error(this.loadError);
        return;
      }
      this.loadReport();
    });
  }

  showRowDocuments(): boolean {
    return !this.page?.bulkInst;
  }

  goBack(): void {
    this.router.navigate(['/orders/purchase-order-receipts']);
  }

  openPrint(row: InstallationReportRow): void {
    const html = `<!DOCTYPE html><html><head><title>Installation Report</title>
<style>
  body{font-family:'Times New Roman',Times,serif;color:#003399;padding:24px}
  h2{text-align:center} table{width:100%;border-collapse:collapse;margin-top:16px}
  td,th{border:1px solid #3366cc;padding:8px;text-align:left}
  th{background:#003399;color:#ccf}
</style></head><body>
<h2>Installation Report</h2>
<table>
<tr><th>Serial No</th><td>${row.serialNo || '—'}</td></tr>
<tr><th>Installation Date</th><td>${row.installationDate || '—'}</td></tr>
<tr><th>Warranty From</th><td>${row.warrantyFrom || '—'}</td></tr>
<tr><th>Warranty To</th><td>${row.warrantyTo || '—'}</td></tr>
<tr><th>Receipt Qty</th><td>${row.receivedQty}</td></tr>
<tr><th>Warranty Card No</th><td>${row.warrantyCardNo || '—'}</td></tr>
<tr><th>Installation Location</th><td>${row.installationLocation || '—'}</td></tr>
</table>
<script>window.onload=function(){window.print();}</script>
</body></html>`;
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) {
      this.toastr.warning('Please allow pop-ups to print.');
      return;
    }
    w.document.write(html);
    w.document.close();
  }

  downloadBulk(fileType: InstallationFileType): void {
    this.openFileUrl(this.receiptId, fileType, 0, true);
  }

  downloadRowFile(row: InstallationReportRow, fileType: InstallationFileType): void {
    this.openFileUrl(this.receiptId, fileType, row.itemDetailId, false);
  }

  viewRowFile(row: InstallationReportRow, fileType: InstallationFileType): void {
    this.openFileUrl(this.receiptId, fileType, row.itemDetailId, false);
  }

  private loadReport(): void {
    this.loading = true;
    this.loadError = '';
    this.page = null;

    this.http
      .get<Record<string, unknown>>(
        `${this.apiRoot}installation-report?userId=${this.userId}&receiptId=${this.receiptId}`,
      )
      .subscribe({
        next: (raw) => {
          this.loading = false;
          this.page = this.mapPage(raw);
          if (!this.page.rows.length) {
            this.loadError = 'No installation items found for this receipt.';
          }
        },
        error: (err) => {
          this.loading = false;
          this.loadError = apiErrorMessage(err, 'Unable to load installation report.');
          this.toastr.error(this.loadError);
        },
      });
  }

  private openFileUrl(
    receiptId: number,
    fileType: InstallationFileType,
    itemDetailId: number,
    bulk: boolean,
  ): void {
    const params = new URLSearchParams({
      userId: String(this.userId),
      receiptId: String(receiptId),
      fileType,
    });
    if (!bulk) {
      params.set('itemDetailId', String(itemDetailId));
    } else {
      params.set('bulk', 'true');
    }
    const url = `${this.apiRoot}installation-report/file?${params.toString()}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private mapPage(raw: Record<string, unknown>): InstallationReportPage {
    const rowsRaw = (raw['rows'] ?? raw['Rows'] ?? []) as unknown[];
    return {
      receiptId: Number(raw['receiptId'] ?? raw['ReceiptId'] ?? this.receiptId),
      receivedDate: String(raw['receivedDate'] ?? raw['ReceivedDate'] ?? ''),
      bulkInst: Boolean(raw['bulkInst'] ?? raw['BulkInst'] ?? false),
      hasBulkInstallationReport: Boolean(
        raw['hasBulkInstallationReport'] ?? raw['HasBulkInstallationReport'] ?? false,
      ),
      hasBulkInstallationPhoto: Boolean(
        raw['hasBulkInstallationPhoto'] ?? raw['HasBulkInstallationPhoto'] ?? false,
      ),
      hasBulkWarrantyCard: Boolean(raw['hasBulkWarrantyCard'] ?? raw['HasBulkWarrantyCard'] ?? false),
      hasBulkChallan: Boolean(raw['hasBulkChallan'] ?? raw['HasBulkChallan'] ?? false),
      rows: rowsRaw.map((item) => {
        const row = item as Record<string, unknown>;
        return {
          slNo: Number(row['slNo'] ?? row['SlNo'] ?? 0),
          itemDetailId: Number(row['itemDetailId'] ?? row['ItemDetailId'] ?? 0),
          serialNo: String(row['serialNo'] ?? row['SerialNo'] ?? ''),
          installationDate: String(row['installationDate'] ?? row['InstallationDate'] ?? ''),
          warrantyFrom: String(row['warrantyFrom'] ?? row['WarrantyFrom'] ?? ''),
          warrantyTo: String(row['warrantyTo'] ?? row['WarrantyTo'] ?? ''),
          receivedQty: Number(row['receivedQty'] ?? row['ReceivedQty'] ?? 0),
          warrantyCardNo: String(row['warrantyCardNo'] ?? row['WarrantyCardNo'] ?? ''),
          installationLocation: String(
            row['installationLocation'] ?? row['InstallationLocation'] ?? '',
          ),
          isMongo: Boolean(row['isMongo'] ?? row['IsMongo'] ?? false),
          hasInstallationReport: Boolean(
            row['hasInstallationReport'] ?? row['HasInstallationReport'] ?? false,
          ),
          hasInstallationPhoto: Boolean(
            row['hasInstallationPhoto'] ?? row['HasInstallationPhoto'] ?? false,
          ),
          hasWarrantyCard: Boolean(row['hasWarrantyCard'] ?? row['HasWarrantyCard'] ?? false),
          hasChallan: Boolean(row['hasChallan'] ?? row['HasChallan'] ?? false),
        };
      }),
    };
  }
}
