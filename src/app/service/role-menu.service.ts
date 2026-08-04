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
  '/master/dhsaddfacility.aspx': '/dhs-add-facility',
  '/master/dhsfacilityuserslocations.aspx': '/dhs-facility-users-locations',
  '/master/healthfacilitydetails.aspx': '/health-facility-details',
  '/master/itemspecification.aspx': '/item-specification',
  '/master/masfacilityuserslocations.aspx': '/mas-facility-users-locations',
  '/master/mastersupplieradd.aspx': '/master-supplier-add',
  '/master/particularsupplieradd.aspx': '/masters/particular-supplier-add',
  '/master/suppliergstentry1.aspx': '/masters/supplier-gst-entry',

  // --- 2. Stock Module ---
  '/stock/facstockcoviditemsmc.aspx': '/FACStockCOVIDItemsMC',
  '/stock/existingcoviditemsdme.aspx': '/ExistingCovidItemsDME',
  '/stock/newcoviditemdme.aspx': '/NewCovidItemDME',
  '/stock/facstockcmho.aspx': '/FACStockCMHO',
  '/stock/facprogress4cat.aspx': '/FACProgress4Cat',
  '/stock/facilityequipmentreceipt.aspx': '/Facilityequipmentreceipt',
  '/stock/nodleinformationnew.aspx': '/NodleInformationNew',
  '/stock/progressdetail.aspx': '/ProgressDetail',
  '/stock/progressdetaildme.aspx': '/ProgressDetailDME',
  '/stock/stockreport.aspx': '/dme/stock-report',
  '/stock/openingstockentry.aspx': '/dme/opening-stock',

  // --- 3. Orders & Transactions Module ---
  '/order/podashboarddmefac.aspx': '/PODashboardDMEFAC',
  '/order/facilitypo_supply_editdme.aspx': '/Facilitypo_supply_editDME',
  '/order/masfileno.aspx': '/MasFileNo',
  '/order/reportpoeligible.aspx': '/ReportPOEligible',
  '/order/porealloaction.aspx': '/PORealloaction',
  '/order/emspoammendment.aspx': '/EMSPOAmmendment',
  '/order/payment20per.aspx': '/Payment20Per',
  '/order/paymentletter.aspx': '/PaymentLetter',
  '/order/poreceiptentry.aspx': '/po-receipt-entry',
  '/order/facilitypo_supply_receiptdme.aspx': '/Facilitypo_supply_ReceiptDME',
  '/order/poinstallationreport.aspx': '/po-installation-report',
  '/order/facility_installationreportdme.aspx': '/Facility_InstallationReportDME',
  '/order/poprint.aspx': '/po-print',
  '/order/rdlcporeportdme.aspx': '/rdlcPoReportDME',
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
  '/contract/rcdetailreport.aspx': '/RCDetailReport',
  '/contract/rcdetailreportforsupplier.aspx': '/contracts/rc-detail-report-supplier',
  '/contract/acceptedreoprtsupplier.aspx': '/contracts/accepted-report-supplier',
  '/contracts/rc-detail-report-supplier.aspx': '/contracts/rc-detail-report-supplier',
  '/contracts/accepted-report-supplier.aspx': '/contracts/accepted-report-supplier',

  // --- 5. Indents Module ---
  '/indent/dmefacheads.aspx': '/DMEFACHeads',
  '/indent/consolidatedindentdme_mc.aspx': '/ConsolidatedIndentDME_MC',
  '/indent/dmefacaddindent.aspx': '/dme-fac-add-indent',
  '/indent/dmefacindentreport.aspx': '/dme-fac-indent-report',
  '/indent/consolidatedindentpocell.aspx': '/ConsolidatedIndentPOCell',
  '/indent/consolidatedindentdhspo.aspx': '/ConsolidatedIndentDHSPO',
  '/indent/indentwiseitemremarks.aspx': '/IndentWiseItemRemarks',
  '/indent/indenteditdhspo.aspx': '/IndentEditDHSPO',
  '/indent/dhsindentaddbulkconsigneepo.aspx': '/DHSindentAddBulkConsigneePO',
  '/indent/consolidatedindentcgmsc.aspx': '/ConsolidatedIndentCGMSC',

  // --- 6. Reports Module ---
  '/reports/cmcdetail.aspx': '/CMCdetail',
  '/reports/mainequipmentmappedreport.aspx': '/MainEquipmentMappedReport',
  '/reports/reportpoeligible.aspx': '/ReportPOEligible',
  '/reports/indentpotenderstatus.aspx': '/reports/indent-po-tender-status',
  '/reports/indentpotenderstatussummary.aspx': '/reports/indent-po-tender-status-summary',
  '/reports/indentpotendersummary.aspx': '/reports/indent-po-tender-summary',
  '/reports/cmhoposummary.aspx': '/CmhoPoSummary',
  '/reports/posummarydirectorate.aspx': '/PoSummaryDirectorate',
  '/reports/posummaryconsigneeho.aspx': '/PoSummaryConsigneeHo',
  '/reports/tenderlivestatus.aspx': '/TenderLiveStatus',
  '/reports/balancestatusdhs.aspx': '/BalanceStatusDhs',
  '/reports/balancestatuspocell.aspx': '/BalanceStatusPocell',
  '/reports/openingstocksummary.aspx': '/OpeningStockSummary',
  '/reports/paymentscpreportigm.aspx': '/PaymentsCpreportIgm',
  '/reports/popaidreportigm.aspx': '/PopaidReportIgm',
  '/reports/emddepositereport.aspx': '/EmdDepositeReport',
  '/reports/equipmenttagreport.aspx': '/EquipmentTagReport',
  '/reports/tenderwisepodetails.aspx': '/TenderWisePoDetails',
  '/reports/tenderstatusitemwise.aspx': '/TenderStatusItemWise',
  '/reports/dispatchdetail.aspx': '/DispatchDetail',
  '/reports/pendingposupplierwise.aspx': '/PendingPoSupplierWise',
  '/reports/receiptpendingcmho.aspx': '/ReceiptPendingCmho',
  '/reports/reportindentpodetails.aspx': '/ReportIndentPoDetails',
  '/reports/eelsuggestionreport.aspx': '/EelSuggestionReport',
  '/reports/facstockcoviditemsbme.aspx': '/FacStockCovidItemsBme',
  '/reports/balancesupplierwise.aspx': '/BalanceSupplierwise',
  '/reports/indentreportpocell.aspx': '/IndentReportPocell',
  '/reports/pendinginstalldrilldowndhs.aspx': '/PendingInstallDrilldownDhs',
  '/reports/pendinginstalldrilldownpocell.aspx': '/PendingInstallDrilldownPocell',
  '/reports/rdlcdhspending.aspx': '/RdlcDhsPending',
  '/reports/coveraitemsreports.aspx': '/CoverAItemsReports',
  '/reports/paymentscpreport.aspx': '/PaymentsCpreport',
  '/reports/poreceiptsummary.aspx': '/PoReceiptSummary',
  '/reports/sanctionsrdlc.aspx': '/reports/sanction-report',
  '/reports/balancestatussupplier.aspx': '/reports/pending-receipt-installation',
  '/reports/itemwisedetail.aspx': '/ItemWiseDetail',
  '/reports/complainreportbme.aspx': '/ComplainReportBme',
  '/reports/districtwisepodetail.aspx': '/DistrictWisePoDetail',
  '/reports/emdrefundreport.aspx': '/EmdRefundReport',
  '/reports/popaidreport.aspx': '/PoPaidReport',
  '/reports/paymentreport.aspx': '/reports/payment-report',
  '/reports/tenderstatus.aspx': '/TenderStatus',
  '/reports/posummary.aspx': '/PoSummary',

  // --- 7. Complain Module ---
  '/complain/facilitycomplainstore.aspx': '/FacilityComplainStore',
  '/complain/complaintstatus.aspx': '/ComplaintStatus',
  '/complain/complaintstatusedit.aspx': '/ComplaintStatusEdit',
  '/complain/complaintstatusfacility.aspx': '/ComplaintStatusFacility',
  '/complain/complaintstatusfacilityedit.aspx': '/ComplaintStatusFacilityEdit',
  '/complain/complaincmho.aspx': '/ComplainCmho',
  '/complain/receiptcomplainsupplier.aspx': '/complain/receipt-complain-supplier',

  // --- 8. BME & Tender Cell Module ---
  '/bme/masttersupplierdash.aspx': '/MastterSupplierDash',
  '/bme/itemsbme.aspx': '/ItemsBME',
  '/bme/mapitemseithtype.aspx': '/MapitemsEithType',
  '/bme/mapitemswithtypeupdate.aspx': '/MapitemswithTypeUpdate',
  '/bme/mapitemswithmainitemtyperepo.aspx': '/MapitemswithMainitemTypeRepo',
  '/bme/emsrcdashbord.aspx': '/EMSRCDashbord',
  '/bme/emsnewrc.aspx': '/EMSNEWRC',
  '/bme/planatenderd.aspx': '/PlanaTenderD',
  '/bme/tenderstatusupdate.aspx': '/TenderStatusUpdate',
  '/bme/addrtenderitems.aspx': '/AddRTenderItems',
  '/bme/tendercovera.aspx': '/TenderCoverA',
  '/bme/tendercoveraobclaim.aspx': '/TenderCoverAObClaim',
  '/bme/tenderitemspricegem.aspx': '/TenderItemsPriceGEM',
  '/bme/tenderdetailspriceentrygem.aspx': '/TenderDetailsPriceEntryGEM',
  '/bme/tendercoveraitems.aspx': '/TenderCoverAitems',
  '/bme/coveraitemsreports.aspx': '/CoverAitemsReports',

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
  '/gmfinance/suppliers.aspx': '/Suppliers',
  '/gmfinance/supplierbankaccounts.aspx': '/SupplierBankAccounts',
  '/gmfinance/suppliergstentry.aspx': '/SupplierGSTentry',
  '/gmfinance/cgmscbankaccounts.aspx': '/CgmscBankAccounts',
  '/gmfinance/newfundmaster.aspx': '/NewFundMaster',
  '/gmfinance/fundmap.aspx': '/FundMap',
  '/gmfinance/budgententry.aspx': '/BudgentEntry',
  '/gmfinance/budgetdetailsprovisional.aspx': '/BudgetDetailsProvisional',
  '/gmfinance/filemrcdashboardfinfile.aspx': '/FileMRCDashboardFINFile',
  '/gmfinance/sanction.aspx': '/Sanction',

  // --- 11. Performance Module ---
  '/performance/performancecertificate.aspx': '/PerformanceCertificate',
  '/performance/performace20consignee.aspx': '/Performace20Consignee',
  '/performance/performancecertificatefin.aspx': '/PerformanceCertificateFin',
  '/performance/emisperf20rdlc.aspx': '/EMISPerf20_RDLC',
  '/performance/payment20chequeprep.aspx': '/Payment20CheequPrep',
  '/performance/sanctionnotesheet.aspx': '/SanctionNotesheet',

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
  const lower = raw.toLowerCase();

  // 1. Direct match in override map
  if (ROUTE_MAP[lower]) {
    return ROUTE_MAP[lower];
  }

  // 2. If it's already a clean Angular route (doesn't contain .aspx)
  if (!lower.includes('.aspx')) {
    return raw.startsWith('/') ? raw : '/' + raw;
  }

  // 3. Remove .aspx extension and leading slashes
  let clean = raw.replace(/\.aspx$/i, '');
  clean = clean.replace(/^~?\//, '');

  // 4. Check clean route lower in override map
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


