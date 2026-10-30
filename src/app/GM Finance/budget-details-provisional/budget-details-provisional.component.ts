
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { SecureFileService } from 'src/app/service/secure-file.service';
declare var bootstrap: any;

@Component({
  selector: 'app-budget-details-provisional',
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
  templateUrl: './budget-details-provisional.component.html',
  styleUrl: './budget-details-provisional.component.css',
})
export class BudgetDetailsProvisionalComponent implements OnInit {
  // Properties mapping directly to HTML layout view bindings labels
  lblBGID!: number; // Extracted safely from query parameter context
  lblBudgetName: string = '';
  lblBudgRecevDT: string = '';
  lblACno: string = '';
  lblRecvType: string = '';
  lblBalance: number = 0;
  lblBudgID: number | null = null;

  bankAccountsList: any[] = [];
  isBankDropdownDisabled: boolean = false;

  directorateList: any[] = [];
  instituteList: any[] = [];
  mappedFundsList: any[] = [];

  displayedColumns: string[] = ['sno', 'Budgetname', 
    'Receiveddate', 'Amount', 'Acname', 'Remarks', 'download'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  
  fetchedDetails: any = null;
  labelAmountCaption: string = 'Received Fund (Rs)';
  labelDateCaption: string = 'Fund Received Date';
  labelFileUploadCaption: string = 'Upload Letter/Acknowledgement/Mail Copy (In PDF)';

  formModel: any = {
    directorateId: null,
    facilityId: null,
    budgetId: null,
    bankId: null,
    isOp: false,
    fundType: 'A',
    amount: null,
    receivedDate: '',
    remarks: '',
    fileBase64: ''
  };

  isDateInputLocked: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private secureFile: SecureFileService,
  ) {}

  ngOnInit(): void {
    this.loadBankAccountsDropdown();
    this.extractQueryParametersContext();
  }

  loadBankAccountsDropdown() {
    this.api.get('GMFI/GetCgmscBankAccounts').subscribe({
      next: (res: any) => this.bankAccountsList = res || [],
      error: (err) => console.error(err)
    });
  }

  extractQueryParametersContext() {
    this.route.queryParams.subscribe({
      next: (params) => {
        this.lblBGID = params['BGID'] ? Number(params['BGID']) : 0;
        
        if (this.lblBGID > 0) {
          this.loadProvisionalDetailsData(this.lblBGID);
          this.loadReceiptRecordsGrid(this.lblBGID);
        } else {
          this.toastr.warning('Missing valid parameters. Routing back to overview ledger.');
          this.router.navigate(['/BudgentEntry']);
        }
      },
      error: (err) => console.error('Router navigation state trace collapsed:', err)
    });
  }

  loadProvisionalDetailsData(bgid: number) {
    this.spinner.show();
    this.api.get(`GMFI/GetFundDetailsByBgid/${bgid}`).subscribe({
      next: (res: any) => {
        if (res) {
          this.lblBudgetName = res.budgetname || res.Budgetname;
          this.lblBudgRecevDT = res.receiveddate || res.Receiveddate;
          this.lblACno = res.acname || res.Acname;
          this.lblRecvType = res.pentryShow || res.PentryShow;
          this.lblBalance = res.balValue !== undefined ? res.balValue : res.BalValue;
          this.lblBudgID = res.budgetid || res.Budgetid;
          
          const backendBankId = res.bankid !== undefined ? res.bankid : res.Bankid;
          this.formModel.bankId = backendBankId ? Number(backendBankId) : null;
          this.isBankDropdownDisabled = true;
        }
        this.spinner.hide();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error('Error binding core layout metrics details records data streams.');
        console.error(err);
      }
    });
  }

  loadReceiptRecordsGrid(bgid: number) {
    this.api.get(`GMFI/GetActualEntriesByBgid/${bgid}`).subscribe({
      next: (res: any) => {
        this.dataSource.data = res || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  // ================= THE CREATED POST METHOD SUBMIT PIPELINE =================
  onSubmitFundReceipt(form: any) {
    if (form.invalid) {
      this.toastr.warning('Please rectify the field parameters verification flags before submitting.');
      return;
    }

    // Dynamic Date Rules Validations
    const inputDateValue = new Date(this.formModel.receivedDate);
    const todayDateWindow = new Date();
    const anticipatoryBaseDate = this.parseDateStringValue(this.lblBudgRecevDT);

    if (inputDateValue.getTime() > todayDateWindow.getTime()) {
      Swal.fire('Validation Error', "You can't select a date greater than today's date.", 'warning');
      return;
    }

    if (inputDateValue.getTime() < anticipatoryBaseDate.getTime()) {
      Swal.fire('Validation Error', "You can't select a date less than the parent Anticipatory Date.", 'warning');
      return;
    }

    // Strict validation constraint checking over threshold amounts limits
    if (Number(this.formModel.amount) > this.lblBalance) {
      Swal.fire('Validation Error', 'You cannot receive more than the remaining Anticipatory Balance amount.', 'error');
      return;
    }

    this.spinner.show();

    // STRICT MATCHING PAYLOAD SCHEMA OBJECT TO THE REQUIRED CURL CURL DATA -D METRICS SPECIFICATION
    const curlMappedPayloadBody = {
      Bgid: Number(this.lblBGID),
      Budgetid: Number(this.lblBudgID),
      Amount: Number(this.formModel.amount),
      CurrentBalance: Number(this.lblBalance),
      ReceivedDate: this.formModel.receivedDate, // Binded 'YYYY-MM-DD'
      AnticipatoryDate: this.convertFormattedStringToIso(this.lblBudgRecevDT), // Standardized target parse
      BankId: Number(this.formModel.bankId),
      Remarks: this.formModel.remarks || '',
      FileBase64: this.formModel.fileBase64,
      FileExtension: '.pdf'
    };

    // Target API Call to: GMFI/SaveActualFundEntry1
    this.api.post1('GMFI/SaveActualFundEntry1', curlMappedPayloadBody).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        Swal.fire('Saved Successfully!', res.message || 'Actual entry recorded.', 'success');
        
        // Reset and reload the lists views grids state properties
        form.resetForm();
        this.onCancelClearForm(form);
        this.loadProvisionalDetailsData(this.lblBGID);
        this.loadReceiptRecordsGrid(this.lblBGID);
      },
      error: (err) => {
        this.spinner.hide();
        Swal.fire('Error', err.error?.message || 'Data stream save execution aborted.', 'error');
        console.error(err);
      }
    });
  }

  parseDateStringValue(dateStr: string): Date {
    if (!dateStr) return new Date();
    const bits = dateStr.split('-');
    if (bits[0].length === 4) return new Date(dateStr);
    return new Date(Number(bits[2]), Number(bits[1]) - 1, Number(bits[0]));
  }

  convertFormattedStringToIso(dateStr: string): string {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('-');
    if (parts[0].length === 4) return dateStr;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  onCancelClearForm(form: any) {
    form.resetForm();
    this.formModel = { directorateId: null, facilityId: null, budgetId: null, bankId: this.formModel.bankId, isOp: false, fundType: 'A', amount: null, receivedDate: '', remarks: '', fileBase64: '' };
    this.isBankDropdownDisabled = true; // Retain disabled select state context
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // onDownloadFileStream(data:any){

  // }

  // 1. VIEW ACTION LINK: Opens the PDF file directly inside a new clean tab browser view layout window
onViewPdfInNewTab(abgid: number) {
  if (!abgid) return;
  this.secureFile.openInNewTab(`${environment.apiUrl}/GMFI/DownloadFundFile/${abgid}`, `FundFile_${abgid}.pdf`);
}

// 2. DOWNLOAD ACTION LINK: Forces download prompt on the client browser viewport
onForceDownloadPdf(abgid: number) {
  if (!abgid) return;
  this.secureFile.download(`${environment.apiUrl}/GMFI/DownloadFundFile/${abgid}?forceDownload=true`, `FundFile_${abgid}.pdf`);
}



// 1. VIEW PDF METHOD: Ispe click karte hi PDF bina download hue naye tab me khulegi
onViewRowDocumentInline(rowElement: any) {
  const targetAbgid = rowElement.Abgid;
  if (!targetAbgid || targetAbgid <= 0) {
    this.toastr.error('Unable to fetch reference key (ABGID) for this row item.');
    return;
  }
  this.secureFile.openInNewTab(
    `${environment.apiUrl}/GMFI/DownloadFundFile/${targetAbgid}?forceDownload=false`,
    `FundFile_${targetAbgid}.pdf`,
  );
}

// 2. HARD SAVE DOWNLOAD METHOD
onDownloadRowDocumentFile(rowElement: any) {
  const targetAbgid = rowElement.Abgid;
  if (!targetAbgid || targetAbgid <= 0) {
    this.toastr.error('Invalid reference parameters allocation.');
    return;
  }
  this.secureFile.download(
    `${environment.apiUrl}/GMFI/DownloadFundFile/${targetAbgid}?forceDownload=true`,
    `FundFile_${targetAbgid}.pdf`,
  );
}



}