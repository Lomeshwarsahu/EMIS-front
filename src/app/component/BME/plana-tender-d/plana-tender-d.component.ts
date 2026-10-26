import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  NgForm,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api.service';
import { CollapseModule } from 'src/app/collapse';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { SupplierPageSkeletonComponent } from '../../Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

declare var bootstrap: any;

@Component({
  selector: 'app-plana-tender-d',
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
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './plana-tender-d.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', './plana-tender-d.component.css'],
})
export class PlanaTenderDComponent implements OnInit, AfterViewInit, OnDestroy {
  Type = [
    { Value: 0, T_name: 'All Types' },
    { Value: 1, T_name: 'Live' },
    { Value: 2, T_name: 'Cover-A' },
    { Value: 3, T_name: 'Cover-B' },
    { Value: 4, T_name: 'Under Demo' },
    { Value: 5, T_name: 'Price Opened' },
    { Value: 6, T_name: 'Cancelled' },
  ];

  Category = [
    { Value: 'C', C_name: 'Code' },
    { Value: 'N', C_name: 'Name' },
    { Value: 'T', C_name: 'Tender' },
  ];

  filterData: any = {
    financialYearId: 19,
    typeId: 0,
    categoryId: null,
    searchText: '',
  };

  selectedYearId: any;
  Typeid = 0;
  yearlist: any = [];
  financial_year_id = 19;
  dispatchData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  loading = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('exporter') exporter!: any;

  displayedColumns: string[] = [
    'sno',
    'TenderNo',
    'TotalItems',
    'TotalValue',
    'CStatus',
    'TenderDate',
    'NosItemsBid',
    'TenderDescription',
    'UpdateStatus',
    'AddTenderItem',
    'UpdateExcel',
    'AddBidder',
    'AddBidItem',
    'AddLeavy',
    'AddnewHOD',
    'actions',
  ];

  newTender1: any = {
    tenderNo: '',
    description: '',
    tenderDate: '',
    finYearId: '',
    isGemTender: false,
    gemBidNo: '',
    tenderValue: 0,
  };

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.Getyear();
    this.GetTenderDashboardReports(19, 0);
  }

  ngAfterViewInit() {
    const modal = document.getElementById('SendModall') || document.getElementById('tenderModal');
    modal?.addEventListener('show.bs.modal', () => {
      document.body.classList.add('emis-modal-open');
    });
    modal?.addEventListener('shown.bs.modal', () => {
      document.body.classList.add('emis-modal-open');
      const input = document.querySelector<HTMLInputElement>('input[name="tenderNo"]');
      input?.focus();
    });
    modal?.addEventListener('hide.bs.modal', () => {
      document.body.classList.remove('emis-modal-open');
    });
    modal?.addEventListener('hidden.bs.modal', () => {
      document.body.classList.remove('emis-modal-open');
    });
  }

  ngOnDestroy() {
    document.body.classList.remove('emis-modal-open');
  }

  get hasActiveFilters(): boolean {
    return (this.filterData.typeId !== 0 && this.filterData.typeId !== null) || this.filterData.financialYearId !== 19;
  }

  onFilterChange() {
    this.GetTenderDashboardReports(this.filterData.financialYearId || 19, this.filterData.typeId || 0);
  }

  applyFilter() {
    if (this.filterData.searchText) {
      this.dataSource.filter = this.filterData.searchText.trim().toLowerCase();
    } else {
      this.dataSource.filter = '';
    }
  }

  onSubmitFilter(form?: any) {
    if (form && form.invalid) {
      return;
    }
    this.GetTenderDashboardReports(this.filterData.financialYearId || 19, this.filterData.typeId || 0);
  }

  onResetFilter(form?: any) {
    if (form && form.resetForm) {
      form.resetForm();
    }
    this.filterData = {
      financialYearId: 19,
      typeId: 0,
      categoryId: null,
      searchText: '',
    };
    this.dataSource.filter = '';
    this.GetTenderDashboardReports(19, 0);
  }

  Getyear() {
    this.api.get('GenerateNasti/Getyear').subscribe({
      next: (res: any) => {
        this.yearlist = res;
      },
      error: (err: any) => {
        console.log('Error fetching mapped items:', err);
      },
    });
  }

  GetTenderDashboardReports(fid: any, tyid: any) {
    this.loading = true;
    this.spinner.show();

    this.api.get(`BME/GetTenderDashboardReports/${fid}/${tyid}`).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.spinner.hide();
        this.dispatchData = (res || []).map((item: any, index: number) => ({
          ...item,
          sno: index + 1,
        }));

        this.dataSource.data = this.dispatchData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.spinner.hide();
        console.log('Error fetching items data:', err);
        this.toastr.error('Failed to load items.', 'Error');
      },
    });
  }

  applyTextFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel() {
    if (this.exporter && this.exporter.exportTable) {
      this.exporter.exportTable('xlsx', {
        fileName: 'Tender_Dashboard',
        sheet: 'Tender_Dashboard',
        Props: { Author: 'cgmsc' },
      });
    } else {
      const exporterDom: any = document.querySelector('[matTableExporter]');
      if (exporterDom && exporterDom.exportTable) {
        exporterDom.exportTable('xlsx', {
          fileName: 'Tender_Dashboard',
          sheet: 'Tender_Dashboard',
          Props: { Author: 'cgmsc' },
        });
      }
    }
  }

  opennewpage(tender_no: any) {
    this.router.navigate(['/TenderStatusUpdate'], {
      queryParams: { tender_no: tender_no },
    });
  }

  openAddRTenderItems(tender_no: any) {
    this.router.navigate(['/AddRTenderItems'], {
      queryParams: { tender_no: tender_no },
    });
  }

  openAddRExcel(tender_no: any) {
    this.router.navigate(['/AddExcel'], {
      queryParams: { tender_no: tender_no },
    });
  }

  openCovAaddRemuvie(tender_no: any) {
    this.router.navigate(['/CovAaddRemuvie'], {
      queryParams: { tender_no: tender_no },
    });
  }

  OpenCovAItemsEntry(tender_no: any) {
    this.router.navigate(['/CovAItemsEntry'], {
      queryParams: { tender_no: tender_no },
    });
  }

  OpenAddLeavy(tender_no: any) {
    this.router.navigate(['/AddLeavy'], {
      queryParams: { tender_no: tender_no },
    });
  }

  OpenAddTenderCon(tender_no: any) {
    this.router.navigate(['/AddTenderCon'], {
      queryParams: { tender_no: tender_no },
    });
  }

  closeModal() {
    document.body.classList.remove('emis-modal-open');
    const modalElement = document.getElementById('SendModall') || document.getElementById('tenderModal');
    if (modalElement && typeof bootstrap !== 'undefined' && bootstrap?.Modal) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }

  generateTender(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((key) => {
        form.controls[key].markAsTouched();
      });
      this.toastr.warning('Please fill all required fields correctly.');
      return;
    }
    this.spinner.show();
    const payload = {
      TenderNo: this.newTender1.tenderNo,
      TenderDescription: this.newTender1.description,
      TenderDate: this.newTender1.tenderDate,
      FinancialYearId: this.newTender1.finYearId,
      IsGemTender: this.newTender1.isGemTender,
      GemBidNo: this.newTender1.gemBidNo || null,
      TenderValue: this.newTender1.tenderValue,
    };
    this.api.post1('BME/SaveTender', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res.message);
        form.resetForm();
        this.closeModal();
        this.GetTenderDashboardReports(19, 0);
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Error occurred while saving.');
      },
    });
  }
}
