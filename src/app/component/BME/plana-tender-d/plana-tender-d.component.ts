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

@Component({
  selector: 'app-plana-tender-d',
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
  templateUrl: './plana-tender-d.component.html',
  styleUrl: './plana-tender-d.component.css',
})
export class PlanaTenderDComponent {
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
  financialYearId: 19, // डिफ़ॉल्ट 19 सेट किया है
  typeId: null,
  categoryId: null,
  searchText: ''
};
Typeid=0;
yearlist:any;
financial_year_id=19;
  dispatchData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
displayedColumns: string[] = [
  'sno',
  'TenderNo',
  'TotalItems',
  'TotalValue',
  'CStatus',
  'TenderDate',
  'NosItemsBid',
  'TenderDescription',
  'UpdateStatus' ,
  'AddTenderItem' ,
  'UpdateExcel' ,
  'AddBidder' ,
  'AddBidItem' ,
  'AddLeavy' ,
  'AddnewHOD' ,
  'actions' 
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
    this.GetTenderDashboardReports(19,0);
  }
  onSubmitFilter(form: any) {
  if (form.invalid) {
    // अगर फॉर्म अधूरा है
    return;
  }
  
  this.spinner.show();
  console.log('Submitted Filter Data:', this.filterData);
this.GetTenderDashboardReports(this.filterData.financialYearId,this.filterData.typeId);
}

onResetFilter(form: any) {
  form.resetForm();
  this.filterData = {
    financialYearId: null, 
    typeId: null,
    categoryId: null,
    searchText: ''
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

// https://localhost:7036/api/BME/GetTenderDashboardReports/19/1
GetTenderDashboardReports(fid:any,tyid:any) {
  // debugger;
  // // अगर ड्रॉपडाउन से वैल्यू सिलेक्ट नहीं हुई है, तो API कॉल ही मत करो
  // if (!this.financial_year_id || this.Typeid === undefined || this.Typeid === null) {
  //   this.toastr.warning('Please select Financial Year and Type', 'Warning');
  //   return;
  // }

  this.spinner.show();

  this.api.get(`BME/GetTenderDashboardReports/${fid}/${tyid}`).subscribe({
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
}
