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
  selector: 'app-fund-map',
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
  templateUrl: './fund-map.component.html',
  styleUrl: './fund-map.component.css',
})
export class FundMapComponent {
// Selection Lookups Dropdowns arrays source
  directorateList: any[] = [];
  instituteList: any[] = [];

  // Data storage pipelines arrays for tables
  sourceFundsList: any[] = [];
  summaryMappedList: any[] = [];

  // Form references tracking variables state
  selectedDirectorateId: number = 0;
  selectedInstituteId: number = 0;
  summaryLabelHeaderMessage: string = '';

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
  }
// fetchRegisteredFundsGrid() {
//   this.spinner.show();
  
//   this.api.get('GMFI/GetFundsList').subscribe({
//     next: (res: any) => {
//       this.fundsMasterList = res || [];
//       this.filteredFundsList = [...this.fundsMasterList];
//       this.spinner.hide();
//     },
//     error: (err) => {
//       this.spinner.hide();
//       console.error('Failed to sync master funds datasets logs:', err);
//     }
//   });
// }
  loadDirectoratesDropdown() {
    this.api.get('BME/GetFacilityList').subscribe({
      next: (res:any) => this.directorateList = res || [],
      error: (err) => console.error(err)
    });
  }

  loadInstituteDropdown() {
    this.api.get('GMFI/GetAuthorityUsersDropdown').subscribe({
      next: (res:any) => this.instituteList = res || [],
      error: (err) => console.error(err)
    });
  }

  // Triggered on Directorate Selected Index Changed Event 
  onDirectorateChange() {
    debugger
    this.sourceFundsList = [];
    this.summaryMappedList = [];
    this.selectedInstituteId = 0;
    this.summaryLabelHeaderMessage = '';

    if (!this.selectedDirectorateId || this.selectedDirectorateId <= 0) return;

    // Trigger explicit conditional cascade lookup if Directorate ID matches 12 (DME)
    if (this.selectedDirectorateId === 12) {
      this.loadInstituteDropdown();
    }

    // Refresh layout data records tables straight away
    this.syncDataViewsTables();
    
    // Emulating: lblhead.Text assignment dynamically
    const selectedObj = this.directorateList.find(x => x.FacilityAutId === Number(this.selectedDirectorateId));
    if (selectedObj) {
      this.summaryLabelHeaderMessage = `List of Funds Mapped with ${selectedObj.FacilityAutName}`;
    }
  }
// https://localhost:7036/api/GMFI/GetMappedFundsSummary/5?dmeUserId=2212
// https://localhost:7036/api/BME/GetDMElist
  syncDataViewsTables() {
    this.spinner.show();
    
    // 1. Load Table A (Source Funds Selection Grid)
    this.api.get(`GMFI/GetFundsToMap/${this.selectedDirectorateId}`).subscribe({
      next: (res:any) => {
        // Map checked state locally inside the runtime memory model explicitly based on subquery 'cnt'
        this.sourceFundsList = (res || []).map((fund: any) => ({
          ...fund,
          isChecked: fund.cnt === 1,
          isDisabled: fund.cnt === 1 // Lock editing if already mapped (Emulating legacy GVDetail_RowDataBound)
        }));
        this.spinner.hide();
      },
      error: () => this.spinner.hide()
    });

    // 2. Load Table B (Bottom Mapped Summary Grid)
    this.api.get(`GMFI/GetMappedFundsSummary/${this.selectedDirectorateId}`).subscribe({
      next: (res:any) => this.summaryMappedList = res || []
    });
  }

  // Submit Handler executing batch transaction operations arrays
  onProcessMapping() {
    debugger;
    if (!this.selectedDirectorateId || this.selectedDirectorateId <= 0) {
      this.toastr.warning('Please Select Directorate', 'Warning');
      return;
    }

    if (this.selectedDirectorateId === 12 && (!this.selectedInstituteId || this.selectedInstituteId <= 0)) {
      this.toastr.warning('Please Select Hospital/College', 'Warning');
      return;
    }

    // Extract newly checked items by user only (Filter manually to preserve submission integrity)
    const targetBudgetIdsArray = this.sourceFundsList
      .filter(fund => fund.isChecked && !fund.isDisabled)
      .map(fund => fund.Budgetid);

    if (targetBudgetIdsArray.length === 0) {
      this.toastr.warning('You have not checked any of the newly available fund checkbox streams.', 'Warning');
      return;
    }

    this.spinner.show();
    const payload = {
      DirectorateId: Number(this.selectedDirectorateId),
      InstituteId: Number(this.selectedInstituteId),
      SelectedBudgetIds: targetBudgetIdsArray
    };

 
  //  'https://localhost:7036/api/GMFI/ExecuteBulkFundMapping' \
    this.api.post1('GMFI/ExecuteBulkFundMapping', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        Swal.fire('Mapped Successfully!', res.message || 'Processing done.', 'success');
        this.syncDataViewsTables(); // Refresh layout indexes metrics grids view state
      },
      error: (err) => {
        this.spinner.hide();
        Swal.fire('Mapping Aborted', err.error?.message || 'Duplication database exception block.', 'error');
      }
    });
  }
}

