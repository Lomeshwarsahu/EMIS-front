import { CommonModule, DatePipe } from '@angular/common';
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
import {
  SupplierBankAccDetail_model,
  vendorBankDetail_model,
  UpdateBankDetails_model,
  UpdateAnnualTurnover_model,
  GetAnnualTurnoverDetail,
  BankMandateDetail,
  MassuppliergstDetails,
  GstReturnDetails,
} from 'src/app/Model/VendorRegisDetail';
import { ApiService } from 'src/app/service/api.service';
import { CollapseModule } from 'src/app/collapse';
import { NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
declare var bootstrap: any;
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  DistrictWiseDetailDTO,
  IndentConsolidationReportDto,
} from 'src/app/Model/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-termsconditions',
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
  templateUrl: './termsconditions.component.html',
  styleUrl: './termsconditions.component.css',
})
export class TermsconditionsComponent {
  termsConditionsData: any[] = [];
  displayedColumns: string[] = ['sno', 'TenderNo', 'TermCondition', 'Action'];
  dataSource = new MatTableDataSource<any>([]);
  reportRawDataList: any[] = [];
  dispatchData: IndentConsolidationReportDto[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    this.dataSource = new MatTableDataSource<IndentConsolidationReportDto>([]);
  }

  ngOnInit() {
    this.Getitemwisedetail();
  }
// https://localhost:7036/api/POCell/GetTermsConditionsList
  Getitemwisedetail() {
    try {
      this.spinner.show();
      const url = 'POCell/GetTermsConditionsList';
      this.api.get(url).subscribe(
        (res: any) => {
          this.dispatchData = res.map((item: any, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          console.log('GetConsolidationReport=:', this.dispatchData);
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

  // 2. EMULATING: btnAdd_Click -> Redirect to blank form
  onAddTermCondition() {
    this.router.navigate(['/AddAndEditTermCondition']);
  }

  // 3. EMULATING: gv_RowCommand (Edit Mode) -> Redirect with Query parameters
  onEditTermCondition(element: any) {
    console.log('Target row selected for modification:', element);

    // Redirects directly to: .../AddAndEditTermCondition?mode=edit&termConditionId=235
    this.router.navigate(['/AddAndEditTermCondition'], {
      queryParams: {
        mode: 'edit',
        termConditionId: element.termConditionId,
      },
    });
  }
}
