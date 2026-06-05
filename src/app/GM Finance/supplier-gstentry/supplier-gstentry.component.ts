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
  selector: 'app-supplier-gstentry',
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
  templateUrl: './supplier-gstentry.component.html',
  styleUrl: './supplier-gstentry.component.css',
})
export class SupplierGSTentryComponent {

isEditMode: boolean = false;
  supplierId!: number;
  supplierName: string = '';
  supplierCode: string = '';

  
  displayedColumns: string[] = ['sno', 'GstNo', 'Flag', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  // Form Model State Reference
  gstFormModel: any = {
    gstid: 0,
    gstno: '',
    flag: 'Y'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // Read route link query string parameter context passed from supplier registry grid
    this.route.queryParams.subscribe({
      next: (params) => {
        this.supplierId = params['id'] ? Number(params['id']) : 0;
        this.supplierName = params['supplierName'];
        if (this.supplierId > 0) {
          this.loadSupplierHeader();
          this.loadGstRecordsGrid();
        } else {
          this.toastr.error('Invalid reference parameters context routing.');
          this.router.navigate(['/Suppliers']);
        }
      }
    });
  }

  loadSupplierHeader() {
    this.api.get(`GMFI/GetSupplierHeaderInfo/${this.supplierId}`).subscribe({
      next: (res: any) => {
        this.supplierName = res.supplierName;
        this.supplierCode = res.supplierCode;
      }
    });
  }

  loadGstRecordsGrid() {
    this.spinner.show();
    this.api.get(`GMFI/GetSupplierGstRecords/${this.supplierId}`).subscribe({
      next: (res: any) => {
        this.dataSource.data = res || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
      },
      error: () => this.spinner.hide()
    });
  }

  onSubmitGstForm(form: any) {
    if (form.invalid) {
      this.toastr.warning('Please enter a valid GST identification string.');
      return;
    }

    this.spinner.show();
    const payload = {
      Gstid: this.gstFormModel.gstid,
      Supplierid: this.supplierId,
      Gstno: this.gstFormModel.gstno.trim().toUpperCase(),
      Flag: this.gstFormModel.flag
    };

    this.api.post1('GMFI/SaveOrUpdateSupplierGst', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Data saved successfully.');
        this.onResetForm(form);
        this.loadGstRecordsGrid();
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.error(err.error?.message || 'Failed to sync execution.');
      }
    });
  }

  editRowElement(row: any) {
    this.isEditMode = true;
    this.gstFormModel = {
      gstid: row.Gstid,
      gstno: row.Gstno,
      flag: row.Flag
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteRowElement(gstId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this GST record registration?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.api.delete(`GMFI/DeleteSupplierGst/${gstId}`).subscribe({
          next: (res: any) => {
            this.spinner.hide();
            Swal.fire('Deleted!', res.message || 'Record wiped.', 'success');
            this.loadGstRecordsGrid();
          },
          error: (err) => {
            this.spinner.hide();
            Swal.fire('Error!', err.error?.message || 'Delete aborted.', 'error');
          }
        });
      }
    });
  }

  onResetForm(form: any) {
    form.resetForm();
    this.isEditMode = false;
    this.gstFormModel = { gstid: 0, gstno: '', flag: 'Y' };
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
