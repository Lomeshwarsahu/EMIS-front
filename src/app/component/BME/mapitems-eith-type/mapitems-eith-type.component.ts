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
import {UnmappedItemDTO } from 'src/app/Model/models';

@Component({
  selector: 'app-mapitems-eith-type',
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
  templateUrl: './mapitems-eith-type.component.html',
  styleUrl: './mapitems-eith-type.component.css',
})
export class MapitemsEithTypeComponent {
mappingForm!: FormGroup; 
  SupplierResponseDTO: UnmappedItemDTO[] = [];
  dispatchData: UnmappedItemDTO[] = [];
  dataSource!: MatTableDataSource<UnmappedItemDTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'ItemCodeAsPerTender',
    'ItemName',
    'ItemId',
  
    // 'action',
  ];
  selectedItems: number[] = [];
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {
    this.dataSource = new MatTableDataSource<UnmappedItemDTO>([]);
this.mappingForm = this.fb.group({
  MainItemType: ['', Validators.required],
  AmcRequired: ['Y', Validators.required],
  IsElectrical: ['Y', Validators.required], 
  ProgressRequired: ['Y'], // DTO के हिसाब से 'Y'
  EntryType: ['S'] // DTO के हिसाब से 'S' (Serial)
});
  }

  ngOnInit() {
    this.GetEquipmentIte();
    // this.GetCategorylist();
  }

  // https://localhost:7036/api/BME/GetUnmappedItems
  GetEquipmentIte() {
    // debugger
    this.spinner.show();
    try {
      this.api.get('BME/GetUnmappedItems').subscribe(
        (res: any) => {
          this.dispatchData = res.map(
            (item: UnmappedItemDTO, index: number) => ({
              ...item,
              sno: index + 1,
            }),
          );
          console.log('ContractItem=:', this.dispatchData);
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

  //   'https://localhost:7036/api/BME/Create' \
onSubmit(): void {
  this.spinner.show();
  
  if (this.mappingForm.valid && this.selectedItems.length > 0) {
    
    const payload = {
      ...this.mappingForm.value,
      SelectedItemIds: this.selectedItems
    };
    
    this.api.post2('BME/MapItemsToMainType', payload).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.toastr.success(response.message || 'Items Successfully Mapped!', 'Success');
        
       
        this.mappingForm.reset({
          AmcRequired: 'Y', 
          IsElectrical: 'Y', 
          ProgressRequired: 'Y', 
          EntryType: 'S'
        });

        this.selectedItems = [];

        this.GetEquipmentIte(); 
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error('API Error:', err);
        this.toastr.error(err.error?.message || 'Something went wrong.', 'Error');
      },
    });

  } else {
    this.spinner.hide();
    
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Please select at least one item from the table to map.', 'Warning');
    } else {
      this.mappingForm.markAllAsTouched();
      this.toastr.warning('Please fill all required fields correctly.', 'Warning');
    }
  }
}
isSelected(itemId: number): boolean {

  return this.selectedItems.includes(itemId);

}

toggleAll(event: any): void {

  if (event.target.checked) {
    this.selectedItems = this.dataSource.data.map((item: any) => item.ItemId);
  } else {
    this.selectedItems = [];
  }
}

toggleSelection(itemId: number): void {

  const index = this.selectedItems.indexOf(itemId);
  if (index > -1) {
    this.selectedItems.splice(index, 1);
  } else {
    this.selectedItems.push(itemId);
  }
}
}