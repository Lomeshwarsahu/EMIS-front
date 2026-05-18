import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ReceiptRow {
  itemCode: string;
  equipmentName: string;
  poNo: string;
  consignee: string;
  poQtyForConsignee: number;
  suppliedQty: number;
  balanceQty: number;
}

@Component({
  selector: 'app-purchase-order-receipts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-order-receipts.component.html',
  styleUrls: ['./purchase-order-receipts.component.css'],
})
export class PurchaseOrderReceiptsComponent {
  readonly rows: ReceiptRow[] = [
    {
      itemCode: 'EQ-1101',
      equipmentName: 'Digital X-Ray',
      poNo: 'PO/2026/1154',
      consignee: 'Ambedkar Memorial Hospital, Raipur',
      poQtyForConsignee: 3,
      suppliedQty: 2,
      balanceQty: 1,
    },
    {
      itemCode: 'EQ-6612',
      equipmentName: 'Anaesthesia Workstation',
      poNo: 'PO/2026/1280',
      consignee: 'Medical College, Bilaspur',
      poQtyForConsignee: 2,
      suppliedQty: 2,
      balanceQty: 0,
    },
  ];
}
