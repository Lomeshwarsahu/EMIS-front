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
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', '../tender-subpage.shared.css', './tender-cover-a.component.css'],
})
export class TenderCoverAComponent {
//#region  lomesh 
TenderList: any[] = []; 
Eligiblitylist: any[] = []; 
selectedTenderId: any;
show:boolean=false;



tenderNo: string | null = null;
 TenderDetails: any = {};
 itemsDtails:any;

 item_id:any;

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

// https://localhost:7036/api/BME/GetSupplierParticipationDetails/680/0
    try {
      this.spinner.show();
      this.api.get(`BME/GetSupplierParticipationDetails/${tid}/${1}`).subscribe(
        (res: any) => {
          const tech = this.isTechRole();
          this.dispatchData = (res || []).map((item: TenderSupplierParticipationDto, index: number) => ({
            ...item,
            sno: index + 1,
            _elig: (tech ? item.IsCovTechEli : item.IsCOVFinEli) || null,
            _remarks: (tech ? item.CovATechRemarksBefore_OBClM : item.CovAFINRemarksBefore_OBClM) || '',
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

// Logged-in user (sessionStorage, with the old localStorage loginData as fallback)
private currentUser() {
  let roleId = sessionStorage.getItem('roleId') || '';
  let userId = sessionStorage.getItem('userid') || '';
  const data = localStorage.getItem('loginData');
  if ((!roleId || !userId) && data) {
    const user = JSON.parse(data);
    roleId = roleId || String(user.roleid ?? '');
    userId = userId || String(user.user_id ?? '');
  }
  return { roleId, userId };
}

// UpdateEligibility writes the technical columns for role 22 / 12, the financial columns otherwise
private isTechRole() {
  const { roleId } = this.currentUser();
  return roleId === '22' || roleId === '12';
}

// Legacy row "Update": saves this row's own Eligible value and remarks
updateRowStatus(element: any) {
  const eligibility = element._elig;
  const remarks = (element._remarks || '').trim();
  if (!eligibility || eligibility === '0') {
    this.toastr.warning('Please select a valid eligibility status.');
    return;
  }
  if (eligibility === 'N' && !remarks) {
    this.toastr.warning('Please Enter Rejection Remark for Not Eligible.');
    return;
  }
  if (eligibility === 'C' && !remarks) {
    this.toastr.warning('Please Enter Clarification Remarks.');
    return;
  }

  const { roleId, userId } = this.currentUser();
  const payload = {
    SchStatusDid: element.SchStatusDid,
    SchemeId: element.TenderId,
    Eligibility: eligibility,
    Remarks: remarks,
    RoleId: roleId,
    UserId: userId,
  };

  this.spinner.show();
  this.api.post1('BME/UpdateEligibility', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res?.message || 'Updated Successfully');
      this.GetLinkedItems(element.TenderId);
    },
    error: (err) => {
      this.spinner.hide();
      this.toastr.error(err.error?.message || 'Error updating status');
    }
  });
}

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

//#endregion


}








