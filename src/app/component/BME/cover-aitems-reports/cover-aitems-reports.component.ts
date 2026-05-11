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
import {ParticipationItemDTO } from 'src/app/Model/models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cover-aitems-reports',
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
  templateUrl: './cover-aitems-reports.component.html',
  styleUrl: './cover-aitems-reports.component.css',
})
export class CoverAitemsReportsComponent {
tenderNo: string | null = null;
  Supplierlist:any;
 TenderDetails: any = {};
 MASDOCUMENTTYPEList:any;
 itemsDtails:any;
  selectedItems: number[] = [];
 item_id:any;
 Sname:any;
  dispatchData: ParticipationItemDTO[] = [];
   dataSource!: MatTableDataSource<ParticipationItemDTO>;
   @ViewChild('paginator') paginator!: MatPaginator;
   @ViewChild('sort') sort!: MatSort;
displayedColumns: string[] = ['sno','ItemCode','ItemName','EmdAmount','select'];
  SchStatusDid: any;
  Supplierid: any;
 constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,private route: ActivatedRoute,private location: Location,
  ) {
   this.dataSource = new MatTableDataSource<ParticipationItemDTO>([]);
  }
    ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tenderNo = params['tid'];
      this.Supplierid = params['sid'];
      this.SchStatusDid = params['ssdid'];
      this.Sname = params['Sname'];
      
      if (this.tenderNo) {
        this.fetchTenderDetails(this.tenderNo);
      }
    });
    this.GetCoverStatusList();
   this.GetLinkedItems();
   this.GETMASDOCUMENTTYPEList();
  }
    GetCoverStatusList() {
      // https://localhost:7036/api/ExtensionEHO/Supplierlist 
    this.api.get('ExtensionEHO/Supplierlist').subscribe({
      next: (res: any) => {
        this.Supplierlist = res;
        // console.log('year 1=',   this.CoverStatusList);
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }
    GETMASDOCUMENTTYPEList() {
      // https://localhost:7036/api/BME/GETMASDOCUMENTTYPEList
    this.api.get('BME/GETMASDOCUMENTTYPEList').subscribe({
      next: (res: any) => {
        this.MASDOCUMENTTYPEList = res;
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

// {
//   "TenderId": 680,
//   "TenderNo": "GEM/2025/B/6375542 (FOR DH GPM)",
//   "FinancialYearId": 19,
//   "Status": "Cover A Opened",
//   "TenderDate": "24/06/2025",
//   "SchStatusDid": 515,
//   "EndDate": "23/07/2025"
// }
fetchTenderDetails(tenderNo: any) {
  // https://localhost:7036/api/BME/GetTenderStatus/680
  this.api.get(`BME/GetTenderStatus/${tenderNo}`).subscribe({
    next: (res: any) => {
      const data = Array.isArray(res) ? res[0] : res;
      
      if (data) {
        this.TenderDetails = {
          ...data,
          TenderDate: this.formatDate(data.TenderDate),
          EndDate: this.formatDate(data.EndDate),
          // cover_a: this.formatDate(data.cover_a),
          // cover_b: this.formatDate(data.cover_b),
          // cover_c: this.formatDate(data.cover_c),
          // cover_Demo: this.formatDate(data.cover_Demo),
          // cover_Demo2: this.formatDate(data.cover_Demo2),
          // cover_Demo3: this.formatDate(data.cover_Demo3),
        };
        console.log('Final Mapped Data:', this.TenderDetails);
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
      this.itemsDtails = res; 
    },
    error: (err: any) => {
      this.spinner.hide();
      console.log('Error:', err);
    }
  });
}



GetLinkedItems() {
    // debugger
  // https://localhost:7036/api/BME/GetTenderItems/680
  // https://localhost:7036/api/BME/GetParticipationItems?schemeId=680&supplierId=51
    try {
      // https://localhost:7036/api/BME/GetParticipationItems?schemeId=680&supplierId=51
      this.spinner.show();
      this.api.get(`BME/GetParticipationItems?schemeId=${this.tenderNo}&supplierId=${this.Supplierid}`).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: ParticipationItemDTO, index: number) => ({
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

formData: any = {
  TenderId: null,
  SupplierId: null,
  EmdAmount: null,
  TenderProFee: null,
  DocTypeId: null,
  EmdDocNo: '',
  Remarks: ''
};

saveParticipation() {
  if (!this.formData.TenderProFee || this.formData.TenderProFee <= 0) {
    this.toastr.warning("Process Fee is Required.");
    return;
  }
  if (!this.formData.EmdAmount || this.formData.EmdAmount <= 0) {
    this.toastr.warning("EMD Amount is Required.");
    return;
  }
  if (!this.formData.EmdDocNo || this.formData.EmdDocNo.trim() === '') {
    this.toastr.warning("Please fill EMD Document Number");
    return;
  }
  if (!this.formData.SupplierId) {
    this.toastr.warning("Please Select Supplier");
    return;
  }

  this.formData.TenderId = Number(this.tenderNo);

  this.spinner.show();
  this.api.post1('BME/SaveSupplierParticipation', this.formData).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message);
      this.resetForm(); 
      this.GetLinkedItems();
    },
    error: (err: any) => {
      this.spinner.hide();
      this.toastr.error(err.error.message || "Failed to save");
    }
  });
}

resetForm() {
  this.formData = {
    TenderId: null,
    SupplierId: null,
    EmdAmount: null,
    TenderProFee: null,
    DocTypeId: null,
    EmdDocNo: '',
    Remarks: ''
  };
}


goToItemDetails(element: any) {
    const supplierId = element.SupplierId;
    const tenderId = element.TenderId;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/AddLeavy'], { queryParams: { sid: supplierId, tid: tenderId } })
    );
    
    // window.open(url, '_blank'); 
}

addItemToTender(element: any) {
 const supplierId = element.SupplierId;
    const tenderId = element.TenderId;
    const SchStatusDid = element.SchStatusDid;
     this.router.navigate(['/TenderCoverAitems'], {
      queryParams: {sid: supplierId, tid: tenderId,ssdid:SchStatusDid},
    });
}

isAllSelected(): boolean {
  if (!this.dataSource || this.dataSource.data.length === 0) {
    return false;
  }
  return this.selectedItems.length === this.dataSource.data.length;
}

toggleAll(event: any): void {
  if (event.target.checked) {
    this.selectedItems = this.dataSource.data.map((item: any) => item.ItemId);
  } else {
    this.selectedItems = [];
  }
}


isSelected(itemId: number): boolean {
  return this.selectedItems.includes(itemId);
}

toggleSelection(itemId: number): void {
  const index = this.selectedItems.indexOf(itemId);
  if (index > -1) {
    this.selectedItems.splice(index, 1);
  } else {
    this.selectedItems.push(itemId);
  }
}


close() {
  if (this.selectedItems.length === 0) {
    this.location.back();
    return;
  }
  Swal.fire({
    title: 'Discard Changes?',
    text: "You have un-saved selections. Do you really want to leave?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, Leave',
    cancelButtonText: 'Stay Here'
  }).then((result) => {
    if (result.isConfirmed) {
      this.location.back();
    }
  });
}

addParticipation() {
  if (this.selectedItems.length === 0) {
    this.toastr.warning("Please select at least one item.");
    return;
  }
 
  const payload = {
    SupplierId: this.Supplierid, 
    SchemeId: this.tenderNo,
    SchStatusDid:  this.SchStatusDid,
    ItemIds: this.selectedItems 
  };

  this.spinner.show();
  this.api.post1('BME/SaveBulkEquipmentParticipation', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message);
      this.selectedItems = []; 
      this.GetLinkedItems(); 
    },
    error: (err: any) => {
      this.spinner.hide();
      this.toastr.error(err.error.message || "Error saving items");
    }
  });
}


deleteParticipation() {

  if (this.selectedItems.length === 0) {
    this.toastr.warning("Please select at least one item to delete.");
    return;
  }
  Swal.fire({
    title: 'Are you sure?',
    text: `You are about to delete ${this.selectedItems.length} selected item(s). This action cannot be undone!`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33', 
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      const payload = {
           SupplierId: this.Supplierid, 
    SchemeId: this.tenderNo,
    // SchStatusDid:  this.SchStatusDid,
    // ItemIds: this.selectedItems 
        // SupplierId: 51, // Aap isse dynamic variable se replace kar sakte hain (this.supplierId)
        // SchemeId: 680,  // Isse bhi (this.schemeId)
        ItemIds: this.selectedItems // [2430, ...]
      };

      this.spinner.show(); 

      // API Call
      this.api.post1('BME/DeleteParticipationItems', payload).subscribe({
        next: (res: any) => {
          this.spinner.hide();
          
          // Success Alert
          Swal.fire(
            'Deleted!',
            res.message || 'Items have been deleted successfully.',
            'success'
          );

          this.selectedItems = [];
          this.GetLinkedItems();
        },
        error: (err: any) => {
          this.spinner.hide();
          
          // Error Alert
          Swal.fire(
            'Error!',
            err.error?.message || 'Something went wrong while deleting.',
            'error'
          );
        }
      });
    }
  });
}

}