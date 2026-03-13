
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
import { PODetails,PaymentListDetails,HeaderPO,CRIDetailDTO} from 'src/app/Model/models';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-installation-details',
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
  templateUrl: './installation-details.component.html',
  styleUrl: './installation-details.component.css',
})
export class InstallationDetailsComponent {

poid:any;
// HeaderPO:HeaderPO[]=[];
HeaderPO: any = {};
FillDeniedDetail:any={};
  // yearList=[{id:0, 'Year':2012}];
  yearList: any;
  searchMode: 'po' | 'outward' = 'po';
  poNo: any;
  outwardNo: any;
  selectedYear: any;
  // PODetails: PaymentListDetails[] = [];
  financialyearid: any;
  fileNo: any;
  podt: any;
  schemeCode: any;
  supplierName: any;


  dispatchData: CRIDetailDTO[] = [];
  dataSource!: MatTableDataSource<CRIDetailDTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'MakeNo',
    'InstallationDate',
    'RecievedDate',
    'WarentyFrom',
    'ReceivedQty',
    'WarrantyCardNo',
    'LocationName',
    'UType',
     'action',
    'Photos',
    'card',
    'Challan',

  ];

  
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,private route: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource<CRIDetailDTO>([]);
  }

ngOnInit() {

  this.route.queryParams.subscribe(params => {

    const poId = params['poId'];
    // this.poid=poId;
    console.log('PO ID:', poId);
    this.GetHeaderPO(poId);
    this.GetCRIDetail(poId);
   this.GetFillDeniedDetail(poId);

  });
}


  Getyears() {
    this.api.get('GenerateNasti/Getyear').subscribe({
      next: (res: any) => {
        console.log('years', res);
        this.yearList = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
//  https://localhost:7036/api/Payment/GetHeaderPO?poId=136
  GetHeaderPO(poid:any) {
    // debugger
    this.spinner.show();

    const params = {
      poId: poid
    };
    this.api.get('Payment/GetHeaderPO', { params }).subscribe({
      next: (res: any) => {
        this.HeaderPO=res[0];
        // console.log('GetHeaderPO', res);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }
  convertDate(dateStr: string) {
    const parts = dateStr.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
//  https://localhost:7036/api/Payment/GetCRIDetail?poId=717
  GetCRIDetail(poid:any) {
    debugger
    try {
      this.spinner.show();

    const params = {
      poId: poid
    };
      this.api.get('Payment/GetCRIDetail', { params }).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: CRIDetailDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          console.log('CRIDetailDTO=:', this.dispatchData);
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
onButtonClick(poid:any){
alert(poid)
}
// https://localhost:7036/api/Payment/FillDeniedDetail?poId=717

  GetFillDeniedDetail(poid:any) {
    // debugger
    this.spinner.show();

    const params = {
      poId: poid
    };
    this.api.get('Payment/FillDeniedDetail', { params }).subscribe({
      next: (res: any) => {
        this.FillDeniedDetail=res[0];
        console.log('FillDeniedDetail', res);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
  }





}
