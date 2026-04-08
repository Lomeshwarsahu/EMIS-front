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
import { TenderSupplierDataDTO } from 'src/app/Model/models';

@Component({
  selector: 'app-accepted-reort',
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
  templateUrl: './accepted-reort.component.html',
  styleUrl: './accepted-reort.component.css',
})
export class AcceptedReortComponent {
  Tenterlist: any[] = [];
  Supplierlist: any[] = [];
  // tender_id: any;
  // supplier_id:any;
  tender_id: any = null;
supplier_id: any = null;
  CategoryType :any; //1;
  // CategoryType = 'tender'; //1;
isTenderDisabled: boolean = false;
isSupplierDisabled: boolean = false;
  dispatchData: TenderSupplierDataDTO[] = [];
  dataSource!: MatTableDataSource<TenderSupplierDataDTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'ItemCode',
    'ItemName',
    'SupplierName',
    'TenderNo',
    'TenderDate',
    'TenderQuantity',
    'BasicRate',
    'GST',
    'AcceptedBasicRate',
    'AcceptedDate',
    // 'action'

  ];

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,private cd: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<TenderSupplierDataDTO>([]);
  }

  ngOnInit() {
    this.GetAccSupplierlist();
    this.GetConTenterlist();
  }

  // https://localhost:7036/api/Contract/GetAccTenterlist

  GetConTenterlist() {
    // this.spinner.show();
    this.api.get('Contract/GetAccTenterlist').subscribe({
      next: (res: any) => {
        this.Tenterlist = res;
        // console.log(' this.Tenterlist:', this.Tenterlist);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }
  // https://localhost:7036/api/Contract/GetAccSupplierlist
  GetAccSupplierlist() {
    // this.spinner.show();
    this.api.get('Contract/GetAccSupplierlist').subscribe({
      next: (res: any) => {
        this.Supplierlist = res;
        // console.log('Supplierlist:', this.Supplierlist);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }

  onSelectedItem(tenders: any) {
    this.tender_id = tenders.tender_id;
     if (this.tender_id) {
    this.isSupplierDisabled = true;
    this.supplier_id = 0; // reset supplier
  } else {
    this.isSupplierDisabled = false;
  }
  }
  onSelectedItem1(supplier: any) {
    this.supplier_id = supplier.supplier_id;
      if (this.supplier_id) {
    this.isTenderDisabled = true;
    this.tender_id = 0; // reset tender
  } else {
    this.isTenderDisabled = false;
  }
  }

  //  https://localhost:7036/api/Contract/GetTenderSupplierData?FilterType=tender&TenderId=65
  GetTenderSupplierData() {
    // debugger
    try {
      this.spinner.show();
      const params = {
        FilterType: this.CategoryType,
        // TenderId: this.tender_id,
        // // CategoryId: this.CategoryType,
        // SupplierId: this.supplier_id,
     TenderId: this.tender_id ?? 0,
  SupplierId: this.supplier_id ?? 0
      };
      this.api.get('Contract/GetTenderSupplierData?', { params }).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: TenderSupplierDataDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          // console.log('TenderSupplierDataDTO=:', this.dispatchData);
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
    return
    this.router.navigate(['/InstallationDetails'], {
      queryParams: { poId: poid },
    });
    // InstallationDetails
    // alert(poid)
    // InstallationDetails
  }
onCategoryChange() {
  if (this.CategoryType === 'tender') {
    this.supplier_id = null;  // disable supplier + clear
  }

  if (this.CategoryType === 'supplier') {
    this.tender_id = null;    // disable tender + clear
  }
    // force UI refresh
  this.cd.detectChanges();
}
}
