import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

interface ReportHeader {
  IndentId: number;
  McName: string;
  BudgetName: string;
  IndentDate: string;
  Year: string;
  AsLetterNo: string;
  AsDate: string;
  DispatchNo: string;
  StatusLabel: string;
}

interface ReportLine {
  ItemCode: string;
  ItemName: string;
  LocationName: string;
  IndentQuantity: number;
  EstimatedCost: number;
  Value: number;
  RcStatus: string;
  Supplier: string;
  PriceIncGst: string;
  TenderNo: string;
  TenderStatus: string;
  Remarks: string;
}

interface FacilityIndentSummary {
  IndentId: number;
  McName: string;
  ConsolidatedDate: string;
  AsLetterNo: string;
  DispatchNo: string;
  NosIndentQty: number;
  EStatus: string;
}

@Component({
  selector: 'app-dme-fac-indent-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dme-fac-indent-report.component.html',
  styleUrls: ['./dme-fac-indent-report.component.css'],
})
export class DmeFacIndentReportComponent implements OnInit {
  private readonly orderApi = `${environment.apiUrl}/DMEOrder/`;
  private printing = false;

  loading = false;
  loadError = '';
  userId = 0;
  selectedIndentId = 0;

  header: ReportHeader | null = null;
  lines: ReportLine[] = [];
  availableIndents: FacilityIndentSummary[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    if (!this.userId) {
      this.loadError = 'Please login again — user id missing.';
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      const qIndentId = Number(params.get('indentId') || params.get('ICID') || params.get('IndentID') || 0);
      if (qIndentId) {
        this.selectedIndentId = qIndentId;
        this.loadReport(qIndentId, this.userId);
        this.loadAvailableIndents();
      } else {
        this.loadAvailableIndents(true);
      }
    });
  }

  loadAvailableIndents(autoSelectFirst = false): void {
    this.http
      .get<unknown[]>(`${this.orderApi}facility-indents?userId=${this.userId}&financialYearId=0`)
      .subscribe({
        next: (res) => {
          const arr = Array.isArray(res) ? res : [];
          this.availableIndents = arr.map((item: any) => ({
            IndentId: Number(item.indentId ?? item.IndentId ?? 0),
            McName: String(item.mcName ?? item.McName ?? ''),
            ConsolidatedDate: String(item.consolidatedDate ?? item.ConsolidatedDate ?? ''),
            AsLetterNo: String(item.asLetterNo ?? item.AsLetterNo ?? ''),
            DispatchNo: String(item.dispatchNo ?? item.DispatchNo ?? ''),
            NosIndentQty: Number(item.nosIndentQty ?? item.NosIndentQty ?? 0),
            EStatus: String(item.eStatus ?? item.EStatus ?? ''),
          }));

          if (autoSelectFirst && this.availableIndents.length > 0) {
            this.selectedIndentId = this.availableIndents[0].IndentId;
            this.loadReport(this.selectedIndentId, this.userId);
          } else if (autoSelectFirst && this.availableIndents.length === 0) {
            this.loadError = 'No indents found for your facility.';
          }
        },
        error: () => {
          if (autoSelectFirst && !this.selectedIndentId) {
            this.loadError = 'Please select an indent from Annual Indents to view report.';
          }
        },
      });
  }

  onIndentSelectChange(): void {
    if (this.selectedIndentId) {
      this.loadReport(this.selectedIndentId, this.userId);
    }
  }

  get totalValue(): number {
    return this.lines.reduce((sum, row) => sum + (Number(row.Value) || 0), 0);
  }

  goBack(): void {
    this.router.navigate(['/indents/annual-indent']);
  }

  printReport(): void {
    if (this.printing || !this.header) {
      return;
    }

    const divToPrint = document.getElementById('indentReportPrint');
    if (!divToPrint) {
      return;
    }

    this.printing = true;
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const printWindow = iframe.contentWindow;
    const printDoc = printWindow?.document;
    if (!printDoc || !printWindow) {
      document.body.removeChild(iframe);
      this.printing = false;
      window.print();
      return;
    }

    printDoc.open();
    printDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Annual Indent Report #${this.header.IndentId}</title>
  <style>
    ${this.printCss}
  </style>
</head>
<body>
  ${divToPrint.innerHTML}
</body>
</html>`);
    printDoc.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        this.printing = false;
      }, 500);
    }, 250);
  }

  private get printCss(): string {
    return `
      @page { size: landscape; margin: 12mm; }
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111; margin: 0; padding: 0; font-size: 11px; }
      .report-card { border: none; box-shadow: none; padding: 0; }
      .report-title { font-size: 16px; font-weight: bold; text-align: center; margin: 0 0 12px; }
      .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px 12px; margin-bottom: 12px; font-size: 11px; }
      .meta-grid .label { color: #555; display: inline-block; min-width: 90px; font-weight: 500; }
      .meta-grid .value { font-weight: 600; }
      .section-title { font-size: 13px; margin: 10px 0 6px; font-weight: 600; }
      table { width: 100%; border-collapse: collapse; font-size: 10px; }
      th, td { border: 1px solid #333; padding: 4px 6px; }
      th { background-color: #f0f0f0 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; text-align: left; }
      .text-center { text-align: center; }
      .text-right { text-align: right; }
      .empty-row { text-align: center; }
    `;
  }

  private loadReport(indentId: number, userId: number): void {
    this.loading = true;
    this.loadError = '';
    this.http
      .get<Record<string, unknown>>(`${this.orderApi}facility-indents/${indentId}/report?userId=${userId}`)
      .subscribe({
        next: (res) => {
          this.header = this.mapHeader(res['header'] ?? res['Header']);
          this.lines = this.mapLines(res['lines'] ?? res['Lines']);
          this.loading = false;
          if (!this.header) {
            this.loadError = 'Indent report not found.';
          }
        },
        error: (e) => {
          this.loading = false;
          this.header = null;
          this.lines = [];
          this.loadError = apiErrorMessage(e, 'Could not load indent report.');
          this.toastr.error(this.loadError);
        },
      });
  }

  private mapHeader(raw: unknown): ReportHeader | null {
    if (!raw || typeof raw !== 'object') {
      return null;
    }
    const r = raw as Record<string, unknown>;
    return {
      IndentId: Number(r['indentId'] ?? r['IndentId'] ?? 0),
      McName: String(r['mcName'] ?? r['McName'] ?? ''),
      BudgetName: String(r['budgetName'] ?? r['BudgetName'] ?? ''),
      IndentDate: String(r['indentDate'] ?? r['IndentDate'] ?? ''),
      Year: String(r['year'] ?? r['Year'] ?? ''),
      AsLetterNo: String(r['asLetterNo'] ?? r['AsLetterNo'] ?? ''),
      AsDate: String(r['asDate'] ?? r['AsDate'] ?? ''),
      DispatchNo: String(r['dispatchNo'] ?? r['DispatchNo'] ?? ''),
      StatusLabel: String(r['statusLabel'] ?? r['StatusLabel'] ?? ''),
    };
  }

  private mapLines(raw: unknown): ReportLine[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((row: Record<string, unknown>) => ({
      ItemCode: String(row['itemCode'] ?? row['ItemCode'] ?? ''),
      ItemName: String(row['itemName'] ?? row['ItemName'] ?? ''),
      LocationName: String(row['locationName'] ?? row['LocationName'] ?? ''),
      IndentQuantity: Number(row['indentQuantity'] ?? row['IndentQuantity'] ?? 0),
      EstimatedCost: Number(row['estimatedCost'] ?? row['EstimatedCost'] ?? 0),
      Value: Number(row['value'] ?? row['Value'] ?? 0),
      RcStatus: String(row['rcStatus'] ?? row['RcStatus'] ?? ''),
      Supplier: String(row['supplier'] ?? row['Supplier'] ?? ''),
      PriceIncGst: String(row['priceIncGst'] ?? row['PriceIncGst'] ?? ''),
      TenderNo: String(row['tenderNo'] ?? row['TenderNo'] ?? ''),
      TenderStatus: String(row['tenderStatus'] ?? row['TenderStatus'] ?? ''),
      Remarks: String(row['remarks'] ?? row['Remarks'] ?? ''),
    }));
  }
}
