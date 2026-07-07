import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';
import { resolveSupplierUserId } from '../supplier-user.util';
import {
  PoSupplyReceiptFilters,
  navigateToPoSupplyReceipt,
  readPoSupplyReceiptFilters,
} from '../supplier-transaction-state.util';

type ReceiptTab = 'receipt' | 'installation' | 'complete';

interface IssueDetailOption {
  issueDetailId: number;
  serialNo: string;
  warrantyCertificateNo: string;
  dispatchedQty: number;
}

interface InstallationLine {
  issueDetailId: number;
  serialNo: string;
  warrantyCertificateNo: string;
  warrantyCardNo: string;
  receivedQty: number;
  installationDate: string;
  warrantyFromDate: string;
  warrantyToDate: string;
  installationBy: string;
  installationLocation: string;
}

@Component({
  selector: 'app-po-supply-receipt-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SupplierPageSkeletonComponent],
  templateUrl: './po-supply-receipt-entry.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './po-supply-receipt-entry.component.css'],
})
export class PoSupplyReceiptEntryComponent implements OnInit {
  loading = false;
  saving = false;
  activeTab: ReceiptTab = 'receipt';
  userId = 0;

  poId = 0;
  locId = 0;
  issueId = 0;
  receiptId = 0;

  itemCode = '';
  itemName = '';
  taxPercent = '';
  poNo = '';
  poDate = '';
  tenderNo = '';
  consigneeName = '';
  modelNo = '';
  make = '';
  basicRate = 0;
  totalNetPoValue = 0;
  totalGrossPoValue = 0;
  poQtyAllConsignees = 0;
  poQtyConsignee = 0;
  dispatchedQty = 0;
  balanceQty = 0;
  supplyDays = '';
  lastReceiptDate = '';

  challanNo = '';
  challanDate = '';
  invoiceNo = '';
  invoiceDate = '';
  dispatchNo = '';
  dispatchDate = '';
  supplierRemarks = '';
  receivedDate = '';
  receiptNo = '';
  receiptQty = '';
  receiptRemarks = '';

  issueDetailOptions: IssueDetailOption[] = [];
  installationLines: InstallationLine[] = [];

  selectedIssueDetailId = 0;
  warrantyCardNo = '';
  installQty = 1;
  installationDate = '';
  installationBy = '';
  installationLocation = '';
  cgmscLogoPrinted = 'N';
  warrantyValidity = 'N';
  serviceManual = 'N';
  operatingManual = 'N';
  calibrationCertificate = 'N';
  warrantyCard = 'N';
  otherStatutory = 'N';
  poDocuments = 'N';
  private returnFilters: PoSupplyReceiptFilters = {
    financialYearId: 0,
    poType: 'All',
    poId: 0,
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveSupplierUserId();
    if (!this.userId) {
      this.toastr.error('Please login as supplier.');
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      this.returnFilters = readPoSupplyReceiptFilters({
        financialYearId: params.get('financialYearId') ?? 0,
        poType: params.get('poType') ?? 'All',
        poId: params.get('poId') ?? 0,
      });
      this.poId = Number(params.get('poId') || params.get('POID') || 0);
      this.locId = Number(params.get('locId') || params.get('LOCID') || 0);
      this.issueId = Number(params.get('issueId') || params.get('Issue_ID') || 0);
      if (!this.poId || !this.locId || !this.issueId) {
        this.toastr.error('PO, consignee and issue are required.');
        return;
      }
      this.loadPage();
    });
  }

  setTab(tab: ReceiptTab): void {
    this.activeTab = tab;
  }

  saveReceipt(): void {
    this.saving = true;
    this.api
      .saveSupplierReceiptEntry(this.userId, {
        poId: this.poId,
        locationId: this.locId,
        issueId: this.issueId,
        receivedDate: this.fromIsoDate(this.receivedDate),
        receiptNo: this.receiptNo.trim(),
        receiptQty: this.receiptQty.trim(),
        receiptRemarks: this.receiptRemarks.trim(),
      })
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.receiptId = Number(res?.receiptId ?? this.receiptId);
          this.toastr.success(res?.message ?? 'Receipt details saved.');
          this.activeTab = 'installation';
          this.loadPage();
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(err?.error?.message ?? 'Unable to save receipt details.');
        },
      });
  }

  saveInstallationLine(): void {
    if (!this.receiptId) {
      this.toastr.warning('Please save receipt details first.');
      return;
    }
    this.saving = true;
    this.api
      .saveSupplierReceiptInstallation(this.userId, {
        receiptId: this.receiptId,
        issueDetailId: this.selectedIssueDetailId,
        warrantyCardNo: this.warrantyCardNo.trim(),
        receivedQty: Number(this.installQty),
        installationDate: this.fromIsoDate(this.installationDate),
        installationBy: this.installationBy.trim(),
        installationLocation: this.installationLocation.trim(),
        cgmscLogoPrinted: this.cgmscLogoPrinted,
        warrantyValidity: this.warrantyValidity,
        serviceManual: this.serviceManual,
        operatingManual: this.operatingManual,
        calibrationCertificate: this.calibrationCertificate,
        warrantyCard: this.warrantyCard,
        otherStatutory: this.otherStatutory,
        poDocuments: this.poDocuments,
      })
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.toastr.success(res?.message ?? 'Installation details saved.');
          this.resetInstallationForm();
          this.loadPage();
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(err?.error?.message ?? 'Unable to save installation details.');
        },
      });
  }

  completeInstallation(): void {
    if (!this.receiptId) {
      this.toastr.warning('Please save receipt details first.');
      return;
    }
    this.saving = true;
    this.api
      .completeSupplierReceiptEntry(this.userId, {
        poId: this.poId,
        locationId: this.locId,
        issueId: this.issueId,
        receiptId: this.receiptId,
      })
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.toastr.success(res?.message ?? 'Installation completed.');
          navigateToPoSupplyReceipt(this.router, this.returnFilters);
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(err?.error?.message ?? 'Unable to complete installation.');
        },
      });
  }

  goBack(): void {
    navigateToPoSupplyReceipt(this.router, this.returnFilters);
  }

  private loadPage(): void {
    this.loading = true;
    this.api.getSupplierReceiptEntry(this.userId, this.poId, this.locId, this.issueId).subscribe({
      next: (raw) => {
        this.loading = false;
        this.applyPage(raw as Record<string, unknown>);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load receipt entry.');
      },
    });
  }

  private applyPage(data: Record<string, unknown>): void {
    this.receiptId = Number(data['receiptId'] ?? data['ReceiptId'] ?? 0);
    this.itemCode = String(data['itemCode'] ?? data['ItemCode'] ?? '');
    this.itemName = String(data['itemName'] ?? data['ItemName'] ?? '');
    this.taxPercent = String(data['taxPercent'] ?? data['TaxPercent'] ?? '');
    this.poNo = String(data['poNo'] ?? data['PoNo'] ?? '');
    this.poDate = String(data['poDate'] ?? data['PoDate'] ?? '');
    this.tenderNo = String(data['tenderNo'] ?? data['TenderNo'] ?? '');
    this.consigneeName = String(data['consigneeName'] ?? data['ConsigneeName'] ?? '');
    this.modelNo = String(data['modelNo'] ?? data['ModelNo'] ?? '');
    this.make = String(data['make'] ?? data['Make'] ?? '');
    this.basicRate = Number(data['basicRate'] ?? data['BasicRate'] ?? 0);
    this.totalNetPoValue = Number(data['totalNetPoValue'] ?? data['TotalNetPoValue'] ?? 0);
    this.totalGrossPoValue = Number(data['totalGrossPoValue'] ?? data['TotalGrossPoValue'] ?? 0);
    this.poQtyAllConsignees = Number(data['poQtyAllConsignees'] ?? data['PoQtyAllConsignees'] ?? 0);
    this.poQtyConsignee = Number(data['poQtyConsignee'] ?? data['PoQtyConsignee'] ?? 0);
    this.dispatchedQty = Number(data['dispatchedQty'] ?? data['DispatchedQty'] ?? 0);
    this.balanceQty = Number(data['balanceQty'] ?? data['BalanceQty'] ?? 0);
    this.supplyDays = String(data['supplyDays'] ?? data['SupplyDays'] ?? '');
    this.lastReceiptDate = String(data['lastReceiptDate'] ?? data['LastReceiptDate'] ?? '');

    this.challanNo = String(data['challanNo'] ?? data['ChallanNo'] ?? '');
    this.challanDate = String(data['challanDate'] ?? data['ChallanDate'] ?? '');
    this.invoiceNo = String(data['invoiceNo'] ?? data['InvoiceNo'] ?? '');
    this.invoiceDate = String(data['invoiceDate'] ?? data['InvoiceDate'] ?? '');
    this.dispatchNo = String(data['dispatchNo'] ?? data['DispatchNo'] ?? '');
    this.dispatchDate = String(data['dispatchDate'] ?? data['DispatchDate'] ?? '');
    this.supplierRemarks = String(data['supplierRemarks'] ?? data['SupplierRemarks'] ?? '');
    this.receivedDate = this.toIsoDate(String(data['receivedDate'] ?? data['ReceivedDate'] ?? ''));
    this.receiptNo = String(data['receiptNo'] ?? data['ReceiptNo'] ?? '');
    this.receiptQty = String(data['receiptQty'] ?? data['ReceiptQty'] ?? '');
    this.receiptRemarks = String(data['receiptRemarks'] ?? data['ReceiptRemarks'] ?? '');

    const issueRaw = (data['issueDetailOptions'] ?? data['IssueDetailOptions'] ?? []) as unknown[];
    this.issueDetailOptions = issueRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        issueDetailId: Number(row['issueDetailId'] ?? row['IssueDetailId'] ?? 0),
        serialNo: String(row['serialNo'] ?? row['SerialNo'] ?? ''),
        warrantyCertificateNo: String(
          row['warrantyCertificateNo'] ?? row['WarrantyCertificateNo'] ?? '',
        ),
        dispatchedQty: Number(row['dispatchedQty'] ?? row['DispatchedQty'] ?? 0),
      };
    });
    if (!this.selectedIssueDetailId && this.issueDetailOptions.length) {
      this.selectedIssueDetailId = this.issueDetailOptions[0].issueDetailId;
    }

    const linesRaw = (data['installationLines'] ?? data['InstallationLines'] ?? []) as unknown[];
    this.installationLines = linesRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        issueDetailId: Number(row['issueDetailId'] ?? row['IssueDetailId'] ?? 0),
        serialNo: String(row['serialNo'] ?? row['SerialNo'] ?? ''),
        warrantyCertificateNo: String(
          row['warrantyCertificateNo'] ?? row['WarrantyCertificateNo'] ?? '',
        ),
        warrantyCardNo: String(row['warrantyCardNo'] ?? row['WarrantyCardNo'] ?? ''),
        receivedQty: Number(row['receivedQty'] ?? row['ReceivedQty'] ?? 0),
        installationDate: String(row['installationDate'] ?? row['InstallationDate'] ?? ''),
        warrantyFromDate: String(row['warrantyFromDate'] ?? row['WarrantyFromDate'] ?? ''),
        warrantyToDate: String(row['warrantyToDate'] ?? row['WarrantyToDate'] ?? ''),
        installationBy: String(row['installationBy'] ?? row['InstallationBy'] ?? ''),
        installationLocation: String(row['installationLocation'] ?? row['InstallationLocation'] ?? ''),
      };
    });
  }

  private resetInstallationForm(): void {
    this.warrantyCardNo = '';
    this.installQty = 1;
    this.installationDate = '';
    this.installationBy = '';
    this.installationLocation = '';
  }

  private toIsoDate(displayDate: string): string {
    const trimmed = displayDate.trim();
    if (!trimmed) {
      return '';
    }
    const parts = trimmed.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  }

  private fromIsoDate(isoDate: string): string {
    if (!isoDate) {
      return '';
    }
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }
}
