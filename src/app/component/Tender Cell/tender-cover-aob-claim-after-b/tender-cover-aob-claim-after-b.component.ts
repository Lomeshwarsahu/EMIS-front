import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

// Legacy: EMSRole/Tender/TenderCoverAObClaimAfterB.aspx
// ("Cover B Shortlisting [Eligiblity for Price Bid]", sidebar: Tender -> Finalization of Cover B)
@Component({
  selector: 'app-tender-cover-aob-claim-after-b',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './tender-cover-aob-claim-after-b.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', '../../BME/tender-subpage.shared.css'],
})
export class TenderCoverAObClaimAfterBComponent implements OnInit {
  @ViewChild('demoFileInput') demoFileInput?: ElementRef<HTMLInputElement>;

  tenderList: any[] = [];
  tenderId: number | null = null;
  shown = false;
  header: any = null;
  bidders: any[] = [];
  pending = '';

  remarksList: any[] = [];
  popupBidder: any = null;
  popupItems: any[] = [];

  priceBidDate = '';
  demoFile: File | null = null;

  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    public toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    // Legacy FillCovBTender(): Get_TendersStatus("3", "COVERB") -> csid in (3,4)
    this.api.get('Tendercell/GetTendersStatus?stid=3&undOBClaim=COVERB').subscribe({
      next: (res: any) => (this.tenderList = res || []),
      error: () => (this.tenderList = []),
    });
    this.api.get('Tendercell/GetDemoEligibilityList').subscribe({
      next: (res: any) => (this.remarksList = res || []),
      error: (err: any) => console.log('Error fetching remarks:', err),
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
    this.api.get(`Tendercell/GetCoverBShortlisting/${this.tenderId}`).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.header = res?.Header || null;
        this.bidders = res?.Bidders || [];
        this.pending = res?.Pending || '';
        this.shown = true;
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to load');
      },
    });
  }

  // Legacy gvAindent1_RowDataBound: green when every item has a decision, pink otherwise
  rowDone(b: any) {
    return b.EligibleItems === b.EligibleForC + b.NotEligibleForC;
  }

  // Legacy btnItemAction_Click -> mpe popup
  openItems(b: any) {
    this.spinner.show();
    this.api.get(`Tendercell/GetCoverBItems?tenderId=${b.TenderId}&schStatusDid=${b.SchStatusDid}`).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.popupBidder = b;
        this.popupItems = (res || []).map((i: any) => ({ ...i }));
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Failed to load items');
      },
    });
  }

  closePopup() {
    this.popupBidder = null;
    this.popupItems = [];
  }

  // Legacy btnUpdateItems ("Update(Checked:Eligible,NotChecked:Not Eligible)")
  updateItems() {
    if (this.popupItems.some((i) => !i.Eligible && !i.DemoRemarksId)) {
      this.toastr.warning('Please Select Remarks for Not eligible');
      return;
    }
    const payload = {
      TenderId: this.tenderId,
      Items: this.popupItems.map((i) => ({
        ChildId: i.ChildId,
        ItemId: i.ItemId,
        SupplierId: i.SupplierId,
        Eligible: !!i.Eligible,
        DemoRemarksId: Number(i.DemoRemarksId) || 0,
      })),
    };
    this.spinner.show();
    this.api.post1('Tendercell/UpdateCoverBItems', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'Saved');
        this.closePopup();
        this.load();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Not Saved Successfully');
      },
    });
  }

  onDemoFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.demoFile = input.files && input.files.length ? input.files[0] : null;
  }

  // Legacy btnFreezCovA_Click ("Freeze Cover B Shortlisting")
  freeze() {
    if (!this.demoFile) return void this.toastr.warning('Please Upload Demo for Bulk');
    if (!/\.pdf$/i.test(this.demoFile.name)) return void this.toastr.warning('Please Choose PDF File for DEMO');
    if (this.demoFile.size > 1000000) return void this.toastr.warning('File More than 1 MB.');
    if (!this.priceBidDate) return void this.toastr.warning('Enter Price Bid Date');

    const fd = new FormData();
    fd.append('TenderId', String(this.tenderId));
    fd.append('PriceBidDate', this.priceBidDate);
    fd.append('File', this.demoFile);

    this.spinner.show();
    this.api.post1('Tendercell/FreezeCoverB', fd).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'COVER B Shorlisted Successfully');
        this.priceBidDate = '';
        this.demoFile = null;
        if (this.demoFileInput?.nativeElement) this.demoFileInput.nativeElement.value = '';
        this.load();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'COVER B Shorlisted Not Saved');
      },
    });
  }
}
