import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type DmeSkeletonType = 'table' | 'form' | 'lines';

@Component({
  selector: 'app-dme-page-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dme-page-skeleton.component.html',
  styleUrls: ['./dme-page-skeleton.component.css'],
})
export class DmePageSkeletonComponent {
  @Input() type: DmeSkeletonType = 'table';
  @Input() rows = 8;
  @Input() cols = 6;

  get rowIndexes(): number[] {
    return Array.from({ length: Math.max(1, this.rows) }, (_, index) => index);
  }

  get colIndexes(): number[] {
    return Array.from({ length: Math.max(1, this.cols) }, (_, index) => index);
  }

  get gridColumns(): string {
    return `repeat(${Math.max(1, this.cols)}, minmax(0, 1fr))`;
  }
}
