import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import {
  mapPoPrintReport,
  PoPrintReport,
} from '../../../Suppliers/po-print-report.model';
import { SupplierPoPrintViewComponent } from '../../../Suppliers/supplier-po-print-view/supplier-po-print-view.component';
import { resolveLoginUserId } from '../../shared/session.util';

@Component({
  selector: 'app-po-print',
  standalone: true,
  imports: [CommonModule, SupplierPoPrintViewComponent],
  template: `
    <app-supplier-po-print-view
      [report]="report"
      [loading]="loading"
      [loadError]="loadError" />
  `,
})
export class PoPrintComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  loading = false;
  report: PoPrintReport | null = null;
  loadError = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const userId = resolveLoginUserId();
    if (!userId) {
      this.loadError = 'Please login again — user id missing.';
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
      this.loadReport(userId, poId);
    });
  }

  private loadReport(userId: number, poId: number): void {
    this.loading = true;
    this.loadError = '';
    this.report = null;

    this.http
      .get<Record<string, unknown>>(`${this.apiRoot}po-report/print?userId=${userId}&poId=${poId}`)
      .subscribe({
        next: (raw) => {
          this.loading = false;
          this.report = mapPoPrintReport(raw);
          if (!this.report.poNo && !this.report.items.length) {
            this.loadError = 'Purchase order report data is empty.';
          }
        },
        error: (err) => {
          this.loading = false;
          this.report = null;
          this.loadError =
            err?.error?.detail || err?.error?.message || 'Unable to load purchase order report.';
          this.toastr.error(this.loadError);
        },
      });
  }
}
