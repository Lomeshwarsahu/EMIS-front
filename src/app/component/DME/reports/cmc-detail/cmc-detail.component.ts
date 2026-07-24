import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { DmePageSkeletonComponent } from '../../shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage } from '../../shared/session.util';

interface CmcItemOption {
  ItemCodeAsPerTender: string;
  ItemName: string;
}

interface CmcTenderOption {
  TenderId: number;
  TenderNo: string;
}

interface CmcDetailRow {
  ItemCodeAsPerTender: string;
  ItemName: string;
  TenderNo: string;
  Cmc1: number;
  Cmc2: number;
  Cmc3: number;
  Cmc4: number;
  Cmc5: number;
}

@Component({
  selector: 'app-cmc-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './cmc-detail.component.html',
  styleUrls: ['./cmc-detail.component.css'],
})
export class CmcDetailComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEOrder/`;

  itemOptions: CmcItemOption[] = [];
  tenderOptions: CmcTenderOption[] = [];
  rows: CmcDetailRow[] = [];

  selectedItemCode = '0';
  selectedTenderId = 0;
  loading = false;
  tendersLoading = false;

  get hasActiveFilter(): boolean {
    return (this.selectedItemCode !== '0' && !!this.selectedItemCode) || this.selectedTenderId > 0;
  }

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadDetail();
  }

  onItemChange(): void {
    this.selectedTenderId = 0;
    this.tenderOptions = [];

    if (!this.selectedItemCode || this.selectedItemCode === '0') {
      this.loadDetail();
      return;
    }

    this.tendersLoading = true;
    this.http
      .get<CmcTenderOption[]>(`${this.apiRoot}cmc-tenders?itemCode=${encodeURIComponent(this.selectedItemCode)}`)
      .subscribe({
        next: (res) => {
          this.tenderOptions = this.mapTenders(res);
          this.tendersLoading = false;
          this.loadDetail();
        },
        error: (e) => {
          this.tendersLoading = false;
          this.toastr.error(apiErrorMessage(e, 'Could not load tenders.'));
          this.loadDetail();
        },
      });
  }

  onTenderChange(): void {
    this.loadDetail();
  }

  clearFilters(): void {
    this.selectedItemCode = '0';
    this.selectedTenderId = 0;
    this.tenderOptions = [];
    this.loadDetail();
  }

  loadDetail(): void {
    this.loading = true;
    const params = new URLSearchParams();
    if (this.selectedItemCode && this.selectedItemCode !== '0') {
      params.set('itemCode', this.selectedItemCode);
    }
    if (this.selectedTenderId > 0) {
      params.set('tenderId', String(this.selectedTenderId));
    }
    const qs = params.toString();

    this.http.get<CmcDetailRow[]>(`${this.apiRoot}cmc-detail${qs ? `?${qs}` : ''}`).subscribe({
      next: (res) => {
        this.rows = this.mapRows(res);
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.rows = [];
        this.toastr.error(apiErrorMessage(e, 'Could not load CMC detail.'));
      },
    });
  }

  exportExcel(): void {
    if (!this.rows.length) {
      this.toastr.warning('No records to export.');
      return;
    }
    const header = ['S.No', 'Code', 'Item Name', 'Tender No', 'CMC1', 'CMC2', 'CMC3', 'CMC4', 'CMC5'];
    const lines = this.rows.map((r, i) =>
      [i + 1, r.ItemCodeAsPerTender, r.ItemName, r.TenderNo, r.Cmc1, r.Cmc2, r.Cmc3, r.Cmc4, r.Cmc5]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(','),
    );
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cmc-detail.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  private loadItems(): void {
    this.http.get<CmcItemOption[]>(`${this.apiRoot}cmc-items`).subscribe({
      next: (res) => {
        this.itemOptions = this.mapItems(res);
        this.selectedItemCode = '0';
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load items.')),
    });
  }

  private mapItems(raw: unknown): CmcItemOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      ItemCodeAsPerTender: String(r['ItemCodeAsPerTender'] ?? r['itemCodeAsPerTender'] ?? '0'),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
    }));
  }

  private mapTenders(raw: unknown): CmcTenderOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      TenderId: Number(r['TenderId'] ?? r['tenderId'] ?? 0),
      TenderNo: String(r['TenderNo'] ?? r['tenderNo'] ?? ''),
    }));
  }

  private mapRows(raw: unknown): CmcDetailRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      ItemCodeAsPerTender: String(r['ItemCodeAsPerTender'] ?? r['itemCodeAsPerTender'] ?? ''),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      TenderNo: String(r['TenderNo'] ?? r['tenderNo'] ?? ''),
      Cmc1: Number(r['Cmc1'] ?? r['cmc1'] ?? 0),
      Cmc2: Number(r['Cmc2'] ?? r['cmc2'] ?? 0),
      Cmc3: Number(r['Cmc3'] ?? r['cmc3'] ?? 0),
      Cmc4: Number(r['Cmc4'] ?? r['cmc4'] ?? 0),
      Cmc5: Number(r['Cmc5'] ?? r['cmc5'] ?? 0),
    }));
  }
}
