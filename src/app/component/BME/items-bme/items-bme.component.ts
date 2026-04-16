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
import {EquipmentItemDTO } from 'src/app/Model/models';

@Component({
  selector: 'app-items-bme',
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
  templateUrl: './items-bme.component.html',
  styleUrl: './items-bme.component.css',
})
export class ItemsBMEComponent {
equipmentForm!: FormGroup;
  showForm: boolean = true; 
  Categorylist: any[] = [];






  show: boolean = false;
  SupplierResponseDTO: EquipmentItemDTO[] = [];
  dispatchData: EquipmentItemDTO[] = [];
  dataSource!: MatTableDataSource<EquipmentItemDTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'ItemCodeAsPerTender',
    'ItemName',
    'RCValid',
    'EstimatedCost',
    'AMC',
    'PmMonth',
    'TenderNo',
    'Category',
    'File-uplod',
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
    this.dataSource = new MatTableDataSource<EquipmentItemDTO>([]);
  this.equipmentForm = this.fb.group({
      ItemCode: ['', Validators.required],
      ItemName: ['', Validators.required],
      CategoryId: ['', Validators.required], // DTO में इसका नाम CategoryId है
      Price: [null], // Optional
      PreventivePeriod: [null], // Optional
      
      // Radio Buttons के Default Values ('f' = No, 't' = Yes)
      Warranty: ['f'],
      AMC: ['f'],
      PrevMaint: ['f'],
      Installation: ['f']
    });
  }

  ngOnInit() {
    this.GetEquipmentIte();
    this.GetCategorylist();
  }

  //https://localhost:7036/api/BME/GetCategorylist

  GetCategorylist() {
    // debugger
    try {
      // this.spinner.show();
      this.api.get('BME/GetCategorylist').subscribe(
        (res: any) => {
      this.Categorylist=res;
          // console.log('ContractItem=:', this.dispatchData);
          // this.spinner.hide();
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
  GetEquipmentIte() {
    // debugger
    this.spinner.show();
    try {
      this.api.get('BME/GetEquipmentIte').subscribe(
        (res: any) => {
          this.dispatchData = res.map(
            (item: EquipmentItemDTO, index: number) => ({
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

onSubmit(): void {
      this.spinner.show();
    if (this.equipmentForm.valid) {
      
      const payload = this.equipmentForm.value;
      
      // API Call
      this.api.post2('BME/CreateEquipment', payload).subscribe({
        next: (response: any) => {
          this.toastr.success(response.message || 'Equipment Successfully Inserted!', 'Success');
          this.equipmentForm.reset({
            Warranty: 'f', AMC: 'f', PrevMaint: 'f', Installation: 'f', CategoryId: ''
          });

          this.GetEquipmentIte();
          this.showForm = false;
              this.spinner.hide();
        },
        error: (err: any) => {
          this.spinner.hide();
          console.error('API Error:', err);

          this.toastr.error(err.message || 'Something went wrong.', 'Error');
        },
      });

    } else {
              this.spinner.hide();


      this.equipmentForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields correctly.', 'Warning');
    }
  }
// onSubmit(): void {
//   // debugger;
//     this.spinner.show();
//   if (this.supplierForm.valid) {
    
//     // ==========================================
//     // 1. UPDATE CONDITION (currentSupplierId)
//     // ==========================================
//     if (this.currentSupplierId) {
      
//       const updatePayload = {
//         SupplierId: this.currentSupplierId,
//         ...this.supplierForm.value 
//       };

//       this.api.put(`BME/Update/${this.currentSupplierId}`, updatePayload).subscribe({
//         next: (response: any) => {
//           let msg = 'Record Successfully Updated!';
//           try {
//             let parsedRes = JSON.parse(response);
//             msg = parsedRes.message || msg;
//           } catch (e) {
//             msg = response || msg;
//           }

//           this.toastr.success(msg, 'Success');
//           this.resetFormState(); 
//           this.GetSupplierlist();
//             this.spinner.hide();
//         },
//         error: (err: any) => {
//             this.spinner.hide();
//           console.error('API Error:', err);
//           let errMsg = err.error?.message || err.error || 'Something went wrong.';
//           this.toastr.error(errMsg, 'Error');
//         }
//       });
      
//     } 
//     // ==========================================
//     // 2. CREATE CONDITION (currentSupplierId null)
//     // ==========================================
//     else {
//       this.api.post2('BME/Create', this.supplierForm.value).subscribe({
//         next: (response: any) => {
//           this.toastr.success(response.message || 'Record Successfully Inserted!', 'Success');
//           this.resetFormState(); 
//           this.GetSupplierlist();
//         },
//         error: (err: any) => {
//             this.spinner.hide();
//           console.error('API Error:', err);
//           this.toastr.error(err.error?.message || 'Something went wrong.', 'Error');
//         }
//       });
//     }

//   } else {
//       this.spinner.hide();
//     this.supplierForm.markAllAsTouched();
//     this.toastr.warning('Please fill all required fields correctly.', 'Warning');
//   }
// }

// resetFormState(): void {
//   this.supplierForm.reset();
//   this.currentSupplierId = null; 
//    this.spinner.hide();

// }
  // https://localhost:7036/api/BME/GetById/22

  // SupplierResponseDTO
// GetById(SupID: any) {
//     this.show = true;
//     this.spinner.show();
    
//     this.api.get(`BME/GetById/${SupID}`).subscribe({
//       next: (res: any) => {
//         console.log('Fetched Data:', res);
        
//       this.currentSupplierId = res.SupplierId; 
      
//       this.supplierForm.patchValue(res);
//         // this.supplierForm.patchValue({
//         //   SupplierName: res.SupplierName,
//         //   ContactPersonName: res.ContactPersonName,
//         //   ContactPersonNumber: res.ContactPersonNumber,
//         //   MobileNo: res.MobileNo,
//         //   Email: res.Email,
//         //   GSTNo: res.GSTNo,
//         //   PhnNo: res.PhnNo,
//         //   TinNo: res.TinNo,
//         //   Address: res.Address
//         // });
        
//         this.spinner.hide();
//       },
//       error: (err: any) => {
//         console.error(err);
//         this.spinner.hide();
//       },
//     });
// }


}
