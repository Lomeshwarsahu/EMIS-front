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
  selector: 'app-emis-perf20-rdlc',
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
  templateUrl: './emis-perf20-rdlc.component.html',
  styleUrl: './emis-perf20-rdlc.component.css',
})
export class EmisPerf20RdlcComponent implements OnInit {
  loading = false;
  poNoId = 0;
  downloading = false;

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly secureFile: SecureFileService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.poNoId = params['PONOID'] ? Number(params['PONOID']) : 0;
    });
  }
  // Printable certificate (HTML from the API; print or "Save as PDF").
  downloadPdf() {
    if (!this.poNoId) {
      this.toastr.warning('Invalid PONOID');
      return;
    }
    this.secureFile.openInNewTab(
      `${environment.apiUrl}/Performance/generate-perf20-pdf?poNoId=${this.poNoId}`,
      `Perf20_PONOID_${this.poNoId}.html`,
    );
  }

  goBack() {
    this.router.navigate(['/PerformanceCertificate']);
  }
}
