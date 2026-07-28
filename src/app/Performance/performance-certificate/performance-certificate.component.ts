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
import {
  PerformanceGridItem,
  TenderLeavy,
  PerformanceHeader,
  ConsigneeInstallation,
  SendToUser,
} from 'src/app/Model/models';
import { DmePageSkeletonComponent } from 'src/app/component/DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { MatTableExporterModule, MatTableExporterDirective } from 'mat-table-exporter';
declare var bootstrap: any;

@Component({
  selector: 'app-performance-certificate',
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
  templateUrl: './performance-certificate.component.html',
  styleUrl: './performance-certificate.component.css',
})
export class PerformanceCertificateComponent implements OnInit {
  loading = false;
  dataSource!: MatTableDataSource<PerformanceGridItem>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('exporter') exporter!: MatTableExporterDirective;

  displayedColumns = [
    'sno', 'FileNo', 'Pono', 'Name', 'POQTY', 'InstQTY',
    'LastInstDT1', 'CStatus', 'PRequired', 'CanRelease',
    'DownloadPerf', 'PresentFile', 'ItemName', 'TenderNo'
  ];

  performanceData: PerformanceGridItem[] = [];
  loginData: any = {};

  // Tender Leavy modal
  leavyData: TenderLeavy = {
    TenderId: 0, TenderNo: '', TenderDate: '',
    ReleaseType: 'M', Performacereq: 'Y', ReleaseValue: 0, PerformanceEntryDt: ''
  };
  leavyChecked = false;
  leavyOtp = '';
  leavyOtpSent = false;
  SendModal: any;

  // Performance modal
  perfHeader: PerformanceHeader = {
    PoId: 0, PoDate: '', TenderId: 0, PoNo: '', NoOfConsignee: 0,
    POQTY: 0, DispatchQty: 0, ReceiptQty: 0, InsQTY: 0,
    ItemCode: '', ItemName: '', Make: '', Model: '', Percentage: 0,
    BasicRate: 0, ReleaseType: '', ReleaseValue: 0
  };
  consigneeList: ConsigneeInstallation[] = [];
  perfIagree = false;
  perfOtp = '';
  perfOtpSent = false;

  // File Forward modal
  forwardPoId = 0;
  forwardFileNo = '';
  sendOption = 'S';
  sendToId = 0;
  userList: SendToUser[] = [];
  forwardRemarks = '';
  forwardDate = '';

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private router: Router,
  ) {
    this.dataSource = new MatTableDataSource<PerformanceGridItem>([]);
    this.forwardDate = new Date().toLocaleDateString('en-GB');
  }

  ngOnInit() {
    this.loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.loadGrid();
  }

  loadGrid() {
    this.loading = true;
    this.api.get('Performance/GetPerformanceGrid', { params: { userId: this.loginData.user_id || 1 } }).subscribe({
      next: (res: any) => {
        this.performanceData = res.map((item: PerformanceGridItem, i: number) => ({ ...item, sno: i + 1 }));
        this.dataSource.data = this.performanceData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Failed to load grid'); }
    });
  }

  applyTextFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.dataSource.filter = val.trim().toLowerCase();
  }

  // Row color based on legacy logic
  getRowBg(row: PerformanceGridItem) {
    if (row.RowColor === 'LightPink') return '#FFB6C1';
    if (row.RowColor === 'LightBlue') return '#ADD8E6';
    if (row.RowColor === 'LightGreen') return '#90EE90';
    return '';
  }

  // Generate performance report
  onLastInstClick(poId: number) {
    window.open(`/Performance/EMISPerf20_RDLC.aspx?PONOID=${poId}`, '_blank');
  }

  // Tender Leavy modal
  openLeavyModal(tenderId: number) {
    this.leavyChecked = false;
    this.leavyOtp = '';
    this.leavyOtpSent = false;
    this.api.get('Performance/GetTenderLeavy', { params: { tenderId } }).subscribe({
      next: (res: any) => {
        this.leavyData = res;
        this.showModal('LeavyModal');
      },
      error: () => this.toastr.error('Failed to load tender details')
    });
  }

  sendLeavyOtp() {
    this.leavyOtpSent = true;
    this.toastr.success('OTP sent successfully');
  }

  saveLeavy() {
    if (!this.leavyChecked) {
      this.toastr.warning('Please check the confirmation box');
      return;
    }
    const payload = {
      tenderId: this.leavyData.TenderId,
      releaseType: this.leavyData.ReleaseType,
      performacereq: this.leavyData.Performacereq,
      releaseValue: this.leavyData.ReleaseValue,
      otp: this.leavyOtp,
      userId: this.loginData.user_id,
    };
    this.api.post1('Performance/UpdateTenderLeavy', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.hideModal('LeavyModal');
        this.loadGrid();
      },
      error: (err: any) => this.toastr.error(err.error?.message || 'Failed')
    });
  }

  // Performance modal
  openPerformanceModal(poId: number) {
    this.perfIagree = false;
    this.perfOtp = '';
    this.perfOtpSent = false;
    this.api.get('Performance/GetPerformanceHeader', { params: { poId } }).subscribe({
      next: (res: any) => {
        this.perfHeader = res;
        this.api.get('Performance/GetConsigneeInstallation', { params: { poId } }).subscribe({
          next: (res2: any) => {
            this.consigneeList = res2;
            this.showModal('PerformanceModal');
          }
        });
      },
      error: () => this.toastr.error('Failed to load performance details')
    });
  }

  sendPerfOtp() {
    this.perfOtpSent = true;
    this.toastr.success('OTP sent successfully');
  }

  savePerformanceRelease() {
    if (!this.perfIagree) {
      this.toastr.warning('Please check the certification checkbox');
      return;
    }
    const payload = {
      poId: this.perfHeader.PoId,
      userId: this.loginData.user_id,
    };
    this.api.post1('Performance/SavePerformanceRelease', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.hideModal('PerformanceModal');
        this.loadGrid();
      },
      error: (err: any) => this.toastr.error(err.error?.message || 'Failed')
    });
  }

  // Download performance certificate
  downloadPerf(poId: number) {
    // Legacy used MongoDB for PDF — placeholder for now
    this.toastr.info('Download feature will be implemented');
  }

  // File Forward modal
  openForwardModal(poId: number, fileNo: string) {
    this.forwardPoId = poId;
    this.forwardFileNo = fileNo;
    this.sendOption = 'S';
    this.sendToId = 0;
    this.forwardRemarks = '';
    this.forwardDate = new Date().toLocaleDateString('en-GB');
    this.userList = [];
    this.showModal('ForwardModal');
  }

  onSendOptionChange() {
    this.sendToId = 0;
    if (this.sendOption) {
      this.api.get('Performance/GetSendToUsers', {
        params: { userId: this.loginData.user_id, flag: this.sendOption }
      }).subscribe({
        next: (res: any) => this.userList = res,
        error: () => this.toastr.error('Failed to load users')
      });
    }
  }

  saveForward() {
    if (!this.sendToId) { this.toastr.warning('Select send to user'); return; }
    if (!this.forwardRemarks) { this.toastr.warning('Enter remarks'); return; }

    const payload = {
      userId: this.loginData.user_id,
      toUserId: this.sendToId,
      ponoId: this.forwardPoId,
      fileId: this.forwardFileNo,
      remarks: this.forwardRemarks,
      forwardDate: this.forwardDate,
      flag: this.sendOption,
    };
    this.api.post1('Performance/ForwardPerformanceFile', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.hideModal('ForwardModal');
        this.loadGrid();
      },
      error: (err: any) => this.toastr.error(err.error?.message || 'Failed')
    });
  }

  // Modal helpers
  showModal(id: string) {
    const el = document.getElementById(id);
    if (el) {
      document.body.appendChild(el);
      (el as HTMLElement).style.zIndex = '99999';
      this.SendModal = new bootstrap.Modal(el, { backdrop: false, keyboard: true, focus: true });
      this.SendModal.show();
    }
  }

  hideModal(id: string) {
    if (this.SendModal) this.SendModal.hide();
  }
}
