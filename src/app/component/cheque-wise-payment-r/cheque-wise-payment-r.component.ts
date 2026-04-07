

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
  import { ChequePaymentSummaryDTO } from 'src/app/Model/models';

@Component({
  selector: 'app-cheque-wise-payment-r',
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
  templateUrl: './cheque-wise-payment-r.component.html',
  styleUrl: './cheque-wise-payment-r.component.css',
})
export class ChequeWisePaymentRComponent {

        Fromdt: any;
        Todt: any;
        poType: any; //1;
  
   
    dispatchData: ChequePaymentSummaryDTO[] = [];
    dataSource!: MatTableDataSource<ChequePaymentSummaryDTO>;
    @ViewChild('paginator') paginator!: MatPaginator;
    @ViewChild('sort') sort!: MatSort;
    displayedColumns: string[] = [
      'sno',
      'Name',
      'CountNOs',
      'ChequeAmt',
      'AdminC',
      'TotalCheque',
      'AidNo',
      'BudgetName',
      'ChequeDT',
      'PaidOn',
      'Showbankletter',
      'action'
    ];
  
    constructor(
      private spinner: NgxSpinnerService,
      private api: ApiService,
      public toastr: ToastrService,
      private fb: FormBuilder,
      private cdr: ChangeDetectorRef,
      private router: Router,
      private sanitizer: DomSanitizer,
      private cd: ChangeDetectorRef,
    ) {
      this.dataSource = new MatTableDataSource<ChequePaymentSummaryDTO>([]);
    }
  
    ngOnInit() {
  
    }
  formatDate(date: any) {
    if (!date) return '';
  
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
  
    return `${day}-${month}-${year}`;
  }
    // https://localhost:7036/api/Contract/FinanceRep/ChequePaymentReport?potype=ALL&fromDate=05-03-2024&toDate=05-03-2026
    // https://localhost:7036/api/Contract/FinanceRep/ChequePaymentReport?potype=ALL
    GetTenderSupplierData() {
  try {
    this.spinner.show();

    let params: any = {
      potype: this.poType
    };

    // ✅ ADD DATE ONLY IF PRESENT
    if (this.Fromdt && this.Todt) {
      params.fromDate = this.formatDate(this.Fromdt);
      params.toDate = this.formatDate(this.Todt);
    }

    this.api.get('Contract/FinanceRep/ChequePaymentReport', { params }).subscribe(
      (res: any) => {
        this.dispatchData = res.map(
          (item: ChequePaymentSummaryDTO, index: number) => ({
            ...item,
            sno: index + 1,
          }),
        );

        this.dataSource.data = this.dispatchData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.cdr.detectChanges();
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        console.log('Error fetching data:', error.message);
      }
    );

  } catch (err: any) {
    this.spinner.hide();
    console.log(err);
  }
}
    // GetTenderSupplierData() {
    //   debugger
    //   try {
    //     this.spinner.show();
    //     const params = {
    //       potype: this.poType,
    //        fromDate: this.formatDate(this.Fromdt),
    //       toDate: this.formatDate(this.Todt)
    //       // fromDate: this.Fromdt,
    //       // toDate: this.Todt,
    //     };
    //     this.api.get('Contract/FinanceRep/PaymentUnionReport?', { params }).subscribe(
    //       (res: any) => {
    //         this.dispatchData = res.map(
    //           (item: PaymentPOWiseDTO, index: number) => ({
    //             ...item,
    //             sno: index + 1,
    //           }),
    //         );
    //         console.log('PaymentPOWiseDTO=:', this.dispatchData);
    //         this.dataSource.data = this.dispatchData;
    //         this.dataSource.paginator = this.paginator;
    //         this.dataSource.sort = this.sort;
    //         this.cdr.detectChanges();
    //         this.spinner.hide();
    //       },
    //       (error: { message: any }) => {
    //         this.spinner.hide();
    //         console.log('Error fetching data:', JSON.stringify(error.message));
    //         // alert(`Error fetching data: ${JSON.stringify(error.message)}`);
    //       },
    //     );
    //   } catch (err: any) {
    //     this.spinner.hide();
  
    //     console.log(err);
    //     // throw err;
    //   }
    // }
    applyTextFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    onButtonClick(poid: any) {
      return;
      this.router.navigate(['/InstallationDetails'], {
        queryParams: { poId: poid },
      });
      // InstallationDetails
      // alert(poid)
      // InstallationDetails
    }
    onCategoryChange() {
      this.poType;
      // force UI refresh
      this.cd.detectChanges();
    }
  }
  