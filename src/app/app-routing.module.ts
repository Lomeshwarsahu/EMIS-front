import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/auth/login/login.component';
import { SupplierLoginComponent } from './component/auth/supplier-login/supplier-login.component';
import { ParticularSupplierAddComponent } from './component/Suppliers/particular-supplier-add/particular-supplier-add.component';
import { SupplierGstEntryComponent } from './component/Suppliers/supplier-gst-entry/supplier-gst-entry.component';
import { PoSupplyComponent } from './component/Suppliers/po-supply/po-supply.component';
import { PoSupplyDispatchComponent } from './component/Suppliers/po-supply-dispatch/po-supply-dispatch.component';
import { PoSupplyDispatchEditComponent } from './component/Suppliers/po-supply-dispatch-edit/po-supply-dispatch-edit.component';
import { PoSupplyDispatchEntryComponent } from './component/Suppliers/po-supply-dispatch-entry/po-supply-dispatch-entry.component';
import { PoSupplyDispatchReportComponent } from './component/Suppliers/po-supply-dispatch-report/po-supply-dispatch-report.component';
import { SupplierPoSdDetailComponent } from './component/Suppliers/supplier-po-sd-detail/supplier-po-sd-detail.component';
import { SupplierPoApplyExtensionComponent } from './component/Suppliers/supplier-po-apply-extension/supplier-po-apply-extension.component';
import { PoSupplyReceiptComponent } from './component/Suppliers/po-supply-receipt/po-supply-receipt.component';
import { PoSupplyReceiptEntryComponent } from './component/Suppliers/po-supply-receipt-entry/po-supply-receipt-entry.component';
import { PoSupplyInstallationReportComponent } from './component/Suppliers/po-supply-installation-report/po-supply-installation-report.component';
import { PoSupplyInstallationPrintComponent } from './component/Suppliers/po-supply-installation-print/po-supply-installation-print.component';
import { PoSupplyPoPrintComponent } from './component/Suppliers/po-supply-po-print/po-supply-po-print.component';
import { SupplierRcDetailReportComponent } from './component/Suppliers/supplier-rc-detail-report/supplier-rc-detail-report.component';
import { SupplierAcceptedReportComponent } from './component/Suppliers/supplier-accepted-report/supplier-accepted-report.component';
import { SupplierReceiptComplainComponent } from './component/Suppliers/supplier-receipt-complain/supplier-receipt-complain.component';
import { SupplierEmdDepositComponent } from './component/Suppliers/supplier-emd-deposit/supplier-emd-deposit.component';
import { SupplierPaymentReportComponent } from './component/Suppliers/supplier-payment-report/supplier-payment-report.component';
import { SupplierPendingReceiptInstallationComponent } from './component/Suppliers/supplier-pending-receipt-installation/supplier-pending-receipt-installation.component';
import { LogoutComponent } from './component/auth/logout/logout.component';
import { RouteGuardService } from './service/authentication/route-guard.service';
import { OtpComponent } from './component/auth/otp/otp.component';
import { Registration } from './component/auth/registration/registration';
import { GenerationFileNonastiComponent } from './component/generation-file-nonasti/generation-file-nonasti.component';
import { FileMRCDashbordComponent } from './component/file-mrcdashbord/file-mrcdashbord.component';
import { InstallationDetailsComponent } from './component/installation-details/installation-details.component';
import { ExtensionHODetailComponent } from './component/extension-hodetail/extension-hodetail.component';
import { ExtensionHOEntryComponent } from './component/extension-hoentry/extension-hoentry.component';
import { ItemWiseDetailPOCellComponent } from './component/item-wise-detail-pocell/item-wise-detail-pocell.component';
import { ItemWiseDetailPOCellByPOidComponent } from './component/item-wise-detail-pocell-by-poid/item-wise-detail-pocell-by-poid.component';
import { IndentPOSummaryDirwiseComponent } from './component/indent-posummary-dirwise/indent-posummary-dirwise.component';
import { DistrictWisePODetailComponent } from './component/district-wise-podetail/district-wise-podetail.component';
import { LandingPageComponent } from './component/landing-page/landing-page.component';
import { RCDetailReportComponent } from './component/rcdetail-report/rcdetail-report.component';
import { AcceptedReortComponent } from './component/accepted-reort/accepted-reort.component';
import { IndentFromFacilitiesComponent } from './component/indent-from-facilities/indent-from-facilities.component';
import { ComplainReportBMEComponent } from './component/complain-report-bme/complain-report-bme.component';
import { FacilityAuthPOValuePOCellComponent } from './component/facility-auth-povalue-pocell/facility-auth-povalue-pocell.component';
import { POSummaryDrillDwnQtyPOWiseComponent } from './component/posummary-drill-dwn-qty-powise/posummary-drill-dwn-qty-powise.component';
import { POPaidReportComponent } from './component/popaid-report/popaid-report.component';
import { ChequeWisePaymentRComponent } from './component/cheque-wise-payment-r/cheque-wise-payment-r.component';
import { POSummaryReportComponent } from './component/posummary-report/posummary-report.component';
import { POSummaryDrillDwnQtyComponent } from './component/posummary-drill-dwn-qty/posummary-drill-dwn-qty.component';
import { TendersStatusComponent } from './component/tenders-status/tenders-status.component';
import { PORecdsummaryComponent } from './component/porecdsummary/porecdsummary.component';
import { TenterStatusItemWiseComponent } from './component/tenter-status-item-wise/tenter-status-item-wise.component';
import { POSummaryDrillDwnQtyReagentComponent } from './component/posummary-drill-dwn-qty-reagent/posummary-drill-dwn-qty-reagent.component';
import { MastterSupplierDashComponent } from './component/BME/mastter-supplier-dash/mastter-supplier-dash.component';
import { ItemsBMEComponent } from './component/BME/items-bme/items-bme.component';
import { MapitemsEithTypeComponent } from './component/BME/mapitems-eith-type/mapitems-eith-type.component';
import { MapitemswithTypeUpdateComponent } from './component/BME/mapitemswith-type-update/mapitemswith-type-update.component';
import { MapitemswithMainitemTypeRepoComponent } from './component/BME/mapitemswith-mainitem-type-repo/mapitemswith-mainitem-type-repo.component';
import { EMSRCDashbordComponent } from './component/BME/emsrcdashbord/emsrcdashbord.component';
import { EMSNEWRCComponent } from './component/BME/emsnewrc/emsnewrc.component';
import { PlanaTenderDComponent } from './component/BME/plana-tender-d/plana-tender-d.component';
import { TenderStatusUpdateComponent } from './component/BME/tender-status-update/tender-status-update.component';
import { AddRTenderItemsComponent } from './component/BME/add-rtender-items/add-rtender-items.component';
import { ConsigeeInformationComponent } from './component/DME/consigee-information/consigee-information.component';
import { ReportSpecificationComponent } from './component/DME/masters/report-specification/report-specification.component';
import { CmeEelSuggestionComponent } from './component/DME/masters/cme-eel-suggestion/cme-eel-suggestion.component';
import { StockReportComponent } from './component/DME/stock/stock-report/stock-report.component';
import { OpeningStockEntryComponent } from './component/DME/stock/opening-stock-entry/opening-stock-entry.component';
import { NewOpeningStockEntryComponent } from './component/DME/stock/new-opening-stock-entry/new-opening-stock-entry.component';
import { PurchaseOrderDashboardComponent } from './component/DME/orders/purchase-order-dashboard/purchase-order-dashboard.component';
import { PurchaseOrderReceiptsComponent } from './component/DME/orders/purchase-order-receipts/purchase-order-receipts.component';
import { DmeFacHeadsComponent } from './component/DME/indent/dme-fac-heads/dme-fac-heads.component';
import { ConsolidatedIndentDmeComponent } from './component/DME/indent/consolidated-indent-dme/consolidated-indent-dme.component';
import { CmcDetailComponent } from './component/DME/reports/cmc-detail/cmc-detail.component';
import { FacilityComplainStoreComponent } from './component/DME/complain/facility-complain-store/facility-complain-store.component';
import { TenderCoverAComponent } from './component/BME/tender-cover-a/tender-cover-a.component';
import { TenderCoverAObClaimComponent } from './tender-cover-aob-claim/tender-cover-aob-claim.component';
import { TenderItemsPriceGEMComponent } from './component/BME/tender-items-price-gem/tender-items-price-gem.component';
import { TenderDetailsPriceEntryGEMComponent } from './component/BME/tender-details-price-entry-gem/tender-details-price-entry-gem.component';
import { ConsolidatedIndentPOCellComponent } from './component/BME/consolidated-indent-pocell/consolidated-indent-pocell.component';
import { MasFacilityUsersComponent } from './component/PO-Cell/mas-facility-users/mas-facility-users.component';
import { ProgramMasterComponent } from './component/PO-Cell/program-master/program-master.component';
import { EMSPODashboardComponent } from './component/PO-Cell/emspodashboard/emspodashboard.component';
import { EMSNEWPOComponent } from './component/PO-Cell/emsnewpo/emsnewpo.component';
import { RCExtendComponent } from './component/PO-Cell/rcextend/rcextend.component';
import { AppliedPoExtensionComponent } from './component/PO-Cell/applied-po-extension/applied-po-extension.component';
import { ConsolidatedIndentDHSPOComponent } from './component/PO-Cell/consolidated-indent-dhs-po/consolidated-indent-dhs-po.component';
import { IndentWiseItemRemarksComponent } from './component/PO-Cell/indent-wise-item-remarks/indent-wise-item-remarks.component';
import { IndentEditDHSPOComponent } from './component/PO-Cell/indent-edit-dhs-po/indent-edit-dhs-po.component';
import { DHSindentAddBulkConsigneePOComponent } from './component/PO-Cell/dhsindent-add-bulk-consignee-po/dhsindent-add-bulk-consignee-po.component';
import { TermsconditionsComponent } from './component/PO-Cell/termsconditions/termsconditions.component';
import { RDLCTenderSummaryComponent } from './component/PO-Cell/rdlctender-summary/rdlctender-summary.component';
import { EditReceivedAndInstallationDateComponent } from './GM Finance/edit-received-and-installation-date/edit-received-and-installation-date.component';
import { SuppliersComponent } from './GM Finance/suppliers/suppliers.component';
import { SupplierBankAccountsComponent } from './GM Finance/supplier-bank-accounts/supplier-bank-accounts.component';
import { SupplierGSTentryComponent } from './GM Finance/supplier-gstentry/supplier-gstentry.component';
import { CgmscBankAccountsComponent } from './GM Finance/cgmsc-bank-accounts/cgmsc-bank-accounts.component';
import { NewFundMasterComponent } from './GM Finance/new-fund-master/new-fund-master.component';
import { FundMapComponent } from './GM Finance/fund-map/fund-map.component';
import { BudgentEntryComponent } from './GM Finance/budgent-entry/budgent-entry.component';
import { BudgetDetailsProvisionalComponent } from './GM Finance/budget-details-provisional/budget-details-provisional.component';
import { IndentRCPOTenderStatusComponent } from './Reports/indent-rc-po-tender-status/indent-rc-po-tender-status.component';
import { UnpaidPOSComponent } from './Reports/unpaid-pos/unpaid-pos.component';
import { POReportGMFComponent } from './Reports/poreport-gmf/poreport-gmf.component';
import { InvoiceDetailComponent } from './Reports/invoice-detail/invoice-detail.component';
import { TDSdataReportComponent } from './Reports/tdsdata-report/tdsdata-report.component';
import { PaymentsCPReport20perComponent } from './Reports/payments-cpreport20per/payments-cpreport20per.component';
import { FileMRCDashboardFINFileComponent } from './GM Finance/file-mrcdashboard-finfile/file-mrcdashboard-finfile.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'supplier-login', component: SupplierLoginComponent },
  { path: 'LoginEmsSup', redirectTo: 'supplier-login', pathMatch: 'full' },
  {
    path: 'masters/particular-supplier-add',
    component: ParticularSupplierAddComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'ParticularSupplierAdd',
    redirectTo: 'masters/particular-supplier-add',
    pathMatch: 'full',
  },
  {
    path: 'masters/supplier-gst-entry',
    component: SupplierGstEntryComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'SupplierGSTentry1',
    redirectTo: 'masters/supplier-gst-entry',
    pathMatch: 'full',
  },
  {
    path: 'orders/po-supply',
    component: PoSupplyComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'po_supply',
    redirectTo: 'orders/po-supply',
    pathMatch: 'full',
  },
  {
    path: 'orders/po-supply-sd-detail',
    component: SupplierPoSdDetailComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'SDdetailSupplier',
    redirectTo: 'orders/po-supply-sd-detail',
    pathMatch: 'full',
  },
  {
    path: 'orders/po-supply-apply-extension',
    component: SupplierPoApplyExtensionComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'ApplyForExtension',
    redirectTo: 'orders/po-supply-apply-extension',
    pathMatch: 'full',
  },
  {
    path: 'transaction/po-supply-dispatch',
    component: PoSupplyDispatchComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'transaction/po-supply-dispatch-edit',
    component: PoSupplyDispatchEditComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'transaction/po-supply-dispatch-entry',
    component: PoSupplyDispatchEntryComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'po_supply_details',
    redirectTo: 'transaction/po-supply-dispatch-entry',
    pathMatch: 'full',
  },
  {
    path: 'transaction/po-supply-dispatch-report',
    component: PoSupplyDispatchReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'po_supplyDispatch',
    redirectTo: 'transaction/po-supply-dispatch',
    pathMatch: 'full',
  },
  {
    path: 'po_supply_edit',
    redirectTo: 'transaction/po-supply-dispatch-edit',
    pathMatch: 'full',
  },
  {
    path: 'rptDispatchDetails',
    redirectTo: 'transaction/po-supply-dispatch-report',
    pathMatch: 'full',
  },
  {
    path: 'transaction/po-supply-receipt',
    component: PoSupplyReceiptComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'transaction/po-supply-receipt-entry',
    component: PoSupplyReceiptEntryComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'Facilitypo_supply_ReceiptSUP',
    redirectTo: 'transaction/po-supply-receipt',
    pathMatch: 'full',
  },
  {
    path: 'transaction/po-supply-installation-report',
    component: PoSupplyInstallationReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'Facility_InstallationReportSUP',
    redirectTo: 'transaction/po-supply-installation-report',
    pathMatch: 'full',
  },
  {
    path: 'transaction/po-supply-installation-print',
    component: PoSupplyInstallationPrintComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'transaction/po-supply-po-print',
    component: PoSupplyPoPrintComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'InstalationReport',
    redirectTo: 'transaction/po-supply-installation-print',
    pathMatch: 'full',
  },
  {
    path: 'rdlcPoReport',
    redirectTo: 'transaction/po-supply-po-print',
    pathMatch: 'full',
  },
  {
    path: 'contracts/rc-detail-report-supplier',
    component: SupplierRcDetailReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'RCDetailReportForSupplier',
    redirectTo: 'contracts/rc-detail-report-supplier',
    pathMatch: 'full',
  },
  {
    path: 'contracts/accepted-report-supplier',
    component: SupplierAcceptedReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'AcceptedReoprtSupplier',
    redirectTo: 'contracts/accepted-report-supplier',
    pathMatch: 'full',
  },
  {
    path: 'complain/receipt-complain-supplier',
    component: SupplierReceiptComplainComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'ReceiptComplainSupplier',
    redirectTo: 'complain/receipt-complain-supplier',
    pathMatch: 'full',
  },
  {
    path: 'emd-refund/emd-deposit',
    component: SupplierEmdDepositComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'EMDdeposite',
    redirectTo: 'emd-refund/emd-deposit',
    pathMatch: 'full',
  },
  {
    path: 'reports/payment-report',
    component: SupplierPaymentReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'PaymentReport',
    redirectTo: 'reports/payment-report',
    pathMatch: 'full',
  },
  {
    path: 'reports/pending-receipt-installation',
    component: SupplierPendingReceiptInstallationComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'BalanceStatussupplier',
    redirectTo: 'reports/pending-receipt-installation',
    pathMatch: 'full',
  },
  { path: 'Registration', component: Registration },
  { path: 'otp', component: OtpComponent },
  // {path:'GenerationFileNonasti',component:GenerationFileNonastiComponent},
  // {path:'FileMRCDashbord',component:FileMRCDashbordComponent},
  { path: 'InstallationDetails', component: InstallationDetailsComponent },
  // {path:'ExtensionHODetail',component:ExtensionHODetailComponent},
  { path: 'ExtensionHOEntry', component: ExtensionHOEntryComponent },
  // {path:'ItemWiseDetailPOCell',component:ItemWiseDetailPOCellComponent},
  {
    path: 'ItemWiseDetailPOCellByPOid',
    component: ItemWiseDetailPOCellByPOidComponent,
  },
  // {path:'IndentPOSummaryDirwise',component:IndentPOSummaryDirwiseComponent},
  // {path:'DistrictWisePODetail',component:DistrictWisePODetailComponent},
  {
    path: 'POSummaryDrillDwnQtyPOWise',
    component: POSummaryDrillDwnQtyPOWiseComponent,
  },
  { path: 'POSummaryDrillDwnQty', component: POSummaryDrillDwnQtyComponent },
  { path: 'EMSNEWPO', component: EMSNEWPOComponent },
  { path: 'IndentEditDHSPO', component: IndentEditDHSPOComponent },
  { path: 'SupplierBankAccounts', component: SupplierBankAccountsComponent },
  { path: 'SupplierGSTentry', component: SupplierGSTentryComponent },
  { path: 'BudgetDetailsProvisional', component: BudgetDetailsProvisionalComponent },

  {
    path: 'TenderStatusUpdate',
    component: TenderStatusUpdateComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'AddRTenderItems',
    component: AddRTenderItemsComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },

  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [RouteGuardService],
  },
  // { path: 'welcome', component: HomeComponent },
  {
    path: 'welcome',
    component: LandingPageComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: [
        'AD',
        'AU',
        'AUPO',
        'AUGMF',
        'AAO',
        'AYUSH',
        'CGMSC',
        'CON',
        'DHS',
        'DKS',
        'DME',
        'DMT',
        'FDA',
        'FU',
        'GMF',
        'IT',
        'Principal',
        'SCI',
        'SUP',
        'TPO',
      ],
    },
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: [
        'AD',
        'AU',
        'AUPO',
        'AAO',
        'AYUSH',
        'CGMSC',
        'CON',
        'DHS',
        'DKS',
        'DME',
        'DMT',
        'FDA',
        'FU',
        'GMF',
        'IT',
        'Principal',
        'SCI',
        'SUP',
        'TPO',
      ],
    },
  },
  // { path: 'welcome', component: HomeComponent, canActivate: [RouteGuardService],data: { allowedRoles: ['Suppliers','SEC1','DHS','CME','DME1','Collector','Warehouse','SE','HO_Infra','Division','DM PO','SSO','Logi Cell']} },
  {
    path: 'GenerationFileNonasti',
    component: GenerationFileNonastiComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO'] },
  },
  {
    path: 'FileMRCDashbord',
    component: FileMRCDashbordComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO'] },
  },

  {
    path: 'ExtensionHODetail',
    component: ExtensionHODetailComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUPO'] },
  },

  {
    path: 'ItemWiseDetailPOCell',
    component: ItemWiseDetailPOCellComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO'] },
  },

  {
    path: 'IndentPOSummaryDirwise',
    component: IndentPOSummaryDirwiseComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO'] },
  },

  {
    path: 'DistrictWisePODetail',
    component: DistrictWisePODetailComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUGMF'] },
  },
  // BME
  {
    path: 'MastterSupplierDash',
    component: MastterSupplierDashComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'ItemsBME',
    component: ItemsBMEComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME', 'AUPO'] },
  },
  {
    path: 'MapitemsEithType',
    component: MapitemsEithTypeComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'MapitemswithTypeUpdate',
    component: MapitemswithTypeUpdateComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'MapitemswithMainitemTypeRepo',
    component: MapitemswithMainitemTypeRepoComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'EMSRCDashbord',
    component: EMSRCDashbordComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'EMSNEWRC',
    component: EMSNEWRCComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'PlanaTenderD',
    component: PlanaTenderDComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME','AUPO'] },
  },
  {
    path: 'TenderCoverA',
    component: TenderCoverAComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU'] },
  },
  {
    path: 'TenderCoverAObClaim',
    component: TenderCoverAObClaimComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU'] },
  },
  {
    path: 'TenderItemsPriceGEM',
    component: TenderItemsPriceGEMComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU'] },
  },
  {
    path: 'TenderDetailsPriceEntryGEM',
    component: TenderDetailsPriceEntryGEMComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU'] },
  },
  {
    path: 'ConsolidatedIndentPOCell',
    component: ConsolidatedIndentPOCellComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU','AUPO'] },
  },
  // POCell
  // {path:'MasFacilityUsers',component:MasFacilityUsersComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AU'] }},
  {
    path: 'MasFacilityUsers',
    component: MasFacilityUsersComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'DHSindentAddBulkConsigneePO',
    component: DHSindentAddBulkConsigneePOComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'Termsconditions',
    component: TermsconditionsComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'RDLCTenderSummary',
    component: RDLCTenderSummaryComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'ProgramMaster',
    component: ProgramMasterComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'RCExtend',
    component: RCExtendComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'AppliedPoExtension',
    component: AppliedPoExtensionComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'EMSPODashboard',
    component: EMSPODashboardComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'ConsolidatedIndentDHSPO',
    component: ConsolidatedIndentDHSPOComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'IndentWiseItemRemarks',
    component: IndentWiseItemRemarksComponent,
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  // MD logins
  {
    path: 'RCDetailReport',
    component: RCDetailReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'AcceptedReort',
    component: AcceptedReortComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD','AUPO'] },
  },
  {
    path: 'IndentFromFacilities',
    component: IndentFromFacilitiesComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'ComplainReportBME',
    component: ComplainReportBMEComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'POPaidReport',
    component: POPaidReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'FPOPaidReport',
    component: POPaidReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'ChequeWisePaymentReport',
    component: ChequeWisePaymentRComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'POSummaryReport',
    component: POSummaryReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'TendersStatus',
    component: TendersStatusComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'PORecdsummary',
    component: PORecdsummaryComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'TenterStatusItemWise',
    component: TenterStatusItemWiseComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'POSummaryDrillDwnQtyReagent',
    component: POSummaryDrillDwnQtyReagentComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },

  // EMS sidebar-aligned routes (Masters / Stock / Orders / …)
  {
    path: 'masters/store-home',
    component: ConsigeeInformationComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'masters/consignee-information',
    component: ConsigeeInformationComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'masters/report-specification',
    component: ReportSpecificationComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'masters/cme-eel-suggestion',
    component: CmeEelSuggestionComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'masters/supplier',
    component: MastterSupplierDashComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'masters/items',
    component: ItemsBMEComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'masters/map-items',
    component: MapitemsEithTypeComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'masters/map-items-update',
    component: MapitemswithTypeUpdateComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'masters/map-items-report',
    component: MapitemswithMainitemTypeRepoComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'stock/covid-stock-report',
    component: StockReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'stock/opening-stock-entry',
    component: OpeningStockEntryComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'stock/new-opening-stock-entry',
    component: NewOpeningStockEntryComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'orders/purchase-order-dashboard',
    component: PurchaseOrderDashboardComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'AUPO'] },
  },
  {
    path: 'orders/purchase-order-receipts',
    component: PurchaseOrderReceiptsComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'contracts/dashboard',
    component: EMSRCDashbordComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME','AUPO'] },
  },
  {
    path: 'contracts/new-rc',
    component: EMSNEWRCComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME','AUPO'] },
  },
  {
    path: 'contracts/rc-detail-report',
    component: RCDetailReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AUPO'] },
  },
  {
    path: 'tender/plan',
    component: PlanaTenderDComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'tender/evaluation',
    component: TenderStatusUpdateComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'tender/claim-object',
    component: AddRTenderItemsComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'tender/gem-price-acceptance',
    component: TendersStatusComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'indents/budget-heads',
    component: DmeFacHeadsComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'indents/annual-indent',
    component: ConsolidatedIndentDmeComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'indents/from-facilities',
    component: IndentFromFacilitiesComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'finance/year-wise-po-abstract',
    component: FacilityAuthPOValuePOCellComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AUPO','AUGMF'] },
  },
  {
    path: 'finance/po-wise-payment',
    component: POPaidReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AUPO','AUGMF'] },
  },
  {
    path: 'finance/cheque-wise-payment',
    component: ChequeWisePaymentRComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AUGMF'] },
  },
  {
    path: 'complain/facility-store',
    component: FacilityComplainStoreComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'complain/report',
    component: ComplainReportBMEComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/cmc-detail',
    component: CmcDetailComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'reports/po-summary',
    component: POSummaryReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/po-wise-payment',
    component: POPaidReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/tenders-status',
    component: TendersStatusComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AUGMF'] },
  },
  {
    path: 'reports/po-receipts-summary',
    component: PORecdsummaryComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/tender-item-status',
    component: TenterStatusItemWiseComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/reagent-po',
    component: POSummaryDrillDwnQtyReagentComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },

  // Legacy flat paths → redirects (bookmarks / old links)
  { path: 'store-home', redirectTo: 'masters/store-home', pathMatch: 'full' },
  {
    path: 'consigee-information',
    redirectTo: 'masters/consignee-information',
    pathMatch: 'full',
  },
  {
    path: 'report-specification',
    redirectTo: 'masters/report-specification',
    pathMatch: 'full',
  },
  {
    path: 'cme-eel-suggestion',
    redirectTo: 'masters/cme-eel-suggestion',
    pathMatch: 'full',
  },
  {
    path: 'stock-report',
    redirectTo: 'stock/covid-stock-report',
    pathMatch: 'full',
  },
  {
    path: 'opening-stock-entry',
    redirectTo: 'stock/opening-stock-entry',
    pathMatch: 'full',
  },
  {
    path: 'ExistingCovidItemsDME',
    redirectTo: 'stock/opening-stock-entry',
    pathMatch: 'full',
  },
  {
    path: 'NewCovidItemDME',
    redirectTo: 'stock/new-opening-stock-entry',
    pathMatch: 'full',
  },
  {
    path: 'purchase-order-dashboard',
    redirectTo: 'orders/purchase-order-dashboard',
    pathMatch: 'full',
  },
  {
    path: 'purchase-order-receipts',
    redirectTo: 'orders/purchase-order-receipts',
    pathMatch: 'full',
  },
  {
    path: 'EMSRCDashbord',
    redirectTo: 'contracts/dashboard',
    pathMatch: 'full',
  },
  { path: 'EMSNEWRC', redirectTo: 'contracts/new-rc', pathMatch: 'full' },
  {
    path: 'RCDetailReport',
    redirectTo: 'contracts/rc-detail-report',
    pathMatch: 'full',
  },
  { path: 'PlanaTenderD', redirectTo: 'tender/plan', pathMatch: 'full' },
  {
    path: 'TenderStatusUpdate',
    redirectTo: 'tender/evaluation',
    pathMatch: 'full',
  },
  {
    path: 'AddRTenderItems',
    redirectTo: 'tender/claim-object',
    pathMatch: 'full',
  },
  {
    path: 'TendersStatus',
    redirectTo: 'tender/gem-price-acceptance',
    pathMatch: 'full',
  },
  {
    path: 'dme-fac-heads',
    redirectTo: 'indents/budget-heads',
    pathMatch: 'full',
  },
  {
    path: 'consolidated-indent-dme',
    redirectTo: 'indents/annual-indent',
    pathMatch: 'full',
  },
  {
    path: 'IndentFromFacilities',
    redirectTo: 'indents/from-facilities',
    pathMatch: 'full',
  },
  {
    path: 'FacilityAuthPOValuePOCell',
    redirectTo: 'finance/year-wise-po-abstract',
    pathMatch: 'full',
  },
  {
    path: 'FPOPaidReport',
    redirectTo: 'finance/po-wise-payment',
    pathMatch: 'full',
  },
  {
    path: 'POPaidReport',
    redirectTo: 'reports/po-wise-payment',
    pathMatch: 'full',
  },
  {
    path: 'ChequeWisePaymentReport',
    redirectTo: 'finance/cheque-wise-payment',
    pathMatch: 'full',
  },
  {
    path: 'facility-complain-store',
    redirectTo: 'complain/facility-store',
    pathMatch: 'full',
  },
  {
    path: 'ComplainReportBME',
    redirectTo: 'complain/report',
    pathMatch: 'full',
  },
  { path: 'cmc-detail', redirectTo: 'reports/cmc-detail', pathMatch: 'full' },
  {
    path: 'POSummaryReport',
    redirectTo: 'reports/po-summary',
    pathMatch: 'full',
  },
  {
    path: 'PORecdsummary',
    redirectTo: 'reports/po-receipts-summary',
    pathMatch: 'full',
  },
  {
    path: 'TenterStatusItemWise',
    redirectTo: 'reports/tender-item-status',
    pathMatch: 'full',
  },
  {
    path: 'POSummaryDrillDwnQtyReagent',
    redirectTo: 'reports/reagent-po',
    pathMatch: 'full',
  },
  {
    path: 'MastterSupplierDash',
    redirectTo: 'masters/supplier',
    pathMatch: 'full',
  },
  { path: 'ItemsBME', redirectTo: 'masters/items', pathMatch: 'full' },
  {
    path: 'MapitemsEithType',
    redirectTo: 'masters/map-items',
    pathMatch: 'full',
  },
  {
    path: 'MapitemswithTypeUpdate',
    redirectTo: 'masters/map-items-update',
    pathMatch: 'full',
  },
  {
    path: 'MapitemswithMainitemTypeRepo',
    redirectTo: 'masters/map-items-report',
    pathMatch: 'full',
  },
//#region GM Finance
// 
  {
    path: 'EditReceivedAndInstallationDate',
    component: EditReceivedAndInstallationDateComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'Supplier',
    component: SuppliersComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'CgmscBankAccounts',
    component: CgmscBankAccountsComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'NewFundMaster',
    component: NewFundMasterComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'FundMap',
    component: FundMapComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'BudgentEntry',
    component: BudgentEntryComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'IndentRCPOTenderStatus',
    component: IndentRCPOTenderStatusComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'UnpaidPOS',
    component: UnpaidPOSComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'POReportGMF',
    component: POReportGMFComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'InvoiceDetail',
    component: InvoiceDetailComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'TDSdataReport',
    component: TDSdataReportComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'PaymentsCPReport20per',
    component: PaymentsCPReport20perComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'FileMRCDashboardFINFile',
    component: FileMRCDashboardFINFileComponent,
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
//#endregion
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
