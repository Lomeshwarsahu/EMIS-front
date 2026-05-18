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
import { ActivatedRoute, Router } from '@angular/router';
declare var bootstrap: any;
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TenderLinkedItemDto } from 'src/app/Model/models';

@Component({
  selector: 'app-add-rtender-items',
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
  templateUrl: './add-rtender-items.component.html',
  styleUrl: './add-rtender-items.component.css',
})
export class AddRTenderItemsComponent {
    tenderNo: string | null = null;
  CoverStatusList:any;
 TenderDetails: any = {};
 itemsDtails:any;
 item_id:any;
  dispatchData: TenderLinkedItemDto[] = [];
   dataSource!: MatTableDataSource<TenderLinkedItemDto>;
   @ViewChild('paginator') paginator!: MatPaginator;
   @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
  'sno', 
  'ItemCodeAsPerTender', 
  'ItemName', 
  'TenderQuantity', 
  'EmdAmount'
];
 constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,private route: ActivatedRoute,private location: Location,
  ) {
   this.dataSource = new MatTableDataSource<TenderLinkedItemDto>([]);
  }
    ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tenderNo = params['tender_no'];
      console.log('Tender Number from URL:', this.tenderNo);
      
      if (this.tenderNo) {
        this.fetchTenderDetails(this.tenderNo);
      }
    });
    this.GetCoverStatusList();
   this.GetLinkedItems();
  }
    GetCoverStatusList() {
      // https://localhost:7036/api/BME/GetSelectableItems
    this.api.get('BME/GetSelectableItems').subscribe({
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

fetchTenderDetails(tenderNo: any) {
  this.api.get(`BME/GetTenderDetailsById/${tenderNo}`).subscribe({
    next: (res: any) => {
      const data = Array.isArray(res) ? res[0] : res;
      
      if (data) {
        this.TenderDetails = {
          ...data,
          TENDER_DATE: this.formatDate(data.TENDER_DATE),
          ENDDate: this.formatDate(data.ENDDate),
          cover_a: this.formatDate(data.cover_a),
          cover_b: this.formatDate(data.cover_b),
          cover_c: this.formatDate(data.cover_c),
          cover_Demo: this.formatDate(data.cover_Demo),
          cover_Demo2: this.formatDate(data.cover_Demo2),
          cover_Demo3: this.formatDate(data.cover_Demo3),
        };
        console.log('Final Mapped Data:', this.TenderDetails);
      }
    },
    error: (err: any) => console.log('Error:', err),
  });
}
// https://localhost:7036/api/BME/GetItemEligibility/902

GetItemEligibility1() {
debugger;
  this.api.get(`BME/GetItemEligibility/${this.item_id}`).subscribe({
    next: (res: any) => {
      this.itemsDtails=res;
      console.log('Final Mapped Data:', this.TenderDetails);
  
    },
    error: (err: any) => console.log('Error:', err),
  });
}
onSelectedItem(item: any) {
  this.item_id=item.item_id;
  // console.log(item.item_id);
  // console.log(item.item_name);
}

GetItemEligibility() {
  if (!this.item_id) {
    this.toastr.warning('Please select an item first');
    return;
  }
  
  this.spinner.show();
  this.api.get(`BME/GetItemEligibility/${this.item_id}`).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      // API se array aata hai, isliye hum use direct assign karenge
      this.itemsDtails = res; 
    },
    error: (err: any) => {
      this.spinner.hide();
      console.log('Error:', err);
    }
  });
}
addItemToTender(item: any) {
  // Check karein ki values empty na hon
  if (!item.tender_qty || item.tender_qty <= 0) {
    this.toastr.warning("Please Enter Tender QTY");
    return;
  }
  if (!item.emd_amt || item.emd_amt <= 0) {
    this.toastr.warning("Please Enter EMD");
    return;
  }

  const payload = {
    TenderId: Number(this.tenderNo),
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
      this.GetItemEligibility(); 
      this.GetLinkedItems(); 
    },
    error: (err: any) => {
      this.spinner.hide();
      this.toastr.error(err.error.message || "Failed to add item");
    }
  });
}


GetLinkedItems() {
    // debugger
  
    try {
      this.spinner.show();
      this.api.get(`BME/GetLinkedItemsByTender/${this.tenderNo}/${'A'}`).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: TenderLinkedItemDto, index: number) => ({
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
}
