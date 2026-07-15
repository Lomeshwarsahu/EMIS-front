import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTableExporterDirective, MatTableExporterModule } from 'mat-table-exporter';
import { ToastrService } from 'ngx-toastr';
import { ContractItem } from 'src/app/Model/models';
import { MaterialModule } from 'src/app/material-module';
import { ApiService } from 'src/app/service/api.service';
import { DmePageSkeletonComponent } from '../DME/shared/dme-page-skeleton/dme-page-skeleton.component';

@Component({
  selector: 'app-rcdetail-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTableExporterModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './rcdetail-report.component.html',
  styleUrls: ['./rcdetail-report.component.css'],
})
export class RCDetailReportComponent {
  Tenterlist: { tender_id: number; tender_no: string }[] = [];
  tender_id = 0;
  CategoryType = 'E';
  RcType = 'R';
  loading = false;
  dataSource = new MatTableDataSource<ContractItem>([]);

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  @ViewChild(MatTableExporterDirective) exporter?: MatTableExporterDirective;

  displayedColumns: string[] = [
    'sno',
    'contractItemId',
    'itemId',
    'itemCode',
    'itemName',
    'make',
    'model',
    'supplierName',
    'tenderNo',
    'contractDate',
    'contractEndDate',
    'basicRate',
    'gst',
    'singleUnitPrice',
    'cmc1',
    'cmc2',
    'cmc3',
    'cmc4',
    'cmc5',
    'tenderId',
  ];

  get hasActiveFilter(): boolean {
    return this.tender_id > 0 || this.CategoryType !== 'E' || this.RcType !== 'R';
  }

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.GetConTenterlist();
    this.loadRows();
  }

  onFilterChange(): void {
    this.loadRows();
  }

  clearFilters(): void {
    this.tender_id = 0;
    this.CategoryType = 'E';
    this.RcType = 'R';
    this.loadRows();
  }

  GetConTenterlist(): void {
    this.api.get('Contract/GetConTenterlist').subscribe({
      next: (res: unknown) => {
        const arr = Array.isArray(res) ? res : [];
        const mapped = arr.map((r: Record<string, unknown>) => ({
          tender_id: Number(r['tender_id'] ?? r['TenderId'] ?? 0),
          tender_no: String(r['tender_no'] ?? r['TenderNo'] ?? ''),
        }));
        const hasAll = mapped.some((t) => t.tender_id === 0);
        this.Tenterlist = hasAll ? mapped : [{ tender_id: 0, tender_no: 'All' }, ...mapped];
        this.tender_id = 0;
      },
      error: () => this.toastr.error('Could not load tender list.'),
    });
  }

  loadRows(): void {
    this.loading = true;
    const categoryId = this.CategoryType === 'E' ? 1 : 2;
    const params: Record<string, string | number> = {
      CategoryId: categoryId,
      RcType: this.RcType,
    };
    if (this.tender_id > 0) {
      params['TenderId'] = this.tender_id;
    }

    this.api.get('Contract/GetRcDetailReport', { params }).subscribe({
      next: (res: unknown) => {
        this.dataSource.data = this.mapRows(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.dataSource.data = [];
        this.toastr.error('Could not load RC detail report.');
      },
    });
  }

  applyTextFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportExcel(): void {
    if (!this.exporter || !this.dataSource.data.length) {
      this.toastr.warning('No data to export.');
      return;
    }
    this.exporter.exportTable('xlsx', {
      fileName: 'RCDetailReport',
      sheet: 'RCDetailReport',
      Props: { Author: 'cgmsc' },
    });
  }

  private mapRows(raw: unknown): ContractItem[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>, index: number) => ({
      sno: index + 1,
      contractItemId: Number(r['ContractItemId'] ?? r['contractItemId'] ?? 0),
      itemId: Number(r['ItemId'] ?? r['itemId'] ?? 0),
      itemCode: String(r['ItemCode'] ?? r['itemCode'] ?? ''),
      itemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      make: String(r['Make'] ?? r['make'] ?? ''),
      model: String(r['Model'] ?? r['model'] ?? ''),
      supplierName: String(r['SupplierName'] ?? r['supplierName'] ?? ''),
      tenderNo: String(r['TenderNo'] ?? r['tenderNo'] ?? ''),
      contractDate: String(r['ContractDate'] ?? r['contractDate'] ?? ''),
      contractEndDate: String(r['ContractEndDate'] ?? r['contractEndDate'] ?? ''),
      basicRate: Number(r['BasicRate'] ?? r['basicRate'] ?? 0),
      gst: Number(r['GST'] ?? r['gst'] ?? 0),
      singleUnitPrice: Number(r['SingleUnitPrice'] ?? r['singleUnitPrice'] ?? 0),
      cmc1: Number(r['CMC1'] ?? r['cmc1'] ?? 0),
      cmc2: Number(r['CMC2'] ?? r['cmc2'] ?? 0),
      cmc3: Number(r['CMC3'] ?? r['cmc3'] ?? 0),
      cmc4: Number(r['CMC4'] ?? r['cmc4'] ?? 0),
      cmc5: Number(r['CMC5'] ?? r['cmc5'] ?? 0),
      tenderId: Number(r['TenderId'] ?? r['tenderId'] ?? 0),
    }));
  }
}
