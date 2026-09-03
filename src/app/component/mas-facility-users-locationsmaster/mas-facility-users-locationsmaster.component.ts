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
import {  MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
declare var bootstrap: any;
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-mas-facility-users-locationsmaster',
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
    MatSnackBarModule,
  ],
  templateUrl: './mas-facility-users-locationsmaster.component.html',
  styleUrl: './mas-facility-users-locationsmaster.component.css',
})
export class MasFacilityUsersLocationsmasterComponent {
  locationForm!: FormGroup;
 
  Districtslist: any[] = [];
  filteredDistricts: any[] = []; 
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
 
  }
  ngOnInit(): void {
    this.locationForm = this.fb.group({
      locationName: ['', Validators.required],
      dpDistrictId: [
        '0',
        [Validators.required, Validators.pattern(/^(?!0$).*$/)],
      ],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      emailId: ['', [Validators.required, Validators.email]],
      conductPerson: [''],
      address1: ['', Validators.required],
      address2: [''],
      address3: [''],
      did: [''],
      mcName: [''],
      facilityTypeId: [''],
    });

    this.route.queryParams.subscribe((params) => {
      const urlFid = params['fid'];
      const urlDid = params['did'];

      this.locationForm.patchValue({
        facilityTypeId: urlFid || '',
        did: urlDid || '',
      });
    });

    this.locationForm.get('did')?.valueChanges.subscribe((didValue) => {
      const mcNameControl = this.locationForm.get('mcName');
      if (didValue === '12') {
        mcNameControl?.setValidators(Validators.required);
      } else {
        mcNameControl?.clearValidators();
      }
      mcNameControl?.updateValueAndValidity();
    });

    this.GetDistricts();
  }
  GetDistricts() {
    this.spinner.show();
    this.api.get(`Reports/GetDistricts`).subscribe({
      next: (res: any) => {
        this.Districtslist = res;
        this.filteredDistricts = res; 

        console.log('items', res);
        this.spinner.hide();
      },
      error: (err: any) => {
        console.error(err);
        this.spinner.hide();
      },
    });
  }

  filterDistricts(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    this.filteredDistricts = this.Districtslist.filter((district) =>
      district.DBStart_Name_En.toLowerCase().includes(searchTerm),
    );
  }



  onSubmit(): void {
    if (this.locationForm.valid) {
      const requestData = { ...this.locationForm.value };

      if (requestData.dpDistrictId) {
        requestData.dpDistrictId = requestData.dpDistrictId.toString();
      }

      if (requestData.did) requestData.did = requestData.did.toString();
      if (requestData.facilityTypeId)
        requestData.facilityTypeId = requestData.facilityTypeId.toString();

      this.api.post('POCell/AddLocation', requestData).subscribe({
        next: (response: any) => {
          this.snackBar.open(
            response.message || 'Saved Successfully',
            'Close',
            {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
            },
          );
          this.locationForm.reset({ dpDistrictId: '0' }); 
        },
        error: (err) => {
          console.log(err);
          let errorMessage = 'An error occurred while saving.';
          if (err.error?.errors) {
            errorMessage = Object.values(err.error.errors).join(', ');
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        },
      });
    } else {
      this.locationForm.markAllAsTouched();
    }
  }
}
