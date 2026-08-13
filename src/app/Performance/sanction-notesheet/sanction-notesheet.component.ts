import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { MaterialModule } from 'src/app/material-module';
import { MatTableExporterModule } from 'mat-table-exporter';
import { SupplierPageSkeletonComponent } from 'src/app/component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-sanction-notesheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTableExporterModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './sanction-notesheet.component.html',
  styleUrl: './sanction-notesheet.component.css',
})
export class SanctionNotesheetComponent implements OnInit {
  loading = false;
  paymentId = 0;
  generating = false;

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.paymentId = params['Paymentid'] ? Number(params['Paymentid']) : 0;
    });
  }

  generateNotesheet() {
    if (!this.paymentId) {
      this.toastr.warning('Invalid Payment ID');
      return;
    }
    this.generating = true;
    this.api.get('Performance/generate-sanction-notesheet', {
      params: { paymentid: this.paymentId },
      responseType: 'blob' as 'json',
    }).subscribe({
      next: (res: any) => {
        const blob = new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SanctionNotesheet_${this.paymentId}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.generating = false;
      },
      error: () => {
        this.generating = false;
        this.toastr.error('Failed to generate notesheet');
      },
    });
  }

  goBack() {
    this.router.navigate(['/PerformanceCertificate']);
  }
}
