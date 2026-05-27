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

@Component({
  selector: 'app-program-master',
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
  templateUrl: './program-master.component.html',
  styleUrl: './program-master.component.css',
})
export class ProgramMasterComponent {

mappingForm!: FormGroup; 
  showForm: boolean = true; 
  
  FacilityList: any[] = []; 

  dispatchData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  
  displayedColumns: string[] = ['sno', 'FacilityAutCode', 'ProgramName', 'CreatedOn'];
  

  selectedItems: number[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
    
    this.mappingForm = this.fb.group({
      FacilityAutId: [null, Validators.required]
    });
  }

  ngOnInit() {
  this.initFormSchema();

    this.GetmappedItems(); 
    this.GetEquipmentIte(); 
  }

  GetmappedItems() {
    // https://localhost:7036/api/BME/GetFacilityList
    this.api.get('BME/GetFacilityList').subscribe({
      next: (res: any) => {
        this.FacilityList = res; 
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      }
    });
  }

  GetEquipmentIte() {
    //https://localhost:7036/api/POCell/GetProgramFacilityList
    this.spinner.show();
    this.api.get('POCell/GetProgramFacilityList').subscribe({
      next: (res: any) => {
        this.dispatchData = res.map((item: any, index: number) => ({
          ...item,
          sno: index + 1,
        }));
        this.dataSource.data = this.dispatchData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.log('Error fetching table data:', err);
      }
    });
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
private initFormSchema() {
  this.mappingForm = this.fb.group({
    directorateId: [null, Validators.required],
    programName: ['', Validators.required] 
  });
}

onSubmit() {
  if (this.mappingForm.invalid) {
    this.mappingForm.markAllAsTouched();
    this.toastr.warning("Please fill all required fields correctly.");
    return;
  }
  this.spinner.show();
  const formValue = this.mappingForm.value;
  const payload = {
    ProgramName: formValue.programName,
    DirectorateId: String(formValue.directorateId) 
  };

  // console.log('Sending Reactive Form Payload:', payload);
// https://localhost:7036/api/POCell/SaveProgram
  this.api.post1('POCell/SaveProgram', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message || "Record Successfully Inserted");
      this.GetEquipmentIte(); 
      this.mappingForm.reset();
      
      if (typeof (this as any).refreshGridDataList === 'function') {
        (this as any).refreshGridDataList();
      }
    },
    error: (err) => {
      this.spinner.hide();
      console.error('API Error:', err);
      this.toastr.error(err.error?.message || "Something went wrong while saving data.");
    }
  });
}

}