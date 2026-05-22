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
declare var bootstrap: any;
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-consolidated-indent-pocell',
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
  templateUrl: './consolidated-indent-pocell.component.html',
  styleUrl: './consolidated-indent-pocell.component.css',
    animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', opacity: 0, padding: '0' })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('expanded <=> collapsed', animate('250ms ease-in-out')),
    ])
  ],
})
export class ConsolidatedIndentPOCellComponent {
Type=[
  {Value:1,T_name:'Live'},
  {Value:2,T_name:'Cover-A'},
  {Value:3,T_name:'Cover-B'},
  {Value:4,T_name:'Under Demo'},
  {Value:5,T_name:'Price Opened'},
  {Value:6,T_name:'Cancelled'}
]
Category=[
  {Value:'C',C_name:'Code'},
  {Value:'N',C_name:'Name'},
  {Value:'T',C_name:'Tender'}
]

filterData: any = {
  financialYearId: 19, 
  USER_ID: null,
  // categoryId: null,
  // searchText: ''
};
selectedYearId:any;
USER_ID:any;
yearlist:any;
DMElist:any;
financial_year_id=19;
  dispatchData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
displayedColumns: string[] = [
  'sno',
  'UserName',
  'IndentConNo',
  'ConsolidatedDate',
  'NosIndentQty',
  'EStatus',
  'UploadStatus',
  'IsBackEntry',
  'FinalQty',
  'indentReoprt',
  'Download',
  'insertRemarks',
  'actions',
];
 constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }
  ngOnInit() {
    this.Getyear();
    this.GetDMElist();
    // this.GetTenderDashboardReports(19,0);
  }
  onSubmitFilter(form: any) {
  if (form.invalid) {
    return;
  }
  
  this.spinner.show();
  console.log('Submitted Filter Data:', this.filterData);
this.GetTenderDashboardReports(this.filterData.financialYearId,this.filterData.USER_ID);
}

onResetFilter(form: any) {
  form.resetForm();
  this.filterData = {
    financialYearId: null, 
    USER_ID: null,
    // categoryId: null,
    // searchText: ''
  };
}
    Getyear() {
      // debugger;
    this.api.get('GenerateNasti/Getyear').subscribe({
      next: (res: any) => {
        this.yearlist = res;
        console.log('year 1=',   this.yearlist);
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }
    GetDMElist() {
      // debugger;
      // {
  //   "USER_ID": 80,
  //   "e_mail_id": "mcambikapur@ems.in",
  //   "USER_NAME": "Medical College Ambikapur",
  //   "designation": "Dean"
  // },// https://localhost:7036/api/BME/GetDMElist
    this.api.get('BME/GetDMElist').subscribe({
      next: (res: any) => {
        this.DMElist = res;
        console.log('DMElist 1=',this.DMElist);
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }

// https://localhost:7036/api/BME/GetIndentConsolidationList/12/80/19
GetTenderDashboardReports(fid:any,USER_ID:any) {
  // debugger;
  // if (!this.financial_year_id || this.Typeid === undefined || this.Typeid === null) {
  //   this.toastr.warning('Please select Financial Year and Type', 'Warning');
  //   return;
  // }
var DID=12;
  this.spinner.show();

  this.api.get(`BME/GetIndentConsolidationList/${DID}/${USER_ID}/${fid}`).subscribe({
    next: (res: any) => {
      this.dispatchData = (res || []).map((item: any, index: number) => ({
        ...item,
        sno: index + 1,
      }));
      
      console.log('Contract Items Data =', this.dispatchData);

      this.dataSource.data = this.dispatchData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cdr.detectChanges();
      this.spinner.hide();
    },
    error: (err: any) => {
      this.spinner.hide();
      console.log('Error fetching items data:', err);
      this.toastr.error('Failed to load items.', 'Error');
    },
  });
}

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

// opennewpage() {
//     this.router.navigate(['/TenderStatusUpdate']);
//   }

 opennewpage(tender_no :any) {
   this.router.navigate(['/TenderStatusUpdate'], {
      queryParams: {tender_no:tender_no},
    });
  }
 openAddRTenderItems(tender_no :any) {
   this.router.navigate(['/AddRTenderItems'], {
      queryParams: {tender_no:tender_no},
    });
  }
 openAddRExcel(tender_no :any) {
   this.router.navigate(['/AddExcel'], {
      queryParams: {tender_no:tender_no},
    });
  }
 openCovAaddRemuvie(tender_no :any) {
   this.router.navigate(['/CovAaddRemuvie'], {
      queryParams: {tender_no:tender_no},
    });
  }
  OpenCovAItemsEntry(tender_no :any) {
   this.router.navigate(['/CovAItemsEntry'], {
      queryParams: {tender_no:tender_no},
    });
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/CovAItemsEntry'], { queryParams: { sid: supplierId, tid: tenderId } })
    // );
    // window.open(url, '_blank'); 
}
OpenAddLeavy(tender_no :any) {
   this.router.navigate(['/AddLeavy'], {
      queryParams: {tender_no:tender_no},
    });
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/AddLeavy'], { queryParams: { sid: supplierId, tid: tenderId } })
    // );
    // window.open(url, '_blank'); 
}
OpenAddTenderCon(tender_no :any) {
   this.router.navigate(['/AddTenderCon'], {
      queryParams: {tender_no:tender_no},
    });
 
}

FinancialYearList:any;
newTender: any = {
  tenderNo: '',
  finYearId: '',
  tenderDate: '',
  processingFee: null,
  description: ''
};


Newtender(){

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

// Initializing the model
newTender1: any = {
  tenderNo: '',
  description: '',
  tenderDate: '',
  finYearId: '',
  isGemTender: false,
  gemBidNo: '',
  tenderValue: 0
};
generateTender(form: NgForm) {
  if (form.invalid) {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });
    this.toastr.warning("Please fill all required fields correctly.");
    return;
  }
    this.spinner.show();
    const payload = {
      TenderNo: this.newTender1.tenderNo,
      TenderDescription: this.newTender1.description,
      TenderDate: this.newTender1.tenderDate,
      FinancialYearId: this.newTender1.finYearId,
      IsGemTender: this.newTender1.isGemTender, 
      GemBidNo: this.newTender1.gemBidNo || null, 
      TenderValue: this.newTender1.tenderValue
    };
  this.api.post1('BME/SaveTender', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message);
      form.resetForm(); 
      this.closeModal();
    },
    error: (err) => {
      this.spinner.hide();
      this.toastr.error("Error occurred while saving.");
    }
  });
}
generateTender1(form: any) {
  debugger;
  if (form.valid) {
    this.spinner.show();
    
    // Mapping model to match your API DTO exactly
    const payload = {
      TenderNo: this.newTender1.tenderNo,
      TenderDescription: this.newTender1.description,
      TenderDate: this.newTender1.tenderDate,
      FinancialYearId: this.newTender1.finYearId,
      IsGemTender: this.newTender1.isGemTender, 
      GemBidNo: this.newTender1.gemBidNo || null, // Empty string ko null bhejna behtar hai
      TenderValue: this.newTender1.tenderValue
    };

    this.api.post1('BME/SaveTender', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res.message);
         this.GetTenderDashboardReports(19,0);
        // Reset form data
        this.resetTenderForm();
        
        // Modal close karne ka logic
        this.closeModal(); 
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || "Failed to save tender");
      }
    });
  } else {
    this.toastr.warning("Please fill all required fields");
  }
}

resetTenderForm() {
    this.newTender = {
        tenderNo: '',
        description: '',
        tenderDate: '',
        finYearId: '',
        isGemTender: false,
        gemBidNo: '',
        tenderValue: 0
    };
}
}
