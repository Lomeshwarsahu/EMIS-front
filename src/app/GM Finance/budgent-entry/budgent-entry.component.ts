import { CommonModule } from '@angular/common';
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
import Swal from 'sweetalert2'

@Component({
  selector: 'app-budgent-entry',
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
  templateUrl: './budgent-entry.component.html',
  styleUrl: './budgent-entry.component.css',
})
export class BudgentEntryComponent {

  // Selection dropdown matrices caches arrays
  directorateList: any[] = [];
  instituteList: any[] = [];
  mappedFundsList: any[] = [];
  bankAccountsList: any[] = [];

  // Table grid mappings parameters
  displayedColumns: string[] = ['sno', 'Directorate', 'College', 'Fund', 'RecDate', 'Amount', 'Remark', 'BalanceType', 'ActualAmount', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  // Dynamic variable labels properties (Emulating: lblamt.Text updates)
  labelAmountCaption: string = 'Received Fund (Rs)';
  labelDateCaption: string = 'Fund Received Date';
  labelFileUploadCaption: string = 'Upload Letter/Acknowledgement/Mail Copy (In PDF)';

  // Complex input model configuration state reference object
  formModel: any = {
    directorateId: null,
    facilityId: null,
    budgetId: null,
    bankId: null,
    isOp: false,
    fundType: 'A', // Default: Actual Fund
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
    private router: Router,private route: ActivatedRoute
  ) {
    // this.dataSource = new MatTableDataSource<any>([]);
  }


  ngOnInit(): void {
    this.loadDirectoratesDropdown();
    this.loadBankAccountsDropdown();
    this.loadReceiptRecordsGrid(0); // Pass 0 to retrieve total master listings un-filtered
  }
  // loadDirectoratesDropdown() {
  //   this.api.get('BME/GetFacilityList').subscribe({
  //     next: (res:any) => this.directorateList = res || [],
  //     error: (err) => console.error(err)
  //   });
  // }
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
  // loadDirectoratesDropdown() {
  //   this.api.get('FundMap/GetDirectorates').subscribe(res => this.directorateList = res || []);
  // }

  // loadBankAccountsDropdown() {
  //   this.api.get('FundReceipt/GetCgmscBankAccounts').subscribe(res => this.bankAccountsList = res || []);
  // }

  onDirectorateSelectedChange() {
    debugger;
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
    debugger
    this.mappedFundsList = [];
    this.formModel.budgetId = null;
    if (this.formModel.facilityId) {
      this.loadMappedFundsDropdown(this.formModel.directorateId, this.formModel.facilityId);
    }
  }

  loadMappedFundsDropdown(dirId: number, facId: number) {
debugger
  this.api.get(`GMFI/GetFundsToMap/${dirId}`).subscribe({
      next: (res:any) =>
        
           this.mappedFundsList = (res || []).filter((x: any) => x.Cnt === 1),
        
        // this.instituteList = res || [],
      error: (err) => console.error(err)
    });



    // this.api.get<any>(`FundMap/GetFundsToMap/${dirId}`).subscribe(res => {
    //   // Filter strictly only pre-mapped heads available in current sector domain
    //   this.mappedFundsList = (res || []).filter((x: any) => x.cnt === 1);
    // });
  }

  // Triggered on Mapped Fund Selected Index Changed Event (Emulating CheckFirstTimeOP method logic flow)
  onFundHeadSelectedChange() {
    debugger;
    if (!this.formModel.budgetId) return;

    const facId = this.formModel.facilityId ? this.formModel.facilityId : 0;
    const url = `GMFI/VerifyFirstTimeOpeningBalance?budgetId=${this.formModel.budgetId}&directorateId=${this.formModel.directorateId}&facilityId=${facId}`;
  this.api.get(url).subscribe({
      next: (res:any) =>{
 if (res.isAlreadyInitialized) {
        // Regular continuous fund transaction state rules
        this.labelAmountCaption = 'Received Fund (Rs)';
        this.labelDateCaption = 'Fund Received Date';
        this.labelFileUploadCaption = 'Upload Letter/Acknowledgement/Mail Copy (In PDF)';
        this.formModel.isOp = false;
        this.isDateInputLocked = false;
        this.formModel.receivedDate = '';
      } else {
        // Strict mandatory entry rules condition for Opening Balance
        this.labelAmountCaption = 'Opening Balance Fund (Rs)';
        this.labelDateCaption = 'Opening Balance Date';
        this.labelFileUploadCaption = 'Upload Signed Copy (In PDF)';
        this.formModel.isOp = true;
        this.formModel.receivedDate = '2022-04-01'; // Standard machine notation format matching 01-04-2022
        this.isDateInputLocked = true;
        this.formModel.fundType = 'A'; // Force type constraint lock value to Actual
      }
      },
       error: (err) => console.error(err)
    });
  }

  // Captures and serializes File Upload Selection Object cleanly to Base64 String format
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
        this.formModel.fileBase64 = rawString.split(',')[1]; // Extracts core data string segment safely
      };
    }
  }

  loadReceiptRecordsGrid(dirId: number) {

  this.api.get(`GMFI/GetFundReceiptsGridSummary/${dirId}`).subscribe({
      next: (res:any) =>{
      this.dataSource.data = res || [];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      },
           
        
        // this.instituteList = res || [],
      error: (err) => console.error(err)
    });



    // this.api.get<any>(`FundReceipt/GetFundReceiptsGridSummary/${dirId}`).subscribe(res => {
    //   this.dataSource.data = res || [];
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
  }

  onSubmitFundReceipt(form: any) {
    if (form.invalid) return;

    // Boundary Date Verification Logic
    const parsedTargetDate = new Date(this.formModel.receivedDate);
    const minDateConstraint = new Date('2022-04-01');
    const todayDateTime = new Date();

    if (parsedTargetDate > todayDateTime) {
      Swal.fire('Date Rule Overlap', 'You cannot select a date greater than today.', 'warning');
      return;
    }
    if (parsedTargetDate < minDateConstraint) {
      Swal.fire('Date Rule Overlap', 'You cannot select a date less than 01/04/2022.', 'warning');
      return;
    }

    this.spinner.show();
    const payload = {
      BudgetId: Number(this.formModel.budgetId),
      Amount: Number(this.formModel.amount),
      ReceivedDate: this.formModel.receivedDate,
      DirectorateId: Number(this.formModel.directorateId),
      FacilityId: this.formModel.facilityId ? Number(this.formModel.facilityId) : 0,
      BankId: Number(this.formModel.bankId),
      Remarks: this.formModel.remarks,
      IsOp: this.formModel.isOp ? 'Y' : 'N',
      IsProvisional: this.formModel.fundType === 'Y' ? 'Y' : 'N',
      FileBase64: this.formModel.fileBase64
    };

    this.api.post1('GMFI/SaveFundReceiptRecord', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        Swal.fire('Saved!', res.message || 'Saved Successfully', 'success');
        this.onCancelClearForm(form);
        this.loadReceiptRecordsGrid(this.formModel.directorateId ? this.formModel.directorateId : 0);
      },
      error: (err) => {
        this.spinner.hide();
        Swal.fire('Error', err.error?.message || 'Submission process collapsed.', 'error');
      }
    });
  }

  onExecuteActionLink(rowElement: any) {
    // Dynamic conditional logic evaluated from GVDetail_RowDataBound rules row parsing
    if (rowElement.pentry === 'Provisional' && rowElement.actualAmountReceived !== rowElement.amount) {
      this.toastr.info(`Redirecting to dynamic allocations: BudgetDetailsProvisional for BGID: ${rowElement.bgid}`);
      // this.router.navigate(['/BudgetDetailsProvisional'], { queryParams: { BGID: rowElement.bgid } });
    }
  }

  onDownloadFileStream(bgid: number) {
    this.toastr.success(`Initiating document binary bundle stream download pipeline for identity ID: ${bgid}`);
  }

  onCancelClearForm(form: any) {
    form.resetForm();
    this.formModel = { directorateId: null, facilityId: null, budgetId: null, bankId: null, isOp: false, fundType: 'A', amount: null, receivedDate: '', remarks: '', fileBase64: '' };
    this.isDateInputLocked = false;
    this.labelAmountCaption = 'Received Fund (Rs)';
    this.labelDateCaption = 'Fund Received Date';
    this.labelFileUploadCaption = 'Upload Letter/Acknowledgement/Mail Copy (In PDF)';
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}