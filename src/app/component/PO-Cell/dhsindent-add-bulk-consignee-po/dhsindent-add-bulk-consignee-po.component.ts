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
  //  this.GetLinkedItems();
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
}
