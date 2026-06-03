import { CommonModule,Location } from '@angular/common';
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
import { ApiService } from 'src/app/service/api.service';
import { CollapseModule } from 'src/app/collapse';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
declare var bootstrap: any;
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { IndentConsolidationDetailDto, TenderLinkedItemDto } from 'src/app/Model/models';

@Component({
  selector: 'app-indent-edit-dhs-po',
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
    MatTableExporterModule
  ],
  templateUrl: './indent-edit-dhs-po.component.html',
  styleUrl: './indent-edit-dhs-po.component.css',
})
export class IndentEditDHSPOComponent {
    IndentCId: string | null = null;
  CoverStatusList:any;
 SingleIndentDetail: any = {};
 itemsDtails:any;
 item_id:any;
  dispatchData: IndentConsolidationDetailDto[] = [];
   dataSource!: MatTableDataSource<IndentConsolidationDetailDto>;
   @ViewChild('paginator') paginator!: MatPaginator;
   @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
  'sno', 
  'ItemName', 
  'ItemCodeAsPerTender', 
  'RcEndDate', 
  'Specification', 
  'EstimatedCost',
  'FinalQty',
  'FinalQtyI',
  'add',
  'delete',
  'Action'
];
 constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,private route: ActivatedRoute,private location: Location,
  ) {
   this.dataSource = new MatTableDataSource<IndentConsolidationDetailDto>([]);
  }
    ngOnInit(): void {
      // S/IndentEditDHSPO?IndentConsolidationId=2953
    this.route.queryParams.subscribe(params => {
      this.IndentCId = params['IndentConsolidationId'];
      console.log('Tender Number from URL:', this.IndentCId);
      
      if (this.IndentCId) {
        this.fetchTenderDetails(this.IndentCId);
      }
    });
    // this.GetCoverStatusList();
   this.GetLinkedItems();
  }



onSelectedItem1(event: any) {
  const selectedValue = event.target.value; 
  
  console.log('Selected Radio Value:', selectedValue);

  if (selectedValue === 'EEL') {
    this.GetCoverStatusList('EEL'); 
  } else {
    this.GetCoverStatusList('NON EEL'); 
  }
}

    GetCoverStatusList(val:any) {
     // https://localhost:7036/api/POCell/GetSearchItemsDropdown?checkType=NO%20EEL
    this.api.get(`POCell/GetSearchItemsDropdown?checkType=${val}`).subscribe({
      next: (res: any) => {
        this.CoverStatusList = res;
        // console.log('year 1=',   this.CoverStatusList);
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }
goBack() {
  this.location.back(); 
}
formatDate(dateStr: string) {
  if (!dateStr || dateStr.includes('-')) return dateStr; 
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`; 
  }
  return '';
}


// https://localhost:7036/api/POCell/GetSingleIndentDetail/2953
fetchTenderDetails(IndentCId: any) {
  this.api.get(`POCell/GetSingleIndentDetail/${IndentCId}`).subscribe({
    next: (res: any) => {
      const data = Array.isArray(res) ? res[0] : res;
      
      if (data) {
        this.SingleIndentDetail = {
          ...data,
          ConsolidatedDate: this.formatDate(data.ConsolidatedDate),
        
        };
        console.log('Final Mapped Data:', this.SingleIndentDetail);
      }
    },
    error: (err: any) => console.log('Error:', err),
  });
}
// https://localhost:7036/api/BME/GetItemEligibility/902

GetItemEligibility1() {
// debugger;
  this.api.get(`BME/GetItemEligibility/${this.item_id}`).subscribe({
    next: (res: any) => {
      this.itemsDtails=res;
      console.log('Final Mapped Data:', this.SingleIndentDetail);
  
    },
    error: (err: any) => console.log('Error:', err),
  });
}
onSelectedItem(item: any) {
  this.item_id=item.ItemId;
  // console.log(item.item_id);
  // console.log(item.item_name);
}

GetItemEligibility() {

  //  https://localhost:7036/api/POCell/GetConsolidationItemDetails/3948
  this.spinner.show();
  this.api.get(`POCell/GetConsolidationItemDetails/${this.IndentCId}`).subscribe({
    next: (res: any) => {
      this.spinner.hide();
   
      this.itemsDtails = res; 
      console.log('itemsDtails=',res);
    },
    error: (err: any) => {
      this.spinner.hide();
      console.log('Error:', err);
    }
  });
}
addItemToTender(item: any) {

  if (!item.tender_qty || item.tender_qty <= 0) {
    this.toastr.warning("Please Enter Tender QTY");
    return;
  }
  if (!item.emd_amt || item.emd_amt <= 0) {
    this.toastr.warning("Please Enter EMD");
    return;
  }

  const payload = {
    TenderId: Number(this.IndentCId),
    ItemId: item.item_id,
    TenderQuantity: item.tender_qty,
    EmdAmount: item.emd_amt
  };

  this.spinner.show();
  this.api.post1('BME/AddItemToTender', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message);
      // Item add hone ke baad list refresh karein
      // this.GetItemEligibility(); 
      this.GetLinkedItems(); 
    },
    error: (err: any) => {
      this.spinner.hide();
      this.toastr.error(err.error.message || "Failed to add item");
    }
  });
}
// https://localhost:7036/api/POCell/GetConsolidationItemDetails/3948

// https://localhost:7036/api/POCell/GetIndentConsolidationDetailsGrid?finYearId=18&indentConsolidationId=2955&itemId=4883

GetLinkedItems() {
    // debugger

  let finYearId=  this.SingleIndentDetail.FinancialYearId;
    try {
      this.spinner.show();
      this.api.get(`POCell/GetIndentConsolidationDetailsGrid?finYearId=${finYearId}&indentConsolidationId=${this.IndentCId}&itemId=${this.item_id}`).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: IndentConsolidationDetailDto, index: number) => ({
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
  GetitemFulldetail(id:any){
    
  }
  onDeleteRow(valu:any){

  }

  onAddRow(value: any) {
  console.log('Row Values Received for Routing:', value);
  // {
  //   "ItemId": 4883,
  //   "ItemCodeAsPerTender": "PATH038",
  //   "RcEndDate": "",
  //   "ItemDesc": "",
  //   "ItemName": "-80° C DEEP FREEZER",
  //   "FileName": "",
  //   "UploadDocId": null,
  //   "UploadFolderName": "",
  //   "SingleUnitPrice": 0,
  //   "EstimatedCost": 0,
  //   "ContractItemId": 0,
  //   "IndentConsItemsId": null,
  //   "IndentConsolidationId": null,
  //   "ProposedQty": 0,
  //   "OtherFundName": "",
  //   "FinalQtyI": 0,
  //   "FinalQty": 0,
  //   "IndentFundId": null,
  //   "IndentMonthId": null,
  //   "IndentFundName": "",
  //   "IndentMonth": "",
  //   "Status": ""
  // }
  // 1. Query Parameters Object Create karein (Exact C# / Query Fields Ke Hisab Se)
  const queryParamsData: NavigationExtras = {
    queryParams: {
      itemid: value.ItemId,                           
      estcost: value.EstimatedCost,                    
      fqty: value.FinalQty,                            
      indentid: value.IndentConsolidationId,            
      finid: this.SingleIndentDetail.FinancialYearId,                      
      IndentCId: this.IndentCId ,         
      ItemName: value.ItemName,         
      ItemCodeAsPerTender: value.ItemCodeAsPerTender         
    }
  };

  this.router.navigate(['/DHSindentAddBulkConsigneePO'], queryParamsData);
}
}
