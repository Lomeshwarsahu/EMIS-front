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
  selector: 'app-mapitemswith-mainitem-type-repo',
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
  templateUrl: './mapitemswith-mainitem-type-repo.component.html',
  styleUrl: './mapitemswith-mainitem-type-repo.component.css',
})
export class MapitemswithMainitemTypeRepoComponent {
mappingForm!: FormGroup; 
  showForm: boolean = true; 
  
  mappedItems: any[] = []; 

  dispatchData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  
  displayedColumns: string[] = ['sno','PItemName', 'ItemCode', 'ItemName', 'IsElectrical','ProgReq','SRorBulkEntry','AmcReq'];
  
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
    
    // this.mappingForm = this.fb.group({
    //   MainItemTypeId: [null, Validators.required]
    // });
  }

  ngOnInit() {
    // this.GetmappedItems(); 
    this.GetmappedItemsReport(); 
  }

  // GetmappedItems() {
  //   this.api.get('BME/GetmappedItems').subscribe({
  //     next: (res: any) => {
  //       this.mappedItems = res; 
  //     },
  //     error: (err: any) => {
  //       console.log('Error fetching mapped items:', err);
  //     }
  //   });
  // }
// https://localhost:7036/api/BME/GetmappedItemsReport
  GetmappedItemsReport() {
    this.spinner.show();
    this.api.get('BME/GetmappedItemsReport').subscribe({
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

  // ==========================================
  // Checkbox Selection Logic
  // ==========================================
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

  // ==========================================
  // Submit Logic (API Call)
  // ==========================================
  onSubmit(): void {
    this.spinner.show();
    
    if (this.mappingForm.valid && this.selectedItems.length > 0) {
      
      const payload = {
        MainItemTypeId: this.mappingForm.value.MainItemTypeId,
        SelectedItemIds: this.selectedItems
      };
      
      this.api.post2('BME/MapExistingItems', payload).subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.toastr.success(response.message || 'Items Successfully Mapped!', 'Success');
          
          this.mappingForm.reset();
          this.selectedItems = [];

          // this.GetEquipmentIte(); 
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
        this.toastr.warning('Please select a Main Item Type.', 'Warning');
      }
    }
  }
}