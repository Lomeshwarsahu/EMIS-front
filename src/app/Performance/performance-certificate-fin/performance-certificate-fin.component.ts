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
import { MatTableExporterModule, MatTableExporterDirective } from 'mat-table-exporter';
import { SupplierPageSkeletonComponent } from 'src/app/component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';
import { FinReleaseGridItem, ForwardUser } from 'src/app/Model/models';

@Component({
  selector: 'app-performance-certificate-fin',
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
  templateUrl: './performance-certificate-fin.component.html',
  styleUrl: './performance-certificate-fin.component.css',
})
export class PerformanceCertificateFinComponent implements OnInit {
  loading = false;
  dataSource!: MatTableDataSource<FinReleaseGridItem>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('exporter') exporter!: MatTableExporterDirective;

  displayedColumns = [
    'sno', 'fund', 'check_box', 'supplier_name', 'nasti_no',
    'po_no', 'installed_qty', 'last_installed_date', 'cheque_dt',
    'withheld_amt', 'recovered_amount', 'to_be_released_amt',
    'remarks', 'paid_from', 'paid_to', 'actions',
    'performance_required', 'to_be_released', 'per_certificate',
    'present_file_to_action', 'tender_no', 'complaint_status',
  ];

  gridData: FinReleaseGridItem[] = [];
  loginData: any = {};

  releaseYearList: any[] = [];
  fundList: any[] = [];
  selectedReleaseYearId = 0;
  selectedFundId = 0;

  rowSelection: { [key: number]: boolean } = {};

  // Forward File modal
  forwardPoId = 0;
  sendOption = 'S';
  sendToId = 0;
  userList: ForwardUser[] = [];
  forwardRemarks = '';
  forwardDate = '';

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private router: Router,
  ) {
    this.dataSource = new MatTableDataSource<FinReleaseGridItem>([]);
    this.forwardDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.loadReleaseYears();
    this.loadFunds();
  }

  loadReleaseYears() {
    this.api.get('Performance/get-release-years', {}).subscribe({
      next: (res: any) => this.releaseYearList = res,
      error: () => this.toastr.error('Failed to load release years'),
    });
  }

  loadFunds() {
    this.api.get('Performance/get-funds', {}).subscribe({
      next: (res: any) => this.fundList = res,
      error: () => this.toastr.error('Failed to load funds'),
    });
  }

  loadGrid() {
    if (!this.selectedReleaseYearId || !this.selectedFundId) {
      this.toastr.warning('Select Release Year and Fund');
      return;
    }
    this.loading = true;
    this.api.get('Performance/get-fin-release-grid', {
      params: { releaseYearId: this.selectedReleaseYearId, fundId: this.selectedFundId }
    }).subscribe({
      next: (res: any) => {
        this.gridData = res.map((item: FinReleaseGridItem, i: number) => ({
          ...item, sno: i + 1,
        }));
        this.dataSource.data = this.gridData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Failed to load grid'); }
    });
  }

  toggleAllSelection(event: any) {
    const checked = event.target.checked;
    this.gridData.forEach(row => this.rowSelection[row.po_id] = checked);
  }

  applyTextFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.dataSource.filter = val.trim().toLowerCase();
  }

  getRowBg(row: FinReleaseGridItem) {
    if (row.complaint_status === 'Booked' || !row.isEligible) return '#FFB6C1';
    if (row.complaint_status !== 'Booked' && !row.isEligible) return '#ADD8E6';
    if (row.to_be_released_amt > 0) return '#90EE90';
    return '';
  }

  onAddClick(row: FinReleaseGridItem) {
    const payload = {
      poId: row.po_id,
      recoveredAmount: row.recovered_amount,
      remarks: row.remarks,
      userId: this.loginData.user_id,
    };
    this.api.post1('Performance/update-release-data', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Saved');
        this.loadGrid();
      },
      error: (err: any) => this.toastr.error(err.error?.message || 'Failed to save'),
    });
  }

  onToBeReleasedClick(poId: number) {
    this.router.navigate(['/performance/performace20-consignee'], { queryParams: { po_id: poId } });
  }

  onPerCertificateClick(poId: number) {
    window.open(`/Performance/EMISPerf20_RDLC.aspx?PONOID=${poId}`, '_blank');
  }

  onPresentFileClick(poId: number) {
    this.forwardPoId = poId;
    this.sendOption = 'S';
    this.sendToId = 0;
    this.forwardRemarks = '';
    this.forwardDate = new Date().toISOString().split('T')[0];
    this.userList = [];
    this.loadForwardUsers();
    this.showModal('ForwardModal');
  }

  onChequeDtClick(poId: number) {
    window.open(`/Performance/EMISSanction_RDLC.aspx?PONOID=${poId}`, '_blank');
  }

  loadForwardUsers() {
    this.api.get('Performance/get-forward-users', {
      params: { userId: this.loginData.user_id, flag: this.sendOption }
    }).subscribe({
      next: (res: any) => this.userList = res,
      error: () => this.toastr.error('Failed to load users'),
    });
  }

  onSendOptionChange() {
    this.sendToId = 0;
    this.loadForwardUsers();
  }

  saveForward() {
    if (!this.sendToId) { this.toastr.warning('Select send to user'); return; }
    if (!this.forwardRemarks) { this.toastr.warning('Enter remarks'); return; }

    const payload = {
      userId: this.loginData.user_id,
      toUserId: this.sendToId,
      ponoId: this.forwardPoId,
      remarks: this.forwardRemarks,
      forwardDate: this.forwardDate,
      flag: this.sendOption,
    };
    this.api.post1('Performance/forward-file', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Forwarded successfully');
        this.hideModal('ForwardModal');
        this.loadGrid();
      },
      error: (err: any) => this.toastr.error(err.error?.message || 'Failed'),
    });
  }

  goForChequePreparation() {
    const selectedIds = Object.keys(this.rowSelection).filter(k => this.rowSelection[+k]).map(Number);
    if (!selectedIds.length) {
      this.toastr.warning('Select at least one row');
      return;
    }
    this.loading = true;
    const payload = {
      poIds: selectedIds,
      userId: this.loginData.user_id,
    };
    this.api.post1('Performance/go-for-cheque-preparation', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Cheque preparation batch created');
        this.rowSelection = {};
        this.loadGrid();
      },
      error: (err: any) => { this.loading = false; this.toastr.error(err.error?.message || 'Failed'); }
    });
  }

  showModal(id: string) {
    const el = document.getElementById(id);
    if (el) {
      (el as HTMLElement).style.display = 'block';
      (el as HTMLElement).classList.add('show');
      document.body.classList.add('modal-open');
    }
  }

  hideModal(id: string) {
    const el = document.getElementById(id);
    if (el) {
      (el as HTMLElement).style.display = 'none';
      (el as HTMLElement).classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  }
}
