import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type SupplierSkeletonType = 'table' | 'form' | 'filter-panel' | 'lines';

@Component({
  selector: 'app-supplier-page-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supplier-page-skeleton.component.html',
  styleUrls: ['./supplier-page-skeleton.component.css'],
})
export class SupplierPageSkeletonComponent {
  @Input() type: SupplierSkeletonType = 'table';
  @Input() rows = 8;
  @Input() cols = 6;
  @Input() formFields = 6;
  @Input() filterRows = 3;

  get rowIndexes(): number[] {
    return Array.from({ length: Math.max(1, this.rows) }, (_, index) => index);
  }

  get colIndexes(): number[] {
    return Array.from({ length: Math.max(1, this.cols) }, (_, index) => index);
  }

  get formFieldIndexes(): number[] {
    return Array.from({ length: Math.max(1, this.formFields) }, (_, index) => index);
  }

  get filterRowIndexes(): number[] {
    return Array.from({ length: Math.max(1, this.filterRows) }, (_, index) => index);
  }

  get gridColumns(): string {
    return `repeat(${Math.max(1, this.cols)}, minmax(0, 1fr))`;
  }
}
