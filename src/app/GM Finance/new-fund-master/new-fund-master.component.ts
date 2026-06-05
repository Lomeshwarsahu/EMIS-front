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
  selector: 'app-new-fund-master',
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
  templateUrl: './new-fund-master.component.html',
  styleUrl: './new-fund-master.component.css',
})
export class NewFundMasterComponent {
// Data binding source lists arrays
  fundsMasterList: any[] = [];
  filteredFundsList: any[] = [];

  // Input text container reactive state model string
  newFundNameString: string = '';

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
    this.fetchRegisteredFundsGrid();
  }
fetchRegisteredFundsGrid() {
  this.spinner.show();
  
  this.api.get('GMFI/GetFundsList').subscribe({
    next: (res: any) => {
      this.fundsMasterList = res || [];
      this.filteredFundsList = [...this.fundsMasterList];
      this.spinner.hide();
    },
    error: (err) => {
      this.spinner.hide();
      console.error('Failed to sync master funds datasets logs:', err);
    }
  });
}


  onSaveNewFund(form: any) {
    if (form.invalid) {
      this.toastr.warning('Please input a valid fund descriptor name before execution.');
      return;
    }

    this.spinner.show();
    const payload = {
      Budgetname: this.newFundNameString.trim()
    };

    this.api.post1('GMFI/AddNewFund', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        
        // SweetAlert2 beautiful success notification implementation loop
        Swal.fire('Success!', res.message || 'New Fund Added Successfully', 'success');
        
        form.resetForm(); // Empty form field variables context
        this.fetchRegisteredFundsGrid(); // Trigger incremental matrix refresh
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Save Exception Log:', err);
        
        // Display validation duplicate messages dynamically caught by core backend checks
        Swal.fire('Validation Failed', err.error?.message || 'Something collapsed during processing.', 'error');
      }
    });
  }

  // Frontend Live Local Grid Searching Filter Engine
  applyInstantSearchFilter(event: Event) {
    const searchVal = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
    if (!searchVal) {
      this.filteredFundsList = [...this.fundsMasterList];
      return;
    }

    this.filteredFundsList = this.fundsMasterList.filter((fund: any) => {
      return fund.budgetname?.toLowerCase().includes(searchVal);
    });
  }
}