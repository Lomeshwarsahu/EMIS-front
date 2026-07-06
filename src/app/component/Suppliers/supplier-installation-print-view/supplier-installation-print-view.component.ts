import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { InstallationPrintReport } from '../installation-report.model';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-supplier-installation-print-view',
  standalone: true,
  imports: [CommonModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-installation-print-view.component.html',
  styleUrls: ['./supplier-installation-print-view.component.css', '../supplier-po-pages.shared.css'],
})
export class SupplierInstallationPrintViewComponent {
  @Input() report: InstallationPrintReport | null = null;
  @Input() loading = false;
  @Input() loadError = '';
  @Input() printContainerId = 'installationPrintDiv';

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
  <title>Installation Report</title>
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
      body { font-family: 'Times New Roman', Times, serif; color: #000; margin: 16px; }
      table { width: 100%; border-collapse: collapse; }
      .outer-table { border: 1px solid #000; }
      .inner-table { border: 1px solid #000; margin: 0 auto; }
      .inner-table td { border: 1px solid #000; padding: 6px 8px; font-size: 13px; }
      .title-cell { text-align: center; padding: 8px; font-weight: 700; }
      .meta-left { text-align: left; }
      .meta-right { text-align: right; }
      .label-cell { width: 42%; }
      .note-cell { padding: 8px; font-size: 12px; }
    `;
  }
}
