import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

interface BudgetHeadRow {
  HeadId: number;
  HeadNo: string;
  HeadName: string;
}

@Component({
  selector: 'app-dme-fac-heads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dme-fac-heads.component.html',
  styleUrls: ['./dme-fac-heads.component.css'],
})
export class DmeFacHeadsComponent implements OnInit, OnDestroy {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  rows: BudgetHeadRow[] = [];
  headNo = '';
  headName = '';
  loading = false;
  saving = false;
  showAddModal = false;
  userId = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    this.load();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('emis-modal-open');
  }

  load(): void {
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }

    this.loading = true;
    this.http.get<BudgetHeadRow[]>(`${this.apiRoot}budget-heads?userId=${this.userId}`).subscribe({
      next: (res) => {
        this.rows = this.mapRows(res);
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load budget heads.'));
      },
    });
  }

  openAddModal(): void {
    this.headNo = '';
    this.headName = '';
    this.showAddModal = true;
    document.body.classList.add('emis-modal-open');
  }

  closeAddModal(): void {
    if (this.saving) {
      return;
    }
    this.showAddModal = false;
    document.body.classList.remove('emis-modal-open');
  }

  save(): void {
    if (!this.headNo.trim() || !this.headName.trim()) {
      this.toastr.warning('Please enter Head No and Head Name.');
      return;
    }

    this.saving = true;
    this.http
      .post(`${this.apiRoot}budget-heads`, {
        HeadNo: this.headNo.trim(),
        HeadName: this.headName.trim(),
        UserId: this.userId,
      })
      .subscribe({
        next: (res: { message?: string }) => {
          this.saving = false;
          this.headNo = '';
          this.headName = '';
          this.closeAddModal();
          this.toastr.success(res?.message ?? 'Budget Head Saved Successfully.');
          this.load();
        },
        error: (e) => {
          this.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not save budget head.'));
        },
      });
  }

  private mapRows(raw: unknown): BudgetHeadRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      HeadId: Number(r['HeadId'] ?? r['headId'] ?? 0),
      HeadNo: String(r['HeadNo'] ?? r['headNo'] ?? ''),
      HeadName: String(r['HeadName'] ?? r['headName'] ?? ''),
    }));
  }
}
