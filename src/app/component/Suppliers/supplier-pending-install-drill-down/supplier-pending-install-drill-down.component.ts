import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';

export interface PendingInstallDrillDownRow {
  district: string;
  consignee: string;
  poQty: number;
  dispatchedQty: number;
  receiptQty: number;
  installedQty: number;
  remarks: string;
}

export interface PendingInstallDrillDownReport {
  poId: number;
  itemName: string;
  itemCode: string;
  supplier: string;
  poNo: string;
  poDate: string;
  printDate: string;
  rows: PendingInstallDrillDownRow[];
}

@Component({
  selector: 'app-supplier-pending-install-drill-down',
  standalone: true,
  imports: [CommonModule, SupplierPageSkeletonComponent],
  templateUrl: './supplier-pending-install-drill-down.component.html',
  styleUrls: [
    '../supplier-po-pages.shared.css',
    './supplier-pending-install-drill-down.component.css',
  ],
})
export class SupplierPendingInstallDrillDownComponent implements OnInit {
  loading = false;
  userId = 0;
  poId = 0;
  loadError = '';
  report: PendingInstallDrillDownReport | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveSupplierUserId();
    if (!this.userId) {
      this.loadError = 'Please login as supplier.';
      this.toastr.error(this.loadError);
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      this.poId = Number(
        params.get('poId') || params.get('POID') || params.get('PoId') || params.get('poid') || 0,
      );
      if (!this.poId) {
        this.loadError = 'PO id is required.';
        this.toastr.error(this.loadError);
        return;
      }
      this.loadReport();
    });
  }

  print(): void {
    if (!this.report) {
      this.toastr.warning('Nothing to print.');
      return;
    }

    const snapshot: PendingInstallDrillDownReport = {
      ...this.report,
      printDate: this.formatPrintDate(new Date()),
      rows: [...this.report.rows],
    };
    this.report = snapshot;

    // Same-window iframe print (legacy printDiv) — no new tab, full data
    const html = this.buildPrintHtml(snapshot);
    let iframe = document.getElementById('pending-install-print-frame') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'pending-install-print-frame';
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.cssText =
        'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
      document.body.appendChild(iframe);
    }

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc || !iframe.contentWindow) {
      this.toastr.error('Unable to open print view.');
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    const doPrint = () => {
      try {
        iframe!.contentWindow!.focus();
        iframe!.contentWindow!.print();
      } catch {
        this.toastr.error('Print failed. Please try again.');
      }
    };

    // Wait for iframe content to render
    if (iframe.contentWindow.document.readyState === 'complete') {
      setTimeout(doPrint, 100);
    } else {
      iframe.onload = () => setTimeout(doPrint, 100);
    }
  }

  exportExcel(): void {
    if (!this.report?.rows?.length) {
      this.toastr.warning('No data to export.');
      return;
    }

    const headers = [
      'S.No',
      'District',
      'Consignee',
      'PO Qty',
      'Dispatch Qty',
      'Received Qty',
      'Installed Qty',
    ];
    const lines = this.report.rows.map((row, index) =>
      [
        index + 1,
        row.district,
        row.consignee,
        row.poQty,
        row.dispatchedQty,
        row.receiptQty,
        row.installedQty,
      ]
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(','),
    );
    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pending_Install_PO_${this.report.poNo || this.poId}_${Date.now()}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  back(): void {
    void this.router.navigate(['/reports/pending-receipt-installation']);
  }

  private loadReport(): void {
    this.userId = resolveSupplierUserId();
    if (!this.userId) {
      this.loading = false;
      this.loadError = 'Please login as supplier.';
      this.toastr.error(this.loadError);
      return;
    }

    this.loading = true;
    this.loadError = '';
    this.report = null;

    this.api.getSupplierBalanceStatusDrillDown(this.userId, this.poId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.report = this.mapReport(raw as Record<string, unknown>);
        if (!this.report.rows.length && !this.report.poNo) {
          this.loadError = 'No data found for this PO.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.loadError = err?.error?.message ?? 'Unable to load pending install drill-down.';
        this.toastr.error(this.loadError);
      },
    });
  }

  private mapReport(raw: Record<string, unknown>): PendingInstallDrillDownReport {
    const rowsRaw = (raw['rows'] ?? raw['Rows'] ?? []) as Record<string, unknown>[];
    return {
      poId: Number(raw['poId'] ?? raw['PoId'] ?? this.poId),
      itemName: String(raw['itemName'] ?? raw['ItemName'] ?? ''),
      itemCode: String(raw['itemCode'] ?? raw['ItemCode'] ?? ''),
      supplier: String(raw['supplier'] ?? raw['Supplier'] ?? ''),
      poNo: String(raw['poNo'] ?? raw['PoNo'] ?? ''),
      poDate: String(raw['poDate'] ?? raw['PoDate'] ?? ''),
      printDate: String(raw['printDate'] ?? raw['PrintDate'] ?? this.formatPrintDate(new Date())),
      rows: (Array.isArray(rowsRaw) ? rowsRaw : []).map((row) => ({
        district: String(row['district'] ?? row['District'] ?? ''),
        consignee: String(row['consignee'] ?? row['Consignee'] ?? ''),
        poQty: Number(row['poQty'] ?? row['PoQty'] ?? 0),
        dispatchedQty: Number(row['dispatchedQty'] ?? row['DispatchedQty'] ?? 0),
        receiptQty: Number(row['receiptQty'] ?? row['ReceiptQty'] ?? 0),
        installedQty: Number(row['installedQty'] ?? row['InstalledQty'] ?? 0),
        remarks: String(row['remarks'] ?? row['Remarks'] ?? ''),
      })),
    };
  }

  private formatPrintDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  private escapeHtml(value: string | number): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** Print HTML built from loaded report (same data as on screen). */
  private buildPrintHtml(report: PendingInstallDrillDownReport): string {
    const rowsHtml = report.rows.length
      ? report.rows
          .map(
            (row, i) => `
        <tr>
          <td class="c">${i + 1}</td>
          <td>${this.escapeHtml(row.district)}</td>
          <td>${this.escapeHtml(row.consignee)}</td>
          <td class="c">${this.escapeHtml(row.poQty)}</td>
          <td class="c">${this.escapeHtml(row.dispatchedQty)}</td>
          <td class="c">${this.escapeHtml(row.receiptQty)}</td>
          <td class="c">${this.escapeHtml(row.installedQty)}</td>
        </tr>`,
          )
          .join('')
      : `<tr><td colspan="7" class="c">No Record found.</td></tr>`;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Pending Receipt / Installation — PO ${this.escapeHtml(report.poNo || report.poId)}</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; font-size: 13px; color: #000; margin: 16px; }
    h2 { text-align: center; margin: 0 0 14px; font-size: 18px; }
    .meta { width: 100%; margin-bottom: 12px; border-collapse: collapse; }
    .meta td { padding: 4px 8px; vertical-align: top; }
    table.grid { width: 100%; border-collapse: collapse; }
    table.grid th, table.grid td { border: 1px solid #333; padding: 5px 6px; }
    table.grid th { background: #7488B4; color: #fff; font-size: 12px; }
    tr:nth-child(even) td { background: #eee; }
    .c { text-align: center; }
    @media print {
      body { margin: 8px; }
      table.grid th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <h2>Pending Receipt/Installation</h2>
  <table class="meta">
    <tr>
      <td><strong>Item Name:</strong> ${this.escapeHtml(report.itemName)}</td>
      <td><strong>Item Code:</strong> ${this.escapeHtml(report.itemCode)}</td>
      <td><strong>Supplier:</strong> ${this.escapeHtml(report.supplier)}</td>
    </tr>
    <tr>
      <td><strong>PO Number:</strong> ${this.escapeHtml(report.poNo)}</td>
      <td><strong>PO Date:</strong> ${this.escapeHtml(report.poDate)}</td>
      <td><strong>Print Date:</strong> ${this.escapeHtml(report.printDate)}</td>
    </tr>
  </table>
  <table class="grid">
    <thead>
      <tr>
        <th>S.No</th>
        <th>District</th>
        <th>Consignee</th>
        <th>PO Qty</th>
        <th>Dispatch Qty</th>
        <th>Received Qty</th>
        <th>Installed Qty</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
</body>
</html>`;
  }
}
