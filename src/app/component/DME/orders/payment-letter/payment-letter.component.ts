import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { apiErrorMessage } from '../../shared/session.util';

interface PaymentLetterRow {
  Bankaccountid: number;
  Accountno: string;
  Accountname: string;
  Bankname: string;
  Branch: string;
  Ifsccode: string;
  SupplierId: number;
  SupplierName: string;
  AmountPaid: number;
  PaymentId: number;
}

interface PaymentLetterBank {
  Bankname: string;
  Branch: string;
  Accountno: string;
  Accountname: string;
  Ifsccode: string;
  Aidno: string;
  Aiddate: string;
  Remarks: string;
}

interface PaymentLetterData {
  BankLetter: PaymentLetterRow[];
  BankInfo: PaymentLetterBank[];
  Words: string;
  SupplierName: string;
  AidNo: string;
  TotalAmount: number;
}

@Component({
  selector: 'app-payment-letter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-letter.component.html',
  styleUrls: ['./payment-letter.component.css'],
})
export class PaymentLetterComponent implements OnInit {
  data: PaymentLetterData | null = null;
  loading = true;
  paymentId = 0;
  is20 = 'Y';

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.paymentId = Number(params['Paymentid'] || 0);
      this.is20 = params['Is20'] || 'Y';
      this.load();
    });
  }

  load(): void {
    if (!this.paymentId) {
      this.loading = false;
      this.toastr.error('Payment id is required.');
      return;
    }
    this.loading = true;
    this.http
      .get<PaymentLetterData>(`${environment.apiUrl}/WithheldRelease/letter?paymentId=${this.paymentId}&is20=${this.is20}`)
      .subscribe({
        next: (res) => {
          this.data = res;
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.toastr.error(apiErrorMessage(e, 'Could not load bank letter.'));
        },
      });
  }

  today(): string {
    return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  print(): void {
    window.print();
  }

  goBack(): void {
    window.history.back();
  }
}
