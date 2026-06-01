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
import { PoExtensionReportDto, TenderSupplierDataDTO } from 'src/app/Model/models';

@Component({
  selector: 'app-applied-po-extension',
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
  templateUrl: './applied-po-extension.component.html',
  styleUrl: './applied-po-extension.component.css',
})
export class AppliedPoExtensionComponent {
  Tenterlist: any[] = [];
  Supplierlist: any[] = [];
  txtRmrk: any;
  selectedvalue:any;
  Tenderid: any = null;
AwardOfContractId: any = null;
  CategoryType ='contract'; //1;
 txtContNewEndDate:any;
isTenderDisabled: boolean = false;
isSupplierDisabled: boolean = false;
  dispatchData: PoExtensionReportDto[] = [];
  dataSource!: MatTableDataSource<PoExtensionReportDto>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  // 100% matching with your backend API output payload properties keys
// displayedColumns: string[] = [
//   'sno',
//   'supplierName',
//   'poNo',
//   'poDate',
//   'code',
//   'itemName',
//   'basicRate',
//   'percentage',
//   'singleUnitPrice',
//   'quantity',
//   'totalPoValue',
//   'noOfConsignee',
//   'tenderNo',
//   'status',
//   'sd',
//   'trancheDays',
//   'poEndDate',
//   'lastPoEndDate',
//   'letterNo',
//   'letterDate',
//   'days',
//   'extendedDate',
//   'sysGenApplyDate',
//   'letterStatus'
// ];
  displayedColumns: string[] = [
    'sno',
    'SupplierName',
    'PoNo',
    'ItemName',
    'BasicRate',
    'Quantity',
    'TotalPoValue',
    'TenderNo',
    'NoOfConsignee',
    'Status',
    'Sd',
    'TrancheDays',
    'PoEndDate',
    'LastPoEndDate',
    'LetterNo',
    'LetterDate',
    'Days',
    'ExtendedDate',
    'SysGenApplyDate',
    'action',
    'Approve',
    'Reject',
    'Edit'

  ];

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,private cd: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<PoExtensionReportDto>([]);
  }

  ngOnInit() {
    this.GetConTenterlist();
  }

  // https://localhost:7036/api/Contract/GetAccTenterlist
// https://localhost:7036/api/BME/GetTenderList1/5
  GetConTenterlist() {
    // this.spinner.show();
    this.api.get(`BME/GetTenderList1/${5}`).subscribe({
      next: (res: any) => {
        this.Tenterlist = res;
        // console.log(' this.Tenterlist:', this.Tenterlist);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }
  // https://localhost:7036/api/Contract/GetAccSupplierlist
  // https://localhost:7036/api/POCell/GetContractsByTender/169
  GetContractsByTender() {
    // this.spinner.show();
    this.api.get(`POCell/GetContractsByTender/${this.Tenderid}`).subscribe({
      next: (res: any) => {
        this.Supplierlist = res;
        // console.log('Supplierlist:', this.Supplierlist);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }

  onSelectedItem(tenders: any) {
    this.Tenderid = tenders.Tenderid;
    this.GetContractsByTender();

  //    if (this.Tenderid) {
  //   // this.isSupplierDisabled = true;
  //   this.supplier_id = 0; // reset supplier
  // } else {
  //   this.isSupplierDisabled = false;
  // }
  }
  onSelectedItem1(supplier: any) {
    this.AwardOfContractId = supplier.AwardOfContractId;
  //     if (this.supplier_id) {
  //   this.isTenderDisabled = true;
  //   this.Tenderid = 0; // reset tender
  // } else {
  //   this.isTenderDisabled = false;
  // }
  }


  //https://localhost:7036/api/POCell/GetExtensionReportList/applied
  GetTenderSupplierData() {
    // debugger
    try {
      this.spinner.show();
    
      // this.api.get('POCell/GetContractGridDetail?', { params }).subscribe(
      this.api.get(`POCell/GetExtensionReportList/${this.CategoryType}`).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: PoExtensionReportDto, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          console.log('TenderSupplierDataDTO=:', this.dispatchData);
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

      console.log(err);
      // throw err;
    }
  }
  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onButtonClick(poid: any) {
    return
    this.router.navigate(['/InstallationDetails'], {
      queryParams: { poId: poid },
    });
    // InstallationDetails
    // alert(poid)
    // InstallationDetails
  }
onCategoryChange() {
  if (this.CategoryType === 'applied') {
    this.AwardOfContractId = null;  // disable supplier + clear
  }

  if (this.CategoryType === 'approved') {
    // this.tender/id = null;    // disable tender + clear
  }
  if (this.CategoryType === 'rejected') {
    // this.tender/id = null;    // disable tender + clear
  }
    // force UI refresh
  this.cd.detectChanges();
}
ExtendContract1(){
 if (!this.txtContNewEndDate || !this.AwardOfContractId) {
    this.toastr.warning("Please fill all required inputs.");
    return;
  }

  const payload = {
    AwardOfContractId: Number(this.AwardOfContractId),
    ContractNewEndDate: this.txtContNewEndDate, // Make sure it sends standard dd-mm-yyyy or similar match format
    Remark: this.txtRmrk || ''
  };

  this.spinner.show();
  
  this.api.post1('POCell/ExtendContractTransaction', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message); // "Contract Successfully Extended."
      
      // Clear inputs (WebForms text control resets)
      this.txtContNewEndDate = "";
      this.txtRmrk = "";
      
      // Call your grid reload method (WebForms fillgrid implementation match)
      this.GetTenderSupplierData();
    },
    error: (err) => {
      this.spinner.hide();
      this.toastr.error(err.error?.message || "Transaction update crashed.");
    }
  });
}
// curl -X 'POST' \
//   'https://localhost:7036/api/POCell/ExtendContractTransaction' \
//   -H 'accept: */*' \
//   -H 'Content-Type: application/json' \
//   -d '{
//   "AwardOfContractId": 382,
//   "ContractNewEndDate": "27/05/2026",
//   "Remark": "Extension Approved"
// }'
// txtContNewEndDate: string = '';
// txtRmrk: string = '';
// CategoryType: string = 'Active'; // Example default placeholder initialization
// AwardOfContractId: number | null = 382; // Dynamic parameter updated from your grid selection

ExtendContract(form: NgForm) {
  debugger
  if (form.invalid || !this.AwardOfContractId) {
    this.toastr.warning("Please select a valid date and ensure contract is loaded.");
    return;
  }
let formattedEndDate = '';
  if (this.txtContNewEndDate) {
    formattedEndDate = this.txtContNewEndDate.split('-').reverse().join('/');
  }
  this.spinner.show();
  // let processedDate = this.txtContNewEndDate; 

  const payload = {
    AwardOfContractId: Number(this.AwardOfContractId),
    ContractNewEndDate: formattedEndDate, 
    Remark: this.txtRmrk ? this.txtRmrk.trim() : ''
  };

  console.log('Posting Extension Transaction Payload Context:', payload);
  this.api.post1('POCell/ExtendContractTransaction', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message || "Contract Successfully Extended.");
      form.resetForm({
        CategoryType: this.CategoryType 
      });
      
      this.txtContNewEndDate = "";
      this.txtRmrk = "";
      if (typeof (this as any).GetTenderSupplierData === 'function') {
         (this as any).GetTenderSupplierData();
      }
    },
    error: (err) => {
      this.spinner.hide();
      console.error('Extension Transaction Error:', err);
      this.toastr.error(err.error?.message || "Transaction update crashed inside backend SQL scopes.");
    }
  });
}
}


