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
import { PODetails } from 'src/app/Model/models';

@Component({
  selector: 'app-generation-file-nonasti',
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
  templateUrl: './generation-file-nonasti.component.html',
  styleUrl: './generation-file-nonasti.component.css',
})
export class GenerationFileNonastiComponent {
  // yearList=[{id:0, 'Year':2012}];
  yearList: any;
  searchMode: 'po' | 'outward' = 'po';
  poNo: any;
  outwardNo: any;
  selectedYear: any;
  PODetails: PODetails[] = [];
  financialyearid: any;
  fileNo: any;
  podt: any;
  schemeCode: any;
  supplierName: any;
  dispatchData: PODetails[] = [];
  dataSource!: MatTableDataSource<PODetails>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'PONo',
    'PODT',
    'ItemCode',
    'SupplierName',
    'FileNo',
    'FileDT',
    //  ,'action','delete'
  ];

  poId:any;
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.dataSource = new MatTableDataSource<PODetails>([]);
  }

  ngOnInit() {
    this.GETGetPODetails();
    this.Getyears();
  }
  search() {
    // debugger;
    if (this.searchMode === 'po') {
      if (!this.poNo) {
        this.toastr.warning('Enter PO Number');
        return;
      }
      // call PO search
      this.GetPODetails();
    }

    if (this.searchMode === 'outward') {
      if (!this.outwardNo || !this.selectedYear) {
        this.toastr.warning('Enter Outward Number and Year');
        return;
      }
      // call outward search
      this.GetPODetails();
    }
  }

  // https://localhost:7036/api/GenerateNasti/Getyear

  Getyears() {
    this.api.get('GenerateNasti/Getyear').subscribe({
      next: (res: any) => {
        console.log('years', res);
        this.yearList = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
  // 'https://localhost:7036/api/GenerateNasti/GetPODetails?pono=EQP%2F1000%2F2017-2018&outwardNo=0&financialYearId=0'
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

this.poId = data.ponoid;
this.fileNo = data.fileNo;
this.poNo = data.poNo;
this.schemeCode = data.schemeCode;
this.supplierName = data.supplierName;
this.podt = this.convertDate(data.podt);
        // ponoid
        // this.fileNo = data.fileNo;
        // // this.podt = data.podt;
        // this.podt = this.convertDate(data.podt);
        // this.schemeCode = data.schemeCode;
        // this.supplierName = data.supplierName;
        // this.poNo = data.poNo;
        // poNo
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

  GETGetPODetails() {
    try {
      this.spinner.show();

      const params = {
        // pono: 'EQP/783/2017-2018',
        pono: this.poNo || 0,
        outwardNo: this.outwardNo || 0,
        financialYearId: this.financialyearid || 0,
      };
      this.api.get('GenerateNasti/GetPODetails', { params }).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: PODetails, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          console.log('GetPODetails=:', this.dispatchData);
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

//   https://localhost:7036/api/GenerateNasti/UpdateFileNo
//   {
//   "poId": 128,
//   "fileNo": "1898/T fgsergtfgd",
//   "fileDate": "2026-03-09T05:24:43.414Z"
// }

// UpdateFileNo() {

//   try {

//     this.spinner.show();

//     // const body = {
//     //   PoId: this.poId,
//     //   FileNo: this.fileNo,
//     //   FileDate: new Date().toISOString()
//     // };
// const body = {
//   poId: this.poId,
//   fileNo: this.fileNo,
//   fileDate: new Date().toISOString().split('T')[0]
// };
//     this.api.put('GenerateNasti/UpdateFileNo', body).subscribe({
//       next: (res: any) => {

//         console.log(res);
//         this.toastr.success('File Updated Successfully');
//         this.GETGetPODetails();
//         this.spinner.hide();

//       }, error: (error: any) => {

//         this.spinner.hide();
//         console.log('Error:', error);

//       }
//     });

//   } catch (err: any) {

//     this.spinner.hide();
//     console.log(err);

//   }

// }
UpdateFileNo(form: any) {

  try {

    this.spinner.show();

    const body = {
      poId: this.poId,
      fileNo: this.fileNo,
      fileDate: new Date().toISOString().split('T')[0]
    };

    this.api.put('GenerateNasti/UpdateFileNo', body).subscribe({

      next: (res: any) => {

        console.log(res);
        this.toastr.success('File Updated Successfully');
        this.GETGetPODetails();
        this.spinner.hide();

        form.resetForm();

      },

      error: (error: any) => {

        this.spinner.hide();
        console.log('Error:', error);

      }

    });

  } catch (err: any) {

    this.spinner.hide();
    console.log(err);

  }

}
}
