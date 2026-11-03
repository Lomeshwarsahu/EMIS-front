import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-tender-cover-a',
   standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './tender-cover-a.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', '../tender-subpage.shared.css', './tender-cover-a.component.css'],
})
export class TenderCoverAComponent implements OnInit {
  // Legacy EMSRole/Tender/TenderCoverA.aspx ("Cover A Evaluation/Clarification")
  TenderList: any[] = [];
  Eligiblitylist: any[] = [];
  selectedTenderId: any = null;
  show = false;
  freezing = false;
  TenderDetails: any = {};
  dispatchData: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Legacy Page_Load: tender list = Get_TendersStatus("2", ""); the role-based heading is the page title
    this.GetTenderList1();
    this.GetEligiblity();
  }

  GetTenderList1() {
    this.spinner.show();
    this.api.get('BME/GetTenderList1/1').subscribe({
      next: (res: any) => {
        this.TenderList = res || [];
        this.spinner.hide();
      },
      error: (err: any) => {
        this.spinner.hide();
        console.error('Error:', err);
      },
    });
  }

  // Legacy BindEligiblity: masEligiblity, with "Select" (0) on top
  GetEligiblity() {
    this.api.get('BME/GetEligiblity').subscribe({
      next: (res: any) => (this.Eligiblitylist = res || []),
      error: (err: any) => console.log('Error:', err),
    });
  }

  // Legacy btnSave_Click ("Show"): Tender.msgCheckCOVA_WithItemList, then tender block + grid + Freeze button
  onShow() {
    if (!this.selectedTenderId) {
      return;
    }
    const tid = this.selectedTenderId;
    this.spinner.show();
    this.api.get(`BME/GetSupplierParticipationDetails/${tid}/1`).subscribe({
      next: (res: any) => {
        const rows = res || [];
        // Legacy counts suppliers that have at least one item; none -> this message
        if (!rows.some((r: any) => Number(r.PItems) > 0)) {
          this.spinner.hide();
          this.show = false;
          this.toastr.warning('No Suppliers Added in Tender,Please Enter COV-A Suppliers First');
          return;
        }
        // Legacy gvAindent1_RowDataBound: dropdown / remarks prefilled from this role's saved columns
        const tech = this.isTechRole();
        this.dispatchData = rows.map((item: any) => ({
          ...item,
          _elig: (tech ? item.IsCovTechEli : item.IsCOVFinEli) || '0',
          _remarks: (tech ? item.CovATechRemarksBefore_OBClM : item.CovAFINRemarksBefore_OBClM) || '',
        }));
        this.api.get(`BME/GetTenderStatus/${tid}`).subscribe({
          next: (det: any) => {
            this.TenderDetails = (Array.isArray(det) ? det[0] : det) || {};
            this.show = true;
            this.spinner.hide();
          },
          error: (err: any) => {
            this.spinner.hide();
            console.log('Error:', err);
          },
        });
      },
      error: (err: any) => {
        this.spinner.hide();
        console.log('Error fetching data:', err);
      },
    });
  }

  // Logged-in user (sessionStorage, with the old localStorage loginData as fallback)
  private currentUser() {
    let roleId = sessionStorage.getItem('roleId') || '';
    let userId = sessionStorage.getItem('userid') || '';
    const data = localStorage.getItem('loginData');
    if ((!roleId || !userId) && data) {
      const user = JSON.parse(data);
      roleId = roleId || String(user.roleid ?? '');
      userId = userId || String(user.user_id ?? '');
    }
    return { roleId, userId };
  }

  // Role 22 / 12 = technical evaluation (Equipment Cell), others = financial (CGMSC Finance)
  private isTechRole() {
    const { roleId } = this.currentUser();
    return roleId === '22' || roleId === '12';
  }

  isCoverA(element: any) {
    return Number(element.Csid ?? element.csid) === 2;
  }

  // Legacy btnaccepted_Click ("Action"): saves this row's eligibility and remarks; the grid is not reloaded
  updateRowStatus(element: any) {
    const eligibility = element._elig;
    const remarks = element._remarks || '';
    if (!eligibility || eligibility === '0') {
      this.toastr.warning('Please select Cover A Eligibility');
      return;
    }
    if (eligibility === 'N' && !remarks.trim()) {
      alert('Please Enter Rejection Remark for Not Eligible');
      return;
    }
    if (eligibility === 'C' && !remarks.trim()) {
      alert('Please Enter Clarification Remarks');
      return;
    }

    const { roleId, userId } = this.currentUser();
    this.spinner.show();
    this.api
      .post1('BME/UpdateEligibility', {
        SchStatusDid: element.SchStatusDid,
        SchemeId: element.TenderId,
        Eligibility: eligibility,
        Remarks: remarks,
        RoleId: roleId,
        UserId: Number(userId) || 0,
      })
      .subscribe({
        next: () => {
          this.spinner.hide();
          alert('Updated Successfully');
        },
        error: (err) => {
          this.spinner.hide();
          alert(err.error?.message || 'Error updating status');
        },
      });
  }

  // Legacy btnFreezCovA_Click: the API refuses while any Cover A supplier has no value from this role
  freezeCoverA() {
    if (!this.selectedTenderId) {
      alert('Select Tender No first');
      return;
    }
    const { roleId, userId } = this.currentUser();
    this.freezing = true;
    this.api
      .post1('BME/FreezeCoverAEvaluation', {
        TenderId: Number(this.selectedTenderId),
        RoleId: roleId,
        UserId: Number(userId) || 0,
      })
      .subscribe({
        next: (res: any) => {
          this.freezing = false;
          alert(res?.message || 'Completed Evaluation,Please Go to upload Object Claim Summary');
        },
        error: (err) => {
          this.freezing = false;
          alert(err.error?.message || 'Freeze failed');
        },
      });
  }

  private supplierParams(element: any) {
    return { tid: element.TenderId, sid: element.SupplierId, ssdid: element.SchStatusDid, Sname: element.SupplierName };
  }

  // Legacy "Participated Items" count -> CoverAitemsReports.aspx?schemeid&supplierId&schstatusdid
  openParticipatedItems(element: any) {
    this.router.navigate(['/CoverAitemsReports'], { queryParams: this.supplierParams(element) });
  }
}
