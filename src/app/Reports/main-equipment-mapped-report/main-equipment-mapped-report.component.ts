import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DmePageSkeletonComponent } from '../../component/DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage } from '../../component/DME/shared/session.util';
import * as XLSX from 'xlsx';

interface MainEquipmentMappedRow {
  PItemName: string;
  ItemCode: string;
  ItemName: string;
  IsElectrical: string;
  ProgReq: string;
  SrOrBulkEntry: string;
  AmcReq: string;
  ItemId: number;
}

@Component({
  selector: 'app-main-equipment-mapped-report',
  standalone: true,
  imports: [CommonModule, DmePageSkeletonComponent],
  templateUrl: './main-equipment-mapped-report.component.html',
  styleUrls: ['./component.css'],
})
export class MainEquipmentMappedReportComponent implements OnInit {
  rows: MainEquipmentMappedRow[] = [];
  loading = false;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.http.get<MainEquipmentMappedRow[]>(`${environment.apiUrl}/DMEReports/main-equipment-mapped`).subscribe({
      next: (res) => {
        this.rows = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load report.'));
      },
    });
  }

  exportExcel(): void {
    if (!this.rows.length) {
      this.toastr.warning('No data to export.');
      return;
    }
    const data = this.rows.map((r, i) => ({
      'S.no': i + 1,
      'Main Item Name': r.PItemName,
      'Item Code': r.ItemCode,
      'Item Name': r.ItemName,
      Electrical: r.IsElectrical,
      'Progress Required': r.ProgReq,
      'Serial OR Bulk Entry': r.SrOrBulkEntry,
      'AMC Required': r.AmcReq,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MainEquipmentMapped');
    const stamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    XLSX.writeFile(wb, `MainEquipmentMapped_${stamp}.xlsx`);
  }
}
