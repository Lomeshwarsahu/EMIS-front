import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SupplierBankAccDetail_model, vendorBankDetail_model,UpdateBankDetails_model, UpdateAnnualTurnover_model, GetAnnualTurnoverDetail, BankMandateDetail, MassuppliergstDetails, GstReturnDetails } from 'src/app/Model/VendorRegisDetail';
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

@Component({
  selector: 'app-generation-file-nonasti',
  standalone: true,
  imports: [NgSelectModule,CommonModule,FormsModule,CollapseModule,NgbCollapseModule,ReactiveFormsModule,MatTabsModule,
    MaterialModule,MatSortModule, MatPaginatorModule,MatTableModule,MatDialogModule,MatSelectModule, MatOptionModule,
      MatTableExporterModule
  ],
  templateUrl: './generation-file-nonasti.component.html',
  styleUrl: './generation-file-nonasti.component.css',
})
export class GenerationFileNonastiComponent {
yearList=[{id:0, 'Year':2012}];
searchMode: 'po' | 'outward' = 'po';
poNo = '';
outwardNo = '';
selectedYear: any;
  constructor(private spinner: NgxSpinnerService,private api: ApiService,public toastr: ToastrService, private fb: FormBuilder,
    private cdr: ChangeDetectorRef, private router: Router,  private sanitizer: DomSanitizer,
  ){
    //  this.dataSource = new MatTableDataSource<GetAnnualTurnoverDetail>([]);

 }
search() {
  if (this.searchMode === 'po') {
    if (!this.poNo) {
      this.toastr.warning('Enter PO Number');
      return;
    }
    // call PO search
  }

  if (this.searchMode === 'outward') {
    if (!this.outwardNo || !this.selectedYear) {
      this.toastr.warning('Enter Outward Number and Year');
      return;
    }
    // call outward search
  }
}
}
