import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RoleDto {
  RoleId: number;
  RoleName: string;
}

export interface MenuDto {
  MenuId: number;
  MenuName: string;
  MenuLink: string;
  MenuOrder: number;
  IsActive: boolean;
}

export interface SubMenuDto {
  SubMenuId: number;
  SubMenuName: string;
  SubMenuLink: string;
  MenuId: number;
  MenuName: string;
  SubMenuOrder: number;
  IsActive: boolean;
}

export interface SubMenuWithRoleStatusDto extends SubMenuDto {
  AddedOrNot: number;
}

export interface SubMenuRoleMappingDto {
  SMControlId: number;
  SubMenuId: number;
  SubMenuName: string;
  SubMenuLink: string;
  MenuId: number;
  MenuName: string;
  RoleId: number;
  RoleName: string;
}

export interface RoleMenuGridDto {
  MenuId: number;
  MenuName: string;
  RoleId: number;
  RoleName: string;
  NoOfSubMenus: number;
  MenuOrder: number;
}

export interface CreateSubMenuRequest {
  SubMenuName: string;
  SubMenuLink: string;
  MenuId: number;
}

export interface MapRoleScreenRequest {
  RoleId: number;
  MenuId: number;
  SubMenuIds: number[];
}

export interface RenameMenuRequest {
  NewName: string;
}

export interface RemoveSubMenuRoleRequest {
  SubMenuId: number;
  SMControlId: number;
}

@Injectable({ providedIn: 'root' })
export class RoleMenuService {
  private readonly api = `${environment.apiUrl}/IT`;

  constructor(private readonly http: HttpClient) {}

  getRoles(): Observable<RoleDto[]> {
    return this.http.get<RoleDto[]>(`${this.api}/roles`);
  }

  getMenus(): Observable<MenuDto[]> {
    return this.http.get<MenuDto[]>(`${this.api}/menus`);
  }

  getMenusAll(): Observable<MenuDto[]> {
    return this.http.get<MenuDto[]>(`${this.api}/menus/all`);
  }

  getSubMenus(menuId: number): Observable<SubMenuDto[]> {
    return this.http.get<SubMenuDto[]>(`${this.api}/menus/${menuId}/submenus`);
  }

  createSubMenu(req: CreateSubMenuRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/submenus`, req);
  }

  renameMenu(menuId: number, newName: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.api}/menus/${menuId}`, { NewName: newName });
  }

  renameSubMenu(id: number, newName: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.api}/submenus/${id}`, { NewName: newName });
  }

  getSubMenusWithRoleStatus(menuId: number, roleId: number): Observable<SubMenuWithRoleStatusDto[]> {
    return this.http.get<SubMenuWithRoleStatusDto[]>(
      `${this.api}/menus/${menuId}/submenus-with-role-status?roleId=${roleId}`
    );
  }

  getSubMenuMappingsForRole(roleId: number, menuId?: number): Observable<SubMenuRoleMappingDto[]> {
    let url = `${this.api}/roles/${roleId}/submenu-mappings`;
    if (menuId != null) url += `?menuId=${menuId}`;
    return this.http.get<SubMenuRoleMappingDto[]>(url);
  }

  mapScreensToRole(req: MapRoleScreenRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/roles/map-screens`, req);
  }

  getMenuGridForRole(roleId: number): Observable<RoleMenuGridDto[]> {
    return this.http.get<RoleMenuGridDto[]>(`${this.api}/roles/${roleId}/menu-grid`);
  }

  getSubMenusInRole(roleId: number, menuId: number): Observable<SubMenuRoleMappingDto[]> {
    return this.http.get<SubMenuRoleMappingDto[]>(
      `${this.api}/roles/${roleId}/menus/${menuId}/submenus-in-role`
    );
  }

  deleteMenuFromRole(roleId: number, menuId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/roles/${roleId}/menus/${menuId}`);
  }

  removeSubMenusFromRole(roleId: number, items: RemoveSubMenuRoleRequest[]): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/roles/${roleId}/remove-submenus`, items);
  }
}
