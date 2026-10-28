import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { TenderPageHeaderComponent } from '../tender-page-header/tender-page-header.component';

// Legacy: EMSRole/Tender/AddTenderCon.aspx (Plan a Tender -> Add Conversation With HOD (DHS/DME/Ayush))
@Component({
  selector: 'app-add-tender-con',
  standalone: true,
  imports: [CommonModule, FormsModule, TenderPageHeaderComponent],
  templateUrl: './add-tender-con.component.html',
  styleUrls: ['../../Suppliers/supplier-po-pages.shared.css', '../tender-subpage.shared.css'],
})
export class AddTenderConComponent implements OnInit {
  @ViewChild('convFile') convFile?: ElementRef<HTMLInputElement>;
  @ViewChild('replyFile') replyFile?: ElementRef<HTMLInputElement>;

  private readonly maxPdfBytes = 2000000;

  tenderNo: string | null = null;
  hodList: any[] = [];
  conversations: any[] = [];
  hodData: any = this.emptyHod();
  hodFile: File | null = null;

  // Reply popup (legacy mpReason)
  replyConvId: number | null = null;
  replyData: any = this.emptyReply();
  replyPdf: File | null = null;

  // Reply Details per conversation
  expandedConvId: number | null = null;
  replies: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private api: ApiService,
    private http: HttpClient,
    public toastr: ToastrService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.tenderNo = params['tender_no'] || params['schemeid'] || null;
      if (this.tenderNo) {
        this.GetConversations();
      }
    });
    this.GetHodList();
  }

  private emptyHod() {
    return { HodId: null, SendDate: '', LetterNo: '', LetterDate: '', Remarks: '' };
  }

  private emptyReply() {
    return { LetterNo: '', LetterDt: '', RecvDate: '', Remarks: '' };
  }

  // Legacy BindHOD(): facility_aut where ordercase is not null
  GetHodList() {
    this.api.get('BME/GetFacilityList').subscribe({
      next: (res: any) => {
        this.hodList = res || [];
      },
      error: (err: any) => console.log('Error fetching HOD list:', err),
    });
  }

  GetConversations() {
    this.api.get(`BME/GetHodConversations/${this.tenderNo}`).subscribe({
      next: (res: any) => {
        this.conversations = res || [];
      },
      error: (err: any) => console.log('Error fetching conversations:', err),
    });
  }

  private pickPdf(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    if (!file) return null;
    if (!/\.pdf$/i.test(file.name)) {
      this.toastr.warning('Please upload pdf file only.');
      input.value = '';
      return null;
    }
    if (file.size > this.maxPdfBytes) {
      this.toastr.warning("You can't upload file more than 2 MB.");
      input.value = '';
      return null;
    }
    return file;
  }

  onHodFileSelected(event: Event) {
    this.hodFile = this.pickPdf(event);
  }

  onReplyFileSelected(event: Event) {
    this.replyPdf = this.pickPdf(event);
  }

  // Legacy btnSave_Click
  saveConversation() {
    const h = this.hodData;
    if (!h.HodId) return void this.toastr.warning('Select HOD');
    if (!h.SendDate) return void this.toastr.warning('Enter Send Date');
    if (!(h.LetterNo || '').trim()) return void this.toastr.warning('Enter Letter No');
    if (!h.LetterDate) return void this.toastr.warning('Enter Letter Date');
    if (!(h.Remarks || '').trim()) return void this.toastr.warning('Enter Remarks');
    if (!this.hodFile) return void this.toastr.warning('Please select file to be uploaded.');

    const fd = new FormData();
    fd.append('TenderId', String(this.tenderNo));
    fd.append('HodId', String(h.HodId));
    fd.append('SendDate', h.SendDate);
    fd.append('LetterNo', h.LetterNo.trim());
    fd.append('LetterDate', h.LetterDate);
    fd.append('Remarks', h.Remarks.trim());
    fd.append('File', this.hodFile);

    this.spinner.show();
    this.api.post1('BME/SaveHodConversation', fd).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'Save Successfully.');
        this.hodData = this.emptyHod();
        this.hodFile = null;
        if (this.convFile?.nativeElement) this.convFile.nativeElement.value = '';
        this.GetConversations();
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Save failed');
      },
    });
  }

  // Legacy lnkDownload_Click / lnkRDownload_Click
  downloadFile(fileName: string) {
    if (!fileName) {
      this.toastr.warning('No file uploaded');
      return;
    }
    this.http
      .get(`${environment.apiUrl}/BME/GetHodFile/${encodeURIComponent(fileName)}`, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          setTimeout(() => URL.revokeObjectURL(url), 60000);
        },
        error: () => this.toastr.error('File not found'),
      });
  }

  // Legacy lnkReply_Click -> mpReason popup
  openReply(convId: number) {
    this.replyConvId = convId;
    this.replyData = this.emptyReply();
    this.replyPdf = null;
  }

  cancelReply() {
    this.replyConvId = null;
  }

  // Legacy btnYes_Click
  submitReply() {
    const r = this.replyData;
    if (!(r.LetterNo || '').trim()) return void this.toastr.warning('Enter Letter No');
    if (!r.LetterDt) return void this.toastr.warning('Enter Letter Date');
    if (!r.RecvDate) return void this.toastr.warning('Enter Received Date');
    if (!(r.Remarks || '').trim()) return void this.toastr.warning('Enter Remarks');
    if (!this.replyPdf) return void this.toastr.warning('Please select file to be uploaded.');

    const convId = this.replyConvId as number;
    const fd = new FormData();
    fd.append('Convid', String(convId));
    fd.append('LetterNo', r.LetterNo.trim());
    fd.append('LetterDt', r.LetterDt);
    fd.append('RecvDate', r.RecvDate);
    fd.append('Remarks', r.Remarks.trim());
    fd.append('File', this.replyPdf);

    this.spinner.show();
    this.api.post1('BME/SaveHodReply', fd).subscribe({
      next: (res: any) => {
        this.spinner.hide();
        this.toastr.success(res?.message || 'Save Successfully.');
        this.replyConvId = null;
        this.expandedConvId = convId;
        this.loadReplies(convId);
      },
      error: (err: any) => {
        this.spinner.hide();
        this.toastr.error(err?.error?.message || 'Save failed');
      },
    });
  }

  toggleReplies(convId: number) {
    if (this.expandedConvId === convId) {
      this.expandedConvId = null;
      return;
    }
    this.expandedConvId = convId;
    this.loadReplies(convId);
  }

  private loadReplies(convId: number) {
    this.replies = [];
    this.api.get(`BME/GetHodReplyList/${convId}`).subscribe({
      next: (res: any) => {
        this.replies = res || [];
      },
      error: () => (this.replies = []),
    });
  }
}
