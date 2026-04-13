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
import {MassupplierDTO, SupplierResponseDTO } from 'src/app/Model/models';

@Component({
  selector: 'app-mastter-supplier-dash',
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
  templateUrl: './mastter-supplier-dash.component.html',
  styleUrl: './mastter-supplier-dash.component.css',
})
export class MastterSupplierDashComponent {
  supplierForm!: FormGroup;
currentSupplierId: number | null = null;
  show: boolean = false;
  SupplierResponseDTO: SupplierResponseDTO[] = [];
  dispatchData: MassupplierDTO[] = [];
  dataSource!: MatTableDataSource<MassupplierDTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'Name',
    'EmailId',
    'MobileNo',
    'PhNo',
    'GSTNo',
    'Address',
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
    this.dataSource = new MatTableDataSource<MassupplierDTO>([]);
    this.supplierForm = this.fb.group({
      SupplierName: ['', [Validators.required, Validators.maxLength(100)]],
      ContactPersonName: ['', [Validators.required, Validators.maxLength(100)]],
      ContactPersonNumber: ['', Validators.required],
      MobileNo: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      Email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(50)],
      ],
      GSTNo: ['', [Validators.required, Validators.maxLength(15)]],
      PhnNo: ['', [Validators.maxLength(11)]],
      TinNo: [''],
      // TinNo: ['', [Validators.maxLength(15)]],
      Address: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit() {
    this.GetSupplierlist();
  }

  // https://localhost:7036/api/BME/GetSupplierlist

  GetSupplierlist() {
    // debugger
    try {
      this.spinner.show();
      this.api.get('BME/GetSupplierlist').subscribe(
        (res: any) => {
          this.dispatchData = res.map(
            (item: MassupplierDTO, index: number) => ({
              ...item,
              sno: index + 1,
            }),
          );
          // console.log('ContractItem=:', this.dispatchData);
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
    return;

    this.router.navigate(['/InstallationDetails'], {
      queryParams: { poId: poid },
    });
    // InstallationDetails
    // alert(poid)
    // InstallationDetails
  }
  showinput() {
    this.show = true;
  }

  //   'https://localhost:7036/api/BME/Create' \

  // onSubmit(): void {
  //   debugger;
  //   if (this.supplierForm.valid) {
  //     this.api.post2('BME/Create', this.supplierForm.value).subscribe({
  //       next: (response: any) => {
  //         // alert(response.message || 'Record Successfully Inserted!');
  //         this.toastr.success(
  //           response.message || 'Record Successfully Inserted!',
  //           'Success',
  //         );
  //         this.supplierForm.reset();
  //         this.GetSupplierlist();
  //         // this.show=false;
  //       },
  //       error: (err: any) => {
  //         console.error('API Error:', err);
  //         this.toastr.error(
  //           err.error?.message || 'Something went wrong.',
  //           'Error',
  //         );
  //       },
  //     });
  //   } else {
  //     // अगर फॉर्म इनवैलिड है, तो सारे फील्ड्स को touched कर दो ताकि लाल एरर दिख सकें
  //     this.supplierForm.markAllAsTouched();
  //     // alert('Please fill all required fields correctly.');
  //     this.toastr.warning(
  //       'Please fill all required fields correctly.',
  //       'Warning',
  //     );
  //   }
  // }
onSubmit(): void {
  // debugger;
    this.spinner.show();
  if (this.supplierForm.valid) {
    
    // ==========================================
    // 1. UPDATE CONDITION (currentSupplierId)
    // ==========================================
    if (this.currentSupplierId) {
      
      const updatePayload = {
        SupplierId: this.currentSupplierId,
        ...this.supplierForm.value 
      };

      this.api.put(`BME/Update/${this.currentSupplierId}`, updatePayload).subscribe({
        next: (response: any) => {
          let msg = 'Record Successfully Updated!';
          try {
            let parsedRes = JSON.parse(response);
            msg = parsedRes.message || msg;
          } catch (e) {
            msg = response || msg;
          }

          this.toastr.success(msg, 'Success');
          this.resetFormState(); 
          this.GetSupplierlist();
            this.spinner.hide();
        },
        error: (err: any) => {
            this.spinner.hide();
          console.error('API Error:', err);
          let errMsg = err.error?.message || err.error || 'Something went wrong.';
          this.toastr.error(errMsg, 'Error');
        }
      });
      
    } 
    // ==========================================
    // 2. CREATE CONDITION (currentSupplierId null)
    // ==========================================
    else {
      this.api.post2('BME/Create', this.supplierForm.value).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message || 'Record Successfully Inserted!', 'Success');
          this.resetFormState(); 
          this.GetSupplierlist();
        },
        error: (err: any) => {
            this.spinner.hide();
          console.error('API Error:', err);
          this.toastr.error(err.error?.message || 'Something went wrong.', 'Error');
        }
      });
    }

  } else {
      this.spinner.hide();
    this.supplierForm.markAllAsTouched();
    this.toastr.warning('Please fill all required fields correctly.', 'Warning');
  }
}

resetFormState(): void {
  this.supplierForm.reset();
  this.currentSupplierId = null; 
   this.spinner.hide();

}
  // https://localhost:7036/api/BME/GetById/22

  // SupplierResponseDTO
GetById(SupID: any) {
    this.show = true;
    this.spinner.show();
    
    this.api.get(`BME/GetById/${SupID}`).subscribe({
      next: (res: any) => {
        console.log('Fetched Data:', res);
        
      this.currentSupplierId = res.SupplierId; 
      
      this.supplierForm.patchValue(res);
        // this.supplierForm.patchValue({
        //   SupplierName: res.SupplierName,
        //   ContactPersonName: res.ContactPersonName,
        //   ContactPersonNumber: res.ContactPersonNumber,
        //   MobileNo: res.MobileNo,
        //   Email: res.Email,
        //   GSTNo: res.GSTNo,
        //   PhnNo: res.PhnNo,
        //   TinNo: res.TinNo,
        //   Address: res.Address
        // });
        
        this.spinner.hide();
      },
      error: (err: any) => {
        console.error(err);
        this.spinner.hide();
      },
    });
}


}
