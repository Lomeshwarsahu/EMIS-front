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
  RoleDto,
  RoleMenuGridDto,
  SubMenuRoleMappingDto,
} from '../../../service/role-menu.service';

@Component({
  selector: 'app-delete-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DmePageSkeletonComponent,
  ],
  templateUrl: './delete-menu.component.html',
  styleUrls: ['./delete-menu.component.css'],
})
export class DeleteMenuComponent implements OnInit {
  loading = false;
  roles: RoleDto[] = [];
  menuGrid: RoleMenuGridDto[] = [];
  subMenusInRole: SubMenuRoleMappingDto[] = [];

  selectedRoleId: number | null = null;
  showModal = false;
  modalMenuName = '';
  modalMenuId = 0;

  // Inline rename
  editMenuId: number | null = null;
  editMenuName = '';
  editSubMenuId: number | null = null;
  editSubMenuName = '';

  // Sub-menu selection for removal
  selectedForRemoval: Set<number> = new Set();

  gridDataSource = new MatTableDataSource<RoleMenuGridDto>([]);
  gridColumns = ['sno', 'roleName', 'menuName', 'noOfSubMenus', 'menuAction', 'subMenuAction', 'renameMenu'];

  subMenuDataSource = new MatTableDataSource<SubMenuRoleMappingDto>([]);
  subMenuColumns = ['sno', 'subMenuName', 'subMenuLink', 'check', 'renameSubMenu'];

  @ViewChild('gridSort') gridSort!: MatSort;
  @ViewChild('subSort') subSort!: MatSort;

  constructor(
    private readonly itApi: RoleMenuService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.itApi.getRoles().subscribe({
      next: (res) => (this.roles = res),
      error: () => this.toastr.error('Failed to load roles.'),
    });
  }

  onRoleChange(): void {
    if (!this.selectedRoleId) {
      this.menuGrid = [];
      this.gridDataSource.data = [];
      return;
    }
    this.loading = true;
    this.itApi.getMenuGridForRole(this.selectedRoleId).subscribe({
      next: (res) => {
        this.menuGrid = res;
        this.gridDataSource.data = res;
        setTimeout(() => (this.gridDataSource.sort = this.gridSort));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to load menu grid.');
      },
    });
  }

  deleteMenu(menuId: number): void {
    if (!this.selectedRoleId) return;
    if (!confirm('Are you sure you want to remove this menu from the role?')) return;

    this.itApi.deleteMenuFromRole(this.selectedRoleId, menuId).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.onRoleChange();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Cannot delete menu.');
      },
    });
  }

  openSubMenuModal(menuId: number, menuName: string): void {
    if (!this.selectedRoleId) return;
    this.modalMenuId = menuId;
    this.modalMenuName = menuName;
    this.selectedForRemoval.clear();
    this.showModal = true;

    this.itApi.getSubMenusInRole(this.selectedRoleId, menuId).subscribe({
      next: (res) => {
        this.subMenusInRole = res;
        this.subMenuDataSource.data = res;
        setTimeout(() => (this.subMenuDataSource.sort = this.subSort));
      },
      error: () => {
        this.toastr.error('Failed to load sub-menus.');
      },
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.subMenusInRole = [];
    this.subMenuDataSource.data = [];
    this.selectedForRemoval.clear();
  }

  toggleRemoval(smControlId: number): void {
    if (this.selectedForRemoval.has(smControlId)) {
      this.selectedForRemoval.delete(smControlId);
    } else {
      this.selectedForRemoval.add(smControlId);
    }
  }

  removeSelected(): void {
    if (!this.selectedRoleId || this.selectedForRemoval.size === 0) return;

    const items = this.subMenusInRole
      .filter((s) => this.selectedForRemoval.has(s.SMControlId))
      .map((s) => ({ SubMenuId: s.SubMenuId, SMControlId: s.SMControlId }));

    this.itApi.removeSubMenusFromRole(this.selectedRoleId, items).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.selectedForRemoval.clear();
        this.openSubMenuModal(this.modalMenuId, this.modalMenuName);
        this.onRoleChange();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Failed to remove sub-menus.');
      },
    });
  }

  startRenameMenu(menuId: number, currentName: string): void {
    this.editMenuId = menuId;
    this.editMenuName = currentName;
  }

  saveRenameMenu(): void {
    if (!this.editMenuId || !this.editMenuName.trim()) return;
    this.itApi.renameMenu(this.editMenuId, this.editMenuName.trim()).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.editMenuId = null;
        this.onRoleChange();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Failed to rename.');
      },
    });
  }

  startRenameSubMenu(subMenuId: number, currentName: string): void {
    this.editSubMenuId = subMenuId;
    this.editSubMenuName = currentName;
  }

  saveRenameSubMenu(): void {
    if (!this.editSubMenuId || !this.editSubMenuName.trim()) return;
    this.itApi.renameSubMenu(this.editSubMenuId, this.editSubMenuName.trim()).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.editSubMenuId = null;
        this.openSubMenuModal(this.modalMenuId, this.modalMenuName);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message ?? 'Failed to rename.');
      },
    });
  }
}
