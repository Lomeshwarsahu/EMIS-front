import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ListPager } from 'src/app/helper/list-pager';
import { ApiService } from 'src/app/service/api.service';
import { apiErrorMessage } from '../../DME/shared/session.util';
import { SupplierPageSkeletonComponent } from '../../Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';
import { DispatchBatch, DispatchConsigneeRow, DispatchConsigneeView } from './supplier-dispatch-ho.models';

/**
 * Order/SupplierDispatchPendingCons_HO.aspx (route data mode 'dispatch') and
 * Order/SupplierDispatchPendingInsta_HO.aspx (mode 'installation'): consignee rows of one PO with dispatch batches.
 * Legacy "add dispatch" / invoice upload / installation detail links pointed to pages that were never shipped,
 * so this view is read-only; a completed batch opens the dispatch report.
 */
@Component({
  selector: 'app-supplier-dispatch-consignee-ho',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-dispatch-consignee-ho.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', './supplier-dispatch-ho.shared.css'],
})
export class SupplierDispatchConsigneeHoComponent implements OnInit {
  readonly pager = new ListPager();
  installationMode = false;
  poNo = '';
  poDate = '';
  rows: DispatchConsigneeRow[] = [];
  loading = false;
  missingPo = false;
  private supplierId = 0;

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  get title(): string {
    return this.installationMode ? 'Installation Desk' : 'Dispatch Equipment Desk';
  }

  ngOnInit(): void {
    this.installationMode = this.route.snapshot.data['mode'] === 'installation';
    this.route.queryParamMap.subscribe((params) => {
      const poId = Number(params.get('POID') || params.get('poId') || 0);
      this.supplierId = Number(params.get('supplierId') || 0);
      this.missingPo = !poId;
      if (poId) this.load(poId);
    });
  }

  private load(poId: number): void {
    this.loading = true;
    this.api.get(`SupplierDispatchHO/po-consignees/${poId}`).subscribe({
      next: (res: any) => {
        const view = res as DispatchConsigneeView;
        this.poNo = view?.PoNo ?? '';
        this.poDate = view?.PoDate ?? '';
        this.pager.reset();
        this.rows = view?.Rows ?? [];
        this.loading = false;
      },
      error: (e: any) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load consignee dispatch details.'));
      },
    });
  }

  back(): void {
    this.router.navigate(['/orders/supplier-dispatch-pending-ho'], {
      queryParams: this.supplierId ? { supplierId: this.supplierId } : {},
    });
  }

  openReport(batch: DispatchBatch): void {
    this.router.navigate(['/transaction/po-supply-dispatch-report'], {
      queryParams: { poId: batch.PoId, locId: batch.LocationId, issueId: batch.IssueId },
    });
  }
}
