import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SecureFileService } from 'src/app/service/secure-file.service';
import { environment } from 'src/environments/environment';
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
    private readonly secureFile: SecureFileService,
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
    this.secureFile.openInNewTab(
      `${environment.apiUrl}/Performance/generate-sanction-notesheet?paymentid=${this.paymentId}`,
      `SanctionNotesheet_${this.paymentId}.html`,
    );
  }

  goBack() {
    this.router.navigate(['/PerformanceCertificate']);
  }
}
