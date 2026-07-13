import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PoPrintReport } from '../po-print-report.model';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-supplier-po-print-view',
  standalone: true,
  imports: [CommonModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-po-print-view.component.html',
  styleUrls: ['./supplier-po-print-view.component.css'],
})
export class SupplierPoPrintViewComponent {
  @Input() report: PoPrintReport | null = null;
  @Input() loading = false;
  @Input() loadError = '';
  @Input() printContainerId = 'poPrintDiv';

  private printing = false;

  get showAmendment(): boolean {
    const amendNo = Number(this.report?.amendNo ?? 0);
    return amendNo > 0;
  }

  get cmcTotal(): string {
    if (!this.report) {
      return 'NA';
    }

    const values = [this.report.cmc1, this.report.cmc2, this.report.cmc3, this.report.cmc4, this.report.cmc5];
    const numeric = values
      .map((value) => (value === 'NA' ? 0 : Number(value)))
      .filter((value) => !Number.isNaN(value));
    const total = numeric.reduce((sum, value) => sum + value, 0);
    return total === 0 ? 'NA' : String(total);
  }

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
  <title>Purchase Order</title>
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
      .report-block { margin-bottom: 12px; }
      .items-table th, .items-table td, .consignee-table th, .consignee-table td, .cmc-table th, .cmc-table td {
        border: 1px solid #000; padding: 4px 6px;
      }
      .items-table th, .consignee-table th, .cmc-table th { text-align: center; font-weight: 700; }
      .title-line { font-weight: 700; margin: 4px 0; }
      .center { text-align: center; }
      .right { text-align: right; }
      .amend-note { color: #000; font-weight: 700; margin: 8px 0; }
    `;
  }
}
