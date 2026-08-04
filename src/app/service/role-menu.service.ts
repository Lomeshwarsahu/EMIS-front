import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const ROUTE_MAP: Record<string, string> = {
  // --- 1. Master Module ---
  '/master/storehome.aspx': '/masters/store-home',
  '/master/facility_home.aspx': '/masters/store-home',
  '/master/consigeeinformation.aspx': '/masters/consignee-information',
  '/master/reportspecification.aspx': '/masters/report-specification',
  '/master/cmeeelsuggestion.aspx': '/masters/cme-eel-suggestion',
  '/master/dhsaddfacility.aspx': '/masters/dhs-add-facility',
  '/master/dhsfacilityuserslocations.aspx': '/masters/dhs-facility-users-locations',
  '/master/healthfacilitydetails.aspx': '/masters/health-facility-details',
  '/master/itemspecification.aspx': '/masters/item-specification',
  '/master/masfacilityuserslocations.aspx': '/masters/mas-facility-users-locations',
  '/master/mastersupplieradd.aspx': '/masters/master-supplier-add',
  '/master/particularsupplieradd.aspx': '/masters/particular-supplier-add',
  '/master/suppliergstentry1.aspx': '/masters/supplier-gst-entry',

  // --- 2. Stock Module ---
  '/stock/facstockcoviditemsmc.aspx': '/stock/covid-stock-report',
  '/stock/existingcoviditemsdme.aspx': '/stock/opening-stock-entry',
  '/stock/newcoviditemdme.aspx': '/stock/new-opening-stock-entry',
  '/stock/facstockcmho.aspx': '/stock/covid-stock-report',
  '/stock/facprogress4cat.aspx': '/stock/progress-category',
  '/stock/facilityequipmentreceipt.aspx': '/stock/facility-receipts',
  '/stock/nodleinformationnew.aspx': '/stock/nodal-information',
  '/stock/progressdetail.aspx': '/stock/nodal-progress',
  '/stock/progressdetaildme.aspx': '/stock/nodal-progress',

  // --- 3. Orders & Transactions Module ---
  '/order/podashboarddmefac.aspx': '/orders/purchase-order-dashboard',
  '/order/facilitypo_supply_editdme.aspx': '/orders/purchase-order-receipts',
  '/order/masfileno.aspx': '/orders/mas-file-no',
  '/order/reportpoeligible.aspx': '/reports/eligible-report',
  '/order/porealloaction.aspx': '/orders/po-reallocation',
  '/order/emspoammendment.aspx': '/orders/po-amendment',
  '/order/payment20per.aspx': '/orders/withheld-release',
  '/order/paymentletter.aspx': '/payment-letter',
  '/order/poreceiptentry.aspx': '/orders/po-receipt-entry',
  '/order/facilitypo_supply_receiptdme.aspx': '/orders/po-receipt-entry',
  '/order/poinstallationreport.aspx': '/orders/po-installation-report',
  '/order/facility_installationreportdme.aspx': '/orders/po-installation-report',
  '/order/poprint.aspx': '/orders/po-print',
  '/order/rdlcporeportdme.aspx': '/orders/po-print',
  '/orders/po-supply.aspx': '/orders/po-supply',
  '/orders/po-supply-sd-detail.aspx': '/orders/po-supply-sd-detail',
  '/orders/po-supply-apply-extension.aspx': '/orders/po-supply-apply-extension',
  '/transaction/po-supply-dispatch.aspx': '/transaction/po-supply-dispatch',
  '/transaction/po-supply-dispatch-edit.aspx': '/transaction/po-supply-dispatch-edit',
  '/transaction/po-supply-dispatch-entry.aspx': '/transaction/po-supply-dispatch-entry',
  '/transaction/po-supply-dispatch-report.aspx': '/transaction/po-supply-dispatch-report',
  '/transaction/po-supply-receipt.aspx': '/transaction/po-supply-receipt',
  '/transaction/po-supply-receipt-entry.aspx': '/transaction/po-supply-receipt-entry',
  '/transaction/po-supply-installation-report.aspx': '/transaction/po-supply-installation-report',
  '/transaction/po-supply-installation-print.aspx': '/transaction/po-supply-installation-print',
  '/transaction/po-supply-po-print.aspx': '/transaction/po-supply-po-print',

  // --- 4. Contracts Module ---
  '/contract/rcdetailreport.aspx': '/contracts/rc-detail-report',
  '/contract/rcdetailreportforsupplier.aspx': '/contracts/rc-detail-report-supplier',
  '/contract/acceptedreoprtsupplier.aspx': '/contracts/accepted-report-supplier',
  '/contracts/rc-detail-report-supplier.aspx': '/contracts/rc-detail-report-supplier',
  '/contracts/accepted-report-supplier.aspx': '/contracts/accepted-report-supplier',

  // --- 5. Indents Module ---
  '/indent/dmefacheads.aspx': '/indents/budget-heads',
  '/indent/consolidatedindentdme_mc.aspx': '/indents/annual-indent',
  '/indent/dmefacaddindent.aspx': '/indents/annual-indent-items',
  '/indent/dmefacindentreport.aspx': '/indents/annual-indent-report',
  '/indent/consolidatedindentpocell.aspx': '/ConsolidatedIndentPOCell',
  '/indent/consolidatedindentdhspo.aspx': '/ConsolidatedIndentDHSPO',
  '/indent/indentwiseitemremarks.aspx': '/IndentWiseItemRemarks',
  '/indent/indenteditdhspo.aspx': '/IndentEditDHSPO',
  '/indent/dhsindentaddbulkconsigneepo.aspx': '/DHSindentAddBulkConsigneePO',
  '/indent/consolidatedindentcgmsc.aspx': '/ConsolidatedIndentCGMSC',
  '/indent/indentfromfacilities.aspx': '/indents/from-facilities',
  '/indent/indentrcpotenderstatus.aspx': '/reports/indent-po-tender-status',

  // --- 6. Reports Module ---
  '/reports/cmcdetail.aspx': '/reports/cmc-detail',
  '/reports/mainequipmentmappedreport.aspx': '/reports/main-equipment-mapped',
  '/reports/reportpoeligible.aspx': '/reports/eligible-report',
  '/reports/indentpotenderstatus.aspx': '/reports/indent-po-tender-status',
  '/reports/indentpotenderstatussummary.aspx': '/reports/indent-po-tender-status-summary',
  '/reports/indentpotendersummary.aspx': '/reports/indent-po-tender-summary',
  '/reports/paymentreport.aspx': '/reports/payment-report',
  '/reports/sanctionsrdlc.aspx': '/reports/sanction-report',
  '/reports/balancestatussupplier.aspx': '/reports/pending-receipt-installation',
  '/reports/posummary.aspx': '/reports/po-summary',

  // --- 7. Complain Module ---
  '/complain/facilitycomplainstore.aspx': '/complain/facility-store',
  '/complain/complaintstatus.aspx': '/complain/complaint-status',
  '/complain/complaintstatusfacility.aspx': '/complain/complaint-status-facility',
  '/complain/complaincmho.aspx': '/complain/complain-cmho',
  '/complain/receiptcomplainsupplier.aspx': '/complain/receipt-complain-supplier',

  // --- 8. BME & Tender Cell Module ---
  '/bme/masttersupplierdash.aspx': '/MasterSupplierDash',
  '/bme/itemsbme.aspx': '/ItemsBME',
  '/bme/mapitemseithtype.aspx': '/masters/map-items',
  '/bme/mapitemswithtypeupdate.aspx': '/masters/map-items-update',
  '/bme/mapitemswithmainitemtyperepo.aspx': '/masters/map-items-report',
  '/bme/emsrcdashbord.aspx': '/contracts/dashboard',
  '/bme/emsnewrc.aspx': '/contracts/new-rc',
  '/bme/planatenderd.aspx': '/tender/plan',
  '/bme/tenderstatusupdate.aspx': '/tender/evaluation',
  '/bme/addrtenderitems.aspx': '/tender/claim-object',
  '/bme/tendercovera.aspx': '/TenderCoverA',
  '/bme/tendercoveraobclaim.aspx': '/TenderCoverAObClaim',
  '/bme/tenderitemspricegem.aspx': '/TenderItemsPriceGEM',
  '/bme/tenderdetailspriceentrygem.aspx': '/TenderDetailsPriceEntryGEM',
  '/bme/tendercoveraitems.aspx': '/TenderCoverAitems',
  '/bme/coveraitemsreports.aspx': '/reports/cover-a-items-reports',

  // --- 9. PO Cell Module ---
  '/pocell/masfacilityusers.aspx': '/MasFacilityUsers',
  '/pocell/programmaster.aspx': '/ProgramMaster',
  '/pocell/emspodashboard.aspx': '/EMSPODashboard',
  '/pocell/emsnewpo.aspx': '/EMSNEWPO',
  '/pocell/rcextend.aspx': '/RCExtend',
  '/pocell/appliedpoextension.aspx': '/AppliedPoExtension',
  '/pocell/consolidatedindentdhspo.aspx': '/ConsolidatedIndentDHSPO',
  '/pocell/indentwiseitemremarks.aspx': '/IndentWiseItemRemarks',
  '/pocell/indenteditdhspo.aspx': '/IndentEditDHSPO',
  '/pocell/dhsindentaddbulkconsigneepo.aspx': '/DHSindentAddBulkConsigneePO',
  '/pocell/termsconditions.aspx': '/Termsconditions',
  '/pocell/rdlctendersummary.aspx': '/RDLCTenderSummary',

  // --- 10. GM Finance Module ---
  '/gmfinance/editreceivedandinstallationdate.aspx': '/EditReceivedAndInstallationDate',
  '/gmfinance/suppliers.aspx': '/masters/supplier',
  '/gmfinance/supplierbankaccounts.aspx': '/SupplierBankAccounts',
  '/gmfinance/suppliergstentry.aspx': '/SupplierGSTentry',
  '/gmfinance/cgmscbankaccounts.aspx': '/CgmscBankAccounts',
  '/gmfinance/newfundmaster.aspx': '/NewFundMaster',
  '/gmfinance/fundmap.aspx': '/FundMap',
  '/gmfinance/budgententry.aspx': '/BudgentEntry',
  '/gmfinance/budgetdetailsprovisional.aspx': '/BudgetDetailsProvisional',
  '/gmfinance/filemrcdashboardfinfile.aspx': '/FileMRCDashboardFINFile',
  '/gmfinance/sanction.aspx': '/Sanction',
  '/gmfinance/popaidreport.aspx': '/reports/po-paid-report',
  '/gmfinance/chequewisepaymentreport.aspx': '/finance/cheque-wise-payment',
  '/gmfinance/facilityauthpovaluepocell.aspx': '/finance/year-wise-po-abstract',
  '/gmfinance/fpopaidreport.aspx': '/finance/po-wise-payment',

  // --- 11. Performance Module ---
  '/performance/performancecertificate.aspx': '/PerformanceCertificate',
  '/performance/performace20consignee.aspx': '/performance/performace20-consignee',
  '/performance/performancecertificatefin.aspx': '/performance/performance-certificate-fin',
  '/performance/emisperf20rdlc.aspx': '/performance/emis-perf20-rdlc',
  '/performance/payment20chequeprep.aspx': '/performance/payment20-cheque-prep',
  '/performance/sanctionnotesheet.aspx': '/performance/sanction-notesheet',

  // --- 12. File Movement Module ---
  '/filemovement/generationfilenonasti.aspx': '/GenerationFileNonasti',
  '/filemovement/filemrcdashbord.aspx': '/FileMRCDashbord',
  '/filemovement/filemrcdashboardfin.aspx': '/FileMRCDashboardFIN',
  '/filemovement/filemrcdashboardgm.aspx': '/FileMRCDashboardGM',
  '/filemovement/filemrcdashboardigm.aspx': '/FileMRCDashboardIGM',
  '/filemovement/filemrcdashboardfinfile.aspx': '/FileMRCDashboardFINFile',
  '/filemovement/emdfileapproval.aspx': '/EMDFileApprovalBankletter',
  '/filemovement/logoverifiedho.aspx': '/LogoVerifiedHO',
  '/filemovement/sitenotreadydocupload.aspx': '/SiteNotReadyDocUpload',
  '/filemovement/invoicesbyso.aspx': '/InvoicesBySO',
  '/filemovement/poreportnew.aspx': '/PoReportNew',

  // --- 13. IT Module ---
  '/it/addsubmenu.aspx': '/IT/add-sub-menu',
  '/it/addroleinscreen.aspx': '/IT/add-role-in-screen',
  '/it/deletemenu.aspx': '/IT/delete-menu',
};



function mapLegacyRoute(route: string): string {
  if (!route) return '';
  const raw = route.trim();

  // Separate path from query string & hash (e.g. "/Stock/FACProgress4Cat.aspx?type=1" -> "/Stock/FACProgress4Cat.aspx")
  const pathOnly = raw.split('?')[0].split('#')[0].trim();
  const lower = pathOnly.toLowerCase();

  // 1. Direct match in override map
  if (ROUTE_MAP[lower]) {
    return ROUTE_MAP[lower];
  }

  // 2. If it's already a clean Angular route (doesn't contain .aspx)
  if (!lower.includes('.aspx')) {
    return pathOnly.startsWith('/') ? pathOnly : '/' + pathOnly;
  }

  // 3. Remove .aspx extension and leading slashes/tilde
  let clean = pathOnly.replace(/\.aspx$/i, '').replace(/^~?\//, '');

  // 4. Check clean route in override map
  const cleanLower = '/' + clean.toLowerCase();
  if (ROUTE_MAP[cleanLower]) {
    return ROUTE_MAP[cleanLower];
  }

  // 5. Extract page name (e.g. "Stock/FACStockCOVIDItemsMC" -> "FACStockCOVIDItemsMC")
  const parts = clean.split('/');
  const pageName = parts[parts.length - 1];

  return '/' + pageName;
}





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

  getSidebarTreeForRole(roleId: number): Observable<{ label: string; route: string; submenu?: { label: string; route: string }[] }[]> {
    return this.http.get<any[]>(`${this.api}/sidebar-tree/${roleId}`).pipe(
      map((rawItems) => {
        if (!Array.isArray(rawItems)) return [];
        return rawItems
          .map((item) => {
            const label = item.label || item.Label || '';
            const rawRoute = item.route || item.Route || '';
            const rawSubmenu = item.submenu || item.Submenu || [];

            const submenu = Array.isArray(rawSubmenu)
              ? rawSubmenu.map((sub: any) => ({
                  label: sub.label || sub.Label || '',
                  route: mapLegacyRoute(sub.route || sub.Route || ''),
                }))
              : undefined;

            return {
              label,
              route: mapLegacyRoute(rawRoute),
              submenu: submenu && submenu.length > 0 ? submenu : undefined,
            };
          })
          .filter((item) => !!item.label && (!!item.route || (item.submenu && item.submenu.length > 0)));
      })
    );
  }
}


