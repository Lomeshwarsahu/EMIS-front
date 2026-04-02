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
import { IndentConsolidationDTO } from 'src/app/Model/models';

@Component({
  selector: 'app-indent-from-facilities',
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
  templateUrl: './indent-from-facilities.component.html',
  styleUrl: './indent-from-facilities.component.css',
})
export class IndentFromFacilitiesComponent {
 ItemsList: any[] = [];
  UsersByAuthoritylist: any[] = [];
  yearlist: any[] = [];
  Diectoratelist: any[] = [];
  authority_id:any;
  selecteditem:any;
  UserId:any;
  financial_year_id: any;
  facility_aut_id:any;
  ItemId: any = null;
  dispatchData: IndentConsolidationDTO[] = [];

  dataSource!: MatTableDataSource<IndentConsolidationDTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'IndentConsolidationId',
    'IndentConNo',
    'IndentDate',
    'ItemCount',
    'Status',
    'FacilityAutName',
    'Description',
    'Path',
    'UserType',
    'Designation',
    'UserId',
    'UserName',
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
    this.dataSource = new MatTableDataSource<IndentConsolidationDTO>([]);
  }

  ngOnInit() {
    // this.GetUsersByAuthority();
    this.GetItemsList();
    this.Getyear();
    this.GetDiectorate();
  }

  // https://localhost:7036/api/Contract/Indent/GetItemsList

  GetItemsList() {
    // this.spinner.show();
    this.api.get('Contract/Indent/GetItemsList').subscribe({
      next: (res: any) => {
        this.ItemsList = res;
        // console.log(' this.Tenterlist:', this.Tenterlist);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }
  //https://localhost:7036/api/Contract/Indent/GetUsersByAuthority?authority_id=5
  GetUsersByAuthority(id:any) {
    // this.spinner.show();
       const params = {
        authority_id:id,
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
      this.GetUsersByAuthority(  this.facility_aut_id);
  //    if (this.ItemId) {
  // } else {
  // }
  }
  onSelectedyearlist(years: any) {
    this.financial_year_id = years.financial_year_id;

  //    if (this.ItemId) {
  // } else {
  // }
  }
  onSelectedUsers(Users: any) {
    this.UserId = Users.UserId;
  }

  //  https://localhost:7036/api/Contract/Indent/GetIndentConsolidation?FinancialYearId=0&ItemId=0&AuthorityId=0&UserId=0
  GetIndentConsolidation() {
    debugger
    try {
      this.spinner.show();
      const params = {
        FinancialYearId: this.financial_year_id,
     ItemId: this.ItemId ,
  AuthorityId: this.facility_aut_id ,
  UserId: this.UserId 
      };
      this.api.get('Contract/Indent/GetIndentConsolidation?', { params }).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: IndentConsolidationDTO, index: number) => ({
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

}