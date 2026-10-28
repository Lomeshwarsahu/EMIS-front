import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

// Legacy: EMSRole/Tender/TenderCoverAObClaim.aspx ("Equipment Cell: Claim Object Prepartion",
// sidebar: Tender -> Claim-Object Preparation)
@Component({
  selector: 'app-tender-cover-aob-claim',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './tender-cover-aob-claim.component.html',
  styleUrls: ['../component/Suppliers/supplier-po-pages.shared.css', '../component/BME/tender-subpage.shared.css'],
})
export class TenderCoverAObClaimComponent implements OnInit {
  tenderList: any[] = [];
  tenderId: number | null = null;
  shown = false;
  header: any = null;
  bidders: any[] = [];
  pendingSuppliers = 0;
  eligibilityList: any[] = [];

  objStartDate = '';
  objEndDate = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    public toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    // Legacy FillCovATender(): Get_TendersStatus("2", "Under Prep") -> Cover A tenders with tech + finance evaluation done
    this.api.get('Tendercell/GetTendersStatus?stid=2&undOBClaim=Under%20Prep').subscribe({
      next: (res: any) => (this.tenderList = res || []),
      error: () => (this.tenderList = []),
    });
    // Legacy BindEligiblity(): masEligiblity
    this.api.get('BME/GetEligiblity').subscribe({
      next: (res: any) => (this.eligibilityList = res || []),
      error: (err: any) => console.log('Error fetching eligibility list:', err),
    });
  }

  // Legacy btnSave_Click ("Show")
  show() {
    if (!this.tenderId) {
      this.toastr.warning('---Select Tender---');
      return;
    }
    this.load();
  }

  private load() {
    this.spinner.show();
    this.api.get(`Tendercell/GetObjClaimPrep/${this.tenderId}`).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.header = res?.Header || null;
        this.pendingSuppliers = res?.PendingSuppliers || 0;
        // Each row keeps its own eligibility / remark (legacy ddlEli / txtReason per row)
        this.bidders = (res?.Bidders || []).map((b: any) => ({
          ...b,
          editEligibility: b.ObjEligibility || '0',
          editRemarks: b.ObjRemarks || '',
        }));
        this.shown = true;
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to load');
      },
    });
  }

  // Legacy btnaccepted_Click ("Action"), shown only when the bidder has participated items
  saveRow(b: any) {
    const eli = b.editEligibility;
    const remarks = (b.editRemarks || '').trim();
    if (!eli || eli === '0') return void this.toastr.warning('Please select Eligibility');
    if (eli === 'N' && !remarks) return void this.toastr.warning('Please Enter Rejection Remark for Not Eligible');
    if (eli === 'C' && !remarks) return void this.toastr.warning('Please Enter Clarification Remarks');

    this.spinner.show();
    this.api
      .post1('Tendercell/UpdateObjClaimPrep', {
        TenderId: b.TenderId,
        SchStatusDid: b.SchStatusDid,
        Eligibility: eli,
        Remarks: remarks,
      })
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.toastr.success(res?.message || 'Object Claim Updated Successfully');
          this.load();
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err?.error?.message || 'Update failed');
        },
      });
  }

  // Legacy "Participated Items" -> CoverAitemsReports.aspx
  openParticipatedItems(b: any) {
    this.router.navigate(['/CoverAitemsReports'], {
      queryParams: { tid: b.TenderId, sid: b.SupplierId, ssdid: b.SchStatusDid, Sname: b.SupplierName },
    });
  }

  // Legacy btnFreezCovA_Click ("Freeze for Object Claim Upload")
  freeze() {
    if (!this.objStartDate) return void this.toastr.warning('Enter Objection Claim Start Date');
    if (!this.objEndDate) return void this.toastr.warning('Enter Objection Claim End Date');

    this.spinner.show();
    this.api
      .post1('Tendercell/FreezeObjClaim', {
        TenderId: this.tenderId,
        StartDate: this.objStartDate,
        EndDate: this.objEndDate,
      })
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.toastr.success(res?.message || 'Object Claim Uploaded Successfully');
          // The tender moves to status 7 and leaves this list (legacy re-binds the dropdown on next load)
          this.shown = false;
          this.tenderId = null;
          this.objStartDate = '';
          this.objEndDate = '';
          this.ngOnInit();
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err?.error?.message || 'Object Claim Not Saved Successfully');
        },
      });
  }
}
