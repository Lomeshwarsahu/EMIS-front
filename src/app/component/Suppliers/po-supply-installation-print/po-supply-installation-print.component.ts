import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';
import {
  InstallationPrintReport,
  mapInstallationPrintReport,
} from '../installation-report.model';
import { SupplierInstallationPrintViewComponent } from '../supplier-installation-print-view/supplier-installation-print-view.component';

@Component({
  selector: 'app-po-supply-installation-print',
  standalone: true,
  imports: [CommonModule, SupplierInstallationPrintViewComponent],
  template: `
    <app-supplier-installation-print-view
      [report]="report"
      [loading]="loading"
      [loadError]="loadError" />
  `,
})
export class PoSupplyInstallationPrintComponent implements OnInit {
  loading = false;
  userId = 0;
  report: InstallationPrintReport | null = null;
  loadError = '';

  constructor(
    private readonly route: ActivatedRoute,
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
      const receiptItemId = Number(
        params.get('receiptItemId') ||
          params.get('Receiptitemid') ||
          params.get('ReceiptItemId') ||
          0,
      );

      if (!receiptItemId) {
        this.loadError = 'Receipt item id is required.';
        this.toastr.error(this.loadError);
        return;
      }

      this.loadReport(receiptItemId);
    });
  }

  private loadReport(receiptItemId: number): void {
    this.loading = true;
    this.loadError = '';
    this.report = null;

    this.api.getSupplierInstallationPrintReport(this.userId, receiptItemId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.report = mapInstallationPrintReport(raw as Record<string, unknown>);
      },
      error: (err) => {
        this.loading = false;
        this.report = null;
        this.loadError = err?.error?.message ?? 'Unable to load installation print report.';
        this.toastr.error(this.loadError);
      },
    });
  }
}
