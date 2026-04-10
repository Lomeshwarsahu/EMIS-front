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
import { IndentDetailsDTO } from 'src/app/Model/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-posummary-drill-dwn-qty-reagent',
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
  templateUrl: './posummary-drill-dwn-qty-reagent.component.html',
  styleUrl: './posummary-drill-dwn-qty-reagent.component.css',
})
export class POSummaryDrillDwnQtyReagentComponent {
  Dname: any;
  Iname:any
  year: any;
  year1="2019-20 and 2020-21"
  dispatchData1: IndentDetailsDTO[] = [];
  dataSource1!: MatTableDataSource<IndentDetailsDTO>;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('sort1') sort1!: MatSort;
  displayedColumns1: string[] = [
    'sno',
    'PoNo',
    'PoDate',
    'LocationName',
    'Quantity',
    'BasicRate',
    'Percentage',
    'SingleUnitPrice',
    'TotalPOValue',
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
    this.dataSource1 = new MatTableDataSource<IndentDetailsDTO>([]);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      //http://localhost:4200/EMIS/POSummaryDrillDwnQty?
      // ItemName=300MA%20X-Ray%20Machine&Icode=DHS20&yearid=6&directorateId=5&directorate=Directorate%20of%20Health%20Services&year=2017-2018
      const yearid = params['yearid'];
      const directorateId = params['directorateId'];
      const itemCode = params['Icode'];
      this.Iname = params['ItemName'];
      this.year = params['year'];
      this.Dname=params['directorate'];
      this.GetPOSummaryDrillDwnQtyPOWise(yearid, directorateId, itemCode);
    });
  }

  //https://localhost:7036/api/Contract/Reports/GetItemWPODetails?finYrId=7&itemCode=DHS20&directorateId=5
  GetPOSummaryDrillDwnQtyPOWise(yearid: any, directorateId: any, itemCode: any) {
    // debugger

    try {
      this.spinner.show();
      const params = {
        finYrId: yearid,
        itemCode: itemCode,
        directorateId: directorateId,
      };
      this.api
        .get('Contract/Reports/GetItemWPODetails?', { params })
        .subscribe(
          (res: any) => {
            this.dispatchData1 = res.map(
              (item: IndentDetailsDTO, index: number) => ({
                ...item,
                sno: index + 1,
              }),
            );
            console.log('IndentDetailsDTO=:', this.dispatchData1);
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

