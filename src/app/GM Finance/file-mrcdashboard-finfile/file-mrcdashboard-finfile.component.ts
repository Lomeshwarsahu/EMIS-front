import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import {
  SupplierBankAccDetail_model,
  vendorBankDetail_model,
  UpdateBankDetails_model,
  UpdateAnnualTurnover_model,
  GetAnnualTurnoverDetail,
  BankMandateDetail,
  MassuppliergstDetails,
  GstReturnDetails,
} from 'src/app/Model/VendorRegisDetail';
import { ApiService } from 'src/app/service/api.service';
import { CollapseModule } from 'src/app/collapse';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
declare var bootstrap: any;
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PODetails,PaymentListDetails,GetDashboardGrid } from 'src/app/Model/models';

@Component({
  selector: 'app-file-mrcdashboard-finfile',
  standalone: true,
  imports: [
    NgSelectModule,
    CommonModule,
    FormsModule,
    CollapseModule,
    NgbCollapseModule,
    ReactiveFormsModule,
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
  templateUrl: './file-mrcdashboard-finfile.component.html',
  styleUrl: './file-mrcdashboard-finfile.component.css',
})
export class FileMRCDashboardFINFileComponent {
  authorityId = 5;
  Diectorateid: any;
  poType = 'All';
  paymentType = 'All';
  // poType = 'NP';
  // paymentType = 'FP';
  eqType = 0;
  onlyMyDesk = false;
  SendModal: any;
  sendTo: any;
  remarks: any;
  forwardDate: any;
  Sendoption: any;
  userList: any[] = [];
  poID: any;
  FileNo: any;

  // yearList=[{id:0, 'Year':2012}];
  yearList: any;
  searchMode: 'po' | 'outward' = 'po';
  poNo: any;
  outwardNo: any;
  selectedYear: any;
  Diectoratelist: any = {};
  // PODetails: PaymentListDetails[] = [];
  financialyearid: any;
  fileNo: any;
  podt: any;
  schemeCode: any;
  supplierName: any;
  dispatchData: GetDashboardGrid[] = [];
  dataSource!: MatTableDataSource<GetDashboardGrid>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'PoNo',
    'TenderNo',
    'Supplier',
    'PoDate',
    'ItemName',
    'PoQty',
    'PoValue',
    'SupplyQty',
    'ReceiptQty',
    'InsQty',
    'Conditond',
    // 'FitUnfit',
    'PresentFile',
    'FileNo',
    'LastRDate',
    'FacilityAutName',
    // 'ItemCode',
    'PoType',
    'FileDt',
    'PresentUserId',
    'ToUserId',
    'PenaltyPercent',
    'ReasonId',
    'ReasonName',
    'IsSolved',
    'SiteStatus',
    'RowNo',
    'ToDate',
    'EntDt',
    'FinRemarks',
    // 'ExtStatus',
    'Present_File_Action',
    'action',
  ];
 
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.dataSource = new MatTableDataSource<GetDashboardGrid>([]);
  }

  ngOnInit() {
    this.GetDashboardGrid();

    // this.Getyears();
    this.GetDiectorate();
  }
  search() {
    // debugger;
    if (this.searchMode === 'po') {
      if (!this.poNo) {
        this.toastr.warning('Enter PO Number');
        return;
      }
      // call PO search
      // this.GetPODetails();
    }

    if (this.searchMode === 'outward') {
      if (!this.outwardNo || !this.selectedYear) {
        this.toastr.warning('Enter Outward Number and Year');
        return;
      }
      // call outward search
      // this.GetPODetails();
    }
  }

  // https://localhost:7036/api/GenerateNasti/Getyear

  // https://localhost:7036/api/Reports/GetDiectorate
  GetDiectorate() {
    this.spinner.show();
    let directorateId = 5;
    this.api.get(`Reports/GetDiectorate`).subscribe({
      next: (res: any) => {
        this.Diectoratelist = res;

        console.log('items', res);
        this.spinner.hide();
      },
      error: (err: any) => {
        console.error(err);
        this.spinner.hide();
      },
    });
  }
  GetPODetails() {
    // debugger
    this.spinner.show();

    const params = {
      pono: this.poNo || 0,
      outwardNo: this.outwardNo || 0,
      financialYearId: this.financialyearid || 0,
    };
    this.api.get('GenerateNasti/GetPODetails', { params }).subscribe({
      next: (res: any) => {
        console.log('podetailes', res);
        // this.PODetails = res[0];

        const data = res[0];

        // this.poId = data.ponoid;
        this.fileNo = data.fileNo;
        this.poNo = data.poNo;
        this.schemeCode = data.schemeCode;
        this.supplierName = data.supplierName;
        this.podt = this.convertDate(data.podt);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }
  convertDate(dateStr: string) {
    const parts = dateStr.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  onselectacno(event: any): void {
    //  debugger
    const financial_year_id = event.financial_year_id;
    this.financialyearid = financial_year_id;
    // if (bankaccountid === 0) {
    // //  this.GETSupplierBankAccDetail(0,bankaccountid);
    // // this.GETSupplierBankAccDetail(1836,1139);
    // // this.bankForm.resetForm();

    // } else {
    //   // this.GETSupplierBankAccDetail(1836,1139);
    //   // const selectedUser = this.VendorBankDetail.find(
    //   //   (user: { bankaccountid: any }) => user.bankaccountid === this.acno
    //   // );
    //   // console.log('selectedUser:', selectedUser);
    // }
  }
  // https://localhost:7036/api/Payment/GetFitPaymentList?Potype=NP&MyDeskFile=false&FitUnfit=FP&UserId=383
  // https://localhost:7036/api/Payment/GetFitPaymentList?Potype=NP&MyDeskFile=false&FitUnfit=FP

  //new letest code  https://localhost:7036/api/GMFI/GetDashboardGrid?poType=NP&fitUnfit=FP&eqType=0&authorityId=5

  GetDashboardGrid() {
    debugger;
    try {
      this.spinner.show();
// const params = { poType: 'NP', fitUnfit: 'FP', eqType: '0', authorityId: 5 };
      const params = {
        poType: this.poType,
        fitUnfit: this.paymentType,
        eqType: this.eqType,
        authorityId: this.authorityId,

     
      };
      this.api.get('GMFI/GetDashboardGrid?',{ params }).subscribe(
        (res: any) => {
          this.dispatchData = res.map(
            (item: GetDashboardGrid, index: number) => ({
              ...item,
              sno: index + 1,
            }),
          );
          console.log('GetDashboardGrid=:', this.dispatchData);
          this.dataSource.data = this.dispatchData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        (error: { message: any }) => {
          this.spinner.hide();
          console.log('Error fetching data:', JSON.stringify(error.message));
          // alert(`Error fetching data: ${JSON.stringify(error.message)}`);
        },
      );
    } catch (err: any) {
      this.spinner.hide();

        console.log('Error fetching data:', JSON.stringify(err.message));
      // throw err;
    }
  }
  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onButtonClick(poid: any) {
    this.router.navigate(['/InstallationDetails'], {
      queryParams: { poId: poid },
    });
    // InstallationDetails
    // alert(poid)
    // InstallationDetails
  }
  // https://localhost:7036/api/Payment/GetHeaderPO?poId=136

  ONOpenModal(id: any, FileNo: any): void {
    this.poID = id;
    this.FileNo = FileNo;
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());

    const modalEl = document.getElementById('SendModal')!;
    document.body.appendChild(modalEl);
    (modalEl as HTMLElement).style.zIndex = '99999';

    this.SendModal = new bootstrap.Modal(modalEl, {
      backdrop: false,
      keyboard: true,
      focus: true,
    });
    this.SendModal.show();
  }
  // https://localhost:7036/api/Payment/sendto/383?sb=S
  Getsendto() {
    this.sendTo = '';
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    const userId = loginData.user_id;
    // const poid = 383;
    const send = this.Sendoption;

    this.api.get(`Payment/sendto/${userId}?sb=${send}`).subscribe({
      next: (res: any) => {
        this.userList = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
  //
  saveForward(form: any) {
    // debugger;
    this.spinner.show();
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');

    const payload = {
      UserId: loginData.user_id,

      ToUserId: this.sendTo,

      PonoId: this.poID,

      FileId: this.FileNo || '',

      Remarks: this.remarks,

      ForwardDate: this.forwardDate,

      Flag: this.Sendoption,
    };

    console.log('Forward Payload', payload);

    this.api.post1('Payment/forward', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success('File Forward Successfully!');
        form.resetForm();
        console.log('Forward Success', res);
      },

      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }
  onSelectedDiectorate(Diectorate: any) {
    this.Diectorateid = Diectorate.facility_aut_id;
    this.authorityId = Diectorate.facility_aut_id;
    // console.log(Diectorate.financial_year_id);
    // console.log(Diectorate.year);
  }

ONOpenSanction(opid: any, file: any) {
  this.router.navigate(['/Sanction'], { 
    queryParams: { 
      poId: opid, 
      fileNo: file 
    } 
  });
}

}
