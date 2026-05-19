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
Tenterlist: { tender_id: number; tender_no: string }[] = [];
tender_id: number | null = 0;
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

GetConTenterlist(): void {
    this.api.get('Contract/GetConTenterlist').subscribe({
      next: (res: unknown) => {
        const arr = Array.isArray(res) ? res : [];
        const mapped = arr.map((r: Record<string, unknown>) => ({
          tender_id: Number(r['tender_id'] ?? r['TenderId'] ?? 0),
          tender_no: String(r['tender_no'] ?? r['TenderNo'] ?? ''),
        }));
        const hasAll = mapped.some((t) => t.tender_id === 0);
        this.Tenterlist = hasAll ? mapped : [{ tender_id: 0, tender_no: '--All--' }, ...mapped];
        this.tender_id = 0;
        this.spinner.hide();
      },
      error: (err: unknown) => {
        this.spinner.hide();
        console.error(err);
      },
    });
}
  // https://localhost:7036/api/GenerateNasti/Getyear

//  https://localhost:7036/api/Contract/GetRcDetailReport?TenderId=66&CategoryId=1&RcType=R
  GetRcDetailReport() {
    try {
      this.spinner.show();
      this.CaType = this.CategoryType === 'E' ? 1 : 2;

      const params: Record<string, string | number> = {
        CategoryId: this.CaType,
        RcType: this.RcType,
      };
      if (this.tender_id != null && this.tender_id > 0) {
        params['TenderId'] = this.tender_id;
      }

      this.api.get('Contract/GetRcDetailReport', { params }).subscribe(
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
