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
import { Router, ActivatedRoute } from '@angular/router';

declare var bootstrap: any;

interface VariantConfig {
  title: string;
  showEquipmentFilter: boolean;
  accent: string;
  showDispatchQty: boolean;
  showInstallQty: boolean;
  showFitStatus: boolean;
  showPresentFile: boolean;
  showFileNo: boolean;
  showLastRDate: boolean;
  showDirectorate: boolean;
  showSupplier: boolean;
  showItemName: boolean;
  showTenderNo: boolean;
  showPOValue: boolean;
}

const VARIANT_MAP: Record<string, VariantConfig> = {
  dm: {
    title: 'File Movement Based on FIFO (DM)',
    showEquipmentFilter: false, accent: '#2563eb',
    showDispatchQty: true, showInstallQty: true, showFitStatus: true,
    showPresentFile: true, showFileNo: true, showLastRDate: true,
    showDirectorate: true, showSupplier: true, showItemName: true,
    showTenderNo: true, showPOValue: true,
  },
  fin: {
    title: 'Indent PO / Tender Status (Finance)',
    showEquipmentFilter: false, accent: '#059669',
    showDispatchQty: true, showInstallQty: true, showFitStatus: true,
    showPresentFile: true, showFileNo: true, showLastRDate: true,
    showDirectorate: true, showSupplier: true, showItemName: true,
    showTenderNo: true, showPOValue: true,
  },
  gm: {
    title: 'Indent PO / Tender Status (GM)',
    showEquipmentFilter: true, accent: '#7c3aed',
    showDispatchQty: true, showInstallQty: true, showFitStatus: true,
    showPresentFile: true, showFileNo: true, showLastRDate: true,
    showDirectorate: true, showSupplier: true, showItemName: true,
    showTenderNo: true, showPOValue: true,
  },
  igm: {
    title: 'FIFO Desk (IGM)',
    showEquipmentFilter: false, accent: '#ea580c',
    showDispatchQty: true, showInstallQty: true, showFitStatus: true,
    showPresentFile: true, showFileNo: true, showLastRDate: true,
    showDirectorate: true, showSupplier: true, showItemName: true,
    showTenderNo: true, showPOValue: true,
  },
  'fin-file': {
    title: 'File Movement (Finance File)',
    showEquipmentFilter: false, accent: '#0891b2',
    showDispatchQty: true, showInstallQty: true, showFitStatus: true,
    showPresentFile: true, showFileNo: true, showLastRDate: true,
    showDirectorate: true, showSupplier: true, showItemName: true,
    showTenderNo: true, showPOValue: true,
  },
  'fin-file-v1': {
    title: 'File Movement (Finance File Ver1)',
    showEquipmentFilter: false, accent: '#0891b2',
    showDispatchQty: true, showInstallQty: true, showFitStatus: true,
    showPresentFile: true, showFileNo: true, showLastRDate: true,
    showDirectorate: true, showSupplier: true, showItemName: true,
    showTenderNo: true, showPOValue: true,
  },
  'gm-new': {
    title: 'File Movement (GM New)',
    showEquipmentFilter: true, accent: '#7c3aed',
    showDispatchQty: true, showInstallQty: true, showFitStatus: true,
    showPresentFile: true, showFileNo: true, showLastRDate: true,
    showDirectorate: true, showSupplier: true, showItemName: true,
    showTenderNo: true, showPOValue: true,
  },
  'igm-mov': {
    title: 'File Movement (IGM Movement)',
    showEquipmentFilter: false, accent: '#dc2626',
    showDispatchQty: true, showInstallQty: true, showFitStatus: true,
    showPresentFile: true, showFileNo: true, showLastRDate: true,
    showDirectorate: true, showSupplier: true, showItemName: true,
    showTenderNo: true, showPOValue: true,
  },
  'igm-mov-audit': {
    title: 'File Movement (IGM Movement Audit)',
    showEquipmentFilter: false, accent: '#dc2626',
    showDispatchQty: true, showInstallQty: true, showFitStatus: true,
    showPresentFile: true, showFileNo: true, showLastRDate: true,
    showDirectorate: true, showSupplier: true, showItemName: true,
    showTenderNo: true, showPOValue: true,
  },
  'igm-mov-bme': {
    title: 'File Movement (IGM Movement BME)',
    showEquipmentFilter: true, accent: '#dc2626',
    showDispatchQty: true, showInstallQty: true, showFitStatus: true,
    showPresentFile: true, showFileNo: true, showLastRDate: true,
    showDirectorate: true, showSupplier: true, showItemName: true,
    showTenderNo: true, showPOValue: true,
  },
};

@Component({
  selector: 'app-file-mrcdashbord',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './file-mrcdashbord.component.html',
  styleUrls: ['./file-mrcdashbord.component.css'],
})
export class FileMRCDashbordComponent {
  variant: string = 'dm';
  config!: VariantConfig;

  poType = 'CP';
  paymentType = 'FP';
  onlyMyDesk = false;
  equipmentType = '0';
  loading = false;

  dataSource = new MatTableDataSource<PaymentListDetails>([]);
  displayedColumns: string[] = [];

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
    private readonly route: ActivatedRoute,
  ) {
    this.route.data.subscribe((data) => {
      this.variant = data['variant'] || 'dm';
      this.config = VARIANT_MAP[this.variant] || VARIANT_MAP['dm'];
      this.buildColumns();
    });
  }

  private buildColumns(): void {
    const c = this.config;
    const cols: string[] = ['sno', 'PoNo', 'PoDate', 'POQty'];
    if (c.showPOValue) cols.push('POValue');
    if (c.showDispatchQty) cols.push('SupplyQty');
    cols.push('ReceiptQty');
    if (c.showInstallQty) cols.push('InstallationQty');
    if (c.showFitStatus) cols.push('FitUnfit');
    if (c.showPresentFile) cols.push('PresentFile');
    if (c.showFileNo) cols.push('FileNo');
    if (c.showLastRDate) cols.push('LastRDate');
    if (c.showDirectorate) cols.push('FacilityAutName');
    if (c.showSupplier) cols.push('Supplier');
    if (c.showItemName) cols.push('ItemName');
    if (c.showTenderNo) cols.push('TenderNo');
    cols.push('action', 'Present_File_Action');
    this.displayedColumns = cols;
  }

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
