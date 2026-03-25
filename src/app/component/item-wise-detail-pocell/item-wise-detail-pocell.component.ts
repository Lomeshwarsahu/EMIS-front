
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
  selector: 'app-item-wise-detail-pocell',
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
  templateUrl: './item-wise-detail-pocell.component.html',
  styleUrl: './item-wise-detail-pocell.component.css',
})
export class ItemWiseDetailPOCellComponent {
 itemslist: any = {};
selecteditem:any;
item_id:any;

    dispatchData: ItemWiseDetailDTO[] = [];
  dataSource!: MatTableDataSource<ItemWiseDetailDTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'tender_no',
    'year',
    'po_no',
    'po_date',
    'facility_aut_name',
    'item_code_as_per_tender',
    'item_name',
    'Supplier',
    'POQTY',
    'Supplyqty',
    'receiptQTY',
    'insqty',
    'potype',
    'balanceToDispatch',
    'BalToReceipt',
    'BalToInstall',
    //  'action',

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
    this.dataSource = new MatTableDataSource<ItemWiseDetailDTO>([]);
  }

ngOnInit() {

    this.Getitemslist();
     this.Getitemwisedetail();


}

// https://localhost:7036/api/Reports/items/5

  Getitemslist() {
  this.spinner.show();
let  directorateId =5 ;
  this.api.get(`Reports/items/${directorateId}`).subscribe({
    next: (res: any) => {
      this.itemslist = res; 

      console.log('items', res);
      this.spinner.hide();
    },
    error: (err: any) => {
      console.error(err);
      this.spinner.hide();
    },
  });
}
//https://localhost:7036/api/Reports/itemwisedetail/677
 Getitemwisedetail() {
    // debugger
  
    try {
      this.spinner.show();
      this.api.get(`Reports/itemwisedetail/${this.item_id}`).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: ItemWiseDetailDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          console.log('itemwisedetail=:', this.dispatchData);
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

onSelectedItem(item: any) {
  this.item_id=item.item_id;
  // console.log(item.item_id);
  // console.log(item.item_name);
}

 GetitemFulldetail(yearid:any,Icode:any,POid:any,tender_no :any,po_no:any) {
   this.router.navigate(['/ItemWiseDetailPOCellByPOid'], {
      queryParams: { yearid: yearid, Icode:Icode,POid:POid,tender_no:tender_no,po_no:po_no},
    });
  }
}
