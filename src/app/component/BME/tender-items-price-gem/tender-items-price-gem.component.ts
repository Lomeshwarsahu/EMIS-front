import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';

// Legacy: EMSRole/Tender/TenderItemsPriceAR.aspx (route data mode 'AR') and TenderItemsPriceGEM.aspx (mode 'GEM').
// Same page in both: tender -> qualified items -> per item the supplier price rows (add / accept) and item reject.
@Component({
  selector: 'app-tender-items-price-gem',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './tender-items-price-gem.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', '../tender-subpage.shared.css', './tender-items-price-gem.component.css'],
})
export class TenderItemsPriceGEMComponent implements OnInit {
  readonly gstOptions = [0, 5, 12, 18, 28];

  mode: 'AR' | 'GEM' = 'GEM';
  tenderList: any[] = [];
  supplierList: any[] = [];
  tenderId: number | null = null;
  header: any = null;
  items: any[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'] === 'AR' ? 'AR' : 'GEM';
    // Legacy FillCovCTender(): AR -> Get_TendersStatus("3", "COVERC"); GEM -> Get_TendersStatus("3", "GEM")
    const list = this.mode === 'AR' ? 'COVERC' : 'GEM';
    this.api.get(`Tendercell/GetTendersStatus?stid=3&undOBClaim=${list}`).subscribe({
      next: (res: any) => (this.tenderList = res || []),
      error: () => (this.tenderList = []),
    });
    // Legacy ddlsupplier: all suppliers
    this.api.get('BME/GetSupplierlist').subscribe({
      next: (res: any) =>
        (this.supplierList = (res || [])
          .map((s: any) => ({ id: s.SupplierId, name: s.Name }))
          .sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))),
      error: () => (this.supplierList = []),
    });
  }

  trackIndex(index: number) {
    return index;
  }

  // Legacy ddlSup_SelectedIndexChanged (AutoPostBack)
  onTenderChange() {
    this.header = null;
    this.items = [];
    if (!this.tenderId) return;
    this.api.get(`BME/GetTenderDetailsById/${this.tenderId}`).subscribe({
      next: (res: any) => (this.header = (Array.isArray(res) ? res[0] : res) || null),
      error: () => (this.header = null),
    });
    this.loadItems();
  }

  private loadItems() {
    this.spinner.show();
    this.api.get(`BME/GetPriceEntryItems/${this.tenderId}`).subscribe({
      next: (res: any) => {
        const items = (res || []).map((i: any) => ({
          ...i,
          prices: [],
          newPrice: { SupplierId: null, BasicRate: null, Gst: null },
          rejectDate: '',
        }));
        if (!items.length) {
          this.spinner.hide();
          this.items = [];
          return;
        }
        // Legacy gv0_RowDataBound -> PopulateBatches for every item
        forkJoin(
          items.map((i: any) =>
            this.api.get(`BME/GetLiveTenderPrice/${i.TenderItemId}`).pipe(catchError(() => of([]))),
          ),
        ).subscribe((all: any) => {
          items.forEach((i: any, idx: number) => (i.prices = this.mapPrices(all[idx])));
          this.items = items;
          this.spinner.hide();
        });
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to load items');
      },
    });
  }

  private reloadPrices(item: any) {
    this.api.get(`BME/GetLiveTenderPrice/${item.TenderItemId}`).subscribe({
      next: (res: any) => (item.prices = this.mapPrices(res)),
      error: () => (item.prices = []),
    });
  }

  private toInputDate(d: string) {
    if (!d || d.includes('-')) return d || '';
    const p = d.split('/');
    return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : '';
  }

  private mapPrices(rows: any): any[] {
    return (rows || []).map((p: any) => ({
      ...p,
      accepted: !!p.IsAccept,
      negoPrice: p.FBasicRate ?? null,
      negoDate: this.toInputDate(p.FDate),
      cmc: [p.Cmc1, p.Cmc2, p.Cmc3, p.Cmc4, p.Cmc5].map((v: any) => v ?? null),
      reagentFile: null as File | null,
      accFile: null as File | null,
    }));
  }

  // Legacy gvBatches "Add" row
  addPrice(item: any) {
    const n = item.newPrice;
    if (!n.SupplierId) return void this.toastr.warning('Select Supplier');
    if (!n.BasicRate || Number(n.BasicRate) <= 0) return void this.toastr.warning('Enter Basic Rate');
    if (n.Gst === null || n.Gst === undefined) return void this.toastr.warning('Select GST %');

    this.spinner.show();
    this.api
      .post1('BME/AddLiveTenderPrice', {
        TenderItemId: item.TenderItemId,
        SupplierId: n.SupplierId,
        BasicRate: Number(n.BasicRate),
        Gst: Number(n.Gst),
      })
      .subscribe({
        next: (res: any) => {
          this.spinner.hide();
          this.toastr.success(res?.message || 'Saved Successfully');
          item.newPrice = { SupplierId: null, BasicRate: null, Gst: null };
          this.reloadPrices(item);
        },
        error: (err: any) => {
          this.spinner.hide();
          this.toastr.error(err?.error?.message || 'Failed to save price');
        },
      });
  }

  onPriceFile(price: any, kind: 'reagent' | 'acc', event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    if (file && !/\.pdf$/i.test(file.name)) {
      this.toastr.warning(kind === 'reagent' ? 'Please Choose PDF File for Reagent' : 'Please Choose PDF File for Accessories');
      input.value = '';
      return;
    }
    if (kind === 'reagent') price.reagentFile = file;
    else price.accFile = file;
  }

  // Legacy btnaccepted_Click
  accept(item: any, price: any) {
    const years = ['1st', '2nd', '3rd', '4th', '5th'];
    const missing = price.cmc.findIndex((v: any) => v === null || v === '' || Number(v) <= 0);
    if (missing >= 0) return void this.toastr.warning(`CMC ${years[missing]} Year Should not be blank`);
    if (price.negoPrice === null || price.negoPrice === '') return void this.toastr.warning('Enter Negotiation Price');
    if (!price.negoDate) return void this.toastr.warning('Enter Negotiation Date');

    const fd = new FormData();
    fd.append('TPriceId', String(price.TPriceId));
    fd.append('NegoPrice', String(price.negoPrice));
    fd.append('NegoDate', price.negoDate);
    price.cmc.forEach((v: any, i: number) => fd.append(`Cmc${i + 1}`, String(v)));
    if (price.reagentFile) fd.append('FileUploadReagent', price.reagentFile);
    if (price.accFile) fd.append('FileUploadAccessories', price.accFile);

    this.spinner.show();
    this.api.post1('BME/AcceptTenderPrice', fd).subscribe({
      next: () => {
        this.spinner.hide();
        this.toastr.success('Price Accepted');
        this.reloadPrices(item);
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to accept');
      },
    });
  }

  // Legacy btnreject_Click
  reject(item: any) {
    if (!item.rejectDate) return void this.toastr.warning('Select Reject Date');
    if (!confirm('Reject this item? All its prices will be marked Not Accepted.')) return;

    this.spinner.show();
    this.api.post1('BME/RejectTenderItem', { TenderItemId: item.TenderItemId, RejectDate: item.rejectDate }).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'Item Rejected');
        this.loadItems();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to reject');
      },
    });
  }
}
