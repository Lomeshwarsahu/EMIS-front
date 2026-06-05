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
  selector: 'app-cgmsc-bank-accounts',
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
  templateUrl: './cgmsc-bank-accounts.component.html',
  styleUrl: './cgmsc-bank-accounts.component.css',
})
export class CgmscBankAccountsComponent {
isEditMode: boolean = false;

  displayedColumns: string[] = ['sno', 'Accountno',
     'Accountname', 'Bankname', 'Branch', 'Ifsccode',
      'Remarks', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
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
  accountFormModel: any = {
    bankid: 0,
    accountno: '',
    accountname: '',
    bankname: '',
    branch: '',
    ifsccode: '',
    remarks: ''
  };



ngOnInit(): void {
    this.loadCorporateBankGrid();
  }
  loadCorporateBankGrid() {
    this.spinner.show();
    this.api.get(`GMFI/GetActiveAccounts`).subscribe({
      next: (res: any) => {
        this.dataSource.data = res || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
      },
      error: () => this.spinner.hide()
    });
  }

  // loadCorporateBankGrid() {
  //   this.spinner.show();
  //   this.api.get('CgmscBank/GetActiveAccounts').subscribe({
  //     next: (res: any[]) => {
  //       this.dataSource.data = res || [];
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.spinner.hide();
  //     },
  //     error: (err) => {
  //       this.spinner.hide();
  //       console.error('Grid Stream Loading Failure Error:', err);
  //     }
  //   });
  // }

  onSubmitItem(form: any) {
    if (form.invalid) {
      this.toastr.warning('Please rectify the field parameters verification flags before submitting.');
      return;
    }

    this.spinner.show();
    const payload = {
      Bankid: this.accountFormModel.bankid,
      Accountno: String(this.accountFormModel.accountno),
      Accountname: this.accountFormModel.accountname,
      Bankname: this.accountFormModel.bankname,
      Branch: this.accountFormModel.branch,
      Ifsccode: this.accountFormModel.ifsccode.trim().toUpperCase(),
      Remarks: this.accountFormModel.remarks
    };

    this.api.post1('GMFI/SaveOrUpdateAccount', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Records synchronized.');
        this.onResetForm(form);
        this.loadCorporateBankGrid();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Data stream save operational failure.');
      }
    });
  }

  editRowElement(row: any) {
    this.isEditMode = true;
    this.accountFormModel = {
      bankid: row.Bankid,
      accountno: row.Accountno,
      accountname: row.Accountname,
      bankname: row.Bankname,
      branch: row.Branch,
      ifsccode: row.Ifsccode,
      remarks: row.Remarks
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteRowElement(bankId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to deactivate/delete this CGMSC bank registry profile logs?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        
        // Target dynamic method routing over sanitized API block injection
        this.api.delete(`GMFI/SoftDeleteAccount/${bankId}`).subscribe({
          next: (res: any) => {
            this.spinner.hide();
            Swal.fire('Deleted!', res.message || 'Record successfully flagged inactive.', 'success');
            this.loadCorporateBankGrid();
          },
          error: (err) => {
            this.spinner.hide();
            Swal.fire('Error!', err.error?.message || 'Process aborted.', 'error');
          }
        });
      }
    });
  }

  onResetForm(form: any) {
    form.resetForm();
    this.isEditMode = false;
    this.accountFormModel = { bankid: 0, accountno: '', accountname: '', bankname: '', branch: '', ifsccode: '', remarks: '' };
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
