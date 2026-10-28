import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

// Legacy: EMSRole/Tender/tender_details_12.aspx ("Tender Status Update")
@Component({
  selector: 'app-tender-status-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tender-status-update.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', '../tender-subpage.shared.css'],
})
export class TenderStatusUpdateComponent implements OnInit {
  tenderNo: string | null = null;
  CoverStatusList: any[] = [];
  TenderDetails: any = {};
  // Legacy fillForUpdate: a value already saved in the DB cannot be changed again
  locked: Record<string, boolean> = {};

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.tenderNo = params['tender_no'] || params['tenderid'] || null;
      if (this.tenderNo) {
        this.fetchTenderDetails(this.tenderNo);
      }
    });
    this.GetCoverStatusList();
  }

  // Legacy fillStatus(): mascoverstatus where csid not in (3,5,7)
  GetCoverStatusList() {
    this.api.get('BME/GetCoverStatusList').subscribe({
      next: (res: any) => {
        this.CoverStatusList = res || [];
      },
      error: (err: any) => console.log('Error fetching status list:', err),
    });
  }

  private toInputDate(dateStr: string) {
    if (!dateStr) return '';
    if (dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('/');
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : '';
  }

  fetchTenderDetails(tenderNo: any) {
    this.api.get(`BME/GetTenderDetailsById/${tenderNo}`).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res[0] : res;
        if (!data) return;

        this.TenderDetails = {
          ...data,
          TENDER_DATE: this.toInputDate(data.TENDER_DATE),
          ENDDate: this.toInputDate(data.ENDDate),
          ExtendDt: '',
          cover_a: this.toInputDate(data.cover_a),
          cover_b: this.toInputDate(data.cover_b),
          cover_c: this.toInputDate(data.cover_c),
          cover_Demo: this.toInputDate(data.cover_Demo),
          cover_Demo2: this.toInputDate(data.cover_Demo2),
          cover_Demo3: this.toInputDate(data.cover_Demo3),
          CancelledDT: '',
          csid: data.csid || 0,
          warranty_year: data.warranty_year || null,
          domestic_days: data.domestic_days || null,
          import_days: data.import_days || null,
        };

        const t = this.TenderDetails;
        this.locked = {
          ENDDate: !!t.ENDDate,
          cover_a: !!t.cover_a,
          cover_b: !!t.cover_b,
          cover_c: !!t.cover_c,
          cover_Demo: !!t.cover_Demo,
          cover_Demo2: !!t.cover_Demo2,
          cover_Demo3: !!t.cover_Demo3,
          warranty_year: !!t.warranty_year,
          domestic_days: !!t.domestic_days,
          import_days: !!t.import_days,
        };
      },
      error: (err: any) => console.log('Error:', err),
    });
  }

  // Legacy btNSaveUpload_Click ("Update e-ProcNo")
  updateEProc() {
    const t = this.TenderDetails;
    if (!t.webSiteUploadID && !t.eprocID) {
      this.toastr.warning('Enter eProc Tender No or CGMSC Upload ID');
      return;
    }
    this.spinner.show();
    this.api
      .post1('BME/UpdateTenderUploadIds', {
        tender_id: Number(t.tender_id),
        webSiteUploadID: t.webSiteUploadID || '',
        eprocID: t.eprocID || '',
      })
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.toastr.success(res?.message || 'Updated Successfully');
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err?.error?.message || 'Update failed');
        },
      });
  }

  // Legacy btnSaveHeader_Click ("Update Status"); all checks run in the API with the legacy messages
  saveFullDetails() {
    const t = this.TenderDetails;
    if (!(t.TENDER_NO || '').trim()) {
      this.toastr.warning('Tender No Required');
      return;
    }
    if (!t.TENDER_DATE) {
      this.toastr.warning('Start Date');
      return;
    }
    if (!(t.TENDER_DESCRIPTION || '').trim()) {
      this.toastr.warning('Tender Description');
      return;
    }

    const num = (v: any) => (v === null || v === undefined || v === '' ? null : Number(v));
    const payload = {
      TenderId: Number(t.tender_id),
      TenderNo: t.TENDER_NO,
      WarrantyYear: num(t.warranty_year),
      DomesticDays: num(t.domestic_days),
      ImportDays: num(t.import_days),
      Csid: Number(t.csid) || 0,
      TenderRemarks: t.TenderRemarks || '',
      TenderDescription: t.TENDER_DESCRIPTION || '',
      TenderDate: t.TENDER_DATE || '',
      EndDate: t.ENDDate || '',
      ExtendDt: t.ExtendDt || '',
      CoverA: t.cover_a || '',
      CoverB: t.cover_b || '',
      CoverC: t.cover_c || '',
      CoverDemo: t.cover_Demo || '',
      CoverDemo2: t.cover_Demo2 || '',
      CoverDemo3: t.cover_Demo3 || '',
      CancelledDt: t.CancelledDT || '',
    };

    this.spinner.show();
    this.api.post1('BME/UpdateTenderFullDetails', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'Update Successfully');
        this.fetchTenderDetails(this.tenderNo);
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to update tender details');
      },
    });
  }

  // Legacy btnSaveHeader0_Click -> tender_details_1.aspx?tenderid=
  goBack() {
    this.router.navigate(['/tender/plan'], { queryParams: { tenderid: this.tenderNo } });
  }
}
