import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { TenderPageHeaderComponent } from '../BME/tender-page-header/tender-page-header.component';
import {
  TenderExcelItemRow,
  downloadTenderExcelFormat,
  isTenderExcelFile,
  readTenderExcelRows,
} from '../BME/tender-excel-upload.util';

// Legacy: EMSRole/Tender/AddExcel.aspx ("Add Items In Tender")
@Component({
  selector: 'app-add-excel',
  standalone: true,
  imports: [CommonModule, FormsModule, TenderPageHeaderComponent],
  templateUrl: './add-excel.component.html',
  styleUrls: ['../Suppliers/supplier-po-pages.shared.css', '../BME/tender-subpage.shared.css'],
})
export class AddExcelComponent implements OnInit {
  @ViewChild('excelFileInput') excelFileInput?: ElementRef<HTMLInputElement>;

  tenderNo: string | null = null;
  linkedItems: any[] = [];
  excelFile: File | null = null;
  excelUploading = false;
  excelResult: any = null;

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
  }

  // Legacy lnkDownload_Click
  downloadExcelFormat() {
    this.spinner.show();
    this.api.get('BME/GetTenderExcelFormatItems').subscribe({
      next: (res: any) => {
        this.spinner.hide();
        downloadTenderExcelFormat(res || []);
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error('Unable to download format');
      },
    });
  }

  onExcelFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.excelFile = input.files && input.files.length ? input.files[0] : null;
    this.excelResult = null;
  }

  // Legacy btnSave0_Click ("Link Items to Tender")
  async uploadExcel() {
    if (!this.excelFile) {
      this.toastr.warning('Please browse file');
      return;
    }
    if (!isTenderExcelFile(this.excelFile)) {
      this.toastr.warning('Only .xlsx or .xls files are allowed');
      return;
    }

    let rows: TenderExcelItemRow[] = [];
    try {
      rows = await readTenderExcelRows(this.excelFile);
    } catch {
      this.toastr.error('Unable to read the Excel file');
      return;
    }
    if (!rows.length) {
      this.toastr.warning('No item codes found in the Excel file');
      return;
    }

    this.excelUploading = true;
    this.spinner.show();
    this.api.post1('BME/AddItemsToTenderFromExcel', { TenderId: Number(this.tenderNo), Rows: rows }).subscribe({
      next: (res: any) => {
        this.excelUploading = false;
        this.spinner.hide();
        this.excelResult = res;
        if (res?.added > 0) {
          this.toastr.success(res.message);
        } else {
          this.toastr.warning(res?.message || 'No new items to add');
        }
        this.excelFile = null;
        if (this.excelFileInput?.nativeElement) {
          this.excelFileInput.nativeElement.value = '';
        }
        this.GetLinkedItems();
      },
      error: (err: any) => {
        this.excelUploading = false;
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Failed to upload items');
      },
    });
  }

  // Legacy PopulateMasItem(tenderid)
  GetLinkedItems() {
    this.api.get(`BME/GetLinkedItemsByTender/${this.tenderNo}/E`).subscribe({
      next: (res: any) => {
        this.linkedItems = res || [];
      },
      error: (err: any) => console.log('Error fetching items:', err),
    });
  }
}
