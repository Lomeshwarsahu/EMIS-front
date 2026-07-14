import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SanctionReport } from '../sanction-report.model';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-supplier-sanction-report-view',
  standalone: true,
  imports: [CommonModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-sanction-report-view.component.html',
  styleUrls: ['./supplier-sanction-report-view.component.css'],
})
export class SupplierSanctionReportViewComponent {
  @Input() report: SanctionReport | null = null;
  @Input() loading = false;
  @Input() loadError = '';
  @Input() printContainerId = 'sanctionPrintDiv';

  private printing = false;

  printReport(): void {
    if (this.printing || !this.report) {
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
  <title>Sanction Report</title>
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
      body { font-family: Calibri, Arial, sans-serif; color: #000; margin: 16px; font-size: 9pt; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #000; padding: 4px 6px; vertical-align: top; }
      th { text-align: center; font-weight: 700; background: #f3f4f6; }
      .center { text-align: center; }
      .right { text-align: right; }
      .title { text-align: center; font-size: 14pt; font-weight: 700; margin-bottom: 10px; }
      .meta { margin-bottom: 10px; }
      .section { margin: 12px 0 6px; font-weight: 700; }
      .summary-row td { font-weight: 700; }
    `;
  }
}
