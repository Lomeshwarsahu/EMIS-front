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
import { PODetailsReportDTO } from 'src/app/Model/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-posummary-drill-dwn-qty-powise',
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
  templateUrl: './posummary-drill-dwn-qty-powise.component.html',
  styleUrl: './posummary-drill-dwn-qty-powise.component.css',
})
export class POSummaryDrillDwnQtyPOWiseComponent {
  Fname: any;
  year: any;
  dispatchData1: PODetailsReportDTO[] = [];
  dataSource1!: MatTableDataSource<PODetailsReportDTO>;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('sort1') sort1!: MatSort;
  displayedColumns1: string[] = [
    'sno',
    'PONO',
    'PODate',
    'ITEM_NAME',
    'Quantity',
    'BasicRate',
    'Percentage',
    'PValue',
    'SupplierName',
    'TenderNo',
  ];


  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
  ) {
    this.dataSource1 = new MatTableDataSource<PODetailsReportDTO>([]);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // http://localhost:4200/EMIS/POSummaryDrillDwnQtyPOWise?finYrId=14&directorateId=6&Potype=Normal%20PO
      const yearid = params['finYrId'];
      const directorateId = params['directorateId'];
      const Potype = params['Potype'];
      this.Fname = params['Fname'];
      this.year = params['year'];

      // this.poid=poId;
      // console.log('PO ID:', yearid,'Icode=',Icode,'POid=',POid);
      this.GetPOSummaryDrillDwnQtyPOWise(yearid, directorateId, Potype);
    });
  }

  // http://localhost:4200/EMIS/POSummaryDrillDwnQtyPOWise?finYrId=16&directorateId=1&Potype=Normal%20PO&Fname=Sickle%20Cell%20Institute%20
  GetPOSummaryDrillDwnQtyPOWise(yearid: any, directorateId: any, Potype: any) {
    // debugger

    try {
      this.spinner.show();
      const params = {
        finYrId: yearid,
        directorateId: directorateId,
        POTYPE: Potype,
      };
      this.api
        .get('Contract/FinanceRep/GetPODetailsReport?', { params })
        .subscribe(
          (res: any) => {
            this.dispatchData1 = res.map(
              (item: PODetailsReportDTO, index: number) => ({
                ...item,
                sno: index + 1,
              }),
            );
            // console.log('PODetailsReportDTO=:', this.dispatchData1);
            this.dataSource1.data = this.dispatchData1;
            this.dataSource1.paginator = this.paginator1;
            this.dataSource1.sort = this.sort1;
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
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }
}
