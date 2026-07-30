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
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.poNoId = params['PONOID'] ? Number(params['PONOID']) : 0;
    });
  }

  downloadPdf() {
    if (!this.poNoId) {
      this.toastr.warning('Invalid PONOID');
      return;
    }
    this.downloading = true;
    this.api.get('Performance/generate-perf20-pdf', {
      params: { poNoId: this.poNoId },
      responseType: 'blob' as 'json',
    }).subscribe({
      next: (res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Perf20_PONOID_${this.poNoId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.downloading = false;
      },
      error: () => {
        this.downloading = false;
        this.toastr.error('Failed to download PDF');
      },
    });
  }

  goBack() {
    this.router.navigate(['/PerformanceCertificate']);
  }
}
