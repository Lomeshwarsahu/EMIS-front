import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

// Tender block shown on top of every Plan a Tender sub-page (legacy: Tender No / Tender Date / Description table)
// and the "Back to Tender" button that returns to /tender/plan on the same financial year.
@Component({
  selector: 'app-tender-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <button type="button" class="back-btn" (click)="goBack()">Back to Tender</button>
    </div>
    <div class="detail-header-card tender-header">
      <div class="detail-header-grid cols-3">
        <div class="detail-header-item">
          <span class="label">Tender No</span>
          <span class="value">{{ tender?.TENDER_NO || '—' }}</span>
        </div>
        <div class="detail-header-item">
          <span class="label">Tender Date</span>
          <span class="value">{{ tender?.TENDER_DATE || '—' }}</span>
        </div>
        <div class="detail-header-item">
          <span class="label">Status</span>
          <span class="value">{{ tender?.cStatus || '—' }}</span>
        </div>
        <div class="detail-header-item full">
          <span class="label">Description</span>
          <span class="value">{{ tender?.TENDER_DESCRIPTION || '—' }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css'],
  styles: [
    `
      .tender-header {
        margin-bottom: 12px;
      }
      .detail-header-item.full {
        grid-column: 1 / -1;
      }
      @media (max-width: 720px) {
        .detail-header-grid.cols-3 {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TenderPageHeaderComponent implements OnChanges {
  @Input() tenderId: number | string | null = null;
  @Output() loaded = new EventEmitter<any>();

  tender: any = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnChanges(): void {
    const id = Number(this.tenderId);
    if (!id) return;
    this.api.get(`BME/GetTenderDetailsById/${id}`).subscribe({
      next: (res: any) => {
        this.tender = (Array.isArray(res) ? res[0] : res) || null;
        this.loaded.emit(this.tender);
      },
      error: (err: any) => console.log('Error loading tender:', err),
    });
  }

  goBack() {
    const id = Number(this.tenderId);
    this.router.navigate(['/tender/plan'], id ? { queryParams: { tenderid: id } } : {});
  }
}
