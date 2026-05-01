import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface StockRow {
  hospital: string;
  openingStock: number;
  receivedInstalled: number;
}

@Component({
  selector: 'app-stock-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.css'],
})
export class StockReportComponent {
  authority = 'DME';

  readonly rows: StockRow[] = [
    { hospital: 'Ambedkar Memorial Hospital, Raipur', openingStock: 124, receivedInstalled: 48 },
    { hospital: 'Medical College, Bilaspur', openingStock: 95, receivedInstalled: 62 },
    { hospital: 'Govt. Medical College, Jagdalpur', openingStock: 71, receivedInstalled: 29 },
  ];

  get totalOpeningStock(): number {
    return this.rows.reduce((sum, row) => sum + row.openingStock, 0);
  }

  get totalReceivedInstalled(): number {
    return this.rows.reduce((sum, row) => sum + row.receivedInstalled, 0);
  }
}
