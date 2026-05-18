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
  selector: 'app-emsnewrc',
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
  templateUrl: './emsnewrc.component.html',
  styleUrl: './emsnewrc.component.css',
})
export class EMSNEWRCComponent {
  mappingForm!: FormGroup;
  showForm: boolean = true;
  showtable: boolean = true;
TenderItem:any;
Taxlist:any;
  yearlist: any[] = [];
  Tenderlist: any[] = [];
  Supplierrlist: any[] = [];
  yearId: any;
  statusvalue: any;
  suppId: any;
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
  supplierId:any;
  sName:any;
activeTab: number = 1;
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
  TenderId: null,
  SupplierId: null,
  ContractDate: ''
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
    this.GetTaxlist();
  // this.GetTenderItemDetails(0);
    // this.GetmappedItemsReport();
  }
  //https://localhost:7036/api/BME/GetSuppliersByTenderId/120
  GetSuppliersByTenderId(event: any) {
    if (event) {
      // debugger
      this.tenderId = event.Tenderid;
      this.Tenderno = event.Tenderno;
      // const selectedTenderId = event.Tenderid;
      // console.log('Selected Tender ID:', selectedTenderId);
      this.api.get(`BME/GetSuppliersByTenderId/${ this.tenderId}`).subscribe({
        next: (res: any) => {
          this.Supplierrlist = res;
          console.log('Supplierrlist', res);
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
        //  this.yearlist  = ylist.filter((y: { financial_year_id: number; }) => y.financial_year_id >= 14);
        this.yearlist = ylist
          .filter(
            (y: { financial_year_id: number }) => y.financial_year_id >= 14,
          )
          .sort(
            (
              a: { financial_year_id: number },
              b: { financial_year_id: number },
            ) => a.financial_year_id - b.financial_year_id,
          );
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }
  // https://localhost:7036/api/BME/GetTenderlist
  GetTenderlist(event: any) {
  
    // debugger
    if (event) {
      this.yearId = event.financial_year_id;
      this.year = event.year;
      console.log('yearId', this.yearId);

      const selectedyearId = event.financial_year_id;
      // console.log('financial_year_id:', selectedyearId);

      this.api.get(`BME/GetTenderlist/${selectedyearId}`).subscribe({
        next: (res: any) => {
          this.Tenderlist = res;
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
  OnselectSupplierrlist(event: any) {
    // debugger;
    this.suppId = event.sId;
    this.sName = event.sName;
     this.GetTenderItemDetails(this.tenderId,this.suppId,0);
    console.log(' this.suppId', this.suppId);
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
// https://localhost:7036/api/BME/GetTaxlist
   GetTaxlist() {
//  debugger

    this.api.get('BME/GetTaxlist').subscribe({
      next: (res: any) => {
       
        this.Taxlist = res;
        console.log(' this.Taxlist', this.Taxlist)
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }

  // https://localhost:7036/api/BME/GetRCreports?financialYearId=14&tenderId=12&supplierId=0&status=0
getContractItems() {
  this.spinner.show();


  const encodedContractNo = encodeURIComponent(this.contractNumber);

  this.api.get(`BME/GetContractItemsByContractNo?contractNo=${encodedContractNo}`).subscribe({
    next: (res: any) => {
      this.dispatchData = res.map((item: any, index: number) => ({
        ...item,
        sno: index + 1,
      }));
      
      console.log('Contract Items Data =', this.dispatchData);

      this.dataSource.data = this.dispatchData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cdr.detectChanges();
      this.spinner.hide();
    },
    error: (err: any) => {
      this.spinner.hide();
      console.log('Error fetching items data:', err);
      this.toastr.error('Failed to load items.', 'Error');
    },
  });
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

  const payload = {
    TenderId: Number(this.contractData.TenderId),
    SupplierId: Number(this.contractData.SupplierId),
    FinancialYearId: Number(this.contractData.FinancialYearId),
    ContractDate: this.contractData.ContractDate
  };

  // API Call
  this.api.post2('BME/GenerateContract', payload).subscribe({
    next: (response: any) => {
      this.spinner.hide();
       this.awardOfContractId=response.awardOfContractId;
      this.contractNumber=response.contractNumber;
      // "awardOfContractId": 671,
      // "contractNumber": "Cont/150/1/2021-2022"
      this.toastr.success(response.message || 'Contract Generated Successfully!', 'Success');

      form.resetForm();
      this.contractData = { FinancialYearId: null, TenderId: null, SupplierId: null, ContractDate: '' };
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error('API Error:', err);
      this.toastr.error(err.error?.message || 'Something went wrong.', 'Error');
    }
  });
}

onReset(form: any): void {
  form.resetForm();
  this.contractData = { FinancialYearId: null, TenderId: null, SupplierId: null, ContractDate: '' };
}


calculateUnitPrice() {
  const basicRate = Number(this.itemData.BasicRate) || 0;
  const percentage = Number(this.itemData.Percentage) || 0;
  
  if (basicRate > 0) {
    const calculatedPrice = basicRate + (basicRate * percentage / 100);
    this.itemData.SingleUnitPrice = parseFloat(calculatedPrice.toFixed(2)); 
  } else {
    this.itemData.SingleUnitPrice = null;
  }
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


finalizeData: any = {
  ContractDuration: 24, 
  ContractSignDate: '' 
};

calculatedEndDate: Date | null = null; 

calculateEndDate() {
  if (this.finalizeData.ContractSignDate && this.finalizeData.ContractDuration) {
    const startDate = new Date(this.finalizeData.ContractSignDate);
    const durationMonths = Number(this.finalizeData.ContractDuration);

    if (!isNaN(startDate.getTime()) && !isNaN(durationMonths)) {
      startDate.setMonth(startDate.getMonth() + durationMonths);
      this.calculatedEndDate = startDate;
    } else {
      this.calculatedEndDate = null;
    }
  } else {
    this.calculatedEndDate = null;
  }
}

onFinalizeRC(form: any): void {
  if (form.invalid) {
    this.toastr.warning('Please provide a valid Start Date and Duration.', 'Warning');
    return;
  }

  if (!this.awardOfContractId) {
    this.toastr.error('Contract ID is missing. Please generate the contract first.', 'Error');
    return;
  }

  this.spinner.show();

  const payload = {
    AwardOfContractId: Number(this.awardOfContractId),
    ContractDuration: Number(this.finalizeData.ContractDuration),
    ContractSignDate: this.finalizeData.ContractSignDate 
  };

  this.api.put('BME/FinalizeContract', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message || 'RC Finalized Successfully!', 'Success');
      
      // this.router.navigate(['/EMSRCDashboard']);
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error('API Error:', err);
      this.toastr.error(err.error?.message || 'Something went wrong.', 'Error');
    }
  });
}






editItem(rowData: any) {
  this.isEditMode = true; 

  this.itemData = {
    ContractItemId: rowData.ContractItemId, 
    AwardOfContractId: rowData.AwardOfContractId,
    ItemId: rowData.ItemId,
    NoOfDaysForSupply: rowData.NoOfDaysForSupply,
    BasicRate: rowData.BasicRate,
    TaxTypeId: rowData.TaxTypeId,
    Percentage: rowData.Percentage,
    SingleUnitPrice: rowData.SingleUnitPrice,
    LicenceNumber: rowData.LicenceNumber,
    Make: rowData.Make,
    Model: rowData.Model,
    DomesticImported: rowData.SupplyCategory === 'Imported' ? '1' : '0' 
  };

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onUpdateContractItem(form: any): void {
  if (form.invalid) {
    this.toastr.warning('Please fill all required fields.', 'Warning');
    return;
  }

  this.spinner.show();

  const updatePayload = {
    ContractItemId: Number(this.itemData.ContractItemId),
    NoOfDaysForSupply: Number(this.itemData.NoOfDaysForSupply),
    BasicRate: Number(this.itemData.BasicRate),
    TaxTypeId: Number(this.itemData.TaxTypeId),
    Percentage: Number(this.itemData.Percentage),
    SingleUnitPrice: Number(this.itemData.SingleUnitPrice),
    LicenceNumber: this.itemData.LicenceNumber,
    Make: this.itemData.Make,
    Model: this.itemData.Model
  };

  // PUT API Call
  this.api.put('BME/UpdateContractItems', updatePayload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message || 'Item Updated Successfully!', 'Success');
      
      form.resetForm();
      this.isEditMode = false;
      this.itemData = { DomesticImported: '0' }; 
      
      // this.getContractItems(); 
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error('Update API Error:', err);
      this.toastr.error(err.error?.message || 'Failed to update item.', 'Error');
    }
  });
}

onSubmitItem1(form: any): void {
  if (this.isEditMode) {
    this.onUpdateContractItem(form);
  } else {
    this.onSubmitItem(form); 
  }
}

cancelEdit(form: any) {
  form.resetForm();
  this.isEditMode = false;
  this.itemData = { DomesticImported: '0' };
}
  // https://localhost:7036/api/BME/GenerateContract
  // {
  // "message": "Contract Generated Successfully",
  // "awardOfContractId": 671,
  // "contractNumber": "Cont/150/1/2021-2022"

  // https://localhost:7036/api/BME/GetTaxlist
  // {
  //   "TaxId": 1,
  //   "Taxname": "GST"
  // },
  // https://localhost:7036/api/BME/GetItemRateDetails/450/180/2441
  	
// Response body
// Download
// {
//   "ItemId": 2441,
//   "ItemName": "Repeater-EQP0018",
//   "BasicRate": 44000,
//   "Gst": 18,
//   "SupplierId": 180,
//   "TenderId": 450
// }

// https://localhost:7036/api/BME/GetTenderItemDetails/450/180/2441
// esponse body
// Download
// {
//   "ItemId": 2441,
//   "ItemName": "Repeater-EQP0018",
//   "BasicRate": 44000,
//   "Gst": 18,
//   "SupplierId": 180,
//   "TenderId": 450
// }


}
