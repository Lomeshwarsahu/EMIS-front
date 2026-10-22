import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { CollapseModule } from 'src/app/collapse';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-opening-balance',
  standalone: true,
  imports: [
    NgSelectModule, CommonModule, FormsModule, CollapseModule, NgbCollapseModule,
    ReactiveFormsModule, MatTabsModule, MaterialModule, MatSortModule, 
    MatPaginatorModule, MatTableModule, MatDialogModule, MatSelectModule, 
    MatOptionModule, MatTableExporterModule,
  ],
  templateUrl: './opening-balance.component.html',
  styleUrl: './opening-balance.component.css',
})
export class OpeningBalanceComponent implements OnInit {

  directorateList: any[] = [];
  instituteList: any[] = [];
  mappedFundsList: any[] = [];
  bankAccountsList: any[] = [];
  
  subHeadFormModel = { MHID: null, SHID: null, SubHead_Eng: '', SubHead_Hindi: '', IsActive: 'Active' };
  Mainfundhead: any[] = [];
  subheadfund: any[] = [];
  
  displayedColumns: string[] = ['sno', 'UserName', 'FacName', 'BudgetName', 'RecDate', 'Amount', 'Remarks', 'RecType', 'ActualAmountReceived','download', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  labelAmountCaption: string = 'Balance Amount/Fund Received Amount';
  labelDateCaption: string = 'Opening Balance Date/Fund Date';
  labelFileUploadCaption: string = 'Upload Letter/Receipt/Bank Statement (In PDF)';

  formModel: any = {
    directorateId: null, facilityId: null, budgetId: null, bankId: null,
    isOp: false, fundType: 'A', amount: null, receivedDate: '', remarks: '', fileBase64: '', utrNo: ''
  };

  isDateInputLocked: boolean = false;

  constructor(
    private spinner: NgxSpinnerService, private api: ApiService, public toastr: ToastrService,
    private fb: FormBuilder, private cdr: ChangeDetectorRef, private router: Router, private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDirectoratesDropdown();
    this.loadBankAccountsDropdown();
    this.loadReceiptRecordsGrid(0);
    this.loadMainfund();
    this.onFundTypeChange(); // Page load par default condition
  }

  // **RADIO BUTTON CHANGE LOGIC**
  onFundTypeChange() {
    if (this.formModel.fundType === 'A') {
      this.formModel.receivedDate = '2026-04-01';
      this.labelAmountCaption = 'Balance Amount/Fund Received Amount';
      this.labelDateCaption = 'Opening Balance Date/Fund Date';
      this.isDateInputLocked = true;
    } else {
      this.formModel.receivedDate = ''; 
      this.isDateInputLocked = false;
      this.labelAmountCaption = 'Received Amount';
      this.labelDateCaption = 'Received Date';
    }
  }

  loadDirectoratesDropdown() {
    this.api.get('BME/GetFacilityList').subscribe({
      next: (res:any) => this.directorateList = res || [],
      error: (err) => console.error(err)
    });
  }

  loadBankAccountsDropdown() {
    this.api.get('GMFI/GetCgmscBankAccounts').subscribe({
      next: (res:any) => this.bankAccountsList = res || [],
      error: (err) => console.error(err)
    });
  }

  onDirectorateSelectedChange() {
    this.instituteList = [];
    this.mappedFundsList = [];
    this.formModel.facilityId = null;
    this.formModel.budgetId = null;

    if (!this.formModel.directorateId) return;

    if (Number(this.formModel.directorateId) === 12) {
      this.api.get('GMFI/GetAuthorityUsersDropdown').subscribe({
        next: (res:any) => this.instituteList = res || [],
        error: (err) => console.error(err)
      });
    } else {
      this.loadMappedFundsDropdown(this.formModel.directorateId, 0);
    }
    this.loadReceiptRecordsGrid(this.formModel.directorateId);
  }

  onInstituteSelectedChange() {
    this.mappedFundsList = [];
    this.formModel.budgetId = null;
    if (this.formModel.facilityId) {
      this.loadMappedFundsDropdown(this.formModel.directorateId, this.formModel.facilityId);
    }
  }

  loadMappedFundsDropdown(dirId: number, facId: number) {
    this.api.get(`GMFI/GetFundsToMap/${dirId}`).subscribe({
      next: (res:any) => {
        this.mappedFundsList = (res || []).filter((x: any) => x.Cnt === 1);
      },
      error: (err) => console.error(err)
    });
  }

  onFundHeadSelectedChange() {
 
  }

  // **NEW LOGIC: MHID Change hone par call hoga**
  onMainFundHeadSelectedChange() {
    // debugger;
    this.subHeadFormModel.SHID = null; 
    this.subheadfund = []; 
    if (!this.subHeadFormModel.MHID) return; 

    this.api.get(`GMFI/GetSubHeadById/${this.subHeadFormModel.MHID}`).subscribe({
      next: (res: any) => {
        this.subheadfund = Array.isArray(res) ? res : (res ? [res] : []);
        
       
        this.verifyOpeningBalance();
      },
      error: (err: any) => console.error("SubHead fetch error", err)
    });
     this.verifyOpeningBalance();
  }

  // **NEW LOGIC: SHID Change hone par call hoga**
  // onSubHeadSelectedChange() {
  //   this.verifyOpeningBalance();
  // }

  // **NEW LOGIC: COMMON FUNCTION FOR API CALL (Only for Opening Balance 'A')**
  verifyOpeningBalance() {
    // debugger;
    
    if (this.formModel.fundType !== 'A') return; 
    
    if (!this.formModel.directorateId) {
        this.toastr.warning('Please select Directorate first!', 'Warning');
        this.subHeadFormModel.MHID = null;
        return;
    }

    if (!this.subHeadFormModel.MHID) return;

    const facId = this.formModel.facilityId ? this.formModel.facilityId : 0;
    const shidParam = this.subHeadFormModel.SHID ? this.subHeadFormModel.SHID : '';

   
    const url = `GMFI/VerifyFirstTimeOpeningBalanceByHead/${this.formModel.directorateId}?mhid=${this.subHeadFormModel.MHID}&shid=${shidParam}&facilityId=${facId}`;

    this.api.get(url).subscribe({
      next: (res:any) => {
        if (res.isAlreadyInitialized) {
          console.log('res=',res);
            this.formModel.isOp = true;
          // this.toastr.warning('Opening balance is already added for this Head!', 'Warning');
          
          // Clear selections
          this.subHeadFormModel.MHID = null; 
          this.subHeadFormModel.SHID = null; 
          this.subheadfund = []; 
        
        } else {
          this.formModel.isOp = false;
          this.formModel.fundType = 'A';
          this.onFundTypeChange(); 
        }
      },
      error: (err) => console.error(err)
    });
  }

  handleFileInputEvent(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        Swal.fire('Format Mismatch', 'Please upload PDF files only!', 'error');
        event.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const rawString = reader.result as string;
        this.formModel.fileBase64 = rawString.split(',')[1];
      };
    }
  }

  loadReceiptRecordsGrid(dirId: number) {
    this.api.get(`GMFI/GetFundReceiptsGridSummary/${dirId}`).subscribe({
      next: (res:any) => {
        this.dataSource.data = res || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error(err)
    });
  }

  loadMainfund() {
    this.api.get(`GMFI/GetMainHeads`).subscribe({
      next: (res: any) => this.Mainfundhead = res,
      error: (err) => console.error(err)
    });
  }

  // **SUBMIT LOGIC & VALIDATIONS**
  onSubmitFundReceipt(form: any) {
    // debugger
    // Received Fund ('Y') - Check > 01-04-2026
    if (this.formModel.fundType === 'Y') {
        if (form.invalid) {
            Swal.fire('Warning', 'Please fill all mandatory fields.', 'warning');
            return;
        }
        if (!this.formModel.receivedDate) {
            Swal.fire('Warning', 'Please select a fund date.', 'warning');
            return;
        }
        const parsedTargetDate = new Date(this.formModel.receivedDate);
        const baseDate = new Date('2026-04-01');
        
        if (parsedTargetDate <= baseDate) {
            Swal.fire('Warning', 'Received Fund date must be strictly greater than 01-04-2026.', 'warning');
            return;
        }
    } 
    // Opening Fund ('A') - Force Date Fix
    else if (this.formModel.fundType === 'A') {
        this.formModel.receivedDate = '2026-04-01'; 
    }

    this.spinner.show();

    // API Payload
    const payload = {
      BudgetId: this.formModel.budgetId ? Number(this.formModel.budgetId) : null,
      Amount: this.formModel.amount ? Number(this.formModel.amount) : null,
      ReceivedDate: this.formModel.receivedDate || null,
      DirectorateId: this.formModel.directorateId ? Number(this.formModel.directorateId) : null,
      FacilityId: this.formModel.facilityId ? Number(this.formModel.facilityId) : null,
      BankId: this.formModel.bankId ? Number(this.formModel.bankId) : null, 
      Remarks: this.formModel.remarks || '',
      IsOp: this.formModel.fundType === 'A' ? 'Y' : (this.formModel.fundType === 'U' ? 'U' : 'N'),
      IsProvisional: null, 
      FundType: this.formModel.fundType, 
      FileBase64: this.formModel.fileBase64 || '',
      MHID: this.subHeadFormModel.MHID ? Number(this.subHeadFormModel.MHID) : null,
      SHID: this.subHeadFormModel.SHID ? Number(this.subHeadFormModel.SHID) : null,
      UTRNO: this.formModel.utrNo || '' 
    };

    this.api.post1('GMFI/SaveOpeningBalanceRecord', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        Swal.fire('Saved!', res.message || 'Saved Successfully', 'success');
        this.onCancelClearForm(form);
        this.loadReceiptRecordsGrid(this.formModel.directorateId ? this.formModel.directorateId : 0);
      },
      error: (err: any) => {
        this.spinner.hide();
        Swal.fire('Error', err.error?.message || 'Failed to save the record. Please try again.', 'error');
      }
    });
  }

  onExecuteActionLink(rowElement: any) {
    if (rowElement.Pentry === 'Provisional' && rowElement.ActualAmountReceived !== rowElement.Amount) {
      this.toastr.info(`Redirecting to dynamic allocations: BudgetDetailsProvisional for BGID: ${rowElement.Bgid}`);
      this.router.navigate(['/BudgetDetailsProvisional'], { queryParams: { BGID: rowElement.Bgid } });
    }
  }


  onCancelClearForm(form: any) {
    form.resetForm();
    this.formModel = { directorateId: null, facilityId: null, budgetId: null, bankId: null, isOp: false, fundType: 'A', amount: null, receivedDate: '', remarks: '', fileBase64: '', utrNo: '' };
    this.subHeadFormModel = { MHID: null, SHID: null, SubHead_Eng: '', SubHead_Hindi: '', IsActive: 'Active' };
    this.onFundTypeChange(); 
    this.isDateInputLocked = false;
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // onDownloadFileStream(bgid: number) {
  //   this.toastr.success(`Initiating document binary bundle stream download pipeline for identity ID: ${bgid}`);
  // }
onDownloadFileStream(filePath: string) {
    if (!filePath || filePath.trim() === '') {
      this.toastr.warning('Document not found for this record!', 'Warning');
      return;
    }

    // 1. अपनी C# API का बेस URL यहाँ डालें (Live सर्वर पर इसे लाइव डोमेन से बदल दें)
    const apiBaseUrl = 'https://localhost:7036'; 

    // 2. पूरा URL बनाना (e.g., https://localhost:7036/Uploads/FundReceipts/FileName.pdf)
    // अगर filePath में पहले से '/' नहीं है, तो उसे जोड़ लें
    const finalPath = filePath.startsWith('/') ? filePath : '/' + filePath;
    const fullUrl = apiBaseUrl + finalPath;

    // 3. PDF को नए टैब में ओपन करना (ब्राउज़र अपने आप PDF व्यूअर में दिखा देगा)
    window.open(fullUrl, '_blank');
  }
  // PDF Download Logic
  // onDownloadFileStream(filePath: string) {
  //   if (!filePath || filePath.trim() === '') {
  //     this.toastr.warning('Document not found for this record!', 'Warning');
  //     return;
  //   }

  //   // ध्यान दें: अगर आपकी C# API किसी दूसरे पोर्ट पर चल रही है (जैसे https://localhost:7036)
  //   // तो आपको यहाँ API का Base URL लगाना पड़ेगा। 
  //   // अगर FilePath में पहले से पूरा URL आ रहा है, तो सीधे window.open(filePath) कर सकते हैं।
    
  //   // उदाहरण (अपने API URL के हिसाब से बदलें):
  //   const apiBaseUrl = 'https://localhost:7036'; 
  //   const fullUrl = apiBaseUrl + filePath;

  //   // यह PDF को नए टैब में ओपन कर देगा
  //   window.open(fullUrl, '_blank');
  // }
}