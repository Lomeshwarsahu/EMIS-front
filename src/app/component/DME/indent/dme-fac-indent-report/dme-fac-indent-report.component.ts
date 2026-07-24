import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-dme-fac-indent-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dme-fac-indent-report.component.html',
  styleUrls: ['./dme-fac-indent-report.component.css'],
})
export class DmeFacIndentReportComponent implements OnInit {
  private readonly orderApi = `${environment.apiUrl}/DMEOrder/`;
  private printing = false;

  loading = false;
  loadError = '';
  header: ReportHeader | null = null;
  lines: ReportLine[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    const userId = resolveLoginUserId();
    if (!userId) {
      this.loadError = 'Please login again — user id missing.';
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      const indentId = Number(params.get('indentId') || params.get('ICID') || 0);
      if (!indentId) {
        this.loadError = 'Indent id is required.';
        return;
      }
      this.loadReport(indentId, userId);
    });
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
  <style>${this.getPrintDocumentStyles()}</style>
</head>
<body>${divToPrint.outerHTML}</body>
</html>`);
    printDoc.close();

    const cleanup = (): void => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      this.printing = false;
    };

    printWindow.onafterprint = cleanup;
    // Wait for iframe layout before printing (images/fonts).
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      setTimeout(cleanup, 2500);
    }, 150);
  }

  private getPrintDocumentStyles(): string {
    return `
      @page { size: A4 landscape; margin: 10mm; }
      * { box-sizing: border-box; }
      body {
        font-family: Calibri, Arial, sans-serif;
        color: #000;
        margin: 0;
        font-size: 9pt;
        background: #fff;
      }
      .report-card {
        border: none !important;
        border-radius: 0 !important;
        background: #fff !important;
        padding: 0 !important;
        color: #000 !important;
      }
      .report-title {
        text-align: center;
        font-size: 14pt;
        font-weight: 700;
        margin: 0 0 10px;
      }
      .meta-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 4px 12px;
        margin-bottom: 10px;
        font-size: 9pt;
      }
      .meta-grid .label { font-weight: 700; margin-right: 4px; }
      .meta-grid .label::after { content: ' :-'; }
      .section-title {
        margin: 8px 0 6px;
        font-size: 11pt;
        font-weight: 700;
      }
      .table-wrap {
        overflow: visible !important;
        border: none !important;
        border-radius: 0 !important;
      }
      .report-grid {
        width: 100% !important;
        min-width: 0 !important;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 8pt;
      }
      .report-grid thead th {
        background: #f3f4f6 !important;
        color: #000 !important;
        border: 1px solid #000;
        padding: 4px 5px;
        text-align: center;
        font-weight: 700;
        white-space: normal;
        word-break: break-word;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .report-grid td {
        border: 1px solid #000;
        padding: 3px 4px;
        vertical-align: top;
        word-break: break-word;
        background: #fff !important;
      }
      .report-grid tr.alt-row td { background: #fff !important; }
      .total-row td {
        font-weight: 700;
        background: #f3f4f6 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
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
