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
import Swal from 'sweetalert2'; 
@Component({
  selector: 'app-supplier-bank-accounts',
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
  templateUrl: './supplier-bank-accounts.component.html',
  styleUrl: './supplier-bank-accounts.component.css',
})
export class SupplierBankAccountsComponent {
receivedSupplierName: string = '';
  receivedSupplierId: number = 0;

  activeTab: number = 1;
  isEditMode: boolean = false;
  supplierId!: number;
  supplierName: string = '';
  supplierCode: string = '';

  // Grid system fields definition matching DTO response schema
  displayedColumns: string[] = ['sno', 'AccountNo', 'AccountName',
     'BankName', 'Branch', 'IfscCode', 'DefaultAccText', 'Remarks', 'actions'];
  dataSource = new MatTableDataSource<any>([]);






  mappingForm!: FormGroup;
  showForm: boolean = true;
  showtable: boolean = true;
TenderItem:any;
Taxlist:any;
  yearlist: any[] = [];
  Tenderlist: any[] = [];
  Supplierrlist: any[] = [];
  yearId: any;
  statusvalue: any;
  suppId: any;
  Tenderno:any;
  dispatchData: any[] = [];
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  selectedItems: number[] = [];
  status = [
    { value: 0, name: 'Domestic' },
    // { value: 'C', name: 'Completed' },
    { value: 'I', name: 'Imported' },
  ];

itemData: any = {
  AwardOfContractId: null, 
  ItemId: null,
  NoOfDaysForSupply: null,
  BasicRate: null,
  TaxTypeId: null,
  Percentage: null,
  SingleUnitPrice: null,
  LicenceNumber: '',
  Make: '',
  Model: '',
  DomesticImported: '0' 
};

  contractData: any = {
  FinancialYearId: null,
  TenderId: null,
  SupplierId: null,
  ContractDate: ''
};
year:any;
  tenderId: any;
  awardOfContractId: any;
  contractNumber: any;
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,private route: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }
switchTab(tabNumber: number) {
  this.activeTab = tabNumber;
}
  ngOnInit() {
    // this.route.queryParams.subscribe({
    //   next: (params) => {
    //     this.receivedSupplierName = params['supplierName'] || '';
    //     this.receivedSupplierId = params['id'] ? Number(params['id']) : 0;

    //     console.log('Successfully fetched routing query strings:', {
    //       name: this.receivedSupplierName,
    //       id: this.receivedSupplierId
    //     });

    //     // if (this.receivedSupplierId > 0) {
    //     //   this.loadBankAccountsList(this.receivedSupplierId);
    //     // }
    //   },
    //   error: (err) => {
    //     console.error('Error reading route queries context parameters:', err);
    //   }
    // });
 // Reading URL query string index from previous master table route context links
    this.route.queryParams.subscribe(params => {
      this.supplierId = params['id'] ? Number(params['id']) : 0;
      if (this.supplierId > 0) {
        this.loadSupplierHeader();
        this.loadBankAccountsGrid();
      } else {
        this.toastr.error('Invalid Parameters reference index routing contexts.');
        this.router.navigate(['/Suppliers']);
      }
    });


  }
  


  // Strongly mapped reactive structure replacing itemData placeholder variables
  accountFormModel: any = {
    bankAccountId: 0,
    accountNo: '',
    accountName: '',
    bankName: '',
    branch: '',
    ifscCode: '',
    micrCode: '',
    defaultAcc: false,
    remarks: ''
  };


  loadSupplierHeader() {
    this.api.get(`GMFI/GetSupplierHeaderInfo/${this.supplierId}`).subscribe({
      next: (res: any) => {
        this.supplierName = res.supplierName;
        this.supplierCode = res.supplierCode;
      }
    });
  }

  loadBankAccountsGrid() {
    this.spinner.show();
    this.api.get(`GMFI/GetSupplierBankAccounts/${this.supplierId}`).subscribe({
      next: (res: any) => {
        this.dataSource.data = res || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
      },
      error: () => this.spinner.hide()
    });
  }

  onSubmitItem(form: any) {
    if (form.invalid) {
      this.toastr.warning('Please enter all explicit required metadata variables.');
      return;
    }

    this.spinner.show();
    const payload = {
      BankAccountId: this.accountFormModel.bankAccountId,
      SupplierId: this.supplierId,
      AccountNo: String(this.accountFormModel.accountNo),
      AccountName: this.accountFormModel.accountName,
      BankName: this.accountFormModel.bankName,
      Branch: this.accountFormModel.branch,
      IfscCode: this.accountFormModel.ifscCode,
      MicrCode: this.accountFormModel.micrCode,
      DefaultAcc: this.accountFormModel.defaultAcc ? 1 : 0,
      Remarks: this.accountFormModel.remarks
    };

    this.api.post1('GMFI/SaveOrUpdateBankAccount', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Saved successfully.');
        this.onResetForm(form);
        this.loadBankAccountsGrid();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Transaction submission collapsed.');
      }
    });
  }

  editRowElement(row: any) {
    this.isEditMode = true;
    this.accountFormModel = {
      bankAccountId: row.BankAccountId,
      accountNo: row.AccountNo,
      accountName: row.AccountName,
      bankName: row.BankName,
      branch: row.Branch,
      ifscCode: row.IfscCode,
      micrCode: row.MicrCode,
      defaultAcc: row.DefaultAcc === 1,
      remarks: row.Remarks
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // deleteRowElement(bankAccountId: number) {
  //   if (confirm('Are you sure you want to delete this bank account?')) {
  //     this.spinner.show();
  //     this.api.delete(`GMFI/DeleteBankAccount/${bankAccountId}`).subscribe({
  //       next: (res: any) => {
  //         this.toastr.success(res.message || 'Deleted successfully.');
  //         this.loadBankAccountsGrid();
  //       },
  //       error: (err:any) => {
  //         this.spinner.hide();
  //         this.toastr.error(err.error?.message || 'Failed to complete deletion process.');
  //       }
  //     });
  //   }
  // }

deleteRowElement(bankAccountId: number) {
  // SweetAlert2 Confirmation Dialog Trigger Matrix
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to delete this bank account? This action cannot be reverted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',     // Danger theme red color code
    cancelButtonColor: '#3085d6',      // Primary active info blue color code
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel'
  }).then((result) => {
    
    // Executes only if the user clicks the "Yes" (Confirm) action trigger
    if (result.isConfirmed) {
      this.spinner.show();

      this.api.delete(`GMFI/DeleteBankAccount/${bankAccountId}`).subscribe({
        next: (res: any) => {
          this.spinner.hide(); // Spinner ko safe side hide karein toggle execution loop me
          
          // Premium SweetAlert Success notification replacement for toastr
          Swal.fire(
            'Deleted!',
            res.message || 'Bank account has been deleted successfully.',
            'success'
          );
          
          this.loadBankAccountsGrid(); // Sync metrics grids layout views cache data structures
        },
        error: (err: any) => {
          console.log('error=',err);
          this.spinner.hide();
          
          // Premium SweetAlert Error notification replacement for toastr
          Swal.fire(
            'Error!',
            err.error?.message || 'Failed to complete deletion process inside core data streams.',
            'error'
          );
        }
      });
    }
  });
}
  onResetForm(form: any) {
    form.resetForm();
    this.isEditMode = false;
    this.accountFormModel = { bankAccountId: 0, accountNo: '', accountName: '', bankName: '', branch: '', ifscCode: '', micrCode: '', defaultAcc: false, remarks: '' };
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}