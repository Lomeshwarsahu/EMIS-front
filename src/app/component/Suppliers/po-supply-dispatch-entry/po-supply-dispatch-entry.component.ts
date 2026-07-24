import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service/api.service';
import { resolveSupplierUserId } from '../supplier-user.util';
import { SupplierPageSkeletonComponent } from '../supplier-page-skeleton/supplier-page-skeleton.component';
import { PoSupplyDispatchFilters, poSupplyDispatchQuery, readPoSupplyDispatchFilters } from '../supplier-transaction-state.util';

type DispatchTab = 'invoice' | 'equipment' | 'complete';

interface GstOption {
  gstId: number;
  gstNo: string;
}

interface EquipmentLine {
  issueDetailId: number;
  serialNo: string;
  warrantyCardNo: string;
  mfgDate: string;
  expDate: string;
  supplyQty: number;
  isEditing?: boolean;
}

@Component({
  selector: 'app-po-supply-dispatch-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SupplierPageSkeletonComponent],
  templateUrl: './po-supply-dispatch-entry.component.html',
  styleUrls: ['../supplier-po-pages.shared.css', './po-supply-dispatch-entry.component.css'],
})
export class PoSupplyDispatchEntryComponent implements OnInit {
  loading = false;
  saving = false;
  userId = 0;
  activeTab: DispatchTab = 'invoice';

  poId = 0;
  locId = 0;
  itemId = 0;
  issueId = 0;
  supplierId = 0;
  categoryId = 0;

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

  hasInvoice = false;
  hasInvoiceFile = false;
  challanNo = '';
  challanDate = '';
  invoiceNo = '';
  invoiceDate = '';
  ewayBillNo = '';
  ewayBillDate = '';
  hsnCode = '';
  tcsValue = '';
  invoiceGst = '';
  remarks = '';
  bulkVsSerial = '';
  selectedInvoiceFile: File | null = null;

  dispatchNo = '';
  dispatchDate = '';
  tentativeSupplyDate = '';
  cgmscLogoPrinted = 'N';
  warrantyValidity = 'N';
  serviceManual = 'N';
  operatingManual = 'N';
  calibrationCertificate = 'N';
  warrantyCard = 'N';
  otherStatutory = 'N';
  poDocuments = 'N';

  gstOptions: GstOption[] = [];
  equipmentLines: EquipmentLine[] = [];
  draftLine: EquipmentLine = this.emptyDraftLine();
  private returnFilters: PoSupplyDispatchFilters = {
    financialYearId: 0,
    tenderId: 0,
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
      this.returnFilters = readPoSupplyDispatchFilters({
        financialYearId: params.get('financialYearId') ?? 0,
        tenderId: params.get('tenderId') ?? 0,
      });
      this.poId = Number(params.get('poId') || params.get('POID') || 0);
      this.locId = Number(params.get('locId') || params.get('LOCID') || 0);
      this.itemId = Number(params.get('itemId') || params.get('ITEMID') || 0);
      this.issueId = Number(params.get('issueId') || params.get('Issue_id') || 0);
      if (!this.poId || !this.locId) {
        this.toastr.error('PO and consignee are required.');
        return;
      }
      this.loadPage();
    });
  }

  get invoiceButtonLabel(): string {
    return this.hasInvoice ? 'Update Invoice' : 'Generate Invoice';
  }

  get isReagent(): boolean {
    return this.categoryId === 2;
  }

  get pageTitle(): string {
    return this.isReagent ? 'Dispatch Entry of Reagents' : 'Dispatch Entry of Equipments';
  }

  get lineTabLabel(): string {
    return this.isReagent ? 'Reagent Entry' : 'Equipment Entry';
  }

  get canEditEquipment(): boolean {
    return this.issueId > 0 && !!this.bulkVsSerial;
  }

  setTab(tab: DispatchTab): void {
    this.activeTab = tab;
  }

  onInvoiceFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedInvoiceFile = input.files?.[0] ?? null;
  }

  saveInvoice(): void {
    if (!this.bulkVsSerial) {
      this.toastr.warning('Please Select Bulk Supply or Serial No wise Supply');
      return;
    }

    const formData = new FormData();
    formData.append('poId', String(this.poId));
    formData.append('locId', String(this.locId));
    formData.append('issueId', String(this.issueId));
    formData.append('challanNo', this.challanNo.trim());
    formData.append('challanDate', this.fromIsoDate(this.challanDate));
    formData.append('invoiceNo', this.invoiceNo.trim());
    formData.append('invoiceDate', this.fromIsoDate(this.invoiceDate));
    formData.append('ewayBillNo', this.ewayBillNo.trim());
    formData.append('ewayBillDate', this.fromIsoDate(this.ewayBillDate));
    formData.append('hsnCode', this.hsnCode.trim());
    formData.append('tcsValue', this.tcsValue.trim());
    formData.append('invoiceGst', this.invoiceGst);
    formData.append('remarks', this.remarks.trim());
    formData.append('bulkVsSerial', this.bulkVsSerial);
    if (this.selectedInvoiceFile) {
      formData.append('file', this.selectedInvoiceFile);
    }

    this.saving = true;
    this.api.saveSupplierDispatchInvoice(this.userId, formData).subscribe({
      next: (res) => {
        this.saving = false;
        this.issueId = Number(res?.issueId ?? this.issueId);
        this.hasInvoice = true;
        this.toastr.success(res?.message ?? 'Invoice saved.');
        this.activeTab = 'equipment';
        this.loadPage();
      },
      error: (err) => {
        this.saving = false;
        this.toastr.error(err?.error?.message ?? 'Unable to save invoice.');
      },
    });
  }

  saveEquipmentLine(line?: EquipmentLine): void {
    const target = line ?? this.draftLine;
    if (!this.issueId) {
      this.toastr.warning('Please save invoice details first.');
      return;
    }

    this.saving = true;
    this.api
      .saveSupplierDispatchEquipmentLine(this.userId, {
        issueId: this.issueId,
        issueDetailId: target.issueDetailId,
        serialNo: target.serialNo.trim(),
        warrantyCardNo: target.warrantyCardNo.trim(),
        mfgDate: this.fromIsoDate(target.mfgDate),
        expDate: this.fromIsoDate(target.expDate),
        supplyQty: Number(target.supplyQty),
      })
      .subscribe({
        next: (res) => {
          this.saving = false;
          this.toastr.success(res?.message ?? 'Line saved.');
          this.draftLine = this.emptyDraftLine();
          this.loadPage();
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(err?.error?.message ?? 'Unable to save line.');
        },
      });
  }

  editEquipmentLine(line: EquipmentLine): void {
    this.equipmentLines = this.equipmentLines.map((row) => ({
      ...row,
      isEditing: row.issueDetailId === line.issueDetailId,
    }));
  }

  cancelEdit(line: EquipmentLine): void {
    line.isEditing = false;
    this.loadPage();
  }

  completeDispatch(): void {
    if (!this.issueId) {
      this.toastr.warning('Please save invoice details first.');
      return;
    }

    this.saving = true;
    this.api
      .completeSupplierDispatch(this.userId, {
        poId: this.poId,
        locationId: this.locId,
        issueId: this.issueId,
        dispatchNo: this.dispatchNo.trim(),
        dispatchDate: this.fromIsoDate(this.dispatchDate),
        tentativeSupplyDate: this.fromIsoDate(this.tentativeSupplyDate),
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
          this.toastr.success(res?.message ?? 'Dispatch completed.');
          this.router.navigate(['/transaction/po-supply-dispatch']);
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(err?.error?.message ?? 'Unable to complete dispatch.');
        },
      });
  }

  downloadInvoice(): void {
    if (!this.issueId) {
      return;
    }
    const url = `${environment.apiUrl}/Auth/supplier/dispatch-entry/invoice-file/by-user/${this.userId}?issueId=${this.issueId}`;
    window.open(url, '_blank');
  }

  goBack(): void {
    this.router.navigate(['/transaction/po-supply-dispatch-edit'], {
      queryParams: { poId: this.poId, ...poSupplyDispatchQuery(this.returnFilters) },
    });
  }

  private loadPage(): void {
    this.loading = true;
    this.api.getSupplierDispatchEntry(this.userId, this.poId, this.locId, this.issueId, this.itemId).subscribe({
      next: (raw) => {
        this.loading = false;
        const data = raw as Record<string, unknown>;
        this.applyPage(data);
        if (this.hasInvoice && this.issueId > 0) {
          this.activeTab = this.activeTab === 'invoice' ? 'equipment' : this.activeTab;
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message ?? 'Unable to load dispatch entry.');
      },
    });
  }

  private applyPage(data: Record<string, unknown>): void {
    this.issueId = Number(data['issueId'] ?? data['IssueId'] ?? this.issueId);
    this.supplierId = Number(data['supplierId'] ?? data['SupplierId'] ?? 0);
    this.categoryId = Number(data['categoryId'] ?? data['CategoryId'] ?? 0);
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

    this.hasInvoice = Boolean(data['hasInvoice'] ?? data['HasInvoice']);
    this.hasInvoiceFile = Boolean(data['hasInvoiceFile'] ?? data['HasInvoiceFile']);
    this.challanNo = String(data['challanNo'] ?? data['ChallanNo'] ?? '');
    this.challanDate = this.toIsoDate(String(data['challanDate'] ?? data['ChallanDate'] ?? ''));
    this.invoiceNo = String(data['invoiceNo'] ?? data['InvoiceNo'] ?? '');
    this.invoiceDate = this.toIsoDate(String(data['invoiceDate'] ?? data['InvoiceDate'] ?? ''));
    this.ewayBillNo = String(data['ewayBillNo'] ?? data['EwayBillNo'] ?? '');
    this.ewayBillDate = this.toIsoDate(String(data['ewayBillDate'] ?? data['EwayBillDate'] ?? ''));
    this.hsnCode = String(data['hsnCode'] ?? data['HsnCode'] ?? '');
    this.tcsValue = String(data['tcsValue'] ?? data['TcsValue'] ?? '');
    this.invoiceGst = String(data['invoiceGst'] ?? data['InvoiceGst'] ?? '');
    this.remarks = String(data['remarks'] ?? data['Remarks'] ?? '');
    this.bulkVsSerial = String(data['bulkVsSerial'] ?? data['BulkVsSerial'] ?? '');

    this.dispatchNo = String(data['dispatchNo'] ?? data['DispatchNo'] ?? '');
    this.dispatchDate = this.toIsoDate(String(data['dispatchDate'] ?? data['DispatchDate'] ?? ''));
    this.tentativeSupplyDate = this.toIsoDate(String(data['tentativeSupplyDate'] ?? data['TentativeSupplyDate'] ?? ''));
    this.cgmscLogoPrinted = String(data['cgmscLogoPrinted'] ?? data['CgmscLogoPrinted'] ?? (this.isReagent ? 'NA' : 'N'));
    this.warrantyValidity = String(data['warrantyValidity'] ?? data['WarrantyValidity'] ?? (this.isReagent ? 'NA' : 'N'));
    this.serviceManual = String(data['serviceManual'] ?? data['ServiceManual'] ?? (this.isReagent ? 'NA' : 'N'));
    this.operatingManual = String(data['operatingManual'] ?? data['OperatingManual'] ?? (this.isReagent ? 'NA' : 'N'));
    this.calibrationCertificate = String(
      data['calibrationCertificate'] ?? data['CalibrationCertificate'] ?? (this.isReagent ? 'NA' : 'N'),
    );
    this.warrantyCard = String(data['warrantyCard'] ?? data['WarrantyCard'] ?? (this.isReagent ? 'NA' : 'N'));
    this.otherStatutory = String(data['otherStatutory'] ?? data['OtherStatutory'] ?? (this.isReagent ? 'NA' : 'N'));
    this.poDocuments = String(data['poDocuments'] ?? data['PoDocuments'] ?? (this.isReagent ? 'NA' : 'N'));

    const gstRaw = (data['gstOptions'] ?? data['GstOptions'] ?? []) as unknown[];
    this.gstOptions = gstRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        gstId: Number(row['gstId'] ?? row['GstId'] ?? 0),
        gstNo: String(row['gstNo'] ?? row['GstNo'] ?? ''),
      };
    });

    const linesRaw = (data['equipmentLines'] ?? data['EquipmentLines'] ?? []) as unknown[];
    this.equipmentLines = linesRaw.map((item) => {
      const row = item as Record<string, unknown>;
      return {
        issueDetailId: Number(row['issueDetailId'] ?? row['IssueDetailId'] ?? 0),
        serialNo: String(row['serialNo'] ?? row['SerialNo'] ?? ''),
        warrantyCardNo: String(row['warrantyCardNo'] ?? row['WarrantyCardNo'] ?? ''),
        mfgDate: this.toIsoDate(String(row['mfgDate'] ?? row['MfgDate'] ?? '')),
        expDate: this.toIsoDate(String(row['expDate'] ?? row['ExpDate'] ?? '')),
        supplyQty: Number(row['supplyQty'] ?? row['SupplyQty'] ?? 0),
      };
    });
  }

  private emptyDraftLine(): EquipmentLine {
    return { issueDetailId: 0, serialNo: '', warrantyCardNo: '', mfgDate: '', expDate: '', supplyQty: 1 };
  }

  private toIsoDate(displayDate: string): string {
    const trimmed = displayDate.trim();
    if (!trimmed) {
      return '';
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }
    const slashParts = trimmed.split('/');
    if (slashParts.length === 3) {
      const [day, month, year] = slashParts;
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
