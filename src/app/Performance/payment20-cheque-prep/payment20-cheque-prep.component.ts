import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { MaterialModule } from 'src/app/material-module';
import { Payment20ChequePrepItem } from 'src/app/Model/models';
import { MatTableExporterModule, MatTableExporterDirective } from 'mat-table-exporter';
import { SupplierPageSkeletonComponent } from 'src/app/component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-payment20-cheque-prep',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTableExporterModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './payment20-cheque-prep.component.html',
  styleUrl: './payment20-cheque-prep.component.css',
})
export class Payment20ChequePrepComponent implements OnInit {
  loading = false;
  dataSource!: MatTableDataSource<Payment20ChequePrepItem>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('exporter') exporter!: MatTableExporterDirective;

  displayedColumns = [
    'sno', 'payment_no', 'po_no', 'fund', 'no_of_supplier', 'no_of_pos',
    'to_be_released_amt', 'withheld_recovered_amt', 'status',
    'cgmsc_account_no', 'cheque_no', 'cheque_dt', 'paid_on',
    'notesheet', 'show_bank_letter',
  ];

  chequeData: Payment20ChequePrepItem[] = [];
  statusFilter = '';

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private router: Router,
  ) {
    this.dataSource = new MatTableDataSource<Payment20ChequePrepItem>([]);
  }

  ngOnInit() {
    this.loadGrid();
  }

  loadGrid() {
    this.loading = true;
    const params: any = {};
    if (this.statusFilter) {
      params.status = this.statusFilter;
    }
    this.api.get('Performance/get-cheque-prep-grid', { params }).subscribe({
      next: (res: any) => {
        this.chequeData = res.map((item: Payment20ChequePrepItem, i: number) => ({
          ...item,
          sno: i + 1,
        }));
        this.dataSource.data = this.chequeData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load grid');
      },
    });
  }

  onStatusFilterChange(value: string) {
    this.statusFilter = value;
    this.loadGrid();
  }

  updateRow(row: Payment20ChequePrepItem) {
    this.api
      .post1('Performance/update-cheque-info', {
        paymentId: row.payment_id,
        chequeNo: row.cheque_no,
        chequeDt: row.cheque_dt,
        paidOn: row.paid_on,
      })
      .subscribe({
        next: (res: any) => {
          this.toastr.success(res.message || 'Updated successfully');
          this.loadGrid();
        },
        error: (err: any) => this.toastr.error(err.error?.message || 'Update failed'),
      });
  }

  showNotesheet(paymentId: number) {
    this.api.get('Performance/generate-sanction-notesheet', {
      params: { paymentid: paymentId },
      responseType: 'blob' as 'json',
    }).subscribe({
      next: (res: any) => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SanctionNotesheet_${paymentId}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('Failed to download notesheet'),
    });
  }

  showBankLetter(paymentId: number) {
    this.toastr.info('Bank letter feature will be implemented');
  }

  applyTextFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.dataSource.filter = val.trim().toLowerCase();
  }

  exportToExcel() {
    this.exporter.exportTable('xlsx', {
      fileName: 'Payment20ChequePrep',
      sheet: 'ChequePrep',
    });
  }
}
