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
import { ContractItem } from 'src/app/Model/models';

@Component({
  selector: 'app-rcdetail-report',
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
  templateUrl: './rcdetail-report.component.html',
  styleUrl: './rcdetail-report.component.css',
})
export class RCDetailReportComponent {
Tenterlist:any[]=[];
tender_id:any;
CategoryType='E';//1;
RcType='R';
CaType:any;
 dispatchData: ContractItem[] = [];
  dataSource!: MatTableDataSource<ContractItem>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
     'sno',
  'contractItemId',
  'itemId',
  'itemCode',
  'itemName',
  'make',
  'model',
  'supplierName',
  'tenderNo',
  'contractDate',
  'contractEndDate',
  'basicRate',
  'gst',
  'singleUnitPrice',
  'cmc1',
  'cmc2',
  'cmc3',
  'cmc4',
  'cmc5',
  'tenderId',
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
  ) {
    this.dataSource = new MatTableDataSource<ContractItem>([]);
  }

  ngOnInit() {
    // this.GETGetPODetails();
    this.GetConTenterlist();
  }



  // https://localhost:7036/api/Contract/GetConTenterlist

GetConTenterlist(){
    // this.spinner.show();
    this.api.get('Contract/GetConTenterlist').subscribe({
      next: (res: any) => {
        this.Tenterlist = res;
        // t.tender_no,t.tender_id
        // console.log(' this.Tenterlist:', this.Tenterlist);
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error(err);
      },
    });
}

onSelectedItem(tenders: any) {
  this.tender_id=tenders.tender_id;

}
  // https://localhost:7036/api/GenerateNasti/Getyear

//  https://localhost:7036/api/Contract/GetRcDetailReport?TenderId=66&CategoryId=1&RcType=R
  GetRcDetailReport() {
    // debugger
    try {
      this.spinner.show();
      if(this.CategoryType=='E')
      {
      this.CaType=1
      }else{
      this.CaType=2
      }

      const params = {
        TenderId: this.tender_id,
        CategoryId:   this.CaType ,
        RcType: this.RcType ,
      };
      this.api.get('Contract/GetRcDetailReport?', { params }).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: ContractItem, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          // console.log('ContractItem=:', this.dispatchData);
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
    return

 this.router.navigate(['/InstallationDetails'], {
  queryParams: { poId: poid}
});
  // InstallationDetails
// alert(poid)
// InstallationDetails
}
// https://localhost:7036/api/Payment/GetHeaderPO?poId=136



}
