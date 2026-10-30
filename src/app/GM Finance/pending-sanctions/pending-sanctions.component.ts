import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ListPager } from 'src/app/helper/list-pager';
import { ApiService } from 'src/app/service/api.service';
import { SupplierPageSkeletonComponent } from 'src/app/component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

interface PendingSanctionRow {
  PoId: number;
  SanctionId: number;
  TenderNo: string;
  PoNo: string;
  PoDate: string;
  Directorate: string;
  ItemCode: string;
  ItemName: string;
  Supplier: string;
  PoQty: number;
  PoType: string;
  NoOfInvoices: number;
  NoOfConsignees: number;
  Gross: number;
  Gross50: number;
}

/**
 * Payment/Sanctions.aspx (route data kind 'TP') and Payment/PSanctions.aspx (kind 'P', site-not-ready invoices):
 * POs with verified invoices waiting for sanction. "Go for Sanction" opens the sanction form.
 */
@Component({
  selector: 'app-pending-sanctions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule, SupplierPageSkeletonComponent],
  templateUrl: './pending-sanctions.component.html',
  styleUrls: ['../../component/Suppliers/supplier-po-pages.shared.css'],
})
export class PendingSanctionsComponent implements OnInit {
  readonly pager = new ListPager();
  kind: 'TP' | 'P' = 'TP';
  poType: 'All' | 'NP' | 'CP' = 'All';
  rows: PendingSanctionRow[] = [];
  loading = false;
  loaded = false;

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  get title(): string {
    return this.kind === 'P'
      ? 'Sanction Calculation on Verified Invoices (Site Not Ready)'
      : 'Sanction Calculation on Verified Invoices';
  }

  ngOnInit(): void {
    this.kind = this.route.snapshot.data['kind'] === 'P' ? 'P' : 'TP';
  }

  show(): void {
    this.loading = true;
    this.api.get(`GMFI/GetPendingSanctions?kind=${this.kind}&poType=${this.poType}`).subscribe({
      next: (res: any) => {
        this.pager.reset();
        this.rows = Array.isArray(res) ? res : [];
        this.loading = false;
        this.loaded = true;
      },
      error: (err: any) => {
        this.loading = false;
        this.toastr.error(err?.error?.message || 'Could not load pending sanctions.');
      },
    });
  }

  goForSanction(row: PendingSanctionRow): void {
    this.router.navigate(['/Sanction'], {
      queryParams: this.kind === 'P' ? { poId: row.PoId, SanctionID: row.SanctionId } : { poId: row.PoId },
    });
  }

  openNotesheet(row: PendingSanctionRow): void {
    this.router.navigate(['/PODetailsRDLC'], { queryParams: { Pono_ID: row.PoId, sancid: row.SanctionId } });
  }

  openInstallationDetails(row: PendingSanctionRow): void {
    this.router.navigate(['/PendingInstallDrillDown'], { queryParams: { poid: row.PoId } });
  }
}
