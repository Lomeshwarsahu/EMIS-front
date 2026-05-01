import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface PurchaseOrderRow {
  equipment: string;
  indentDate: string;
  indentQty: number;
  poNo: string;
  poQty: number;
  supplierName: string;
}

@Component({
  selector: 'app-purchase-order-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-order-dashboard.component.html',
  styleUrls: ['./purchase-order-dashboard.component.css'],
})
export class PurchaseOrderDashboardComponent {
  poFinancialYear = '2026-27';
  equipmentFilter = '';

  readonly rows: PurchaseOrderRow[] = [
    { equipment: 'Digital X-Ray (EQ-1101)', indentDate: '04/04/2026', indentQty: 10, poNo: 'PO/2026/1154', poQty: 8, supplierName: 'ABC Medical Systems' },
    { equipment: 'Anaesthesia Workstation (EQ-6612)', indentDate: '09/04/2026', indentQty: 6, poNo: 'PO/2026/1280', poQty: 6, supplierName: 'LifePlus Equipments' },
  ];
}
