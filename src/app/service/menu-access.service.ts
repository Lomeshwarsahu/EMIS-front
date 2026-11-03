import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export interface AccessMenuItem {
  label: string;
  route?: string;
  submenu?: AccessMenuItem[];
  [key: string]: any;
}

// The logged-in role's menu (same items as the sidebar: DB sidebar tree, or the static fallback) and the pages
// it allows. A route counts as allowed when it opens the same page as one of the menu routes, so aliases
// (e.g. /tender/plan and /PlanaTenderD) and redirects match.
@Injectable({ providedIn: 'root' })
export class MenuAccessService {
  // null = menu not loaded yet
  private readonly menuSubject = new BehaviorSubject<AccessMenuItem[] | null>(null);
  readonly menu$ = this.menuSubject.asObservable();

  private allowedPages = new Set<string>();

  constructor(private readonly router: Router) {}

  setMenu(items: AccessMenuItem[] | null) {
    this.allowedPages.clear();
    for (const route of this.flattenRoutes(items || [])) {
      const key = this.pageKey(route);
      if (key) this.allowedPages.add(key);
    }
    this.menuSubject.next(items);
  }

  get loaded(): boolean {
    return this.menuSubject.value !== null;
  }

  canOpen(route: string | null | undefined): boolean {
    const key = this.pageKey(route || '');
    return !!key && this.allowedPages.has(key);
  }

  private flattenRoutes(items: AccessMenuItem[]): string[] {
    const out: string[] = [];
    for (const item of items) {
      if (item.route) out.push(item.route);
      if (item.submenu?.length) out.push(...this.flattenRoutes(item.submenu));
    }
    return out;
  }

  // Identifies the page a URL opens: the route's component (or lazy import), following redirects
  private pageKey(url: string, depth = 0): string {
    const path = (url || '').split(/[?#]/)[0].replace(/^\/+|\/+$/g, '').toLowerCase();
    if (!path) return '';
    const config: Route | undefined = this.router.config.find((r) => (r.path ?? '').toLowerCase() === path);
    if (!config) return 'path:' + path;
    if (typeof config.redirectTo === 'string' && depth < 5) {
      return this.pageKey(config.redirectTo, depth + 1);
    }
    if (config.component) return 'cmp:' + config.component.name;
    if (config.loadComponent) return 'lazy:' + config.loadComponent.toString();
    return 'path:' + path;
  }
}
