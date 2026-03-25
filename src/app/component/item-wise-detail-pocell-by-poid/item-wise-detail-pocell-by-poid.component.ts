
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
import { ItemWiseDetailDTO,ItemWiseFullDTO} from 'src/app/Model/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-wise-detail-pocell-by-poid',
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
  templateUrl: './item-wise-detail-pocell-by-poid.component.html',
  styleUrl: './item-wise-detail-pocell-by-poid.component.css',
})
export class ItemWiseDetailPOCellByPOidComponent {


    dispatchData1: ItemWiseFullDTO[] = [];
  dataSource1!: MatTableDataSource<ItemWiseFullDTO>;
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('sort1') sort1!: MatSort;
displayedColumns1: string[] = [
  'sno',
  'tender_no',
  // 'year',
  'po_no',
  'po_date',
  'facility_aut_name',
  'item_code_as_per_tender',
  'item_name',
  'Supplier',
  'DBStart_Name_En',
  'location_name',
  'POQTY',
  'Supplyqty',
  'receiptQTY',
  'insqty',
  'potype',
  'balanceToDispatch',
  'BalToReceipt',
  'BalToInstall'
];

tenderNoHeading: string = '';
poNoHeading: string = '';
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,private route: ActivatedRoute
  ) {
    this.dataSource1 = new MatTableDataSource<ItemWiseFullDTO>([]);
  }

ngOnInit() {
  this.route.queryParams.subscribe(params => {

    const yearid = params['yearid'];
    const Icode = params['Icode'];
    const POid = params['POid'];
    this. tenderNoHeading = params['tender_no'];
    this. poNoHeading = params['po_no'];
 
    // this.poid=poId;
    console.log('PO ID:', yearid,'Icode=',Icode,'POid=',POid);
   this.GetitemFulldetail(yearid,Icode,POid);


  });
 


}
 



// https://localhost:7036/api/Reports/itemfull/DHS20/7/922
 GetitemFulldetail(yearid:any,Icode:any,POid:any) {
    // debugger
  
    try {
      this.spinner.show();
      this.api.get(`Reports/itemfull/${Icode}/${yearid}/${POid}`).subscribe(
        (res: any) => {
          this.dispatchData1 = res.map((item: ItemWiseFullDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          console.log('ItemWiseFullDTO=:', this.dispatchData1);
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

