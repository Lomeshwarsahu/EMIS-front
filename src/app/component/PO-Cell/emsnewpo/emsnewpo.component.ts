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
  selector: 'app-emsnewpo',
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
  templateUrl: './emsnewpo.component.html',
  styleUrl: './emsnewpo.component.css',
})
export class EMSNEWPOComponent {
  mappingForm!: FormGroup;
  showForm: boolean = true;
  showtable: boolean = true;

  mappedFundsReport: any[] = [];
  TenderItem: any;
  Programlist: any;
  FacilityList: any;
  MappedFundslist: any;
  itemid: any;
  yearlist: any[] = [];
  Tenderlist: any[] = [];
  Supplierrlist: any[] = [];
  yearId: any;
  statusvalue: any;
  suppId: any;
  Dayslist: any;
  Tenderno: any;
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
    'actions',
  ];
  selectedItems: number[] = [];
  status = [
    { value: 0, name: 'Domestic' },
    // { value: 'C', name: 'Completed' },
    { value: 'I', name: 'Imported' },
  ];
  supplierId: any;
  sName: any;
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
    DomesticImported: '0',
  };

  contractData: any = {
    FinancialYearId: 20,
    TenderId: null,
    SupplierId: null,
    ContractDate: '',
  };
  isEditMode: boolean = false;
  year: any;
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
    // this.GetTaxlist();
    this.GetFacilityList();
    this.GetTenderItemDetails();
    this.GetProgramsByDirectorate();
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
      this.api.get(`BME/GetSuppliersByTenderId/${this.tenderId}`).subscribe({
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
        this.yearlist = ylist;
        // .filter(
        //   (y: { financial_year_id: number }) => y.financial_year_id >= 14,
        // )
        // .sort(
        //   (
        //     a: { financial_year_id: number },
        //     b: { financial_year_id: number },
        //   ) => a.financial_year_id - b.financial_year_id,
        // );
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

  Onselectstatus(event: any) {
    // debugger;
    this.statusvalue = event.value;
    console.log('staus', this.statusvalue);
  }
  Onselectfund(event: any) {
    // debugger;
    // this.statusvalue = event.FacilityAutCode;
    this.fetchMappedFunds(event.FacilityAutId, 0);
  }

  //// https://localhost:7036/api/POCell/GetActiveContractItemsReport
  GetTenderItemDetails() {
    //  debugger
    this.api.get(`POCell/GetActiveContractItemsReport`).subscribe({
      next: (res: any) => {
        this.TenderItem = res;
        console.log('this.TenderItem', this.TenderItem);
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }

  // https://localhost:7036/api/POCell/GetSupplyDaysReport/1877
  GetSupplyDaysReport(itemid: any) {
    //  debugger
    this.api.get(`POCell/GetSupplyDaysReport/${itemid}`).subscribe({
      next: (res: any) => {
        this.Dayslist = res;
        console.log('this.Dayslist', this.Dayslist);
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }
  // https://localhost:7036/api/BME/GetFacilityList
  GetFacilityList() {
    //  debugger

    this.api.get('BME/GetFacilityList').subscribe({
      next: (res: any) => {
        this.FacilityList = res;
        console.log(' this.FacilityList', this.FacilityList);
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }
  // https://localhost:7036/api/POCell/GetProgramsByDirectorate/0
  GetProgramsByDirectorate() {
    //  debugger

    this.api.get(`POCell/GetProgramsByDirectorate/${0}`).subscribe({
      next: (res: any) => {
        this.Programlist = res;
        console.log('Programlist', this.Programlist);
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }
  // // https://localhost:7036/api/BME/GetTaxlist
  //    GetTaxlist() {
  // //  debugger

  //     this.api.get('BME/GetTaxlist').subscribe({
  //       next: (res: any) => {

  //         this.Taxlist = res;
  //         console.log(' this.Taxlist', this.Taxlist)
  //       },
  //       error: (err: any) => {
  //         console.log('Error fetching mapped items:', err);
  //       },
  //     });
  //   }

  // https://localhost:7036/api/BME/GetRCreports?financialYearId=14&tenderId=12&supplierId=0&status=0
  getContractItems() {
    this.spinner.show();

    const encodedContractNo = encodeURIComponent(this.contractNumber);

    this.api
      .get(`BME/GetContractItemsByContractNo?contractNo=${encodedContractNo}`)
      .subscribe({
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
      ContractDate: this.contractData.ContractDate,
    };

    // API Call
    this.api.post2('BME/GenerateContract', payload).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.awardOfContractId = response.awardOfContractId;
        this.contractNumber = response.contractNumber;
        // "awardOfContractId": 671,
        // "contractNumber": "Cont/150/1/2021-2022"
        this.toastr.success(
          response.message || 'Contract Generated Successfully!',
          'Success',
        );

        form.resetForm();
        this.contractData = {
          FinancialYearId: null,
          TenderId: null,
          SupplierId: null,
          ContractDate: '',
        };
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error('API Error:', err);
        this.toastr.error(
          err.error?.message || 'Something went wrong.',
          'Error',
        );
      },
    });
  }

  fetchMappedFunds(dirid: any, DmeUserId: any) {
    const payload = {
      FacilityAutId: dirid ? String(dirid) : '',
      DmeUserId: DmeUserId ? String(DmeUserId) : '0',
    };
    // /POCell/ShowMappedFunds'
    this.spinner.show();
    this.api.post1('POCell/ShowMappedFunds', payload).subscribe({
      next: (res: any) => {
        this.mappedFundsReport = res;
        console.log('fundlist=', this.mappedFundsReport);
        // this.dataSource.data = this.mappedFundsReport; // If binding target uses Material Table system
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }

  onReset(form: any): void {
    form.resetForm();
    this.contractData = {
      FinancialYearId: null,
      TenderId: null,
      SupplierId: null,
      ContractDate: '',
    };
  }

  calculateUnitPrice() {
    const basicRate = Number(this.itemData.BasicRate) || 0;
    const percentage = Number(this.itemData.Percentage) || 0;

    if (basicRate > 0) {
      const calculatedPrice = basicRate + (basicRate * percentage) / 100;
      this.itemData.SingleUnitPrice = parseFloat(calculatedPrice.toFixed(2));
    } else {
      this.itemData.SingleUnitPrice = null;
    }
  }


// Component memory area inside variable initialization setup
newPoData: any = {
  poId: 0,
  financialYearId: null,
  itemId: null,
  directorateId: null,
  covidPoValue: '0',
  tenderId: null,
  supplierEmail: '',
  basicRate: null,
  licenceNumber: '',
  model: '',
  poDateStr: '',
  gemPoText: '',
  supplierId: null,
  supplyType: '',
  supplierMobile: '',
  percentage: null,
  fundSourceValue: null,
  supplyDaysValue: null,
  programId: null
};
  Onselecttitem1(event: any) {
    // debugger;
    // this.itemid = event.ItemId;
    this.GetSupplyDaysReport(event.ItemId);
    // this.sName = event.sName;

    // console.log(' this.suppId', this.suppId);
  }
// Item Dropdown change hone par ye function trigger hoga
Onselecttitem(selectedItem: any): void {
  console.log('Selected Item Complete Meta:', selectedItem);
      this.GetSupplyDaysReport(selectedItem.ItemId);
  if (!selectedItem) {
    this.toastr.warning("Please select a valid item.");
    return;
  }

  // AUTO FILL LOGIC: Ek-ek karke incoming JSON data fields ko form models me assign karein
  this.newPoData.itemId = selectedItem.ItemId;
  this.newPoData.tenderId = selectedItem.TenderId;
  this.newPoData.supplierEmail = selectedItem.EmailId;      // EmailId maps to supplierEmail
  this.newPoData.supplierMobile = selectedItem.MobileNo;    // MobileNo maps to supplierMobile
  this.newPoData.basicRate = selectedItem.BasicRate;
  this.newPoData.percentage = selectedItem.Percentage;      // GST percentage mapping
  this.newPoData.singleUnitPrice = selectedItem.SingleUnitPrice;
  
  // Extra mapping features as fallback context reminders
  this.newPoData.supplierId = selectedItem.TenderId; // Agar direct index missing ho toh change framework matching rule

  this.toastr.success(`Form auto-filled for: ${selectedItem.CoreItemName}`, 'Data Synced');
}
onSubmitItem(form: any): void {
  if (form.invalid) {
    this.toastr.warning('Please fill all required fields properly.', 'Validation Warning');
    return;
  }

  this.spinner.show();

  // Selected dropdown properties text lookup helper parsing match tracking
  const selectedYearObj = this.yearlist.find(y => y.financial_year_id == this.newPoData.financialYearId);

  // Exact transactional body data layout structure matching your working Post API schema
  const payload = {
    PoId: Number(this.newPoData.poId || 0),
    AuthorityValue: String(this.newPoData.directorateId || ''),
    FundSourceValue: Number(this.newPoData.fundSourceValue || 0),
    FundSourceSelectedIndex: this.newPoData.fundSourceValue ? 1 : 0, // Validation state counter
    MedicalHospitalValue: Number(this.newPoData.directorateId || 0),
    MedicalHospitalSelectedIndex: this.newPoData.directorateId ? 1 : 0,
    CovidPoValue: this.newPoData.covidPoValue === 'CP' ? 1 : 2, // Maps custom code context enum integers
    CovidPoSelectedIndex: this.newPoData.covidPoValue !== '0' ? 1 : 0,
    SupplyDaysSelectedIndex: this.newPoData.supplyDaysValue ? 1 : 0,
    AuthoritySelectedIndex: this.newPoData.directorateId ? 1 : 0,
    TenderId: Number(this.newPoData.tenderId),
    PoDateStr: this.newPoData.poDateStr, // Server side parses strict YYYY-MM-DD
    SupplierId: Number(this.newPoData.supplierId),
    FinancialYearId: Number(this.newPoData.financialYearId),
    FinancialYearText: selectedYearObj ? selectedYearObj.year : '',
    DirectorateId: Number(this.newPoData.directorateId),
    ProgramId: Number(this.newPoData.programId),
    RcItemsSelectedValue: String(this.newPoData.itemId || ''),
    GemPoText: this.newPoData.gemPoText ? this.newPoData.gemPoText.trim() : ''
  };

  console.log('Dispatching Final Form Generated Payload Context:', payload);

  // Fixed targeting route endpoint payload logic channel mapping execution
  // Typecast with 'as any' if you encounter the ArrayBuffer compilation overload issue
  (this.api.post1('POCell/GeneratePurchaseOrderActual', payload) as any).subscribe({
    next: (response: any) => {
      this.spinner.hide();
      this.toastr.success(response.message || 'Purchase Order Created Successfully!', 'Success');

      // Clear layout properties inputs
      form.resetForm();
      this.newPoData = { poId: 0, covidPoValue: '0' };
      this.showtable = false;
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error('API Pipeline Validation Mismatch:', err);
      this.toastr.error(err.error?.message || 'Server Exception occurred inside PO generation loops.');
    }
  });
}



















  onSubmitItem11(form: any): void {
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
      DomesticImported: this.itemData.DomesticImported,
    };

    // API Call
    this.api.post2('BME/AddContractItem', payload).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.toastr.success('Item Added Successfully!', 'Success');

        form.resetForm();
        this.itemData = { DomesticImported: '0' };
        this.showtable = false;
        // this.getContractItems();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error('API Error:', err);
        this.toastr.error(
          err.error?.message || 'Something went wrong.',
          'Error',
        );
      },
    });
  }

  finalizeData: any = {
    ContractDuration: 24,
    ContractSignDate: '',
  };

  calculatedEndDate: Date | null = null;

  calculateEndDate() {
    if (
      this.finalizeData.ContractSignDate &&
      this.finalizeData.ContractDuration
    ) {
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
      this.toastr.warning(
        'Please provide a valid Start Date and Duration.',
        'Warning',
      );
      return;
    }

    if (!this.awardOfContractId) {
      this.toastr.error(
        'Contract ID is missing. Please generate the contract first.',
        'Error',
      );
      return;
    }

    this.spinner.show();

    const payload = {
      AwardOfContractId: Number(this.awardOfContractId),
      ContractDuration: Number(this.finalizeData.ContractDuration),
      ContractSignDate: this.finalizeData.ContractSignDate,
    };

    this.api.put('BME/FinalizeContract', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(
          res.message || 'RC Finalized Successfully!',
          'Success',
        );

        // this.router.navigate(['/EMSRCDashboard']);
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error('API Error:', err);
        this.toastr.error(
          err.error?.message || 'Something went wrong.',
          'Error',
        );
      },
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
      DomesticImported: rowData.SupplyCategory === 'Imported' ? '1' : '0',
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
      Model: this.itemData.Model,
    };

    // PUT API Call
    this.api.put('BME/UpdateContractItems', updatePayload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(
          res.message || 'Item Updated Successfully!',
          'Success',
        );

        form.resetForm();
        this.isEditMode = false;
        this.itemData = { DomesticImported: '0' };

        // this.getContractItems();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error('Update API Error:', err);
        this.toastr.error(
          err.error?.message || 'Failed to update item.',
          'Error',
        );
      },
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
}
