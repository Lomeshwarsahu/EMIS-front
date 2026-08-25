import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'src/app/collapse';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialModule } from 'src/app/material-module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { SupplierPageSkeletonComponent } from 'src/app/component/Suppliers/supplier-page-skeleton/supplier-page-skeleton.component';

@Component({
  selector: 'app-fac-stock-covid-items-bme',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MaterialModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatTableExporterModule,
    CollapseModule,
    NgbCollapseModule,
    SupplierPageSkeletonComponent,
  ],
  templateUrl: './fac-stock-covid-items-bme.component.html',
  styleUrls: [
    '../../component/Suppliers/supplier-po-pages.shared.css',
    './fac-stock-covid-items-bme.component.css'
  ],
})
export class FacStockCovidItemsBmeComponent implements OnInit {
  Itemlist: any[] = [];
  Districtlist: any[] = [];
  Facilitylist: any[] = [];
  selectedItem: any;
  selectedDistrict: any;
  selectedFacility: any;
  status: string = 'All';
  reportData: any[] = [];
  dataSource!: MatTableDataSource<any>;
  loading: boolean = false;

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('sort') sort!: MatSort;

  displayedColumns: string[] = [
    'sno', 'item_name', 'item_code', 'location', 'make',
    'model_no', 'installation_date', 'warranty', 'serial_no', 'status'
  ];

  constructor(
    private api: ApiService,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.GetItems();
    this.GetDistricts();
  }

  GetItems() {
    this.api.get(`Reports/GetItems`).subscribe({
      next: (res: any) => {
        this.Itemlist = res || [];
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  GetDistricts() {
    this.api.get(`Reports/GetDistricts`).subscribe({
      next: (res: any) => {
        this.Districtlist = res;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  onDistrictChange() {
    this.selectedFacility = null;
    this.Facilitylist = [];
    if (this.selectedDistrict) {
      this.api.get(`Reports/GetFacilities?districtId=${this.selectedDistrict}`).subscribe({
        next: (res: any) => {
          this.Facilitylist = res || [];
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    }
  }

  loadData() {
    this.loading = true;
    const districtId = this.selectedDistrict || '';
    const facilityId = this.selectedFacility || '';
    const itemId = this.selectedItem || '';
    const statusParam = this.status || 'All';

    this.api.get(`Reports/fac-stock-covid?districtId=${districtId}&facilityId=${facilityId}&itemId=${itemId}&status=${statusParam}`)
      .subscribe({
        next: (res: any) => {
          this.reportData = (res || []).map((item: any, index: number) => ({
            ...item,
            sno: index + 1,
          }));
          this.dataSource.data = this.reportData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cdr.detectChanges();
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.toastr.error(err.error?.message || 'Error fetching data');
          console.error('Error fetching data:', err);
        },
      });
  }

  exportToExcel() {
    const exporter: any = document.querySelector('[matTableExporter]');
    if (exporter && exporter.exportTable) {
      exporter.exportTable('xlsx', {
        fileName: 'FacStockCovidItemsBME',
        sheet: 'Data',
        Props: { Author: 'cgmsc' },
      });
    }
  }
}
