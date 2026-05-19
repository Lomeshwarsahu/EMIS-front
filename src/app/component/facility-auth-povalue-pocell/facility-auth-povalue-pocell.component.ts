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
import { FacilityReportDTO } from 'src/app/Model/models';

@Component({
  selector: 'app-facility-auth-povalue-pocell',
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
  templateUrl: './facility-auth-povalue-pocell.component.html',
  styleUrl: './facility-auth-povalue-pocell.component.css',
})
export class FacilityAuthPOValuePOCellComponent {
    yearlist: any[] = [];
      financial_year_id: any;
      selecteditem:any;
Status:any;
Did:any;
  year:any;
  CategoryType:any;
  dispatchData: FacilityReportDTO[] = [];

  dataSource!: MatTableDataSource<FacilityReportDTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'FacilityAutName',
    'NosItem',
    'NosPO',
    'POtype',
    'TotalPOValueCr',
    // 'PValue',
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
    this.dataSource = new MatTableDataSource<FacilityReportDTO>([]);
  }

  ngOnInit() {
    this.Getyear();
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

  //https://localhost:7036/api/Contract/FinanceRep/Facility?financial_year_id=14
  GetFinanceRep() {
    if (!this.financial_year_id) {
      this.toastr.warning('Please select financial year.');
      return;
    }
    try {
      this.spinner.show();
      const params = {
        financial_year_id: this.financial_year_id,
      };
      this.api.get('Contract/FinanceRep/Facility', { params }).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: FacilityReportDTO, index: number) => ({
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

  onCategoryChange() {
  if (this.CategoryType === 'Booked') {
  //  this.Status = null;  // disable supplier + clear//// Booked / Closed
  }

  if (this.CategoryType === 'Closed') {
    //this.tender_id = null;    // disable tender + clear
  }
    // force UI refresh
  this.cd.detectChanges();
}
  onSelectedyearlist(selected: number | { financial_year_id?: number; year?: string } | null) {
    if (selected == null) {
      this.financial_year_id = null;
      this.year = '';
      return;
    }
    if (typeof selected === 'object') {
      this.financial_year_id = selected.financial_year_id ?? null;
      this.year = selected.year ?? '';
    } else {
      this.financial_year_id = selected;
      const match = this.yearlist.find(
        (y: { financial_year_id?: number }) => y.financial_year_id === selected,
      );
      this.year = match?.year ?? '';
    }
  }
  // http://localhost:55385/Reports/POSummaryDrillDwnQtyPOWise.aspx?finYrId=18&directorateId=5&Potype=Normal%20PO
   GetitemFulldetail(directorateId:any,Potype :any,FacilityAutName:any) {
   this.router.navigate(['/POSummaryDrillDwnQtyPOWise'], {
      queryParams: { finYrId:this.financial_year_id, directorateId:directorateId,Potype:Potype,Fname:FacilityAutName,year:this.year},
    });
  }
}