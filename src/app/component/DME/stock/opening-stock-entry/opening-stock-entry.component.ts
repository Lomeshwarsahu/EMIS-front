import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-opening-stock-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './opening-stock-entry.component.html',
  styleUrls: ['./opening-stock-entry.component.css'],
})
export class OpeningStockEntryComponent {
  financialYear = '2026-27';
  hospital = '';
  equipmentCode = '';
  equipmentName = '';
  quantity = 0;
  remarks = '';
}
