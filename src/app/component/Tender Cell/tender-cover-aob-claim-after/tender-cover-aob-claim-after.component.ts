import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

// Legacy: EMSRole/Tender/TenderCoverAObClaimAfter.aspx
// ("Final Cover A Summary Sheet after Claim Objection", sidebar: Tender -> Finalization of Cover A)
@Component({
  selector: 'app-tender-cover-aob-claim-after',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './tender-cover-aob-claim-after.component.html',
  styleUrls: [
    '../../Suppliers/supplier-po-pages.shared.css',
    '../../BME/tender-subpage.shared.css',
    './tender-cover-aob-claim-after.component.css',
  ],
})
export class TenderCoverAObClaimAfterComponent implements OnInit {
  tenderList: any[] = [];
  tenderId: number | null = null;
  shown = false;
  header: any = null;
  bidders: any[] = [];
  eligibilityList: any[] = [];

  popupBidder: any = null;
  popupItems: any[] = [];

  coverBDate = '';

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    public toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Legacy FillCovATender(): Get_TendersStatus("7", "Under Obj") -> claim objection window closed
    this.api.get('Tendercell/GetTendersStatus?stid=7&undOBClaim=Under%20Obj').subscribe({
      next: (res: any) => (this.tenderList = res || []),
      error: () => (this.tenderList = []),
    });
    // Legacy BindEligiblity: masEligiblity without 'C' (Clarification)
    this.api.get('BME/GetEligiblity').subscribe({
      next: (res: any) => (this.eligibilityList = (res || []).filter((e: any) => e.id !== 'C')),
      error: (err: any) => console.log('Error fetching eligibility:', err),
    });
  }

  // Legacy btnSave_Click ("Show")
  show() {
    if (!this.tenderId) {
      this.toastr.warning('---Select Tender---');
      return;
    }
    this.closePopup();
    this.load();
  }

  private load() {
    this.spinner.show();
    this.api.get(`Tendercell/GetTenderDetails/${this.tenderId}`).subscribe({
      next: (res: any) => {
        this.header = Array.isArray(res) ? res[0] : res;
        this.shown = true;
        this.loadBidders();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to load tender');
      },
    });
  }

  private loadBidders() {
    this.api.get(`Tendercell/GetSchemeStatusDetails/${this.tenderId}`).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        // Legacy gvAindent1_RowDataBound: pre-fill saved Final Eligibility / Final Remarks
        this.bidders = (res || []).map((b: any) => ({
          ...b,
          FinalEli: b.IsEligibleB || '0',
          FinalRemarks: b.FinalCovrARemarks || '',
        }));
      },
      error: () => {
        this.spinner.hide();
        this.bidders = [];
      },
    });
  }

  // Legacy lnkNoOfAddedItems -> CoverAitemsReports.aspx?schemeid&supplierId&schstatusdid
  openParticipatedItems(b: any) {
    this.router.navigate(['/CoverAitemsReports'], {
      queryParams: { tid: b.TenderId, sid: b.SupplierId, ssdid: b.SchStatusDid, Sname: b.Name },
    });
  }

  // Legacy btnItemAction_Click -> mpe popup (not opened for a Not Eligible bidder)
  openItems(b: any) {
    if (b.FinalEli === 'N') {
      if (!b.FinalRemarks.trim()) {
        this.toastr.warning('Please Enter Rejection Remark for Not Eligible');
      } else {
        this.toastr.info('Not Eligible bidder: use Bidder to make all quoted items Not Eligible');
      }
      return;
    }
    this.spinner.show();
    this.api.get(`Tendercell/GetParticipatedItems?tenderid=${b.TenderId}&schemestatusid=${b.SchStatusDid}`).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.popupBidder = b;
        // Legacy GVDetail_RowDataBound: checked when FLAGCOB = 'Y'
        this.popupItems = (res || []).map((i: any) => ({ ...i, Eligible: i.FlagCob === 'Y', RemarksA: i.RemarksA || '' }));
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to load items');
      },
    });
  }

  closePopup() {
    this.popupBidder = null;
    this.popupItems = [];
  }

  // Legacy btnUpdateItems ("Update(Checked:Eligible,NotChecked:Not Eligible)")
  updateItems() {
    if (this.popupItems.some((i) => !i.Eligible && !i.RemarksA.trim())) {
      this.toastr.warning('Remarks for Items Not Eligiblity is required');
      return;
    }
    const payload = {
      Items: this.popupItems.map((i) => ({
        SchStatusDid: i.SchStatusDid,
        ChildId: i.ChildId,
        ItemId: i.ItemId,
        IsChecked: !!i.Eligible,
        RemarksA: i.RemarksA.trim(),
      })),
    };
    this.spinner.show();
    this.api.post1('Tendercell/UpdateParticipatedItems', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'Saved');
        this.closePopup();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Not Saved Successfully');
      },
    });
  }

  // Legacy btnaccepted_Click ("Bidder")
  saveBidder(b: any) {
    if (b.FinalEli !== 'Y' && b.FinalEli !== 'N') {
      this.toastr.warning('Please Eligible/Not Eligible');
      return;
    }
    if (b.FinalEli === 'N' && !b.FinalRemarks.trim()) {
      this.toastr.warning('Please Enter Rejection Remark for Not Eligible');
      return;
    }
    const payload = {
      TenderId: b.TenderId,
      SchStatusDid: b.SchStatusDid,
      Eligibility: b.FinalEli,
      Remarks: b.FinalRemarks.trim(),
    };
    this.spinner.show();
    this.api.post1('Tendercell/UpdateFinalCoverABidder', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'Saved');
        this.loadBidders();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Not Saved Successfully');
      },
    });
  }

  // Legacy btnFreezCovA_Click ("Finalize COVER A Shortlisting")
  finalize() {
    if (!this.coverBDate) {
      this.toastr.warning('Cover B Open Date Required');
      return;
    }
    this.spinner.show();
    this.api.post1('Tendercell/FinalizeCoverA', { TenderId: this.tenderId, CoverBDate: this.coverBDate }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'COVER-A Final Summary Sheet Updated Successfully');
        this.coverBDate = '';
        this.load();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'COVER-A Final Summary Sheet Not Saved');
      },
    });
  }
}
