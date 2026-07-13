import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DispatchReport } from '../dispatch-report.model';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-supplier-dispatch-report-view',
  standalone: true,
  imports: [CommonModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-dispatch-report-view.component.html',
  styleUrls: ['./supplier-dispatch-report-view.component.css'],
})
export class SupplierDispatchReportViewComponent {
  @Input() report: DispatchReport | null = null;
  @Input() loading = false;
  @Input() loadError = '';
  @Input() inline = false;
  @Input() printContainerId = 'divToPrint';

  private printing = false;

  printReport(): void {
    if (this.printing) {
      return;
    }

    const divToPrint = document.getElementById(this.printContainerId);
    if (!divToPrint) {
      return;
    }

    this.printing = true;

    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.position = 'fixed';
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
  <title>Dispatch Details</title>
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
    printWindow.focus();
    printWindow.print();

    setTimeout(cleanup, 2000);
  }

  private getPrintDocumentStyles(): string {
    return `
      * { box-sizing: border-box; }
      body {
        margin: 12px;
        padding: 0;
        background: #fff;
        color: #000;
        font-family: Arial, 'Times New Roman', Times, serif;
      }
      .report-card {
        border: 1px solid #000;
        background: #fff;
        width: 1000px;
        max-width: 100%;
        margin: 0 auto;
        page-break-inside: avoid;
      }
      .report-inner { width: 100%; border-collapse: collapse; }
      .report-title-cell,
      .section-title-cell {
        text-align: center;
        text-decoration: underline;
        font-size: 14px;
        padding: 10px 8px;
      }
      .meta-left, .meta-right {
        padding: 4px 8px 10px;
        font-size: 12px;
        vertical-align: top;
      }
      .meta-right { text-align: right; }
      .details-wrap { text-align: center; padding: 0 8px 8px; }
      .invoice-wrap { padding: 0 8px 12px; text-align: left; }
      .info-table, .invoice-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        font-family: 'Times New Roman', Times, serif;
      }
      .invoice-table { width: 500px; max-width: 100%; }
      .info-table td, .invoice-table td {
        border: 1px solid #000;
        padding: 6px 8px;
        vertical-align: middle;
        word-break: break-word;
      }
      .label-cell {
        background: #f0f0f0 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        white-space: nowrap;
      }
      .value-cell { background: #fff !important; white-space: normal; }
      tr { page-break-inside: avoid; }
      @page { size: A4 portrait; margin: 12mm; }
    `;
  }
}
