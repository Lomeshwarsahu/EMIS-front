import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';
import { PoPrintReport, mapPoPrintReport } from '../po-print-report.model';
import { SupplierPoPrintViewComponent } from '../supplier-po-print-view/supplier-po-print-view.component';

@Component({
  selector: 'app-po-supply-po-print',
  standalone: true,
  imports: [CommonModule, SupplierPoPrintViewComponent],
  template: `
    <app-supplier-po-print-view
      [report]="report"
      [loading]="loading"
      [loadError]="loadError" />
  `,
})
export class PoSupplyPoPrintComponent implements OnInit {
  loading = false;
  userId = 0;
  report: PoPrintReport | null = null;
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
        params.get('poId') || params.get('PO_ID') || params.get('POID') || params.get('PoId') || 0,
      );

      if (!poId) {
        this.loadError = 'PO id is required.';
        this.toastr.error(this.loadError);
        return;
      }

      this.loadReport(poId);
    });
  }

  private loadReport(poId: number): void {
    this.loading = true;
    this.loadError = '';
    this.report = null;

    this.api.getSupplierPoPrintReport(this.userId, poId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.report = mapPoPrintReport(raw as Record<string, unknown>);
        if (!this.report.poNo && !this.report.items.length) {
          this.loadError = 'Purchase order report data is empty.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.report = null;
        this.loadError = err?.error?.message ?? 'Unable to load purchase order report.';
        this.toastr.error(this.loadError);
      },
    });
  }
}
