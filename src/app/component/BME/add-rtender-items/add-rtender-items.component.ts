import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { TenderPageHeaderComponent } from '../tender-page-header/tender-page-header.component';

// Legacy: EMSRole/Tender/tender_details_items.aspx ("Add/Remove Items from Tender")
@Component({
  selector: 'app-add-rtender-items',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule, TenderPageHeaderComponent],
  templateUrl: './add-rtender-items.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', '../tender-subpage.shared.css'],
})
export class AddRTenderItemsComponent implements OnInit {
  tenderNo: string | null = null;
  itemList: any[] = [];
  item_id: number | null = null;
  searchItems: any[] = [];
  searched = false;
  linkedItems: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.tenderNo = params['tender_no'] || params['tenderid'] || null;
      if (this.tenderNo) {
        this.GetLinkedItems();
      }
    });
    this.GetSelectableItems();
  }

  // Legacy SearchDrugs.ascx item list
  GetSelectableItems() {
    this.api.get('BME/GetSelectableItems').subscribe({
      next: (res: any) => {
        this.itemList = res || [];
      },
      error: (err: any) => console.log('Error fetching items:', err),
    });
  }

  onSelectedItem(item: any) {
    this.item_id = item?.item_id ?? null;
    this.searchItems = [];
    this.searched = false;
  }

  // Legacy btnShowSelectedItems_Click -> PopulateMasItem(itemid)
  showSelectedItems() {
    if (!this.item_id) {
      this.toastr.warning('Please select an item first');
      return;
    }
    this.spinner.show();
    this.api.get(`BME/GetItemEligibility/${this.item_id}`).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.searchItems = (res || []).map((r: any) => ({ ...r, tender_qty: null, emd_amt: null }));
        this.searched = true;
      },
      error: (err: any) => {
        this.spinner.hide();
        console.log('Error:', err);
        this.toastr.error('Failed to load item');
      },
    });
  }

  // Legacy gvMasItems_RowCommand "Add"
  addItemToTender(item: any) {
    if (!item.emd_amt || Number(item.emd_amt) <= 0) {
      this.toastr.warning('Please Enter EMD');
      return;
    }
    if (!item.tender_qty || Number(item.tender_qty) <= 0) {
      this.toastr.warning('Please Enter Tender QTY');
      return;
    }

    const payload = {
      TenderId: Number(this.tenderNo),
      ItemId: item.item_id,
      TenderQuantity: Number(item.tender_qty),
      EmdAmount: Number(item.emd_amt),
    };

    this.spinner.show();
    this.api.post1('BME/AddItemToTender', payload).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'Saved Successfully');
        // Legacy clears the search grid after a save (PopulateMasItem("0"))
        this.searchItems = [];
        this.searched = false;
        this.item_id = null;
        this.GetLinkedItems();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to add item');
      },
    });
  }

  // Legacy PopulateDataFreezed -> "Schedule of Requirement"
  GetLinkedItems() {
    this.api.get(`BME/GetLinkedItemsByTender/${this.tenderNo}/A`).subscribe({
      next: (res: any) => {
        this.linkedItems = res || [];
      },
      error: (err: any) => console.log('Error fetching linked items:', err),
    });
  }
}
