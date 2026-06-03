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
  selector: 'app-edit-received-and-installation-date',
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
  templateUrl: './edit-received-and-installation-date.component.html',
  styleUrl: './edit-received-and-installation-date.component.css',
})
export class EditReceivedAndInstallationDateComponent {
activeTab: number = 1;

// Separate layout tracking modules for both tab panels
receivedFormModel: any = {
  receiptId: null,
  itemDetailId: null,
  invoiceDate: '',
  challanDate: '',
  recievedDate: ''
};

installationFormModel: any = {
  receiptId: null,
  itemDetailId: null,
  installationDate: '',
  warentyFrom: '',
  warentyTo: ''
};

// Flags to control inputs disabled state constraints loops
isDataLoaded: boolean = false;
















  mappingForm!: FormGroup;
  showForm: boolean = true;
  showtable: boolean = true;
TenderItem:any;
Taxlist:any;
  yearlist: any[] = [];
  ActivePurchaseOrderslist: any[] = [];
  ConsigneesByPolist: any[] = [];
  yearId: any;
  statusvalue: any;
  ConsigneeId: any;
  Tenderno:any;
  dispatchData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
displayedColumns: string[] = [
  'sno',
  'ItemName',
  'NoOfDaysForSupply',
  'BasicRate',
  'TaxTypeName',
  'Percentage',
  'SingleUnitPrice',
  'LicenceNumber',
  'Make',
  'Model',
  'SupplyCategory',
  'actions' 
];
  selectedItems: number[] = [];
  status = [
    { value: 0, name: 'Domestic' },
    // { value: 'C', name: 'Completed' },
    { value: 'I', name: 'Imported' },
  ];
  PoId:any;
itemData: any = {
  AwardOfContractId: null, 
  ItemId: null,
  NoOfDaysForSupply: null,
  BasicRate: null,
  TaxTypeId: null,
  Percentage: null,
  SingleUnitPrice: null,
  LicenceNumber: '',
  Make: '',
  Model: '',
  DomesticImported: '0' 
};

  contractData: any = {
  FinancialYearId: null,
  PoId: null,
  ConsigneeId: null,
 
};
isEditMode: boolean = false;
year:any;
  tenderId: any;
  awardOfContractId: any;
  contractNumber: any;
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
switchTab(tabNumber: number) {
  this.activeTab = tabNumber;
}
  ngOnInit() {
    this.Getyear();
  }
  // https://localhost:7036/api/GMFI/GetConsigneesByPo?poId=3448
  GetConsigneesByPo(event: any) {
    if (event) {
      this.PoId = event.PoId;
      this.api.get(`GMFI/GetConsigneesByPo?poId=${this.PoId}`).subscribe({
        next: (res: any) => {
          this.ConsigneesByPolist = res;
        },
        error: (err: any) => {
          console.log('Error fetching mapped items:', err);
        },
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
        const ylist = res;
        this.yearlist = ylist
      
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }
  //https://localhost:7036/api/GMFI/GetActivePurchaseOrders?finid=19

  GetActivePurchaseOrders(event: any) {
  
    // debugger
    if (event) {
      this.yearId = event.financial_year_id;
      this.api.get(`GMFI/GetActivePurchaseOrders?finid=${this.yearId}`).subscribe({
        next: (res: any) => {
          this.ActivePurchaseOrderslist = res;
        },
        error: (err: any) => {
          console.log('Error fetching mapped items:', err);
        },
      });

      // this.api.get(`BME/GetSuppliersByTenderId/${selectedTenderId}`)...
    } else {
      console.log('Tender cleared');
      // this.supplierList = [];
    }
  }
  OnselectConsigneelist(event: any) {
  
    this.ConsigneeId = event.ConsigneeId;
  
  }
  Onselectstatus(event: any) {
    // debugger;
    this.statusvalue = event.value;
    console.log('staus', this.statusvalue);
  }

// https://localhost:7036/api/BME/GetTenderItemDetails/450/180/2441
 GetTenderItemDetails(tid:any,suid:any,selectedItemId:any) {
//  debugger
    this.api.get(`BME/GetTenderItemDetails/${tid}/${suid}/${selectedItemId}`).subscribe({
    // this.api.get(`BME/GetTenderItemDetails/${this.contractData.TenderId}/${this.contractData.SupplierId}/${selectedItemId}`).subscribe({
      next: (res: any) => {
        this.TenderItem = res;
        console.log('this.TenderItem',this.TenderItem)
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }


  // https://localhost:7036/api/BME/GetRCreports?financialYearId=14&tenderId=12&supplierId=0&status=0
getContractItems() {
 
}

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

 



onSubmit(form: any): void {

  if (form.invalid) {
    this.toastr.warning('Please fill all required fields.', 'Warning');
    return;
  }

  this.spinner.show();
  

// https://localhost:7036/api/GMFI/GetReceiptItemTrackingDetails?locationId=0&poId=0&finYearId=0
  // API Call
  this.spinner.show();
   const  selectedPoId= Number(this.contractData.PoId);
   const selectedLocationId=Number(this.contractData.ConsigneeId);
   const  selectedFinYearId= Number(this.contractData.FinancialYearId);

const url = `GMFI/GetReceiptItemTrackingDetails?locationId=${selectedLocationId}&poId=${selectedPoId}&finYearId=${selectedFinYearId}`;
console.log('url=',url);
  this.api.get(url).subscribe({
    next: (res: any) => {
     const ReceiptItemTrackingDetails = res
        
      if (res && res.length > 0) {
        const trackingDetails = res[0]; // Fetching target item object index row
        console.log('Target API Tracking Details Object Matrix:', trackingDetails);

        this.isDataLoaded = true; // Flips state switches to activate disabled layout rule controls

        // --- PART A: POPULATING UPDATE RECEIVED TAB FIELDS ---
        this.receivedFormModel = {
          receiptId: trackingDetails.ReceiptId,
          itemDetailId: trackingDetails.ItemDetailId,
          invoiceDate: this.convertToInputDateFormat(trackingDetails.InvoiceDate),
          DispatchDate: this.convertToInputDateFormat(trackingDetails.DispatchDate),
          challanDate: this.convertToInputDateFormat(trackingDetails.ChallanDate),
          recievedDate: this.convertToInputDateFormat(trackingDetails.RecievedDate)
        };

        // --- PART B: POPULATING UPDATE INSTALLATION TAB FIELDS ---
        this.installationFormModel = {
          receiptId: trackingDetails.ReceiptId,
          itemDetailId: trackingDetails.ItemDetailId,
          installationDate: this.convertToInputDateFormat(trackingDetails.InstallationDate),
          warentyFrom: this.convertToInputDateFormat(trackingDetails.WarentyFrom),
          warentyTo: this.convertToInputDateFormat(trackingDetails.WarentyTo)
        };

        this.toastr.success('Receipt details loaded and auto-filled.', 'Success');
      } else {
        this.isDataLoaded = false;
        this.toastr.warning('No receipt data logs matched for current indices.', 'No Data');
      }
      console.log('ReceiptItemTrackingDetails =', ReceiptItemTrackingDetails);

      this.spinner.hide();
    },
    error: (err: any) => {
      this.spinner.hide();
      console.log('Error fetching items data:', err);
      this.toastr.error('Failed to load items.', 'Error');
    },
  });
}

onReset(form: any): void {
  form.resetForm();
  this.contractData = { FinancialYearId: null, TenderId: null, SupplierId: null, ContractDate: '' };
}



onSubmitItem(form: any): void {
  if (form.invalid) {
    this.toastr.warning('Please fill all required fields.', 'Warning');
    return;
  }

  this.spinner.show();

  const payload = {
    AwardOfContractId: Number(this.awardOfContractId), 
    ItemId: Number(this.itemData.ItemId),
    NoOfDaysForSupply: Number(this.itemData.NoOfDaysForSupply),
    BasicRate: Number(this.itemData.BasicRate),
    TaxTypeId: Number(this.itemData.TaxTypeId),
    Percentage: Number(this.itemData.Percentage),
    SingleUnitPrice: Number(this.itemData.SingleUnitPrice),
    LicenceNumber: this.itemData.LicenceNumber,
    Make: this.itemData.Make,
    Model: this.itemData.Model,
    DomesticImported: this.itemData.DomesticImported
  };

  // API Call
  this.api.post2('BME/AddContractItem', payload).subscribe({
    next: (response: any) => {
      this.spinner.hide();
      this.toastr.success('Item Added Successfully!', 'Success');
      
      form.resetForm();
      this.itemData = { DomesticImported: '0' }; 
       this.showtable=false;
      // this.getContractItems();
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error('API Error:', err);
      this.toastr.error(err.error?.message || 'Something went wrong.', 'Error');
    }
  });
}



calculatedEndDate: Date | null = null; 










 
// Helper tracking utility string dates format transformer (DD-MM-YYYY to YYYY-MM-DD for standard html inputs)
convertToInputDateFormat(dateStr: string): string {
  if (!dateStr || dateStr.includes('1900') || dateStr === '-') return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; // Returns YYYY-MM-DD
  }
  return dateStr;
}

// onSubmittttt(form: any): void {
//   if (form.invalid) {
//     this.toastr.warning('Please fill all required filters fields.', 'Warning');
//     return;
//   }

//   this.spinner.show();
//   const selectedPoId = Number(this.contractData.PoId);
//   const selectedLocationId = Number(this.contractData.ConsigneeId);
//   const selectedFinYearId = Number(this.contractData.FinancialYearId);

//   const url = `GMFI/GetReceiptItemTrackingDetails?locationId=${selectedLocationId}&poId=${selectedPoId}&finYearId=${selectedFinYearId}`;
  
//   this.api.get(url).subscribe({
//     next: (res: any[]) => {
//       this.spinner.hide();
      
//       if (res && res.length > 0) {
//         const trackingDetails = res[0]; // Fetching target item object index row
//         console.log('Target API Tracking Details Object Matrix:', trackingDetails);

//         this.isDataLoaded = true; // Flips state switches to activate disabled layout rule controls

//         // --- PART A: POPULATING UPDATE RECEIVED TAB FIELDS ---
//         this.receivedFormModel = {
//           receiptId: trackingDetails.ReceiptId,
//           itemDetailId: trackingDetails.ItemDetailId,
//           invoiceDate: this.convertToInputDateFormat(trackingDetails.InvoiceDate),
//           challanDate: this.convertToInputDateFormat(trackingDetails.ChallanDate),
//           recievedDate: this.convertToInputDateFormat(trackingDetails.RecievedDate)
//         };

//         // --- PART B: POPULATING UPDATE INSTALLATION TAB FIELDS ---
//         this.installationFormModel = {
//           receiptId: trackingDetails.ReceiptId,
//           itemDetailId: trackingDetails.ItemDetailId,
//           installationDate: this.convertToInputDateFormat(trackingDetails.InstallationDate),
//           warentyFrom: this.convertToInputDateFormat(trackingDetails.WarentyFrom),
//           warentyTo: this.convertToInputDateFormat(trackingDetails.WarentyTo)
//         };

//         this.toastr.success('Receipt details loaded and auto-filled.', 'Success');
//       } else {
//         this.isDataLoaded = false;
//         this.toastr.warning('No receipt data logs matched for current indices.', 'No Data');
//       }
//     },
//     error: (err: any) => {
//       this.spinner.hide();
//       this.isDataLoaded = false;
//       console.error('API Stream Exception Errors Trace:', err);
//       this.toastr.error('Failed to load tracking analytics configurations.', 'Error');
//     }
//   });
// }


onUpdateReceived(form: any) {
  if (form.invalid) return;

  this.spinner.show();

  // Building payload body parameter schema mapping C# object models properties
  const payload = {
    ReceiptId: Number(this.receivedFormModel.receiptId),
    ReceivedDate: this.receivedFormModel.recievedDate, // Holds the YYYY-MM-DD input string string reference
    DispatchDate: this.receivedFormModel.DispatchDate,  // Bound to your model components state trackers
    ChallanDate: this.receivedFormModel.challanDate,
    InvoiceDate: this.receivedFormModel.invoiceDate
  };

  this.api.post1('GMFI/UpdateReceiptReceivedDateActual', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message || "Updated successfully!");
      
      // Lock fields immediately upon successful persist logic context loops 
      this.isDataLoaded = true; 
      
      // Refresh matching master dataset grids if needed
      // this.onSubmit(this.contractForm); 
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error(err);
      this.toastr.error(err.error?.message || "Internal transaction database failure occurred.");
    }
  });
}

onUpdateInstallation(form: any) {
  if (form.invalid) return;

  this.spinner.show();

  // Building payload matching C# request properties model specifications
  const payload = {
    ReceiptId: Number(this.installationFormModel.receiptId),
    InstallationDate: this.installationFormModel.installationDate, // Holds YYYY-MM-DD string format
    ReceivedDate: this.receivedFormModel.recievedDate,             // References previous tab's received date data string
    WarrantyFrom: this.installationFormModel.warentyFrom,
    WarrantyTo: this.installationFormModel.warentyTo
  };

  console.log('Dispatching Installation Update Payload:', payload);

  this.api.post1('GMFI/UpdateReceiptInstallationDateActual', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message || "Installation changes saved successfully!", "Success");
      
      // Fields lock protection active
      this.isDataLoaded = true;
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error(err);
      this.toastr.error(err.error?.message || "Internal database transaction collapsed.");
    }
  });
}
}
