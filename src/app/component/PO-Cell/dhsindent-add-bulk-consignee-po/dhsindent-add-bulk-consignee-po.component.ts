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
import { distcDetailsGrid, IndentConsolidationDetailDto, TenderLinkedItemDto } from 'src/app/Model/models';

@Component({
  selector: 'app-dhsindent-add-bulk-consignee-po',
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
  templateUrl: './dhsindent-add-bulk-consignee-po.component.html',
  styleUrl: './dhsindent-add-bulk-consignee-po.component.css',
})
export class DHSindentAddBulkConsigneePOComponent {
    IndentCId: string | null = null;
    ItemName: string | null = null;
    ItemCode: string | null = null;
    itemid: string | null = null;
    distid:any;
    isMedicalCollege: boolean = false;
    Districts:any;
  CoverStatusList:any;
 SingleIndentDetail: any = {};
 itemsDtails:any;
 item_id:any;
  dispatchData: distcDetailsGrid[] = [];
   dataSource!: MatTableDataSource<distcDetailsGrid>;
   @ViewChild('paginator') paginator!: MatPaginator;
   @ViewChild('sort') sort!: MatSort;
   displayedColumns: string[] = ['sno', 'LocationName', 'IndentQuantity'];

 constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,private route: ActivatedRoute,private location: Location,
  ) {
   this.dataSource = new MatTableDataSource<distcDetailsGrid>([]);
  }
    ngOnInit(): void {

      // S/IndentEditDHSPO?IndentConsolidationId=2953
    this.route.queryParams.subscribe(params => {
      this.IndentCId = params['IndentCId'];
      this.itemid = params['itemid'];
      this.ItemName = params['ItemName'];
      this.ItemCode = params['ItemCodeAsPerTender'];
      console.log('Tender Number from URL:', this.IndentCId);
      
      if (this.IndentCId) {
        this.fetchTenderDetails(this.IndentCId);
      }
    });
    this.GetDistricts();
    // this.GetCoverStatusList();
  //  this.GetLinkedItems();
  }



    GetDistricts() {
     //// https://localhost:7036/api/Reports/GetDistricts
    this.api.get(`Reports/GetDistricts`).subscribe({
      next: (res: any) => {
        this.Districts = res;
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

onSelectedItem1(event: any) {
  const isChecked = event.target.checked; 
  
  console.log('Is Medical College Checked Status:', isChecked);

  this.isMedicalCollege = isChecked;


}

// https://localhost:7036/api/POCell/GetConsigneeIndentDetailsGrid?indentConNo=2955&itemId=4664&dpDistrictId=2212&isMedicalCollege=false
GetConsigneeIndentDetailsGrid() {
    try {
      this.spinner.show();
      this.api.get(`POCell/GetConsigneeIndentDetailsGrid?indentConNo=${this.IndentCId}&itemId=${this.itemid}&dpDistrictId=${this.distid}&isMedicalCollege=${this.isMedicalCollege}`).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: distcDetailsGrid, index: number) => ({
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
GetItemEligibility(){

}
onSelectedItem(event:any){
   this.distid = event.DP_DistrictID;

  console.log('Selected Radio Value:', event);
}


onsave() {
  if (!this.dataSource || !this.dataSource.data || this.dataSource.data.length === 0) {
    this.toastr.warning("No records found in the table grid to process save.");
    return;
  }

  this.spinner.show();
  let finYearId=  this.SingleIndentDetail.FinancialYearId;
  let IndentConNo=this.SingleIndentDetail.IndentConNo;
  const formattedRows = this.dataSource.data.map((row: any) => {
    return {
      LocationId: row.LocationId ? Number(row.LocationId) : 0,
      
      IndentItemId: row.IndentItemId != null ? Number(row.IndentItemId) : 0,
      
      IndentQuantity: row.IndentQuantity != null ? Number(row.IndentQuantity) : 0
    };
  });

  const finalPayload = {
    ItemId: Number(this.itemid || 0),
    FinancialYearId: Number(finYearId || 0),
    IndConId: Number(this.IndentCId || 0),
    IndentNumber: IndentConNo? IndentConNo.toString().trim() : 'string',
    ConsigneeRows: formattedRows
  };

  console.log('Dispatching Dynamic JSON Payload Framework to Backend:', finalPayload);

  this.api.post1('POCell/SaveBulkConsigneeIndentsActual', finalPayload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message || "Bulk Consignee Matrix Saved Successfully!");
      
      if (typeof (this as any).loadLocationIndentGrid === 'function') {
         (this as any).loadLocationIndentGrid();
      }
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error('API Integration Endpoint Error Execution Loops:', err);
      this.toastr.error(err.error?.message || "An internal error occurred while processing transaction logs.");
    }
  });
}


// CompleteConsigneeAllotment



onCompleteWorkflow() {
  const itemId = Number(this.itemid );
  const indConId = Number(this.IndentCId);

  if (!itemId || !indConId) {
    this.toastr.error("Unable to process: Missing Route parameter references.");
    return;
  }

  this.spinner.show();

  const payload = {
    ItemId: itemId,
    IndConId: indConId
  };

  this.api.post1('POCell/CompleteConsigneeAllotment', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message || "Allotment Process Completed!");
      
      // Emulating WebForms: Response.Redirect("Indent_editDHS_PO.aspx?ICID=" + indentId);
      // Angular Router provides parameter arrays mapping smoothly
      this.router.navigate(['/Indent_editDHS_PO'], { queryParams: { ICID: res.indentConsolidatedId } });
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error(err);
      this.toastr.warning(err.error?.message || "Failed to finalize the current items allocation.");
    }
  });
}

}
