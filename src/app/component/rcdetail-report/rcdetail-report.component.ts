import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { CollapseModule } from 'src/app/collapse';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ContractItem } from 'src/app/Model/models';

@Component({
  selector: 'app-rcdetail-report',
  standalone: true,
  imports: [
    NgSelectModule,
    CommonModule,
    FormsModule,
    CollapseModule,
    NgbCollapseModule,
    MatTabsModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatTableExporterModule,
  ],
  templateUrl: './rcdetail-report.component.html',
})
export class RCDetailReportComponent {
  Tenterlist: { tender_id: number; tender_no: string }[] = [];
  tender_id: number | null = 0;
  CategoryType = 'E';
  RcType = 'R';
  dispatchData: ContractItem[] = [];
  dataSource!: MatTableDataSource<ContractItem>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
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

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {
    this.dataSource = new MatTableDataSource<ContractItem>([]);
  }

  ngOnInit() {
    this.GetConTenterlist();
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
        this.Tenterlist = hasAll ? mapped : [{ tender_id: 0, tender_no: '--All--' }, ...mapped];
        this.tender_id = 0;
        this.spinner.hide();
      },
      error: (err: unknown) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }

  GetRcDetailReport() {
    try {
      this.spinner.show();
      const categoryId = this.CategoryType === 'E' ? 1 : 2;

      const params: Record<string, string | number> = {
        CategoryId: categoryId,
        RcType: this.RcType,
      };
      if (this.tender_id != null && this.tender_id > 0) {
        params['TenderId'] = this.tender_id;
      }

      this.api.get('Contract/GetRcDetailReport', { params }).subscribe(
        (res: unknown) => {
          this.dispatchData = this.mapRows(res);
          this.dataSource.data = this.dispatchData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        (error: { message: unknown }) => {
          this.spinner.hide();
          console.log('Error fetching data:', JSON.stringify(error.message));
        },
      );
    } catch (err: unknown) {
      this.spinner.hide();
      console.log(err);
    }
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
