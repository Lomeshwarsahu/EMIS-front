import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';
import { mapSanctionReport, SanctionReport } from '../sanction-report.model';
import { SupplierSanctionReportViewComponent } from '../supplier-sanction-report-view/supplier-sanction-report-view.component';

@Component({
  selector: 'app-supplier-sanction-report',
  standalone: true,
  imports: [CommonModule, SupplierSanctionReportViewComponent],
  template: `
    <app-supplier-sanction-report-view
      [report]="report"
      [loading]="loading"
      [loadError]="loadError" />
  `,
})
export class SupplierSanctionReportComponent implements OnInit {
  loading = false;
  userId = 0;
  report: SanctionReport | null = null;
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
      const poId = Number(
        params.get('poId') || params.get('PONOID') || params.get('PoId') || params.get('POID') || 0,
      );
      const sanctionId = Number(
        params.get('sanctionId') ||
          params.get('SanctionID') ||
          params.get('SanctionId') ||
          params.get('SANCTIONID') ||
          0,
      );

      if (!poId || !sanctionId) {
        this.loadError = 'PO id and sanction id are required.';
        this.toastr.error(this.loadError);
        return;
      }

      this.loadReport(poId, sanctionId);
    });
  }

  private loadReport(poId: number, sanctionId: number): void {
    this.loading = true;
    this.loadError = '';
    this.report = null;

    this.api.getSupplierSanctionReport(this.userId, poId, sanctionId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.report = mapSanctionReport(raw as Record<string, unknown>);
        if (!this.report.poNo && !this.report.items.length && !this.report.lines.length) {
          this.loadError = 'Sanction report data is empty.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.report = null;
        this.loadError = err?.error?.message ?? 'Unable to load sanction report.';
        this.toastr.error(this.loadError);
      },
    });
  }
}
