import { Router } from '@angular/router';

export const PO_SUPPLY_DISPATCH_ROUTE = '/transaction/po-supply-dispatch';
export const PO_SUPPLY_RECEIPT_ROUTE = '/transaction/po-supply-receipt';

export interface PoSupplyDispatchFilters {
  financialYearId: number;
  tenderId: number;
}

export interface PoSupplyReceiptFilters {
  financialYearId: number;
  poType: string;
  poId: number;
}

export function readPoSupplyDispatchFilters(params: Record<string, unknown>): PoSupplyDispatchFilters {
  return {
    financialYearId: Number(params['financialYearId'] ?? params['fyId'] ?? 0),
    tenderId: Number(params['tenderId'] ?? 0),
  };
}

export function poSupplyDispatchQuery(filters: PoSupplyDispatchFilters): Record<string, number> {
  const query: Record<string, number> = {};
  if (filters.financialYearId > 0) {
    query['financialYearId'] = filters.financialYearId;
  }
  if (filters.tenderId > 0) {
    query['tenderId'] = filters.tenderId;
  }
  return query;
}

export function navigateToPoSupplyDispatch(router: Router, filters: PoSupplyDispatchFilters): void {
  router.navigate([PO_SUPPLY_DISPATCH_ROUTE], { queryParams: poSupplyDispatchQuery(filters) });
}

export function readPoSupplyReceiptFilters(params: Record<string, unknown>): PoSupplyReceiptFilters {
  return {
    financialYearId: Number(params['financialYearId'] ?? params['fyId'] ?? 0),
    poType: String(params['poType'] ?? 'All'),
    poId: Number(params['poId'] ?? 0),
  };
}

export function poSupplyReceiptQuery(filters: PoSupplyReceiptFilters): Record<string, string | number> {
  const query: Record<string, string | number> = {};
  if (filters.financialYearId > 0) {
    query['financialYearId'] = filters.financialYearId;
  }
  if (filters.poType && filters.poType !== 'All') {
    query['poType'] = filters.poType;
  }
  if (filters.poId > 0) {
    query['poId'] = filters.poId;
  }
  return query;
}

export function navigateToPoSupplyReceipt(router: Router, filters: PoSupplyReceiptFilters): void {
  router.navigate([PO_SUPPLY_RECEIPT_ROUTE], { queryParams: poSupplyReceiptQuery(filters) });
}
