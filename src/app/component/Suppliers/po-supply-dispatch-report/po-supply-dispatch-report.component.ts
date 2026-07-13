import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';
import { DispatchReport, mapDispatchReport } from '../dispatch-report.model';
import { SupplierDispatchReportViewComponent } from '../supplier-dispatch-report-view/supplier-dispatch-report-view.component';

@Component({
  selector: 'app-po-supply-dispatch-report',
  standalone: true,
  imports: [CommonModule, SupplierDispatchReportViewComponent],
  template: `
    <app-supplier-dispatch-report-view
      [report]="report"
      [loading]="loading"
      [loadError]="loadError" />
  `,
})
export class PoSupplyDispatchReportComponent implements OnInit {
  loading = false;
  userId = 0;
  report: DispatchReport | null = null;
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
      const poId = Number(params.get('poId') || params.get('POID') || 0);
      const locId = Number(params.get('locId') || params.get('LOCID') || 0);
      const issueId = Number(params.get('issueId') || params.get('Issueid') || 0);

      if (!poId || !locId || !issueId) {
        this.toastr.error('PO id, location id and issue id are required.');
        return;
      }

      this.loadReport(poId, locId, issueId);
    });
  }

  private loadReport(poId: number, locId: number, issueId: number): void {
    this.loading = true;
    this.loadError = '';
    this.report = null;

    this.api.getSupplierDispatchReport(this.userId, poId, locId, issueId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.report = mapDispatchReport(raw as Record<string, unknown>);
        if (!this.report.poNo && !this.report.itemName) {
          this.loadError = 'Dispatch report data is empty.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.report = null;
        this.loadError = err?.error?.message ?? 'Unable to load dispatch report.';
        this.toastr.error(this.loadError);
      },
    });
  }
}
