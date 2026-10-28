import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { TenderPageHeaderComponent } from '../tender-page-header/tender-page-header.component';

// Legacy: EMSRole/Tender/TenderStatusRemark.aspx (opened from Plan a Tender -> Tender Status)
@Component({
  selector: 'app-tender-status-remark',
  standalone: true,
  imports: [CommonModule, FormsModule, TenderPageHeaderComponent],
  templateUrl: './tender-status-remark.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', '../tender-subpage.shared.css'],
})
export class TenderStatusRemarkComponent implements OnInit {
  tenderId: number | null = null;
  statusList: any[] = [];
  remarkList: any[] = [];
  selectedTsId = 0;
  remarks = '';
  saving = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.GetTenderStatusMasterList();
    this.route.queryParams.subscribe((params) => {
      const id = Number(params['tender_no'] || params['schemeid']);
      this.tenderId = id > 0 ? id : null;
      if (this.tenderId) {
        this.GetTenderStatusRemarks();
      }
    });
  }

  GetTenderStatusMasterList() {
    this.api.get('BME/GetTenderStatusMasterList').subscribe({
      next: (res: any) => {
        this.statusList = res || [];
      },
      error: (err: any) => console.log('Error fetching status list:', err),
    });
  }

  GetTenderStatusRemarks() {
    if (!this.tenderId) return;
    this.api.get(`BME/GetTenderStatusRemarks/${this.tenderId}`).subscribe({
      next: (res: any) => {
        this.remarkList = res || [];
      },
      error: (err: any) => console.log('Error fetching remarks:', err),
    });
  }

  save() {
    if (!this.selectedTsId) {
      this.toastr.warning('Please select Current Status');
      return;
    }
    if (!this.remarks.trim()) {
      this.toastr.warning('Please enter Remarks');
      return;
    }

    this.saving = true;
    this.spinner.show();
    const payload = {
      TenderId: this.tenderId,
      TsId: this.selectedTsId,
      Remarks: this.remarks.trim(),
    };
    this.api.post1('BME/SaveTenderStatusRemark', payload).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.spinner.hide();
        this.toastr.success(res?.message || 'Save Successfully.');
        this.selectedTsId = 0;
        this.remarks = '';
        this.GetTenderStatusRemarks();
      },
      error: (err: any) => {
        this.saving = false;
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to save status');
      },
    });
  }
}
