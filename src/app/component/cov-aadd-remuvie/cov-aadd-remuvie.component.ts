import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { TenderPageHeaderComponent } from '../BME/tender-page-header/tender-page-header.component';

// Legacy: EMSRole/Tender/CovA.aspx (Plan a Tender -> Add Bidder / "Add Participants")
@Component({
  selector: 'app-cov-aadd-remuvie',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, TenderPageHeaderComponent],
  templateUrl: './cov-aadd-remuvie.component.html',
  styleUrls: ['../Suppliers/supplier-po-pages.shared.css', '../BME/tender-subpage.shared.css'],
})
export class CovAaddRemuvieComponent implements OnInit {
  tenderNo: string | null = null;
  Supplierlist: any[] = [];
  MASDOCUMENTTYPEList: any[] = [];
  bidders: any[] = [];
  formData: any = this.emptyForm();

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.tenderNo = params['tender_no'] || params['TENDER_ID'] || null;
      if (this.tenderNo) {
        this.GetBidders();
      }
    });
    this.GetSupplierlist();
    this.GETMASDOCUMENTTYPEList();
  }

  private emptyForm() {
    // Legacy txtTenderProFee defaults to 5000
    return { SupplierId: null, EmdAmount: null, TenderProFee: 5000, DocTypeId: null, EmdDocNo: '', Remarks: '' };
  }

  // Legacy FillSup(): all suppliers ordered by name
  GetSupplierlist() {
    this.api.get('BME/GetSupplierlist').subscribe({
      next: (res: any) => {
        this.Supplierlist = (res || [])
          .map((s: any) => ({ supplier_id: s.SupplierId, name: s.Name }))
          .sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
      },
      error: (err: any) => console.log('Error fetching suppliers:', err),
    });
  }

  // Legacy FillDoctype()
  GETMASDOCUMENTTYPEList() {
    this.api.get('BME/GETMASDOCUMENTTYPEList').subscribe({
      next: (res: any) => {
        this.MASDOCUMENTTYPEList = res || [];
      },
      error: (err: any) => console.log('Error fetching document types:', err),
    });
  }

  docTypeName(id: any) {
    const d = this.MASDOCUMENTTYPEList.find((x: any) => String(x.dtypeid) === String(id));
    return d ? d.dtypename : id;
  }

  // Legacy ItemDetails(schemeid)
  GetBidders() {
    this.api.get(`BME/GetSupplierParticipationDetails/${this.tenderNo}/0`).subscribe({
      next: (res: any) => {
        this.bidders = res || [];
      },
      error: (err: any) => console.log('Error fetching bidders:', err),
    });
  }

  // Legacy btnSaveTest_Click
  saveParticipation() {
    const f = this.formData;
    if (!f.SupplierId) {
      this.toastr.warning('Please Select Supplier');
      return;
    }
    if (f.EmdAmount === null || f.EmdAmount === '') {
      this.toastr.warning('EMD Required');
      return;
    }
    if (f.TenderProFee === null || f.TenderProFee === '') {
      this.toastr.warning('Process Fee is Required.');
      return;
    }
    if (!f.DocTypeId) {
      this.toastr.warning('Please Select EMD Document Type');
      return;
    }
    if (!(f.EmdDocNo || '').trim()) {
      this.toastr.warning('Please fill EMD Document Number');
      return;
    }

    const supplierName = this.Supplierlist.find((s) => s.supplier_id === f.SupplierId)?.name || '';
    const payload = {
      TenderId: Number(this.tenderNo),
      SupplierId: f.SupplierId,
      EmdAmount: Number(f.EmdAmount),
      TenderProFee: Number(f.TenderProFee),
      DocTypeId: f.DocTypeId,
      EmdDocNo: f.EmdDocNo.trim(),
      Remarks: (f.Remarks || '').trim() || null,
    };

    this.spinner.show();
    this.api.post1('BME/SaveSupplierParticipation', payload).subscribe({
      next: () => {
        this.spinner.hide();
        this.toastr.success('Successfully Saved ' + supplierName);
        this.formData = this.emptyForm();
        this.GetBidders();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to save');
      },
    });
  }

  private supplierParams(row: any) {
    return { tid: row.TenderId || this.tenderNo, sid: row.SupplierId, ssdid: row.SchStatusDid, Sname: row.SupplierName };
  }

  // Legacy "Add Items" -> TenderCoverAitems.aspx?schemeid&supplierId&schstatusdid
  openAddItems(row: any) {
    this.router.navigate(['/TenderCoverAitems'], { queryParams: this.supplierParams(row) });
  }

  // Legacy "Participated Items" count -> CoverAitemsReports.aspx?schemeid&supplierId&schstatusdid
  openParticipatedItems(row: any) {
    this.router.navigate(['/CoverAitemsReports'], { queryParams: this.supplierParams(row) });
  }
}
