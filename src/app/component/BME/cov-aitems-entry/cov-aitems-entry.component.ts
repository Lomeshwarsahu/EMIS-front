import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { TenderPageHeaderComponent } from '../tender-page-header/tender-page-header.component';

// Legacy: EMSRole/Tender/CovAItemsEntry.aspx ("Tender Participation Details", Plan a Tender -> Add Bid Items)
@Component({
  selector: 'app-cov-aitems-entry',
  standalone: true,
  imports: [CommonModule, TenderPageHeaderComponent],
  templateUrl: './cov-aitems-entry.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', '../tender-subpage.shared.css'],
})
export class CovAItemsEntryComponent implements OnInit {
  tenderNo: string | null = null;
  bidders: any[] = [];
  docTypes: any[] = [];

  constructor(
    private api: ApiService,
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
    this.api.get('BME/GETMASDOCUMENTTYPEList').subscribe({
      next: (res: any) => (this.docTypes = res || []),
      error: (err: any) => console.log('Error fetching document types:', err),
    });
  }

  docTypeName(id: any) {
    const d = this.docTypes.find((x: any) => String(x.dtypeid) === String(id));
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

  private supplierParams(row: any) {
    return { tid: row.TenderId || this.tenderNo, sid: row.SupplierId, ssdid: row.SchStatusDid, Sname: row.SupplierName };
  }

  // Legacy "Participated Items" -> CoverAitemsReports.aspx
  openParticipatedItems(row: any) {
    this.router.navigate(['/CoverAitemsReports'], { queryParams: this.supplierParams(row) });
  }

  // Legacy "Add Items" -> TenderCoverAitems.aspx
  openAddItems(row: any) {
    this.router.navigate(['/TenderCoverAitems'], { queryParams: this.supplierParams(row) });
  }
}
