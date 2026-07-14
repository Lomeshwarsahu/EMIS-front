import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage, resolveLoginUserId } from '../../shared/session.util';

interface IndentHeader {
  IndentId: number;
  UserId: number;
  McName: string;
  BudgetName: string;
  IndentDate: string;
  FinancialYearId: number;
  Year: string;
  Status: string;
  StatusLabel: string;
  AsLetterNo: string;
  AsDate: string;
  DispatchNo: string;
  IsCompleted: boolean;
}

interface EquipmentOption {
  ItemId: number;
  ItemCode: string;
  ItemName: string;
  ItemNameDisplay: string;
  ApproxRate: number;
}

interface DeptRow {
  LocationId: number;
  LocationName: string;
  CurrentStock: number;
  Pipeline: number;
  ExistingIndentQty: number;
  ApproxRate: number;
  qty: number | null;
  rate: number | null;
  remarks: string;
  saving: boolean;
}

interface CartRow {
  IndentItemId: number;
  LocationId: number;
  LocationName: string;
  ItemId: number;
  ItemCode: string;
  ItemName: string;
  EstimatedCost: number;
  IndentQuantity: number;
  Value: number;
  CurrentStock: number;
  Pipeline: number;
  Remarks: string;
  RcStatus: string;
  selected: boolean;
}

@Component({
  selector: 'app-dme-fac-add-indent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dme-fac-add-indent.component.html',
  styleUrls: ['./dme-fac-add-indent.component.css'],
})
export class DmeFacAddIndentComponent implements OnInit {
  private readonly orderApi = `${environment.apiUrl}/DMEOrder/`;

  userId = 0;
  indentId = 0;
  loading = false;
  equipmentLoading = false;
  deptLoading = false;
  deleting = false;

  header: IndentHeader | null = null;
  equipment: EquipmentOption[] = [];
  selectedItemId = 0;
  equipmentFilter = '';
  departments: DeptRow[] = [];
  cart: CartRow[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.userId = resolveLoginUserId();
    if (!this.userId) {
      this.toastr.warning('Please login again — user id missing.');
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      this.indentId = Number(params.get('indentId') || params.get('ICID') || 0);
      if (!this.indentId) {
        this.toastr.error('Indent id is required.');
        return;
      }
      this.loadPage();
    });
  }

  get filteredEquipment(): EquipmentOption[] {
    const q = this.equipmentFilter.trim().toLowerCase();
    if (!q) {
      return this.equipment;
    }
    return this.equipment.filter(
      (e) =>
        e.ItemNameDisplay.toLowerCase().includes(q) ||
        e.ItemCode.toLowerCase().includes(q) ||
        e.ItemName.toLowerCase().includes(q),
    );
  }

  get selectedCount(): number {
    return this.cart.filter((r) => r.selected).length;
  }

  goBack(): void {
    this.router.navigate(['/indents/annual-indent']);
  }

  onEquipmentChange(): void {
    this.departments = [];
  }

  showDepartments(): void {
    if (!this.selectedItemId) {
      this.toastr.warning('Select equipment first.');
      return;
    }
    if (this.header?.IsCompleted) {
      this.toastr.warning('Indent is completed. Items cannot be added.');
      return;
    }

    this.deptLoading = true;
    this.http
      .get<unknown[]>(
        `${this.orderApi}facility-indents/${this.indentId}/departments?userId=${this.userId}&itemId=${this.selectedItemId}`,
      )
      .subscribe({
        next: (res) => {
          this.departments = this.mapDepartments(res);
          this.deptLoading = false;
          if (!this.departments.length) {
            this.toastr.info('No departments found for this indent.');
          }
        },
        error: (e) => {
          this.deptLoading = false;
          this.departments = [];
          this.toastr.error(apiErrorMessage(e, 'Could not load departments.'));
        },
      });
  }

  addLine(row: DeptRow): void {
    if (this.header?.IsCompleted) {
      this.toastr.warning('Indent is completed. Items cannot be added.');
      return;
    }
    const qty = Number(row.qty ?? 0);
    const rate = Number(row.rate ?? 0);
    if (!qty || qty <= 0) {
      this.toastr.warning('Indent qty should be greater than zero.');
      return;
    }
    if (!rate || rate <= 0) {
      this.toastr.warning('Price should not be empty.');
      return;
    }

    row.saving = true;
    this.http
      .post(`${this.orderApi}facility-indents/${this.indentId}/items`, {
        UserId: this.userId,
        ItemId: this.selectedItemId,
        LocationId: row.LocationId,
        FacilityIndQty: qty,
        ApproxRate: rate,
        Remarks: (row.remarks || '').trim(),
      })
      .subscribe({
        next: (res: { message?: string }) => {
          row.saving = false;
          row.qty = null;
          row.remarks = '';
          this.toastr.success(res?.message ?? 'Saved successfully.');
          this.loadCart();
          this.showDepartments();
        },
        error: (e) => {
          row.saving = false;
          this.toastr.error(apiErrorMessage(e, 'Could not save indent item.'));
        },
      });
  }

  toggleSelectAll(checked: boolean): void {
    this.cart.forEach((row) => (row.selected = checked));
  }

  deleteSelected(): void {
    if (this.header?.IsCompleted) {
      this.toastr.warning('Indent is completed. Delete not allowed.');
      return;
    }
    const ids = this.cart.filter((r) => r.selected).map((r) => r.IndentItemId);
    if (!ids.length) {
      this.toastr.warning('Select at least one item to delete.');
      return;
    }

    this.deleting = true;
    this.http
      .post(`${this.orderApi}facility-indents/${this.indentId}/items/delete`, {
        UserId: this.userId,
        IndentItemIds: ids,
      })
      .subscribe({
        next: (res: { message?: string }) => {
          this.deleting = false;
          this.toastr.success(res?.message ?? 'Deleted.');
          this.loadCart();
          if (this.selectedItemId) {
            this.showDepartments();
          }
        },
        error: (e) => {
          this.deleting = false;
          this.toastr.error(apiErrorMessage(e, 'Could not delete items.'));
        },
      });
  }

  private loadPage(): void {
    this.loading = true;
    this.http
      .get<Record<string, unknown>>(`${this.orderApi}facility-indents/${this.indentId}?userId=${this.userId}`)
      .subscribe({
        next: (res) => {
          this.header = this.mapHeader(res);
          this.loading = false;
          this.loadEquipment();
          this.loadCart();
        },
        error: (e) => {
          this.loading = false;
          this.header = null;
          this.toastr.error(apiErrorMessage(e, 'Could not load indent.'));
        },
      });
  }

  private loadEquipment(): void {
    this.equipmentLoading = true;
    this.http.get<unknown[]>(`${this.orderApi}facility-indent-equipment`).subscribe({
      next: (res) => {
        this.equipment = this.mapEquipment(res);
        this.equipmentLoading = false;
      },
      error: (e) => {
        this.equipmentLoading = false;
        this.equipment = [];
        this.toastr.error(apiErrorMessage(e, 'Could not load equipment list.'));
      },
    });
  }

  private loadCart(): void {
    this.http
      .get<unknown[]>(`${this.orderApi}facility-indents/${this.indentId}/items?userId=${this.userId}`)
      .subscribe({
        next: (res) => (this.cart = this.mapCart(res)),
        error: (e) => {
          this.cart = [];
          this.toastr.error(apiErrorMessage(e, 'Could not load indent items.'));
        },
      });
  }

  private mapHeader(raw: Record<string, unknown>): IndentHeader {
    const status = String(raw['status'] ?? raw['Status'] ?? '');
    const completed = Boolean(raw['isCompleted'] ?? raw['IsCompleted']) || status.toUpperCase() === 'C';
    return {
      IndentId: Number(raw['indentId'] ?? raw['IndentId'] ?? this.indentId),
      UserId: Number(raw['userId'] ?? raw['UserId'] ?? 0),
      McName: String(raw['mcName'] ?? raw['McName'] ?? ''),
      BudgetName: String(raw['budgetName'] ?? raw['BudgetName'] ?? ''),
      IndentDate: String(raw['indentDate'] ?? raw['IndentDate'] ?? ''),
      FinancialYearId: Number(raw['financialYearId'] ?? raw['FinancialYearId'] ?? 0),
      Year: String(raw['year'] ?? raw['Year'] ?? ''),
      Status: status,
      StatusLabel: String(raw['statusLabel'] ?? raw['StatusLabel'] ?? (completed ? 'Completed' : 'Incomplete')),
      AsLetterNo: String(raw['asLetterNo'] ?? raw['AsLetterNo'] ?? ''),
      AsDate: String(raw['asDate'] ?? raw['AsDate'] ?? ''),
      DispatchNo: String(raw['dispatchNo'] ?? raw['DispatchNo'] ?? ''),
      IsCompleted: completed,
    };
  }

  private mapEquipment(raw: unknown): EquipmentOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      ItemId: Number(r['itemId'] ?? r['ItemId'] ?? 0),
      ItemCode: String(r['itemCode'] ?? r['ItemCode'] ?? ''),
      ItemName: String(r['itemName'] ?? r['ItemName'] ?? ''),
      ItemNameDisplay: String(r['itemNameDisplay'] ?? r['ItemNameDisplay'] ?? ''),
      ApproxRate: Number(r['approxRate'] ?? r['ApproxRate'] ?? 0),
    }));
  }

  private mapDepartments(raw: unknown): DeptRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => {
      const rate = Number(r['approxRate'] ?? r['ApproxRate'] ?? 0);
      return {
        LocationId: Number(r['locationId'] ?? r['LocationId'] ?? 0),
        LocationName: String(r['locationName'] ?? r['LocationName'] ?? ''),
        CurrentStock: Number(r['currentStock'] ?? r['CurrentStock'] ?? 0),
        Pipeline: Number(r['pipeline'] ?? r['Pipeline'] ?? 0),
        ExistingIndentQty: Number(r['existingIndentQty'] ?? r['ExistingIndentQty'] ?? 0),
        ApproxRate: rate,
        qty: null,
        rate: rate > 0 ? rate : null,
        remarks: '',
        saving: false,
      };
    });
  }

  private mapCart(raw: unknown): CartRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      IndentItemId: Number(r['indentItemId'] ?? r['IndentItemId'] ?? 0),
      LocationId: Number(r['locationId'] ?? r['LocationId'] ?? 0),
      LocationName: String(r['locationName'] ?? r['LocationName'] ?? ''),
      ItemId: Number(r['itemId'] ?? r['ItemId'] ?? 0),
      ItemCode: String(r['itemCode'] ?? r['ItemCode'] ?? ''),
      ItemName: String(r['itemName'] ?? r['ItemName'] ?? ''),
      EstimatedCost: Number(r['estimatedCost'] ?? r['EstimatedCost'] ?? 0),
      IndentQuantity: Number(r['indentQuantity'] ?? r['IndentQuantity'] ?? 0),
      Value: Number(r['value'] ?? r['Value'] ?? 0),
      CurrentStock: Number(r['currentStock'] ?? r['CurrentStock'] ?? 0),
      Pipeline: Number(r['pipeline'] ?? r['Pipeline'] ?? 0),
      Remarks: String(r['remarks'] ?? r['Remarks'] ?? ''),
      RcStatus: String(r['rcStatus'] ?? r['RcStatus'] ?? ''),
      selected: false,
    }));
  }
}
