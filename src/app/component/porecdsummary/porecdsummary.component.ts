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
import { POReceiptDTO } from 'src/app/Model/models';

@Component({
  selector: 'app-porecdsummary',
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
  templateUrl: './porecdsummary.component.html',
  styleUrl: './porecdsummary.component.css',
})
export class PORecdsummaryComponent {
  ItemsList: any[] = [];
  UsersByAuthoritylist: any[] = [];
  yearlist: any[] = [];
  Diectoratelist: any[] = [];
  authority_id: any;
  selecteditem: any;
  UserId: any;
  financial_year_id: any;
  facility_aut_id: any;
  year: any;
  Type_Cancellation: any;
  Type_nonReceived: any;

  ItemId: any = null;
  dispatchData: POReceiptDTO[] = [];
  directorate: any;
  dataSource!: MatTableDataSource<POReceiptDTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'TenderNo',
    'Pono',
    'PoDate',
    'item_code_as_per_tender',
    'ItemName',
    'Supplier',
    'POQty',
    'SupplyQty',
    'ReceiptQty',
    'InsQty',
    'CancellationDays',
    'DaysTakenToSupply',
    'LastSupplyDate',
    // 'action'
  ];
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
  ) {
    this.dataSource = new MatTableDataSource<POReceiptDTO>([]);
  }

  ngOnInit() {
    // this.GetUsersByAuthority();
    // this.GetItemsList();
    this.Getyear();
    this.GetDiectorate();
  }

  // https://localhost:7036/api/Contract/Indent/GetItemsList
  GetItemsList() {
    this.api.get('Contract/Indent/GetItemsList').subscribe({
      next: (res: any) => {
        // ✅ Add "All" option at top
        this.ItemsList = [{ ItemId: 'All', ItemName: 'All' }, ...res];

        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }
  // GetItemsList() {
  //   // this.spinner.show();
  //   this.api.get('Contract/Indent/GetItemsList').subscribe({
  //     next: (res: any) => {
  //       this.ItemsList = res;
  //       // console.log(' this.Tenterlist:', this.Tenterlist);
  //       this.spinner.hide();
  //     },
  //     error: (err: any) => {
  //       this.spinner.hide();
  //       console.error(err);
  //     },
  //   });
  // }
  //https://localhost:7036/api/Contract/Indent/GetUsersByAuthority?authority_id=5
  GetUsersByAuthority(id: any) {
    // this.spinner.show();
    const params = {
      authority_id: id,
    };
    this.api.get('Contract/Indent/GetUsersByAuthority?', { params }).subscribe({
      next: (res: any) => {
        this.UsersByAuthoritylist = res;
        // console.log('Supplierlist:', this.Supplierlist);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }
  // https://localhost:7036/api/GenerateNasti/Getyear
  Getyear() {
    // this.spinner.show();"financial_year_id": 20,
    // "year": "2026-2027"
    this.api.get('GenerateNasti/Getyear').subscribe({
      next: (res: any) => {
        this.yearlist = res;
        // console.log('Supplierlist:', this.Supplierlist);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }
  //https://localhost:7036/api/Reports/GetDiectorate
  GetDiectorate() {
    // this.spinner.show();"financial_year_id": 20,
    // "year": "2026-2027"
    this.api.get('Reports/GetDiectorate').subscribe({
      next: (res: any) => {
        this.Diectoratelist = res;
        // console.log('Supplierlist:', this.Supplierlist);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }

  onSelectedItem(items: any) {
    this.ItemId = items.ItemId;

    //    if (this.ItemId) {
    // } else {
    // }
  }
  onSelectedDirectorate(Authority: any) {
    this.facility_aut_id = Authority.facility_aut_id;
    this.directorate = Authority.facility_aut_name;
    // this.GetUsersByAuthority(  this.facility_aut_id);
    //    if (this.ItemId) {
    // } else {
    // }
  }
  onSelectedyearlist(years: any) {
    this.financial_year_id = years.financial_year_id;
    this.year = years.year;
    //    if (this.ItemId) {
    // } else {
    // }
  }
  onSelectedUsers(Users: any) {
    this.UserId = Users.UserId;
  }

  //https://localhost:7036/api/Contract/get-po-details?directorateId=5&financialYearId=14&isNonReceipt=false&isMoreThanCancelDays=false
  GetIndentConsolidation() {
    // debugger;
    try {
      this.spinner.show();
      const params = {
        directorateId: this.facility_aut_id,
        financialYearId: this.financial_year_id,
        isNonReceipt: this.Type_nonReceived,
        isMoreThanCancelDays: this.Type_Cancellation,
        // UserId: this.UserId
        // Type_Cancellation:any;
        // Type_nonReceived:any;
      };
      this.api.get('Contract/get-po-details?', { params }).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: POReceiptDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          console.log('POReceiptDTO=:', this.dispatchData);
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
    // POSummaryDrillDwnQty
  }
  GetitemFulldetail(ItemName: any, Icode: any) {
    this.router.navigate(['/POSummaryDrillDwnQty'], {
      queryParams: {
        ItemName: ItemName,
        Icode: Icode,
        yearid: this.financial_year_id,
        directorateId: this.facility_aut_id,
        directorate: this.directorate,
        year: this.year,
      },
    });
  }
  onCategoryChange() {
    this.Type_Cancellation;
    // force UI refresh
    this.cd.detectChanges();
  }
}
