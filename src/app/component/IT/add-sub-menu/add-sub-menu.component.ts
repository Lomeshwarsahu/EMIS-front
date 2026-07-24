import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import {
  RoleMenuService,
  MenuDto,
  SubMenuDto,
} from '../../../service/role-menu.service';

@Component({
  selector: 'app-add-sub-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './add-sub-menu.component.html',
  styleUrls: ['./add-sub-menu.component.css'],
})
export class AddSubMenuComponent implements OnInit {
  loading = false;
  saving = false;
  showForm = true;
  menus: MenuDto[] = [];
  subMenus: SubMenuDto[] = [];
  dataSource = new MatTableDataSource<SubMenuDto>([]);
  displayedColumns = ['sno', 'menuName', 'subMenuName', 'subMenuLink', 'isActive'];

  selectedMenuId: number | null = null;
  newSubMenuName = '';
  newSubMenuLink = '';

  @ViewChild('sort') sort!: MatSort;

  constructor(
    private readonly itApi: RoleMenuService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.itApi.getMenus().subscribe({
      next: (res) => (this.menus = res),
      error: () => this.toastr.error('Failed to load menus.'),
    });
  }

  onMenuChange(): void {
    if (!this.selectedMenuId) {
      this.subMenus = [];
      this.dataSource.data = [];
      return;
    }
    this.loading = true;
    this.itApi.getSubMenus(this.selectedMenuId).subscribe({
      next: (res) => {
        this.subMenus = res;
        this.dataSource.data = res;
        setTimeout(() => (this.dataSource.sort = this.sort));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load sub-menus.');
      },
    });
  }

  save(): void {
    if (!this.selectedMenuId) {
      this.toastr.warning('Please select a parent menu.');
      return;
    }
    if (!this.newSubMenuName.trim() || !this.newSubMenuLink.trim()) {
      this.toastr.warning('Please enter sub-menu name and link.');
      return;
    }
    if (!this.newSubMenuLink.trim().endsWith('.aspx')) {
      this.toastr.warning('Link must end with .aspx');
      return;
    }

    this.saving = true;
    this.itApi
      .createSubMenu({
        SubMenuName: this.newSubMenuName.trim(),
        SubMenuLink: this.newSubMenuLink.trim(),
        MenuId: this.selectedMenuId,
      })
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.newSubMenuName = '';
          this.newSubMenuLink = '';
          this.onMenuChange();
          this.saving = false;
        },
        error: (err) => {
          this.saving = false;
          this.toastr.error(err?.error?.message ?? 'Failed to create sub-menu.');
        },
      });
  }
}
