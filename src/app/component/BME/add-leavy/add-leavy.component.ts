import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { TenderPageHeaderComponent } from '../tender-page-header/tender-page-header.component';

// Legacy: EMSRole/Tender/AddLeavy.aspx (Plan a Tender -> Add Leavy/Penalty)
@Component({
  selector: 'app-add-leavy',
  standalone: true,
  imports: [CommonModule, FormsModule, TenderPageHeaderComponent],
  templateUrl: './add-leavy.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', '../tender-subpage.shared.css'],
})
export class AddLeavyComponent implements OnInit {
  tenderNo: string | null = null;
  leavy: any = this.emptyLeavy();
  // Legacy fillForUpdate: both entry dates set -> everything read-only;
  // leavy saved but performance not yet -> only release/performance fields can still be saved
  leavyLocked = false;
  allLocked = false;

  readonly penaltyTypes = [
    { value: 'D', label: 'Days' },
    { value: 'W', label: 'Week' },
  ];
  readonly releaseTypes = [
    { value: 'M', label: 'Month' },
    { value: 'W', label: 'Week' },
    { value: 'NA', label: 'NR' },
  ];
  readonly performanceOptions = [
    { value: 'Y', label: 'Yes' },
    { value: 'N', label: 'No' },
    { value: 'NA', label: 'NA' },
  ];

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
        this.GetLeavy();
      }
    });
  }

  private emptyLeavy() {
    return {
      CancellationDays: null,
      CancellationPercentage: null,
      PenaltyPercent: null,
      PenaltyType: 'D',
      PenaltyPercent120: null,
      LogoCharges: null,
      LogoChargesUpper: null,
      ReleaseType: 'M',
      ReleaseValue: null,
      PerformanceReq: 'Y',
      LeavyEntryDt: '',
      PerfEntryDt: '',
    };
  }

  GetLeavy() {
    this.api.get(`BME/GetTenderLeavy/${this.tenderNo}`).subscribe({
      next: (res: any) => {
        const d = res || {};
        this.leavy = {
          ...this.emptyLeavy(),
          ...Object.fromEntries(Object.entries(d).filter(([, v]) => v !== null && v !== '')),
          LeavyEntryDt: d.LeavyEntryDt || '',
          PerfEntryDt: d.PerfEntryDt || '',
        };
        this.allLocked = !!this.leavy.LeavyEntryDt && !!this.leavy.PerfEntryDt;
        this.leavyLocked = !!this.leavy.LeavyEntryDt;
      },
      error: (err: any) => console.log('Error loading leavy:', err),
    });
  }

  // Legacy btnSaveHeader_Click
  save() {
    const l = this.leavy;
    const empty = (v: any) => v === null || v === undefined || v === '';
    const checks: [any, string][] = [
      [l.CancellationDays, 'Enter Cancelation Days.'],
      [l.CancellationPercentage, 'Enter Cancellation Percentage.'],
      [l.PenaltyPercent, 'Enter Penalty Percentage'],
      [l.PenaltyPercent120, 'Enter Penalty Percentage(121-180 days)'],
      [l.LogoCharges, 'Enter Logo Charges'],
      [l.LogoChargesUpper, 'Enter Logo Charges Upper Limit.'],
    ];
    const missing = checks.find(([v]) => empty(v));
    if (missing) {
      this.toastr.warning(missing[1]);
      return;
    }

    const num = (v: any) => (empty(v) ? null : Number(v));
    const payload = {
      TenderId: String(this.tenderNo),
      CancellationDays: num(l.CancellationDays),
      CancellationPercentage: num(l.CancellationPercentage),
      PenaltyPercent: num(l.PenaltyPercent),
      PenaltyPercent120: num(l.PenaltyPercent120),
      PenaltyType: l.PenaltyType,
      LogoCharges: num(l.LogoCharges),
      LogoChargesUpper: num(l.LogoChargesUpper),
      ReleaseType: l.ReleaseType,
      ReleaseValue: num(l.ReleaseValue),
      PerformanceReq: l.PerformanceReq,
    };

    this.spinner.show();
    this.api.post1('BME/UpdateTenderLevy', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'Leavy Successfully Updated');
        // Legacy redirects back to tender_details_1.aspx?tenderid= after saving
        this.goBack();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to save leavy');
      },
    });
  }

  goBack() {
    this.router.navigate(['/tender/plan'], { queryParams: { tenderid: this.tenderNo } });
  }
}
