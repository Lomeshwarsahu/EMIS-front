import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DmePageSkeletonComponent } from '../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { ApiService } from '../../service/api.service';
import { PaymentListDetails } from '../../Model/models';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-file-mrcdashbord',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './file-mrcdashbord.component.html',
  styleUrls: ['./file-mrcdashbord.component.css'],
})
export class FileMRCDashbordComponent {
  poType = 'CP';
  paymentType = 'FP';
  onlyMyDesk = false;
  loading = false;

  dataSource = new MatTableDataSource<PaymentListDetails>([]);
  displayedColumns = [
    'sno', 'PoNo', 'PoDate', 'POQty', 'POValue', 'SupplyQty',
    'ReceiptQty', 'InstallationQty', 'FitUnfit', 'PresentFile',
    'FileNo', 'LastRDate', 'FacilityAutName', 'Supplier',
    'ItemName', 'TenderNo', 'action',
    'Present_File_Action',
  ];

  @ViewChild('sort') sort!: MatSort;
  @ViewChild('paginator') paginator!: MatPaginator;

  sendModal: any;
  poID: number | null = null;
  fileNo: string = '';
  sendTo: number | null = null;
  sendOption: string = 'S';
  remarks: string = '';
  forwardDate: string = '';
  userList: any[] = [];

  constructor(
    private readonly api: ApiService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
  ) {}

  loadGrid(): void {
    this.loading = true;
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    const userId = loginData.user_id || 0;

    const params: any = {
      Potype: this.poType,
      FitUnfit: this.paymentType,
      UserId: this.onlyMyDesk ? userId : 0,
    };

    this.api.get('Payment/GetFitPaymentList', { params }).subscribe({
      next: (res: any) => {
        const data = (res || []).map((item: PaymentListDetails, i: number) => ({
          ...item,
          sno: i + 1,
        }));
        this.dataSource.data = data;
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load file movement data.');
      },
    });
  }

  onInstallationDownload(poId: number): void {
    this.router.navigate(['/InstallationDetails'], { queryParams: { poId } });
  }

  openSendModal(poId: number, fileNo: string): void {
    this.poID = poId;
    this.fileNo = fileNo || '';
    this.sendTo = null;
    this.sendOption = 'S';
    this.remarks = '';
    this.forwardDate = '';
    this.userList = [];

    this.loadSendToUsers();

    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    const modalEl = document.getElementById('sendModal');
    if (modalEl) {
      this.sendModal = new bootstrap.Modal(modalEl, { backdrop: false, keyboard: true });
      this.sendModal.show();
    }
  }

  loadSendToUsers(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    const userId = loginData.user_id || 0;
    this.api.get(`Payment/sendto/${userId}?sb=${this.sendOption}`).subscribe({
      next: (res: any) => (this.userList = res || []),
      error: () => this.toastr.error('Failed to load user list.'),
    });
  }

  onSendOptionChange(): void {
    this.loadSendToUsers();
  }

  saveForward(): void {
    if (!this.sendTo) {
      this.toastr.warning('Select a user to send to.');
      return;
    }
    if (!this.remarks) {
      this.toastr.warning('Enter remarks.');
      return;
    }
    if (!this.forwardDate) {
      this.toastr.warning('Select forward date.');
      return;
    }

    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    const payload = {
      UserId: loginData.user_id || 0,
      ToUserId: this.sendTo,
      PonoId: this.poID,
      FileId: this.fileNo,
      Remarks: this.remarks,
      ForwardDate: this.forwardDate,
      Flag: this.sendOption,
    };

    this.api.post1('Payment/forward', payload).subscribe({
      next: () => {
        this.toastr.success('File forwarded successfully!');
        this.sendModal?.hide();
        this.loadGrid();
      },
      error: () => this.toastr.error('Failed to forward file.'),
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
