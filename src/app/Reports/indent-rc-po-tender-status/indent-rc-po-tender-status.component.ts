import { CommonModule,DatePipe  } from '@angular/common';
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
import {DistrictWiseDetailDTO, IndentConsolidationReportDto} from 'src/app/Model/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-indent-rc-po-tender-status',
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
  templateUrl: './indent-rc-po-tender-status.component.html',
  styleUrl: './indent-rc-po-tender-status.component.css',
})
export class IndentRCPOTenderStatusComponent {

Yearlist: any = {};
Diectoratelist: any = {};
selecteditem:any;
yearid:any;
BudgetList:any;
facility_aut_id:any;
Districtslist:any;
fromdate:any;
todate:any;
Districtsid:any;
Diectorateid:any;
    dispatchData: IndentConsolidationReportDto[] = [];
  dataSource!: MatTableDataSource<IndentConsolidationReportDto>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
displayedColumns: string[] = [
  'sno', 'Code', 'item_name', 'nosconsignee', 
  'totalIndentQTY', 'POQTY', 'RCEndDate', 

  //'Supplier', 'PriceIncGST', 'tender_no', 'TStartDT', 'finalstatus'
];
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,private route: ActivatedRoute,private datePipe: DatePipe
  ) {
    this.dataSource = new MatTableDataSource<IndentConsolidationReportDto>([]);
  }

ngOnInit() {

    this.Getyearslist();
    this.GetDiectorate();
    this.GetDistricts();
     this.GetBudgetDropdownList();


}

// https://localhost:7036/api/GenerateNasti/Getyear

  Getyearslist() {
  this.spinner.show();
let  directorateId =5 ;
  this.api.get(`GenerateNasti/Getyear`).subscribe({
    next: (res: any) => {
      this.Yearlist = res; 

      console.log('items', res);
      this.spinner.hide();
    },
    error: (err: any) => {
      console.error(err);
      this.spinner.hide();
    },
  });
}
// https://localhost:7036/api/POCell/GetBudgetDropdownList
  GetBudgetDropdownList() {
  this.spinner.show();
let  directorateId =5 ;
  this.api.get(`POCell/GetBudgetDropdownList`).subscribe({
    next: (res: any) => {
      this.BudgetList = res; 

      console.log('items', res);
      this.spinner.hide();
    },
    error: (err: any) => {
      console.error(err);
      this.spinner.hide();
    },
  });
}
// https://localhost:7036/api/Reports/GetDiectorate
  GetDiectorate() {
  this.spinner.show();
let  directorateId =5 ;
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
// https://localhost:7036/api/Reports/GetDistricts
  GetDistricts() {
  this.spinner.show();
let  directorateId =5 ;
  this.api.get(`Reports/GetDistricts`).subscribe({
    next: (res: any) => {
      this.Districtslist = res; 

      console.log('items', res);
      this.spinner.hide();
    },
    error: (err: any) => {
      console.error(err);
      this.spinner.hide();
    },
  });
}
//https://localhost:7036/api/GMFI/GetConsolidatedGridData
 Getitemwisedetail(yearid:any,Diectorateid:any) {
  // "FinancialYearId": 15,
  // "DirectorateId": 5
    try {
      this.spinner.show();
      const filterPayload = {
    financialYearId: yearid ? yearid : this.yearid,
    directorateId:  Diectorateid ? Diectorateid : this.Diectorateid
  };
      // this.api.get(`GMFI/GetConsolidatedGridData?yearId=${yearid1}&directorateId=${Diectorateid1}`).subscribe(
      this.api.post1('GMFI/GetConsolidatedGridData', filterPayload).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: IndentConsolidationReportDto, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          console.log('GetConsolidationReport=:', this.dispatchData);
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

onSelectedItem(years: any) {
  this.yearid=years.financial_year_id;
  console.log(years.financial_year_id);
  console.log(years.year);
}
onSelectedDiectorate(Diectorate: any) {
  this.Diectorateid=Diectorate.facility_aut_id;
  console.log(Diectorate.financial_year_id);
  console.log(Diectorate.year);
}
onSelectedDistricts(Districts: any) {
  this.Districtsid=Districts.DP_DistrictID;
  console.log(Districts.financial_year_id);
  console.log(Districts.year);
}

 GetitemFulldetail(IndentConsolidationId:any) {
   this.router.navigate(['/IndentEditDHSPO'], {
      queryParams: { IndentConsolidationId: IndentConsolidationId},
      // queryParams: { IndentConsolidationId: IndentConsolidationId, Icode:Icode,POid:POid,tender_no:tender_no,po_no:po_no},
    });
  }
  newTender1: any = {
  selectedUserId: '', 
  finYearId: '',      
  BudgetId: '',        
  tenderDate: '',      
  description: ''      
};

generateTender(form: NgForm) {
  // 1. Session check to fetch logged-in user context identity safely
  const storedData = localStorage.getItem('loginData');
  let currentUserId = 0;

  if (storedData) {
    const loginObj = JSON.parse(storedData);
    currentUserId = Number(loginObj.user_id || loginObj.userId || 0);
  }

  // 2. Client Side Form Validation Guard
  if (form.invalid) {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
    this.toastr.warning("Please fill all required fields correctly.");
    return;
  }

  this.spinner.show();

  // 3. CORRECT KEY MAPPING: Form UI data mapped into strict backend DTO properties
  const payload = {
    FundId: Number(this.newTender1.BudgetId),
    IndentDescription: this.newTender1.description ? this.newTender1.description.trim() : '',
    IndentDateStr: this.newTender1.tenderDate, // Browser returns standard "YYYY-MM-DD"
    UserId: currentUserId,                     // Automatically bound from local storage session
    DirectorateId: Number(this.newTender1.selectedUserId),
    FinancialYearId: Number(this.newTender1.finYearId)
  };

  console.log('Dispatching Final Bound Curl Payload Container:', payload);
  // 'https://localhost:7036/api/POCell/SaveIndentConsolidationActual
  // 4. API Request Triggering
  this.api.post1('POCell/SaveIndentConsolidationActual', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message || "Indent Saved Successfully!");
       this.Getitemwisedetail(this.newTender1.finYearId,this.newTender1.selectedUserId);
      // 5. Clean Reset Form Fields Properties
      form.resetForm();
      this.newTender1 = {
        selectedUserId: '',
        finYearId: '',
        BudgetId: '',
        tenderDate: '',
        description: ''
      };
      
      this.closeModal(); // Hide modal popup container layout overlays
      
      // 6. Refresh active reporting dashboard grid tables if method exists
      if (typeof (this as any).loadGridDataReport === 'function') {
         (this as any).loadGridDataReport();
      }
    },
    error: (err) => {
      this.spinner.hide();
      console.error('API Error Response:', err);
      this.toastr.error(err.error?.message || "Error occurred while saving transaction.");
    }
  });
}

closeModal() {
  const modalElement = document.getElementById('tenderModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) {
    modalInstance.hide();
  }
}
ngAfterViewInit(){
  // ngAfterViewInit mein ye jodein agar problem solve na ho
  document.getElementById('tenderModal')?.addEventListener('shown.bs.modal', (e) => {
    const input = document.getElementById('tenderNo');
    input?.focus();
  });

}
}



