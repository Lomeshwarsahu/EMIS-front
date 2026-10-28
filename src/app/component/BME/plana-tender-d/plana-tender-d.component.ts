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
import { ActivatedRoute, Router } from '@angular/router';
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
    { Value: 0, T_name: 'All' },
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

  yearlist: any = [];
  showSearch = false;
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
    'UpdateStatus',
    'AddTenderItem',
    'UpdateExcel',
    'AddBidder',
    'AddBidItem',
    'AddLeavy',
    'TenderDescription',
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
    private route: ActivatedRoute,
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.Getyear();
    // Legacy: ?tenderid=<id> opens the grid on that tender's financial year, otherwise year 19
    const tenderId = Number(this.route.snapshot.queryParamMap.get('tenderid'));
    if (tenderId > 0) {
      this.api.get(`BME/GetTenderDetailsById/${tenderId}`).subscribe({
        next: (res: any) => {
          const data = Array.isArray(res) ? res[0] : res;
          this.filterData.financialYearId = data?.FINANCIAL_YEAR_ID || 19;
          this.loadGrid();
        },
        error: () => this.loadGrid(),
      });
    } else {
      this.loadGrid();
    }
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

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.filterData.categoryId = null;
      this.filterData.searchText = '';
    }
  }

  // Legacy btnShow_Click: search (Code/Name/Tender + text) across all years, else year + status
  onSubmitFilter() {
    this.loadGrid();
  }

  private loadGrid() {
    const search = (this.filterData.searchText || '').trim();
    if (this.showSearch && this.filterData.categoryId && search) {
      this.GetTenderDashboardReports(0, 0, this.filterData.categoryId, search);
    } else {
      this.GetTenderDashboardReports(this.filterData.financialYearId || 0, this.filterData.typeId || 0);
    }
  }

  // Legacy GVDetail_RowDataBound row colours
  rowClass(row: any): string {
    const statusId = Number(row.CsId) || 1;
    const total = Number(row.TotalItems) || 0;
    const notFound = Number(row.NosNotFound) || 0;
    const found = Number(row.FoundItems) || 0;
    const decided = (Number(row.Accept) || 0) + (Number(row.Reject) || 0);

    if (statusId === 6) return 'row-cancelled';
    if (total === 0) return 'row-link-items';
    if (statusId === 5 && notFound === 0 && total !== notFound + found) return 'row-price-pending';
    if (statusId === 5 && notFound > 0 && found !== decided) return 'row-ar-pending';
    return '';
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

  GetTenderDashboardReports(fid: any, tyid: any, searchBy?: string, searchText?: string) {
    this.loading = true;
    this.spinner.show();

    let url = `BME/GetTenderDashboardReports/${fid}/${tyid}`;
    if (searchBy && searchText) {
      url += `?searchBy=${encodeURIComponent(searchBy)}&searchText=${encodeURIComponent(searchText)}`;
    }
    this.api.get(url).subscribe({
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
        this.toastr.error('Failed to load tenders.', 'Error');
      },
    });
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

  // Legacy tender_details_1.aspx row buttons. Checks come from GetTenderActionChecks (Tender.cs).
  private withTenderChecks(tenderId: any, onOk: (checks: any) => void) {
    this.spinner.show();
    this.api.get(`BME/GetTenderActionChecks/${tenderId}`).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        onOk(res || {});
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Unable to verify tender status. Please try again.');
      },
    });
  }

  opennewpage(tender_no: any) {
    this.withTenderChecks(tender_no, (checks) => {
      if (checks.CoverAItemsPending) {
        this.toastr.warning('Item Entry is Pending Cover A Supplier for this Tender');
        return;
      }
      this.router.navigate(['/TenderStatusUpdate'], {
        queryParams: { tender_no: tender_no },
      });
    });
  }

  // Legacy "Tendered Items" count link -> AddExcel.aspx
  openTenderedItems(element: any) {
    this.router.navigate(['/AddExcel'], {
      queryParams: { tender_no: element.TenderId },
    });
  }

  openAddRTenderItems(tender_no: any) {
    this.router.navigate(['/AddRTenderItems'], {
      queryParams: { tender_no: tender_no },
    });
  }

  // Legacy "Upload Excel" -> AddExcel.aspx?tenderid=
  openAddRExcel(tender_no: any) {
    this.router.navigate(['/AddExcel'], {
      queryParams: { tender_no: tender_no },
    });
  }

  openCovAaddRemuvie(element: any) {
    if (Number(element.CsId) !== 2) {
      this.toastr.warning('It will Works only When Status is Cover A');
      return;
    }
    this.router.navigate(['/CovAaddRemuvie'], {
      queryParams: { tender_no: element.TenderId },
    });
  }

  OpenCovAItemsEntry(element: any) {
    if (Number(element.CsId) !== 2) {
      this.toastr.warning('It will Works only When Status is Cover A');
      return;
    }
    this.withTenderChecks(element.TenderId, (checks) => {
      if (!checks.HasBidder) {
        this.toastr.warning('Please Add Bidder First');
        return;
      }
      this.router.navigate(['/CovAItemsEntry'], {
        queryParams: { tender_no: element.TenderId },
      });
    });
  }

  OpenTenderStatusRemark(tender_no: any) {
    this.router.navigate(['/TenderStatusRemark'], {
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
        this.loadGrid();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Error occurred while saving.');
      },
    });
  }
}
