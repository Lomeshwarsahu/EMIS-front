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

@Component({
  selector: 'app-tender-status-update',
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
  templateUrl: './tender-status-update.component.html',
  styleUrl: './tender-status-update.component.css',
})
export class TenderStatusUpdateComponent {
  tenderNo: string | null = null;
  CoverStatusList:any;
 TenderDetails: any = {};
 constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,private route: ActivatedRoute,private location: Location,
  ) {
    // this.dataSource = new MatTableDataSource<any>([]);
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
  }
    GetCoverStatusList() {
    this.api.get('BME/GetCoverStatusList').subscribe({
      next: (res: any) => {
        this.CoverStatusList = res;
        // console.log('year 1=',   this.CoverStatusList);
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
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
  // https://localhost:7036/api/BME/GetTenderDetailsById/680
  // https://localhost:7036/api/BME/GetCoverStatusList
  // https://localhost:7036/api/BME/UpdateTenderUploadIds
goBack() {
  this.location.back(); 
}
 updateEProc() {
  // debugger
  // Check karein ki tender_id null na ho
  if (!this.TenderDetails.tender_id) {
    this.toastr.error('Tender ID not found!', 'Error');
    return;
  }

  // Payload prepare karein (Wahi keys jo aapne Curl mein di hain)
  const payload = {
    tender_id: Number(this.TenderDetails.tender_id),
    webSiteUploadID: this.TenderDetails.webSiteUploadID || "",
    eprocID: this.TenderDetails.eprocID || ""
  };

  console.log('Sending Update Payload:', payload);

  // Loading spinner start
  this.spinner.show();
  this.api.post1('BME/UpdateTenderUploadIds', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      // Toastr success message
      this.toastr.success(res.message || 'Updated Successfully', 'Success');
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error('API Error:', err);
      this.toastr.error('Update failed! Please try again.', 'Error');
    }
  });
}

// {
//     "TENDER_NO": "GEM/2025/B/6375542 (FOR DH GPM)",
//     "FINANCIAL_YEAR": "2025-2026",
//     "domestic_days": 60,
//     "import_days": 75,
//     "warranty_year": 5,
//     "TENDER_DATE": "24/06/2025",
//     "TENDER_DESCRIPTION": "TENDER FOR THE PURCHASE OF CT SCAN(64 SLICE) MACHINE (FOR DH GPM)",
//     "FLAG": "F",
//     "FINANCIAL_YEAR_ID": 19,
//     "tender_id": 680,
//     "cover_a": "",
//     "cover_b": "",
//     "cover_Demo": "",
//     "cover_c": "",
//     "cStatus": "Live",
//     "csid": 1,
//     "cover_Demo2": "",
//     "cover_Demo3": "",
//     "TenderRemarks": "",
//     "webSiteUploadID": "20150106375542",
//     "eprocID": "GEM/2025/B/6375542",
//     "ENDDate": "23/07/2025"
//   }
// https://localhost:7036/api/BME/UpdateTenderFullDetails
saveFullDetails() {
  // debugger;
  // 1. Mandatory Validation Check (Front-end par hi check kar lete hain)
  if (!this.TenderDetails.tender_id) {
    this.toastr.warning('Tender ID missing!');
    return;
  }

  // 2. Payload Prepare karein (Keys exact API DTO se match honi chahiye)
  const payload = {
    TenderId: Number(this.TenderDetails.tender_id),
    TenderNo: this.TenderDetails.TENDER_NO,
    WarrantyYear: Number(this.TenderDetails.warranty_year),
    DomesticDays: Number(this.TenderDetails.domestic_days),
    ImportDays: Number(this.TenderDetails.import_days),
    Csid: Number(this.TenderDetails.csid),
    TenderRemarks: this.TenderDetails.TenderRemarks || "",
    TenderDescription: this.TenderDetails.TENDER_DESCRIPTION || "",
    TenderDate: this.TenderDetails.TENDER_DATE, // yyyy-mm-dd format
    EndDate: this.TenderDetails.ENDDate,
    ExtendDt: this.TenderDetails.ExtendDt || "", // Agar model mein hai
    CoverA: this.TenderDetails.cover_a,
    CoverB: this.TenderDetails.cover_b,
    CoverC: this.TenderDetails.cover_c,
    CoverDemo: this.TenderDetails.cover_Demo,
    CoverDemo2: this.TenderDetails.cover_Demo2,
    CoverDemo3: this.TenderDetails.cover_Demo3,
    CancelledDt: this.TenderDetails.CancelledDT || ""
  };

  console.log('Sending Save Payload:', payload);

  // 3. UI Feedback
  this.spinner.show();

  // 4. API Call
  this.api.post1('BME/UpdateTenderFullDetails', payload).subscribe({
    next: (res: any) => {
      this.spinner.hide();
      this.toastr.success(res.message || 'Updated Successfully', 'Success');
      
      // Data refresh karein ya back jayein
      // this.goBack();
    },
    error: (err: any) => {
      this.spinner.hide();
      console.error('Save Error:', err);
      // Agar API se specific validation message (Status 400) aata hai
      const errorMsg = err.error?.message || 'Failed to update tender details';
      this.toastr.error(errorMsg, 'Error');
    }
  });
}



}
