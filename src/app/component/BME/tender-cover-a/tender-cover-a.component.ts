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
import { TenderLinkedItemDto, TenderSupplierParticipationDto } from 'src/app/Model/models';

@Component({
  selector: 'app-tender-cover-a',
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
  templateUrl: './tender-cover-a.component.html',
  styleUrl: './tender-cover-a.component.css',
})
export class TenderCoverAComponent {
//#region  lomesh 
TenderList: any[] = []; 
Eligiblitylist: any[] = []; 
selectedTenderId: any;
show:boolean=false;
selectedStatus:any;
dispatchData: TenderSupplierParticipationDto[] = [];
dataSource!: MatTableDataSource<TenderSupplierParticipationDto>;
@ViewChild('paginator') paginator!: MatPaginator;
@ViewChild('sort') sort!: MatSort;
displayedColumns: string[] = [
  'sno', 
  'SupplierName', 
  'ReqEMDAMt', 
  'SubmittedEMDAMT', 
  'Emd', 
  'TpAmount', 
  'EmdDocType',
  'EmdDocNo',
  'Remark',
  'PItems',
  'IsEligibleB',
  'Remarksclarification',
  'ADDItems',
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
   this.dataSource = new MatTableDataSource<TenderSupplierParticipationDto>([]);
  }
    ngOnInit(): void {
      this.GetTenderList1();
      this.GetItemEligibility1();


  //  this.GETMASDOCUMENTTYPEList();
  }


GetTenderList1() {
  this.spinner.show();
  // https://localhost:7036/api/BME/GetTenderList1/1
  this.api.get('BME/GetTenderList1/1').subscribe({
    next: (res: any) => {
      this.TenderList = res; 
      this.spinner.hide();
      // console.log('Tenders Loaded:', this.TenderList);
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error('Error:', err);
    }
  });
}
onTenderChange(values:any){
    //  "Tenderid": 680,
    // "Tenderno": "GEM/2025/B/6375542 (FOR DH GPM) ,OpenDT-29/04/2026"
const tid=values.Tenderid;
  this.fetchTenderDetails(tid);
    
}
// https://localhost:7036/api/BME/GetTenderStatus/680
fetchTenderDetails(tenderNo: any) {
  this.show=true;
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
         this.GetLinkedItems(tenderNo);
      }
    },
    error: (err: any) => console.log('Error:', err),
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


GetLinkedItems(tid:any) {
    debugger
// https://localhost:7036/api/BME/GetSupplierParticipationDetails/680/0
    try {
      this.spinner.show();
      this.api.get(`BME/GetSupplierParticipationDetails/${tid}/${1}`).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: TenderSupplierParticipationDto, index: number) => ({
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


GetItemEligibility1() {
// https://localhost:7036/api/BME/GetEligiblity
  this.api.get(`BME/GetEligiblity`).subscribe({
    next: (res: any) => {
      this.Eligiblitylist=res;
      console.log('Final Mapped Data:', this.Eligiblitylist);
  
    },
    error: (err: any) => console.log('Error:', err),
  });
}
onStatusChange(item: any) {
  this.item_id=item.item_id;
  // console.log(item.item_id);
  // console.log(item.item_name);
}
updateRowStatus(element: any) {
  // Logic validation check karein
  if (element.IsEligibleB === 'N' && !element.Remark) {
     alert("Please Enter Rejection Remark");
     return;
  }

  const payload = {
    SchStatusDid: element.SchStatusDid,
    SchemeId: element.TenderId, // Aapka tender_id
    Eligibility: element.IsEligibleB, // Bootstrap dropdown se aayi value
    Remarks: element.Remark,
    RoleId: '22', // Ye session ya auth service se aayega
    UserId: 101   // Ye session ya auth service se aayega
  };

  this.api.post1('BME/UpdateEligibility', payload).subscribe({
    next: (res: any) => {
      alert(res.message);
      // Row refresh ya list reload karein
    },
    error: (err) => {
      alert(err.error?.message || "Error updating status");
    }
  });
}
//#endregion













tenderNo: string | null = null;
  Supplierlist:any;
 TenderDetails: any = {};
 MASDOCUMENTTYPEList:any;
 itemsDtails:any;

 item_id:any;

 
   
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




// Component ke andar variables define karein
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
      // this.GetLinkedItems();
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
// import { Router } from '@angular/router';

// constructor(private router: Router) {}

goToItemDetails(element: any) {
    const supplierId = element.SupplierId;
    const tenderId = element.TenderId;

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/AddLeavy'], { queryParams: { sid: supplierId, tid: tenderId } })
    );
    
    // window.open(url, '_blank'); 
}

// {
//     "SlNo": 1,
//     "SchStatusDid": 515,
//     "TenderId": 680,
//     "SupplierName": "Adonis Medical System Private Limited",
//     "Emd": 5677,
//     "TpAmount": 50000,
//     "EmdDocType": "1",
//     "EmdPath": "",
//     "EmdFileName": "",
//     "TpFileName": "",
//     "TpPath": "",
//     "EmdDocNo": "12",
//     "SupplierId": 51,
//     "Remark": "hgbncvbncvbncv",
//     "PItems": 0,
//     "IsEligibleB": ""
//   }
addItemToTender(element: any) {
 const supplierId = element.SupplierId;
    const tenderId = element.TenderId;
    const SchStatusDid = element.SchStatusDid;
    const SupplierName = element.SupplierName;
     this.router.navigate(['/TenderCoverAitems'], {
      queryParams: {sid: supplierId, tid: tenderId,ssdid:SchStatusDid,Sname:SupplierName},
    });

    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/CovAItemsEntry'], { queryParams: { sid: supplierId, tid: tenderId,ssdid:SchStatusDid } })
    // );
    
    // window.open(url, '_blank'); 
}

OpenCoverAitemsReports(element :any) {

  const supplierId = element.SupplierId;
    const tenderId = element.TenderId;
    const SchStatusDid = element.SchStatusDid;
    const SupplierName = element.SupplierName;
     this.router.navigate(['/CoverAitemsReports'], {
      queryParams: {sid: supplierId, tid: tenderId,ssdid:SchStatusDid,Sname:SupplierName},
    });
  //  this.router.navigate(['/CoverAitemsReports'], {
  //     queryParams: {tender_no:tender_no},
  //   });
}
}

