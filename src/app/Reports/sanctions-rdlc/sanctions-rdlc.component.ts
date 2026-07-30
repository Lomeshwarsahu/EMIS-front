import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { MaterialModule } from 'src/app/material-module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sanctions-rdlc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sanctions-rdlc.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './sanctions-rdlc.component.css'
  ],
})
export class SanctionsRdlcComponent {
  sanctionId: string = '';
  poNoId: string = '';
  loading: boolean = false;
  downloaded: boolean = false;

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.sanctionId = params['SanctionID'] || '';
      this.poNoId = params['PONOID'] || '';
    });
  }

  downloadPdf() {
    if (!this.sanctionId || !this.poNoId) {
      this.toastr.warning('Sanction ID and PO No ID are required.');
      return;
    }
    this.loading = true;
    this.downloaded = false;

    const pdfUrl = `${environment.apiUrl}/Reports/sanctions-rdlc-pdf?sactionId=${this.sanctionId}&poNoId=${this.poNoId}`;
    window.open(pdfUrl, '_blank');
    this.loading = false;
    this.downloaded = true;
  }

  goBack() {
    this.router.navigate(['/reports/po-paid-report']);
  }
}
