import { Router } from '@angular/router';

export const PO_SUPPLY_ROUTE = '/orders/po-supply';

export interface PoSupplyListFilters {
  financialYearId: number;
  tenderId: number;
}

export function readPoSupplyListFilters(params: Record<string, unknown>): PoSupplyListFilters {
  return {
    financialYearId: Number(params['financialYearId'] ?? params['fyId'] ?? 0),
    tenderId: Number(params['tenderId'] ?? 0),
  };
}

export function poSupplyListQuery(filters: PoSupplyListFilters): Record<string, number> {
  const query: Record<string, number> = {};
  if (filters.financialYearId > 0) {
    query['financialYearId'] = filters.financialYearId;
  }
  if (filters.tenderId > 0) {
    query['tenderId'] = filters.tenderId;
  }
  return query;
}

export function navigateToPoSupply(router: Router, filters: PoSupplyListFilters): void {
  router.navigate([PO_SUPPLY_ROUTE], { queryParams: poSupplyListQuery(filters) });
}
