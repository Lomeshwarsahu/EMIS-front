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
import { ActivatedRoute } from '@angular/router';
import { ExtensionEHODTO } from 'src/app/Model/models';

@Component({
  selector: 'app-extension-hodetail',
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
  templateUrl: './extension-hodetail.component.html',
  styleUrl: './extension-hodetail.component.css',
})
export class ExtensionHODetailComponent {
  dispatchData: ExtensionEHODTO[] = [];
  dataSource!: MatTableDataSource<ExtensionEHODTO>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  displayedColumns: string[] = [
    'sno',
    'PO_NO',
    'po_date',
    'name',
    'ITEM_NAME',
    'quantity',
    'totalPOvalue',
    'tender_no',
    'no_of_consignee',
    'action',
    'Fill',
  ];
  Supplierlist: any[] = [];
  selectedSupplier: number | null = null;
  supplierid: any;
  onlyExtensionRequests = false;
  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
  ) {
    this.dataSource = new MatTableDataSource<ExtensionEHODTO>([]);
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.onlyExtensionRequests = params.get('onlyExtensionRequests') === 'true';
    });
    // this.GETGetPODetails();
    this.GetSupplierlist();
  }
  GetSupplierlist() {
    this.api.get('ExtensionEHO/Supplierlist').subscribe({
      next: (res: any) => {
        console.log('Supplierlist', res);
        this.Supplierlist = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
  onSelectSupplier(supplier: any) {
    console.log('Selected Supplier ID:', supplier.supplier_id);
    this.supplierid = supplier.supplier_id;
    // const selectedSupplierObj = this.Supplierlist.find(s => s.supplier_id === supplier);
    // console.log('Selected Supplier Object:', selectedSupplierObj);
  }
  // https://localhost:7036/api/ExtensionEHO/ExtensionEHODetails?supplierid=38
  GETExtensionEHODetails() {
    try {
      this.spinner.show();

      const params = {
        supplierid: this.supplierid || 0,
        onlyExtensionRequests: this.onlyExtensionRequests ? 'true' : 'false',
      };
      this.api.get('ExtensionEHO/ExtensionEHODetails', { params }).subscribe(
        (res: any) => {
          this.dispatchData = res.map(
            (item: ExtensionEHODTO, index: number) => ({
              ...item,
              sno: index + 1,
            }),
          );
          console.log('ExtensionEHODTO=:', this.dispatchData);
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
  ONOpenlink(poid: any) {
    
    this.router.navigate(['/ExtensionHOEntry'], {
      queryParams: { poId: poid },
    });
  }


}
