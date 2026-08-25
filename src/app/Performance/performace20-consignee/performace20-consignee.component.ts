import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';
import { MaterialModule } from 'src/app/material-module';
import { MatTableExporterModule, MatTableExporterDirective } from 'mat-table-exporter';
import { SupplierPageSkeletonComponent } from 'src/app/component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';
import {
  Performace20ConsigneeHeader,
  Performace20ConsigneeGridItem,
} from 'src/app/Model/models';

@Component({
  selector: 'app-performace20-consignee',
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
  templateUrl: './performace20-consignee.component.html',
  styleUrl: './performace20-consignee.component.css',
})
export class Performace20ConsigneeComponent implements OnInit {
  loading = false;
  dataSource!: MatTableDataSource<Performace20ConsigneeGridItem>;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;
  @ViewChild('exporter') exporter!: MatTableExporterDirective;

  displayedColumns = [
    'sno', 'location_name', 'po_qty', 'dispatched_qty',
    'received_qty', 'installed_qty', 'installation_date',
  ];

  poId = 0;
  headerData: Performace20ConsigneeHeader = {
    PoId: 0, PoDate: '', PoNo: '', ItemCode: '', ItemName: '',
    Percentage: 0, BasicRate: 0, NoOfConsignee: 0, Model: '',
    Make: '', POQTY: 0, DispatchQty: 0, ReceiptQty: 0,
    InsQTY: 0, ReleaseDur: '', ReleaseType: '',
  };
  gridData: Performace20ConsigneeGridItem[] = [];
  loginData: any = {};

  perfCertType = 'Select';
  perfIAgree = false;

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.dataSource = new MatTableDataSource<Performace20ConsigneeGridItem>([]);
  }

  ngOnInit() {
    this.loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.route.queryParams.subscribe(params => {
      this.poId = params['po_id'] ? Number(params['po_id']) : 0;
      if (this.poId) this.loadConsigneeDetail();
    });
  }

  loadConsigneeDetail() {
    this.loading = true;
    this.api.get('Performance/get-consignee-detail', { params: { poId: this.poId } }).subscribe({
      next: (res: any) => {
        this.headerData = res.header;
        this.gridData = res.grid.map((item: Performace20ConsigneeGridItem, i: number) => ({
          ...item, sno: i + 1,
        }));
        this.dataSource.data = this.gridData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: () => { this.loading = false; this.toastr.error('Failed to load consignee details'); }
    });
  }

  applyTextFilter(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.dataSource.filter = val.trim().toLowerCase();
  }

  upload() {
    if (this.perfCertType === 'Select') {
      this.toastr.warning('Please select Performance Certificate Type');
      return;
    }
    if (!this.perfIAgree) {
      this.toastr.warning('Please check the certification checkbox');
      return;
    }
    this.loading = true;
    const payload = {
      poId: this.poId,
      perfCertType: this.perfCertType,
      userId: this.loginData.user_id,
    };
    this.api.post1('Performance/upload-consignee-performance', payload).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'Uploaded successfully');
        this.loading = false;
      },
      error: (err: any) => { this.loading = false; this.toastr.error(err.error?.message || 'Upload failed'); }
    });
  }

  close() {
    this.router.navigate(['/PerformanceCertificate']);
  }

  downloadPdf() {
    window.open(`/Performance/EMISPerf20_RDLC.aspx?PONOID=${this.poId}`, '_blank');
  }
}
