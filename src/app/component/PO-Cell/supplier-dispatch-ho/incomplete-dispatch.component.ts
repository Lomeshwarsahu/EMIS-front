import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ListPager } from 'src/app/helper/list-pager';
import { ApiService } from 'src/app/service/api.service';
import { apiErrorMessage } from '../../DME/shared/session.util';
import { SupplierPageSkeletonComponent } from '../../Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';
import {
  DispatchBatch,
  IncompleteDispatchHeader,
  IncompleteDispatchHistory,
  IncompleteDispatchPoOption,
} from './supplier-dispatch-ho.models';

interface IncompleteDispatchRow extends DispatchBatch {
  checked: boolean;
}

/**
 * POCell/InCompleteDispatch.aspx — marks a supplier's completed dispatch back to Incomplete (so the supplier can correct it)
 * against an approval mail/letter PDF. Only dispatches not yet received by the consignee can be reverted.
 * Legacy opened it from the PO dashboard with ?PoNoID=; this page also offers a PO search.
 */
@Component({
  selector: 'app-incomplete-dispatch',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule, SupplierPageSkeletonComponent],
  templateUrl: './incomplete-dispatch.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', './supplier-dispatch-ho.shared.css'],
})
export class IncompleteDispatchComponent implements OnInit {
  readonly pager = new ListPager();
  readonly historyPager = new ListPager();
  readonly fileUrl = `${environment.apiUrl}/DMEOrder/po-reallocation/file/`;

  searchTerm = '';
  searchResults: IncompleteDispatchPoOption[] = [];
  searching = false;

  header: IncompleteDispatchHeader | null = null;
  rows: IncompleteDispatchRow[] = [];
  history: IncompleteDispatchHistory[] = [];
  remark = '';
  selectedFile: File | null = null;
  loading = false;
  saving = false;

  constructor(
    private readonly api: ApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadHistory();
    this.route.queryParamMap.subscribe((params) => {
      const poId = Number(params.get('PoNoID') || params.get('poId') || 0);
      if (poId) this.loadPo(poId);
    });
  }

  search(): void {
    const term = this.searchTerm.trim();
    if (term.length < 2) {
      this.toastr.warning('Enter at least 2 characters of the PO number.');
      return;
    }
    this.searching = true;
    this.api.get(`SupplierDispatchHO/incomplete-dispatch/search-po?term=${encodeURIComponent(term)}`).subscribe({
      next: (res: any) => {
        this.searching = false;
        this.searchResults = Array.isArray(res) ? res : [];
        if (!this.searchResults.length) this.toastr.info('No dispatched PO matches this number.');
      },
      error: (e: any) => {
        this.searching = false;
        this.toastr.error(apiErrorMessage(e, 'Could not search purchase orders.'));
      },
    });
  }

  selectPo(option: IncompleteDispatchPoOption): void {
    this.searchResults = [];
    this.router.navigate([], { relativeTo: this.route, queryParams: { PoNoID: option.PoId } });
  }

  canSelect(row: IncompleteDispatchRow): boolean {
    return row.ReceivedDate === 'Not Receipt';
  }

  hasSelection(): boolean {
    return this.rows.some((r) => r.checked);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (file && !file.name.toLowerCase().endsWith('.pdf')) {
      this.toastr.warning('Please upload pdf file only.');
      input.value = '';
      this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
  }

  save(): void {
    if (!this.header) return;
    if (!this.selectedFile) {
      this.toastr.warning('Upload Mail/Approval Copy/Notesheet in PDF Format.');
      return;
    }
    const selected = this.rows.filter((r) => r.checked);
    if (!selected.length) {
      this.toastr.warning('No Checkbox is selected.');
      return;
    }

    const formData = new FormData();
    formData.append('poId', String(this.header.PoId));
    formData.append('remark', this.remark);
    formData.append('items', JSON.stringify(selected.map((r) => ({ IssueId: r.IssueId, LocationId: r.LocationId }))));
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.saving = true;
    this.api.post('SupplierDispatchHO/incomplete-dispatch', formData).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.toastr.success(res?.message ?? 'Supplier Dispatch has been Incompleted Successfully');
        this.remark = '';
        this.selectedFile = null;
        this.loadPo(this.header!.PoId);
        this.loadHistory();
      },
      error: (e: any) => {
        this.saving = false;
        this.toastr.error(apiErrorMessage(e, 'Could not mark the dispatch incomplete.'));
      },
    });
  }

  private loadPo(poId: number): void {
    this.loading = true;
    this.api.get(`SupplierDispatchHO/incomplete-dispatch/header?poId=${poId}`).subscribe({
      next: (res: any) => {
        this.header = res;
        this.loading = false;
      },
      error: (e: any) => {
        this.loading = false;
        this.header = null;
        this.toastr.error(apiErrorMessage(e, 'Could not load PO header.'));
      },
    });
    this.api.get(`SupplierDispatchHO/incomplete-dispatch/rows?poId=${poId}`).subscribe({
      next: (res: any) => {
        this.pager.reset();
        this.rows = (Array.isArray(res) ? res : []).map((r: DispatchBatch) => ({ ...r, checked: false }));
      },
      error: (e: any) => this.toastr.error(apiErrorMessage(e, 'Could not load dispatch rows.')),
    });
  }

  private loadHistory(): void {
    this.api.get('SupplierDispatchHO/incomplete-dispatch/history').subscribe({
      next: (res: any) => {
        this.historyPager.reset();
        this.history = Array.isArray(res) ? res : [];
      },
      error: (e: any) => this.toastr.error(apiErrorMessage(e, 'Could not load history.')),
    });
  }
}
