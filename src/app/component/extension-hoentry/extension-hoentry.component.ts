
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
import { ExtensionListDTO} from 'src/app/Model/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-extension-hoentry',
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
  templateUrl: './extension-hoentry.component.html',
  styleUrl: './extension-hoentry.component.css',
})
export class ExtensionHOEntryComponent {
  HeaderEX: any = {};
Supplier:any;
PoNo:any;
PoDate:any;
SupplyDays:any;
PoEndDate:any;
ItemName:any
Days:any;
Extension_Date:any;
remarks:any;
IsPenalty:any;
LetterDate:any;
selectedFile: File | null = null;
poid:any;
    dispatchData: ExtensionListDTO[] = [];
  dataSource!: MatTableDataSource<ExtensionListDTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'ExtensionId',
    'PoId',
    'Remark',
    'Days',
    'ExtendedDate',
    'PoEndDate',
    'Path',
    'LetterDate',
    'LetterNo',
    'SysGenApplyDate',
    'Status',
    'Penalty',
    //  'action',

  ];
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,private route: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource<ExtensionListDTO>([]);
  }

ngOnInit() {

  this.route.queryParams.subscribe(params => {

    const poId = params['poId'];
    this.poid=poId;
    console.log('PO ID:', poId);
    this.GetHeaderEXHO(poId);
     this.GetExtensionEHO(poId);


  });
}
// https://localhost:7036/api/ExtensionEHO/header/661

  GetHeaderEXHO(poid: any) {
  this.spinner.show();

  this.api.get(`ExtensionEHO/header/${poid}`).subscribe({
    next: (res: any) => {
      this.HeaderEX = res[0]; 
      this.Supplier= this.HeaderEX.SupplierName;
      this.ItemName= this.HeaderEX.ItemName;
      this.PoNo= this.HeaderEX.PoNo;
      this.PoDate= this.HeaderEX.PoDate;
      this.SupplyDays= this.HeaderEX.SupplyDays;
      this.PoEndDate= this.HeaderEX.PoEndDate;
      // this.SupplyDays= this.HeaderEX.SupplyDays;
      console.log('GetHeaderPO', res);
      this.spinner.hide();
    },
    error: (err: any) => {
      console.error(err);
      this.spinner.hide();
    },
  });
}
// https://localhost:7036/api/ExtensionEHO/list/444
 GetExtensionEHO(poid:any) {
    // debugger
    try {
      this.spinner.show();
      this.api.get(`ExtensionEHO/list/${poid}`).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: ExtensionListDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          console.log('ExtensionListDTO=:', this.dispatchData);
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

// https://localhost:7036/api/ExtensionEHO/apply

// onSubmit(form: any) {
// // debugger;
//  this.spinner.hide();
//   if (form.invalid) {
//      this.toastr.warning('Please fill all required fields ❌');
//     return;
//   }

//   const payload = {
//       PoId: Number(this.poid), 
//      Days: Number(this.Days), 
//       Remark: this.remarks?.substring(0, 200),
//       ExtendedDate: this.formatDate(new Date()), 
//     PoEndDate: this.formatDate(this.PoEndDate),
//     LetterDate: this.formatDate(this.LetterDate),
//     IsPenalty: this.IsPenalty[0] 
//   };
// // console.log(JSON.stringify(payload));
//   this.api.post1('ExtensionEHO/apply', payload)
//     .subscribe({
//       next: (res: any) => {
//         this.toastr.success('Submitted Successfully!');
//         form.reset();
//          this.spinner.hide();
//       },
//       error: (err) => {
//          this.spinner.hide();
//         console.error(err);
//         // alert('Error ❌');
//       }
//     });
// }

onSubmit(form: any) {

  if (form.invalid) {
    this.toastr.warning('Please fill all required fields ❌');
    return;
  }

  const formData = new FormData();

  formData.append('PoId', this.poid);
  formData.append('Days', this.Days);
  formData.append('Remark', this.remarks?.substring(0, 200));
  formData.append('ExtendedDate', this.formatDate(new Date()));
  formData.append('PoEndDate', this.formatDate(this.PoEndDate));
  formData.append('LetterDate', this.formatDate(this.LetterDate));
  formData.append('IsPenalty', this.IsPenalty === 'Yes' ? 'Y' : 'N');

  
  if (this.selectedFile) {
    formData.append('File', this.selectedFile);
  }

  this.api.post2('ExtensionEHO/apply', formData)
    .subscribe({
      next: (res: any) => {
        this.toastr.success('Submitted Successfully!');
        form.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error ❌');
      }
    });
}
onFileChange(event: any) {
  this.selectedFile = event.target.files[0];
}
formatDate(date: any): string {
  return date ? new Date(date).toISOString() : '';
}
// onFileChange(event: any) {
//   this.selectedFile = event.target.files[0];
// }
// formatDate(date: any) {
//   return date ? new Date(date).toISOString() : null;
// }
}
