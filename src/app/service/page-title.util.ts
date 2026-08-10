export interface MenuTitleItem {
  label: string;
  route: string;
  submenu?: { label: string; route: string }[];
}

/** Routes not listed in sidebar menu — use explicit titles. */
const EXTRA_ROUTE_TITLES: Record<string, string> = {
  '/orders/po-supply': 'Purchase Orders Desk',
  '/transaction/po-supply-dispatch': 'Purchase Orders Dispatch Desk',
  '/transaction/po-supply-receipt': 'Consignee Wise PO-Receipt/Installation Details',
  '/masters/particular-supplier-add': 'Supplier Information',
  '/masters/supplier-gst-entry': 'Supplier GST Entry',
  '/reports/payment-report': 'Paid Report of Purchase Orders',
  '/reports/pending-receipt-installation': 'Pending Receipt / Installation',
  '/complain/receipt-complain-supplier': 'Complain Received Against Equipment',
  '/emd-refund/emd-deposit': 'EMD Refund Request Form',
  '/contracts/rc-detail-report-supplier': 'Rate Contract Detail Report',
  '/contracts/accepted-report-supplier': 'Price Accepted By CGMSC',
  '/orders/po-supply-sd-detail': 'Security Deposit Detail', 
  '/orders/po-supply-apply-extension': 'Apply For Extension',
  '/transaction/po-supply-dispatch-edit': 'Dispatch Equipment Desk',
  '/transaction/po-supply-dispatch-entry': 'Dispatch Entry of Equipments',
  '/transaction/po-supply-receipt-entry': 'Receipt / Installation Entry',
  '/transaction/po-supply-installation-report': 'Installation Report',
  '/transaction/po-supply-dispatch-report': 'Dispatch Details',
  '/transaction/po-supply-installation-print': 'Installation Report Print',
  '/transaction/po-supply-po-print': 'Purchase Order Print',
};

export function resolvePageTitle(path: string, menuItems: MenuTitleItem[]): string {
  const normalized = path.split('?')[0].split('#')[0];

  if (EXTRA_ROUTE_TITLES[normalized]) {
    return EXTRA_ROUTE_TITLES[normalized];
  }

  let bestMatch = '';
  let bestLength = 0;

  for (const item of menuItems) {
    if (item.submenu?.length) {
      for (const sub of item.submenu) {
        if (!sub.route) {
          continue;
        }
        const subPath = sub.route.split('?')[0].split('#')[0];
        if (
          (normalized === subPath || normalized.startsWith(`${subPath}/`)) &&
          subPath.length > bestLength
        ) {
          bestMatch = sub.label.trim();
          bestLength = subPath.length;
        }
      }
      continue;
    }

    if (!item.route) {
      continue;
    }
    const itemPath = item.route.split('?')[0].split('#')[0];
    if (
      (normalized === itemPath || normalized.startsWith(`${itemPath}/`)) &&
      itemPath.length > bestLength
    ) {
      bestMatch = item.label.trim();
      bestLength = itemPath.length;
    }
  }

  return bestMatch;
}
