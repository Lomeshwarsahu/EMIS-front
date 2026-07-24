import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DmePageSkeletonComponent } from '../../DME/shared/dme-page-skeleton/dme-page-skeleton.component';
import {
  RoleMenuService,
  MenuDto,
  RoleDto,
  SubMenuWithRoleStatusDto,
  SubMenuRoleMappingDto,
} from '../../../service/role-menu.service';

@Component({
  selector: 'app-add-role-in-screen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './add-role-in-screen.component.html',
  styleUrls: ['./add-role-in-screen.component.css'],
})
export class AddRoleInScreenComponent implements OnInit {
  loading = false;
  menus: MenuDto[] = [];
  roles: RoleDto[] = [];
  subMenus: SubMenuWithRoleStatusDto[] = [];
  assignedSubMenus: SubMenuRoleMappingDto[] = [];

  selectedMenuId: number | null = null;
  selectedRoleId: number | null = null;

  topDataSource = new MatTableDataSource<SubMenuWithRoleStatusDto>([]);
  bottomDataSource = new MatTableDataSource<SubMenuRoleMappingDto>([]);
  topColumns = ['check', 'sno', 'subMenuName', 'subMenuLink', 'status'];
  bottomColumns = ['sno', 'menuName', 'subMenuName', 'subMenuLink'];

  selectedSubMenuIds: Set<number> = new Set();

  @ViewChild('topSort') topSort!: MatSort;
  @ViewChild('bottomSort') bottomSort!: MatSort;

  constructor(
    private readonly itApi: RoleMenuService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.itApi.getMenus().subscribe({
      next: (res) => (this.menus = res),
      error: () => this.toastr.error('Failed to load menus.'),
    });
    this.itApi.getRoles().subscribe({
      next: (res) => (this.roles = res),
      error: () => this.toastr.error('Failed to load roles.'),
    });
  }

  onMenuChange(): void {
    this.selectedSubMenuIds.clear();
    if (!this.selectedMenuId || !this.selectedRoleId) {
      this.subMenus = [];
      this.topDataSource.data = [];
      return;
    }
    this.loading = true;
    this.itApi.getSubMenusWithRoleStatus(this.selectedMenuId, this.selectedRoleId).subscribe({
      next: (res) => {
        this.subMenus = res;
        this.topDataSource.data = res;
        setTimeout(() => (this.topDataSource.sort = this.topSort));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load sub-menus.');
      },
    });
    this.loadAssignedSubMenus();
  }

  onRoleChange(): void {
    this.onMenuChange();
  }

  loadAssignedSubMenus(): void {
    if (!this.selectedRoleId || !this.selectedMenuId) return;
    this.itApi.getSubMenuMappingsForRole(this.selectedRoleId, this.selectedMenuId).subscribe({
      next: (res) => {
        this.assignedSubMenus = res;
        this.bottomDataSource.data = res;
        setTimeout(() => (this.bottomDataSource.sort = this.bottomSort));
      },
    });
  }

  toggleSelection(subMenuId: number): void {
    if (this.selectedSubMenuIds.has(subMenuId)) {
      this.selectedSubMenuIds.delete(subMenuId);
    } else {
      this.selectedSubMenuIds.add(subMenuId);
    }
  }

  isSelected(subMenuId: number): boolean {
    return this.selectedSubMenuIds.has(subMenuId);
  }

  mapSelected(): void {
    if (!this.selectedRoleId || !this.selectedMenuId) {
      this.toastr.warning('Please select both menu and role.');
      return;
    }
    if (this.selectedSubMenuIds.size === 0) {
      this.toastr.warning('Please select at least one sub-menu.');
      return;
    }

    this.itApi
      .mapScreensToRole({
        RoleId: this.selectedRoleId,
        MenuId: this.selectedMenuId,
        SubMenuIds: Array.from(this.selectedSubMenuIds),
      })
      .subscribe({
        next: (res) => {
          this.toastr.success(res.message);
          this.selectedSubMenuIds.clear();
          this.onMenuChange();
        },
        error: (err) => {
          this.toastr.error(err?.error?.message ?? 'Failed to map screens.');
        },
      });
  }
}
