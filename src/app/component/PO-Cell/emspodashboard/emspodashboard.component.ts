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
  selector: 'app-emspodashboard',
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
  templateUrl: './emspodashboard.component.html',
  styleUrl: './emspodashboard.component.css',
})
export class EMSPODashboardComponent {
mappingForm!: FormGroup; 
  showForm: boolean = true; 
  
  yearlist: any[] = []; 
  Tenderlist: any[] = []; 
  Supplierrlist: any[] = []; 
yearId:any;
statusvalue:any;
suppId:any;
  dispatchData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  
  displayedColumns: string[] = [
  'sno',
  'contractNumber', 
  'contractDate', 
  'supplierId',      // <-- Ensure this is listed here so the template can render it
  'supplierName', 
  'tenderNo', 
  'tenderDate', 
  'contractDuration', 
  'contractSignDate', 
  'contractEndDate',
  'status'
];

  selectedItems: number[] = [];
status=[{value:0,name:'All'},{value:'Completed',name:'Completed'},{value:'InComplete',name:'Incomplete'}
,{value:'Waiting For Approval',name:'Waiting For Approval'},{value:'Order Placed',name:'Order Placed'}
]
  tenderId: any;
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
    

  }

  ngOnInit() {
    this.Getyear(); 
    // this.GetTenderlist(); 
    // this.GetmappedItemsReport(); 
  }
//https://localhost:7036/api/BME/GetSuppliersByTenderId/120
GetSuppliersByTenderId(event: any) {
    if (event) {
      debugger
    //  this.tenderId= event.Tenderid;
    //     const selectedTenderId = event.Tenderid;
     this.tenderId= event.TenderId;
        const selectedTenderId = event.TenderId;
        console.log('Selected Tender ID:', selectedTenderId);
            this.api.get(`BME/GetSuppliersByTenderId/${selectedTenderId}`).subscribe({
      next: (res: any) => {
        this.Supplierrlist=res;
        console.log('Supplierrlist',res)
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      }
    });
        
        // this.api.get(`BME/GetSuppliersByTenderId/${selectedTenderId}`)...
    } else {
        console.log('Tender cleared');
        // this.supplierList = []; 
    }
}
// https://localhost:7036/api/GenerateNasti/Getyear

  Getyear() {
    this.api.get('GenerateNasti/Getyear').subscribe({
      next: (res: any) => {
       const ylist= res; 
        //  this.yearlist  = ylist.filter((y: { financial_year_id: number; }) => y.financial_year_id >= 14);
         this.yearlist = ylist
  // .filter((y: { financial_year_id: number; }) => y.financial_year_id >= 14)
  // .sort((a: { financial_year_id: number; }, b: { financial_year_id: number; }) => a.financial_year_id - b.financial_year_id);
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      }
    });
  }
    // https://localhost:7036/api/POCell/GetTenderList/RC
  // https://localhost:7036/api/POCell/GetTenderList/RC
  GetTenderlist(event: any) {
  //  if (event) {
    this.yearId=event.financial_year_id;
  //   console.log('yearId',  this.yearId)

  //       const selectedyearId = event.financial_year_id;
  //       // console.log('financial_year_id:', selectedyearId);

  //   this.api.get(`BME/GetTenderlist/${selectedyearId}`).subscribe({
    this.api.get(`POCell/GetTenderList/${'RC'}`).subscribe({
      next: (res: any) => {
     this.Tenderlist= res; 
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      }
    });
        
    //     // this.api.get(`BME/GetSuppliersByTenderId/${selectedTenderId}`)...
    // } else {
    //     console.log('Tender cleared');
    //     // this.supplierList = []; 
    // }
  }
  OnselectSupplierrlist(event:any){
    // debugger;
 this.suppId=event.sId;
   console.log(' this.suppId', this.suppId)
  }
  Onselectstatus(event:any){
    // debugger;
 this.statusvalue=event.value;
    console.log('staus',  this.statusvalue)
  }
// https://localhost:7036/api/BME/GetRCreports?financialYearId=14&tenderId=12&supplierId=0&status=0
  // GetRCreports() {
  //   debugger;
  //   this.spinner.show();

  //   this.api.get( `BME/GetRCreports?financialYearId=${this.yearId}&tenderId=${this.tenderId}&supplierId=${this.suppId}&status=${this.statusvalue}`).subscribe({
  //     next: (res: any) => {
  //       this.dispatchData = res.map((item: any, index: number) => ({
  //         ...item,
  //         sno: index + 1,
  //       }));
  //       console.log('this.dispatchData=',this.dispatchData);

  //       this.dataSource.data = this.dispatchData;
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.cdr.detectChanges();
  //       this.spinner.hide();
  //     },
  //     error: (err: any) => {
  //       this.spinner.hide();
  //       console.log('Error fetching table data:', err);
  //     }
  //   });
  // }
GetRCreports() {
  this.spinner.show();
// debugger
  // 1. Setup exact JSON payload structure matching your working Curl command
  const payload = {
    YearId: String(this.yearId || '0'),
    TenderId: String(this.tenderId || '0'),
    SupplierId: String(this.suppId || ''),
    StatusId: String(this.statusvalue || '0')
  };

  console.log('Sending Dashboard Request Payload:', payload);

  // 2. Changed from .get() to .post1() to match the backend route
  // this.api.post1('POCell/GetPoDashboardActual', payload).subscribe({
  //   next: (res: any[]) => {
  (this.api.post1('POCell/GetPoDashboardActual', payload) as any).subscribe({
  next: (res: any[]) => {
      if (res && res.length > 0) {
        // 3. Map API camelCase response to your HTML custom structural properties
        this.dispatchData = res.map((item: any, index: number) => ({
          sno: index + 1,
          
          // Matching HTML element.ContractNumber / element.ContractDate binding patterns
          ContractNumber: item.poNo || item.outwardNo || '-',
          ContractDate: item.poDate || '-',
          SupplierId: item.supplierId,
          SupplierName: item.supplierName || 'N/A',
          ContractType: item.poType || 'Normal PO',
          ContractDescription: item.remarks || 'No Description',
          TenderNo: item.tenderNo || '-',
          TenderDate: item.poDate || '-', // Safe fallback fallback placement
          TenderId: item.tenderId,
          ContractDuration: item.poItemsKey ? `${item.poItemsKey} Items` : '0 Items',
          ContractSignDate: item.poDate || '-',
          ContractEndDate: item.poDate || '-',
          DocumentType: item.potype || 'Normal',
          DocumentNumber: item.poNo || '-',
          DocumentDate: item.poDate || '-',
          DocumentExpiryDate: '-',
          FinancialYearId: item.financialYearId,
          Year: item.year || '-',
          DocumentValue: item.totalPoValue || item.poValue || 0,
          AwardOfContractId: item.poId,
          Status: item.status === 'Completed' || item.status === 'C' ? 'C' : 'I' // UI Status match
        }));
      } else {
        this.dispatchData = [];
      }

      console.log('Processed Material Table Data:', this.dispatchData);

      // 4. Update Angular Material DataSource pipelines
      this.dataSource.data = this.dispatchData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cdr.detectChanges();
      this.spinner.hide();
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error('Error fetching dashboard table data:', err);
      this.toastr.error("Failed to load dashboard report matrix.");
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


 AddnewRC() {
  // this.router.navigate(['/EMSNEWRC']);
  this.router.navigate(['/EMSNEWPO']);
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


  // https://localhost:7036/api/BME/GetSuppliersByTenderId/680


}