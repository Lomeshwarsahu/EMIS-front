import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';
import {
  InstallationReportPage,
  InstallationReportRow,
  mapInstallationReportPage,
} from '../installation-report.model';

type InstallationFileType = 'insReport' | 'insPhoto' | 'waranty' | 'chalan';

@Component({
  selector: 'app-po-supply-installation-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './po-supply-installation-report.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './po-supply-installation-report.component.css'],
})
export class PoSupplyInstallationReportComponent implements OnInit {
  loading = false;
  userId = 0;
  receiptId = 0;
  page: InstallationReportPage | null = null;
  loadError = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveSupplierUserId();
    if (!this.userId) {
      this.loadError = 'Please login as supplier.';
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

  openPrint(row: InstallationReportRow): void {
    this.router.navigate(['/transaction/po-supply-installation-print'], {
      queryParams: { receiptItemId: row.itemDetailId },
    });
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

    this.api.getSupplierInstallationReport(this.userId, this.receiptId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.page = mapInstallationReportPage(raw as Record<string, unknown>);
        if (!this.page.rows.length) {
          this.loadError = 'No installation items found for this receipt.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.loadError = err?.error?.message ?? 'Unable to load installation report.';
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
      receiptId: String(receiptId),
      fileType,
    });

    if (!bulk) {
      params.set('itemDetailId', String(itemDetailId));
    } else {
      params.set('bulk', 'true');
    }

    const url = `${environment.apiUrl}/Auth/supplier/installation-report/file/by-user/${this.userId}?${params.toString()}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
