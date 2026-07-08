import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from 'src/app/service/theme.service';

export interface AppSidebarMenuItem {
  label: string;
  route: string;
  submenu?: { label: string; route: string }[];
}

@Component({
  selector: 'app-app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.css'],
})
export class AppSidebarComponent {
  @Input() menuItems: AppSidebarMenuItem[] = [];
  @Input() expandedMenus: Record<string, boolean> = {};
  @Input() menuSearch = '';
  @Input() collapsed = false;
  @Input() activeUrl = '';

  hoveredItem: AppSidebarMenuItem | null = null;
  hoveredFooter: string | null = null;
  flyoutLeft = 0;
  flyoutTop = 0;
  flyoutAlignCenter = false;
  private hoverLeaveTimer: ReturnType<typeof setTimeout> | null = null;

  @Output() submenuToggle = new EventEmitter<string>();
  @Output() navigate = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();
  @Output() collapsedChange = new EventEmitter<boolean>();

  constructor(public readonly themeService: ThemeService) {}

  get filteredItems(): AppSidebarMenuItem[] {
    const query = this.menuSearch.trim().toLowerCase();
    if (!query) {
      return this.menuItems;
    }
    return this.menuItems.filter((item) => {
      if (item.label.toLowerCase().includes(query)) {
        return true;
      }
      return item.submenu?.some((sub) => sub.label.toLowerCase().includes(query));
    });
  }

  filteredSubmenu(item: AppSidebarMenuItem): { label: string; route: string }[] {
    if (!item.submenu?.length) {
      return [];
    }
    const query = this.menuSearch.trim().toLowerCase();
    if (!query) {
      return item.submenu;
    }
    return item.submenu.filter(
      (sub) =>
        sub.label.toLowerCase().includes(query) || item.label.toLowerCase().includes(query),
    );
  }

  isSubmenuExpanded(item: AppSidebarMenuItem): boolean {
    if (this.menuSearch.trim()) {
      return this.filteredSubmenu(item).length > 0;
    }
    return !!this.expandedMenus[item.label];
  }

  isRouteActive(route: string): boolean {
    if (!route) {
      return false;
    }
    const currentPath = this.normalizePath(this.activeUrl);
    const targetPath = this.normalizePath(route);
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  }

  private normalizePath(url: string): string {
    return (url || '').split('?')[0].split('#')[0];
  }

  toggleCollapse(): void {
    this.collapsedChange.emit(!this.collapsed);
  }

  onSubmenuClick(label: string): void {
    if (this.collapsed) {
      return;
    }
    this.submenuToggle.emit(label);
  }

  onNavHover(item: AppSidebarMenuItem, event?: MouseEvent): void {
    if (!this.collapsed) {
      return;
    }
    if (this.hoverLeaveTimer) {
      clearTimeout(this.hoverLeaveTimer);
      this.hoverLeaveTimer = null;
    }
    this.hoveredItem = item;
    this.hoveredFooter = null;
    this.updateFlyoutPosition(event, !item.submenu?.length);
  }

  onNavLeave(): void {
    this.hoverLeaveTimer = setTimeout(() => {
      this.hoveredItem = null;
      this.hoverLeaveTimer = null;
    }, 160);
  }

  isItemHovered(item: AppSidebarMenuItem): boolean {
    return this.hoveredItem?.label === item.label;
  }

  onFlyoutEnter(item: AppSidebarMenuItem): void {
    if (!this.collapsed) {
      return;
    }
    if (this.hoverLeaveTimer) {
      clearTimeout(this.hoverLeaveTimer);
      this.hoverLeaveTimer = null;
    }
    this.hoveredItem = item;
  }

  onFooterHover(key: string, event?: MouseEvent): void {
    if (!this.collapsed) {
      return;
    }
    if (this.hoverLeaveTimer) {
      clearTimeout(this.hoverLeaveTimer);
      this.hoverLeaveTimer = null;
    }
    this.hoveredFooter = key;
    this.hoveredItem = null;
    this.updateFlyoutPosition(event, true);
  }

  onFooterLeave(): void {
    this.hoverLeaveTimer = setTimeout(() => {
      this.hoveredFooter = null;
      this.hoverLeaveTimer = null;
    }, 160);
  }

  private updateFlyoutPosition(event: MouseEvent | undefined, alignCenter: boolean): void {
    const target = event?.currentTarget;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const rect = target.getBoundingClientRect();
    this.flyoutLeft = rect.right + 10;
    this.flyoutTop = alignCenter ? rect.top + rect.height / 2 : rect.top;
    this.flyoutAlignCenter = alignCenter;
  }

  onNavigate(): void {
    this.navigate.emit();
  }

  onLogout(): void {
    this.logoutClick.emit();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isItemActive(item: AppSidebarMenuItem): boolean {
    if (item.route && this.isRouteActive(item.route)) {
      return true;
    }
    return !!item.submenu?.some((sub) => this.isRouteActive(sub.route));
  }

  menuIcon(label: string): string {
    const key = label.trim().toLowerCase();
    if (key === 'home') return 'home';
    if (key === 'masters' || key.startsWith('master')) return 'dataset';
    if (key === 'orders' || key.startsWith('order')) return 'shopping_cart';
    if (key === 'transaction' || key.includes('transaction')) return 'sync_alt';
    if (key === 'contracts' || key.startsWith('contract')) return 'handshake';
    if (key.includes('dashboard') || key.includes('dash')) return 'dashboard';
    if (key.includes('oracle') || key.includes('analytics')) return 'analytics';
    if (key.includes('report')) return 'assessment';
    if (key.includes('payment') || key.includes('finance') || key.includes('sanction')) return 'payments';
    if (key.includes('receipt') || key.includes('installation')) return 'fact_check';
    if (key.includes('dispatch') || key.includes('supply')) return 'local_shipping';
    if (key.includes('purchase') && key.includes('po')) return 'inventory_2';
    if (key.includes('tender') || key.includes('rc ')) return 'description';
    if (key.includes('complain')) return 'report_problem';
    if (key.includes('emd') || key.includes('deposit')) return 'savings';
    if (key.includes('attendance')) return 'schedule';
    if (key.includes('stock') || key.includes('warehouse') || key.includes('indent')) return 'inventory_2';
    if (key.includes('noc')) return 'verified';
    if (key.includes('setting')) return 'settings';
    if (key.includes('registration') || key.includes('vendor') || key.includes('supplier')) return 'badge';
    if (key.includes('gst')) return 'receipt_long';
    return 'folder_open';
  }

  subMenuIcon(label: string, parentLabel: string): string {
    const key = label.trim().toLowerCase();
    const parentKey = parentLabel.trim().toLowerCase();
    if (parentKey === 'masters' || parentKey.startsWith('master')) {
      if (key.includes('gst')) return 'receipt_long';
      if (key.includes('supplier')) return 'person';
      return 'badge';
    }
    if (parentKey === 'orders' || parentKey.startsWith('order')) {
      return 'shopping_bag';
    }
    if (parentKey === 'transaction' || parentKey.includes('transaction')) {
      if (key.includes('dispatch')) return 'local_shipping';
      if (key.includes('receipt') || key.includes('installation')) return 'fact_check';
      return 'sync_alt';
    }
    if (parentKey === 'contracts' || parentKey.startsWith('contract')) {
      if (key.includes('accepted') || key.includes('price')) return 'price_check';
      return 'description';
    }
    if (key.includes('print')) return 'print';
    if (key.includes('status')) return 'pending_actions';
    if (key.includes('planning')) return 'event_note';
    if (key.includes('stock')) return 'inventory';
    if (key.includes('expiry')) return 'hourglass_bottom';
    if (key.includes('pipeline')) return 'timeline';
    if (key.includes('analysis') || key.includes('abc')) return 'insights';
    if (key.includes('qc')) return 'science';
    if (key.includes('facility') || key.includes('information')) return 'apartment';
    if (parentKey.includes('oracle')) return 'query_stats';
    if (parentKey.includes('report')) return 'bar_chart';
    return 'subdirectory_arrow_right';
  }
}
