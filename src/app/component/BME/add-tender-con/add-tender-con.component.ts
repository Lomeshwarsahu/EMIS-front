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
import { HodConversationDTO, TenderLinkedItemDto } from 'src/app/Model/models';
import Swal from 'sweetalert2';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-add-tender-con',
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
  templateUrl: './add-tender-con.component.html',
  styleUrl: './add-tender-con.component.css',
    animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', opacity: 0, padding: '0' })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('expanded <=> collapsed', animate('250ms ease-in-out')),
    ])
  ],
})
export class AddTenderConComponent {
tenderNo: string | null = null;
  CoverStatusList:any;
  FacilityList:any;
 TenderDetails: any = {};
 itemsDtails:any;
 item_id:any;
 Convid:any;
 HodReplyDTO: any[] = [];
  expandedElement: any | null = null;
  dispatchData: HodConversationDTO[] = [];
   dataSource!: MatTableDataSource<HodConversationDTO>;
   @ViewChild('paginator') paginator!: MatPaginator;
   @ViewChild('sort') sort!: MatSort;
//   displayedColumns: string[] = [
//   'sno', 
//   'SCHEMENAME', 
//   'FACILITYTYPECODE', 
//   'LetterNo', 
//   'LetterDate',
//   'SendDate',
//   'Remarks',
//   'Download',
//   'Action',
//   'Reply',
// ];
displayedColumns: string[] = ['sno', 'SCHEMENAME', 'FACILITYTYPECODE', 'LetterNo', 'LetterDate', 'SendDate', 'Remarks', 'Download', 'Action', 'Reply'];
 constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,private route: ActivatedRoute,private location: Location,
  ) {
   this.dataSource = new MatTableDataSource<HodConversationDTO>([]);
  }
    ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tenderNo = params['tender_no'];
      console.log('Tender Number from URL:', this.tenderNo);
      
      if (this.tenderNo) {
        this.fetchTenderDetails(this.tenderNo);
      }
    });
    this.GetFacilityList();
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
    GetFacilityList() {
      // https://localhost:7036/api/BME/GetFacilityList
    this.api.get('BME/GetFacilityList').subscribe({
      next: (res: any) => {
        this.FacilityList = res;
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


fetchTenderDetails(tenderId: any) {
    this.spinner.show();
    this.api.get(`BME/GetTenderSummary/${tenderId}`).subscribe({
        next: (res: any) => {
            this.spinner.hide();
            // Array handle karein aur first object lein
            const data = Array.isArray(res) ? res[0] : res;
            
            if (data) {
                // Direct mapping kyunki keys JSON se match honi chahiye
                this.TenderDetails = data;
                console.log('Successfully Bound Data:', this.TenderDetails);
            }
        },
        error: (err: any) => {
            this.spinner.hide();
            console.error('API Error:', err);
        }
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
  // https://localhost:7036/api/BME/GetHodConversations/680
    try {
      this.spinner.show();
      this.api.get(`BME/GetHodConversations/${this.tenderNo}`).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: HodConversationDTO, index: number) => ({
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

levyData: any = {
  CancellationDays: 0,
  CancellationPercentage: 0,
  PenaltyPercent120: 0,
  PenaltyPercent: 0,
  PenaltyType: 'D',        // 'd' for Days, 'w' for Weeks
  ReleaseType: 'M',        // 'm' for Month, 'w' for Week, 'n' for NR
  PerformanceReq: 'Y',     // 'y' for Yes, 'n' for No, 'a' for NA
  ReleaseValue: 0,
  LogoCharges: 0,
  LogoChargesUpper: 0,
  LeavyEntryDt: '',        
  PerfEntryDt: ''          
};


  reset() {
     this.levyData = {
     CancellationDays: '',
  CancellationPercentage: '',
  PenaltyPercent120: '',
  PenaltyPercent: '',
  PenaltyType: 'D',        // 'd' for Days, 'w' for Weeks
  ReleaseType: 'M',        // 'm' for Month, 'w' for Week, 'n' for NR
  PerformanceReq: 'Y',     // 'y' for Yes, 'n' for No, 'a' for NA
  ReleaseValue: '',
  LogoCharges: '',
  LogoChargesUpper: '',
  LeavyEntryDt: '',        
  PerfEntryDt: '' 
    };
  }



hodData: any = {
  FacilityAutId: null,
  SendDate: '',
  LetterDate: '',
  LetterNo: '',
  Remarks: '',
  SelectedFile: null
};

onFileSelected(event: any) {
  if (event.target.files.length > 0) {
    this.hodData.SelectedFile = event.target.files[0];
  }
}

onSubmit(form: NgForm) {
  if (form.valid && this.hodData.SelectedFile) {
    this.spinner.show();
    const formData = new FormData();
  // formData.append('TenderId', this.tenderNo ?? '');
  formData.append('TenderId', String(this.tenderNo));
    formData.append('HodId', this.hodData.FacilityAutId);
    formData.append('SendDate', this.hodData.SendDate);
    formData.append('LetterNo', this.hodData.LetterNo);
    formData.append('LetterDate', this.hodData.LetterDate);
    formData.append('Remarks', this.hodData.Remarks);
    formData.append('File', this.hodData.SelectedFile);

    this.api.post1('BME/SaveHodConversation', formData).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.GetLinkedItems();
        Swal.fire('Success', 'Data saved successfully!', 'success');
        form.reset();
      },
      error: (err) => {
        this.spinner.hide();
        Swal.fire('Error', err.error?.message || 'Save failed', 'error');
      }
    });
  } else {
    this.toastr.warning("Please fill all fields and select a PDF file.");
  }
}
readonly baseUrl = 'https://localhost:7036/'; 

downloadFileDirectly(filePath: string, fileName: string) {
    if (!filePath) {
        console.error("File path is missing!");
        return;
    }

    const relativePath = filePath.replace('~/', '');
    const fullUrl = this.baseUrl + relativePath;

    fetch(fullUrl)
        .then(response => {
            if (!response.ok) throw new Error('File download failed');
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            a.download = fileName || filePath.split('/').pop() || 'document.pdf';
            
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(err => {
            console.error("Download error:", err);
            window.open(fullUrl, '_blank');
        });
}

viewPdf(convId: number) {
    const url = `https://localhost:7036/api/FileViewer/ViewPdf/${convId}`;
    window.open(url, '_blank');
}
openReplyModal(convId:any){
this.Convid=convId;
}
replyData: any = {
  LetterNo: '',
  LetterDt: '',
  RecvDate: '',
  Remarks: ''
}
selectedReplyFile: File | null = null;

// File change event
onReplyFileSelected(event: any) {
  if (event.target.files.length > 0) {
    this.selectedReplyFile = event.target.files[0];
  }
}

submitReply(form: NgForm) {
  // debugger;
  if (form.valid && this.selectedReplyFile) {
    const formData = new FormData();
    formData.append('Convid', this.Convid.toString()); 
    formData.append('LetterNo', this.replyData.LetterNo);
    formData.append('LetterDt', this.replyData.LetterDt); // yyyy-MM-dd format
    formData.append('RecvDate', this.replyData.RecvDate); // yyyy-MM-dd format
    formData.append('Remarks', this.replyData.Remarks);
    formData.append('File', this.selectedReplyFile);

    this.api.post1('BME/SaveHodReply', formData).subscribe({
      next: (res: any) => {
        alert(res.message);
        form.reset();
        this.selectedReplyFile = null;
      },
      error: (err) => {
        console.error(err);
        alert("Error: " + err.error?.message);
      }
    });
  } else {
    alert("Please fill all required fields and select a file.");
  }
}
GetHodReplyList(convId: any) {
    this.HodReplyDTO = []; // Loading state clear
    this.spinner.show();
    this.api.get(`BME/GetHodReplyList/${convId}`).subscribe({
      next: (res: any) => {
        this.HodReplyDTO = res.map((d: any, i: number) => ({ ...d, sno: i + 1 }));
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
      }
    });
  }
GetHodReplyList1(convId: any) {
  this.spinner.show();
// https://localhost:7036/api/BME/GetHodReplyList/3
  this.api.get(`BME/GetHodReplyList/${convId}`).subscribe({
      next: (res: any) => {
        this.HodReplyDTO = res.map((d: any, i: number) => ({
          ...d,
          sno: i + 1,
        }));
        this.spinner.hide();
      },
      error: () => {
        this.HodReplyDTO = [];
        this.spinner.hide();
      }
    });
}
isExpansionDetailRow = (i: number, row: any) => row.detailRow === true;
toggleDetails(element: any) {
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement) {
      this.GetHodReplyList(element.Convid);
    }
  }
toggleDetails1(row: any, Convid: any) {
  if (this.expandedElement === row) {
    this.expandedElement = null;

    this.dataSource.data = this.dataSource.data.filter(r => !r.detailRow);
    return;
  }

  this.expandedElement = row;

  const updatedRows: any[] = [];

  this.dataSource.data.forEach(r => {
    updatedRows.push(r);

    if (r === row) {
      updatedRows.push({
        detailRow: true,
        data: row
      });
    }
  });

  this.dataSource.data = updatedRows;

  this.GetHodReplyList(Convid);
}

}