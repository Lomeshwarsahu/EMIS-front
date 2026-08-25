import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DmePageSkeletonComponent } from '../../component/DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import { apiErrorMessage } from '../../component/DME/shared/session.util';

interface YearOption {
  Key: number;
  Value: string;
}

interface DirectorateOption {
  Key: number;
  Value: string;
}

interface ItemOption {
  ItemCode: string;
  ItemName: string;
}

interface EligibleSummaryRow {
  FacilityAutCode: string;
  NoofConsinee: number;
  NoofItems: number;
}

interface EligibleDetailRow {
  UserId: number;
  UserName: string;
  Year: string;
  ConsolidatedDate: string;
  IndentConNo: string;
  Description: string;
  ItemCode: string;
  ItemName: string;
  FacilityAutCode: string;
  IndentQty: number;
  PoQty: number;
  BalancePo: number;
  BasicRate: number;
  TenderNo: string;
}

@Component({
  selector: 'app-eligible-report',
  standalone: true,
  imports: [CommonModule, FormsModule, DmePageSkeletonComponent],
  templateUrl: './eligible-report.component.html',
  styleUrls: ['./component.css'],
})
export class EligibleReportComponent implements OnInit {
  private readonly apiRoot = `${environment.apiUrl}/DMEReports/`;

  financialYears: YearOption[] = [];
  directorates: DirectorateOption[] = [];
  items: ItemOption[] = [];

  selectedYear = 0;
  selectedDirectorate = 0;
  selectedItem = '0';

  summaryRows: EligibleSummaryRow[] = [];
  detailRows: EligibleDetailRow[] = [];
  view: 'none' | 'summary' | 'detail' = 'none';
  loading = false;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadYears();
    this.loadDirectorates();
    this.loadItems();
  }

  showSummary(): void {
    this.view = 'none';
    this.loading = true;
    this.http.get<EligibleSummaryRow[]>(`${this.apiRoot}eligible-summary`).subscribe({
      next: (res) => {
        this.summaryRows = this.mapSummary(res);
        this.view = 'summary';
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.toastr.error(apiErrorMessage(e, 'Could not load eligibility summary.'));
      },
    });
  }

  showDetail(): void {
    if (!this.selectedYear || !this.selectedDirectorate) {
      this.toastr.warning('Select Financial Year and Directorate.');
      return;
    }
    this.view = 'none';
    this.loading = true;
    let params = new HttpParams()
      .set('financialYearId', String(this.selectedYear))
      .set('authorityId', String(this.selectedDirectorate));
    if (this.selectedItem !== '0') {
      params = params.set('itemCode', this.selectedItem);
    }
    this.http
      .get<EligibleDetailRow[]>(`${this.apiRoot}eligible-detail`, { params })
      .subscribe({
        next: (res) => {
          this.detailRows = this.mapDetail(res);
          this.view = 'detail';
          this.loading = false;
        },
        error: (e) => {
          this.loading = false;
          this.toastr.error(apiErrorMessage(e, 'Could not load eligibility detail.'));
        },
      });
  }

  private loadYears(): void {
    this.http.get<YearOption[]>(`${this.apiRoot}eligible-financial-years`).subscribe({
      next: (res) => {
        this.financialYears = [{ Key: 0, Value: '--Select Fin Year--' }, ...this.mapPairs(res)];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load financial years.')),
    });
  }

  private loadDirectorates(): void {
    this.http.get<DirectorateOption[]>(`${this.apiRoot}eligible-directorates`).subscribe({
      next: (res) => {
        this.directorates = [{ Key: 0, Value: '--Select Directorate--' }, ...this.mapPairs(res)];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load directorates.')),
    });
  }

  private loadItems(): void {
    this.http.get<ItemOption[]>(`${this.apiRoot}eligible-items`).subscribe({
      next: (res) => {
        this.items = [{ ItemCode: '0', ItemName: '--All--' }, ...(Array.isArray(res) ? res : [])];
      },
      error: (e) => this.toastr.error(apiErrorMessage(e, 'Could not load items.')),
    });
  }

  private mapPairs(raw: unknown): YearOption[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      Key: Number(r['Key'] ?? r['key'] ?? 0),
      Value: String(r['Value'] ?? r['value'] ?? ''),
    }));
  }

  private mapSummary(raw: unknown): EligibleSummaryRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      FacilityAutCode: String(r['Key'] ?? r['key'] ?? ''),
      NoofConsinee: Number(r['Value'] ?? r['value'] ?? 0),
      NoofItems: Number(r['NoofItems'] ?? r['noofItems'] ?? r['noof_items'] ?? 0),
    }));
  }

  private mapDetail(raw: unknown): EligibleDetailRow[] {
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((r: Record<string, unknown>) => ({
      UserId: Number(r['UserId'] ?? r['userId'] ?? 0),
      UserName: String(r['UserName'] ?? r['userName'] ?? ''),
      Year: String(r['Year'] ?? r['year'] ?? ''),
      ConsolidatedDate: String(r['ConsolidatedDate'] ?? r['consolidatedDate'] ?? ''),
      IndentConNo: String(r['IndentConNo'] ?? r['indentConNo'] ?? ''),
      Description: String(r['Description'] ?? r['description'] ?? ''),
      ItemCode: String(r['ItemCode'] ?? r['itemCode'] ?? ''),
      ItemName: String(r['ItemName'] ?? r['itemName'] ?? ''),
      FacilityAutCode: String(r['FacilityAutCode'] ?? r['facilityAutCode'] ?? ''),
      IndentQty: Number(r['IndentQty'] ?? r['indentQty'] ?? 0),
      PoQty: Number(r['PoQty'] ?? r['poQty'] ?? 0),
      BalancePo: Number(r['BalancePo'] ?? r['balancePo'] ?? 0),
      BasicRate: Number(r['BasicRate'] ?? r['basicRate'] ?? 0),
      TenderNo: String(r['TenderNo'] ?? r['tenderNo'] ?? ''),
    }));
  }
}
