import { PageEvent } from '@angular/material/paginator';

/** Client-side paging state for plain `*ngFor` tables paired with `<mat-paginator>`. */
export class ListPager {
  index = 0;
  size = 10;
  readonly sizes = [10, 25, 50, 100];

  get start(): number {
    return this.index * this.size;
  }

  get end(): number {
    return this.start + this.size;
  }

  /** Call whenever the list is reloaded or filtered. */
  reset(): void {
    this.index = 0;
  }

  onPage(e: PageEvent): void {
    this.index = e.pageIndex;
    this.size = e.pageSize;
  }
}
