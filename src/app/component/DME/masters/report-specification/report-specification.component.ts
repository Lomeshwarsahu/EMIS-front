import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface SpecificationRow {
  equipmentCode: string;
  equipmentName: string;
  category: string;
  uploadStatus: 'Uploaded' | 'Pending';
}

@Component({
  selector: 'app-report-specification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-specification.component.html',
  styleUrls: ['./report-specification.component.css'],
})
export class ReportSpecificationComponent {
  selectedCategory = 'All';
  searchText = '';

  readonly categories = ['All', 'CME', 'EEL', 'Critical Care', 'OT'];
  readonly rows: SpecificationRow[] = [
    { equipmentCode: 'EQ-1101', equipmentName: 'Digital X-Ray', category: 'CME', uploadStatus: 'Uploaded' },
    { equipmentCode: 'EQ-2280', equipmentName: 'Infusion Pump', category: 'EEL', uploadStatus: 'Pending' },
    { equipmentCode: 'EQ-7712', equipmentName: 'Portable Ventilator', category: 'Critical Care', uploadStatus: 'Uploaded' },
  ];

  get filteredRows(): SpecificationRow[] {
    return this.rows.filter((row) => {
      const categoryOk = this.selectedCategory === 'All' || row.category === this.selectedCategory;
      const searchOk = !this.searchText || `${row.equipmentCode} ${row.equipmentName}`.toLowerCase().includes(this.searchText.toLowerCase());
      return categoryOk && searchOk;
    });
  }
}
