import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { ListPager } from 'src/app/helper/list-pager';
import { ApiService } from 'src/app/service/api.service';
import { apiErrorMessage } from '../../DME/shared/session.util';
import { SupplierPageSkeletonComponent } from '../../Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';
import { DispatchPendingPo, DispatchPendingSupplier } from './supplier-dispatch-ho.models';

/** Order/SupplierDispatchPending_HO.aspx — POs dated before 01/01/2021 whose supply is still pending. */
@Component({
  selector: 'app-supplier-dispatch-pending-ho',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, MatPaginatorModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-dispatch-pending-ho.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', './supplier-dispatch-ho.shared.css'],
})
export class SupplierDispatchPendingHoComponent implements OnInit {
  readonly pager = new ListPager();
  suppliers: DispatchPendingSupplier[] = [];
  rows: DispatchPendingPo[] = [];
  selectedSupplierId: number | null = null;
  loading = false;
  loaded = false;

  constructor(
    private readonly api: ApiService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    // Keeps the supplier when coming back from the consignee/installation view.
    const supplierId = Number(this.route.snapshot.queryParamMap.get('supplierId') || 0);
    this.api.get('SupplierDispatchHO/pending-suppliers').subscribe({
      next: (res: any) => {
        this.suppliers = Array.isArray(res) ? res : [];
        if (supplierId) {
          this.selectedSupplierId = supplierId;
          this.show();
        }
      },
      error: (e: any) => this.toastr.error(apiErrorMessage(e, 'Could not load suppliers.')),
    });
  }

  show(): void {
    if (!this.selectedSupplierId) {
      this.toastr.warning('Select Pending Dispatch supplier.');
      return;
    }
    this.loading = true;
    this.api.get(`SupplierDispatchHO/pending-pos?supplierId=${this.selectedSupplierId}`).subscribe({
      next: (res: any) => {
        this.pager.reset();
        this.rows = Array.isArray(res) ? res : [];
        this.loading = false;
        this.loaded = true;
      },
      error: (e: any) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load pending purchase orders.'));
      },
    });
  }

  rowClass(row: DispatchPendingPo): string {
    if (row.SupplyStatus === 'Not Supplied') return 'supply-none';
    if (row.SupplyStatus === 'Partial Supplied') return 'supply-partial';
    return 'supply-complete';
  }

  openConsignees(row: DispatchPendingPo): void {
    this.router.navigate(['/orders/supplier-dispatch-pending-cons-ho'], {
      queryParams: { POID: row.PoId, supplierId: this.selectedSupplierId },
    });
  }

  openInstallation(row: DispatchPendingPo): void {
    this.router.navigate(['/orders/supplier-dispatch-pending-insta-ho'], {
      queryParams: { POID: row.PoId, supplierId: this.selectedSupplierId },
    });
  }
}
