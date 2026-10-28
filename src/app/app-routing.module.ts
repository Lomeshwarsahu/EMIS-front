import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/auth/login/login.component';
import { LogoutComponent } from './component/auth/logout/logout.component';
import { RouteGuardService } from './service/authentication/route-guard.service';
import { Registration } from './component/auth/registration/registration';
// import { POSupplyHOComponent } from './component/PO-Cell/po-supply-ho/po-supply-ho.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'supplier-login', loadComponent: () => import('./component/auth/supplier-login/supplier-login.component').then(m => m.SupplierLoginComponent) },
  { path: 'MasFacilityUsersLocationsmaster', loadComponent: () => import('./component/mas-facility-users-locationsmaster/mas-facility-users-locationsmaster.component').then(m => m.MasFacilityUsersLocationsmasterComponent)},

  { path: 'LoginEmsSup', redirectTo: 'supplier-login', pathMatch: 'full' },

  {
    path: 'masters/particular-supplier-add',
    loadComponent: () => import('./component/Suppliers/particular-supplier-add/particular-supplier-add.component').then(m => m.ParticularSupplierAddComponent),
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
    loadComponent: () => import('./component/Suppliers/supplier-gst-entry/supplier-gst-entry.component').then(m => m.SupplierGstEntryComponent),
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
    loadComponent: () => import('./component/Suppliers/po-supply/po-supply.component').then(m => m.PoSupplyComponent),
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
    loadComponent: () => import('./component/Suppliers/supplier-po-sd-detail/supplier-po-sd-detail.component').then(m => m.SupplierPoSdDetailComponent),
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
    loadComponent: () => import('./component/Suppliers/supplier-po-apply-extension/supplier-po-apply-extension.component').then(m => m.SupplierPoApplyExtensionComponent),
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
    loadComponent: () => import('./component/Suppliers/po-supply-dispatch/po-supply-dispatch.component').then(m => m.PoSupplyDispatchComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'transaction/po-supply-dispatch-edit',
    loadComponent: () => import('./component/Suppliers/po-supply-dispatch-edit/po-supply-dispatch-edit.component').then(m => m.PoSupplyDispatchEditComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'transaction/po-supply-dispatch-entry',
    loadComponent: () => import('./component/Suppliers/po-supply-dispatch-entry/po-supply-dispatch-entry.component').then(m => m.PoSupplyDispatchEntryComponent),
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
    loadComponent: () => import('./component/Suppliers/po-supply-dispatch-report/po-supply-dispatch-report.component').then(m => m.PoSupplyDispatchReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP', 'AUPO'] },
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
    loadComponent: () => import('./component/Suppliers/po-supply-receipt/po-supply-receipt.component').then(m => m.PoSupplyReceiptComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'transaction/po-supply-receipt-entry',
    loadComponent: () => import('./component/Suppliers/po-supply-receipt-entry/po-supply-receipt-entry.component').then(m => m.PoSupplyReceiptEntryComponent),
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
    loadComponent: () => import('./component/Suppliers/po-supply-installation-report/po-supply-installation-report.component').then(m => m.PoSupplyInstallationReportComponent),
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
    loadComponent: () => import('./component/Suppliers/po-supply-installation-print/po-supply-installation-print.component').then(m => m.PoSupplyInstallationPrintComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'transaction/po-supply-po-print',
    loadComponent: () => import('./component/Suppliers/po-supply-po-print/po-supply-po-print.component').then(m => m.PoSupplyPoPrintComponent),
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
    loadComponent: () => import('./component/Suppliers/supplier-rc-detail-report/supplier-rc-detail-report.component').then(m => m.SupplierRcDetailReportComponent),
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
    loadComponent: () => import('./component/Suppliers/supplier-accepted-report/supplier-accepted-report.component').then(m => m.SupplierAcceptedReportComponent),
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
    loadComponent: () => import('./component/Suppliers/supplier-receipt-complain/supplier-receipt-complain.component').then(m => m.SupplierReceiptComplainComponent),
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
    loadComponent: () => import('./component/Suppliers/supplier-emd-deposit/supplier-emd-deposit.component').then(m => m.SupplierEmdDepositComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'EMDdeposite',
    redirectTo: 'emd-refund/emd-deposit',
    pathMatch: 'full',
  },
  {
    path: 'reports/supplier-payment-report',
    loadComponent: () => import('./component/Suppliers/supplier-payment-report/supplier-payment-report.component').then(m => m.SupplierPaymentReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'PaymentReport',
    redirectTo: 'reports/payment-report',
    pathMatch: 'full',
  },
  {
    path: 'reports/sanction-report',
    loadComponent: () => import('./component/Suppliers/supplier-sanction-report/supplier-sanction-report.component').then(m => m.SupplierSanctionReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'SanctionsRDLC',
    redirectTo: 'reports/sanctions-rdlc',
    pathMatch: 'full',
  },
  {
    path: 'Payment/SanctionsRDLC',
    redirectTo: 'reports/sanctions-rdlc',
    pathMatch: 'full',
  },
  {
    path: 'reports/pending-receipt-installation',
    loadComponent: () => import('./component/Suppliers/supplier-pending-receipt-installation/supplier-pending-receipt-installation.component').then(m => m.SupplierPendingReceiptInstallationComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'reports/pending-install-drill-down',
    loadComponent: () => import('./component/Suppliers/supplier-pending-install-drill-down/supplier-pending-install-drill-down.component').then(m => m.SupplierPendingInstallDrillDownComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SUP'] },
  },
  {
    path: 'BalanceStatussupplier',
    redirectTo: 'reports/pending-receipt-installation',
    pathMatch: 'full',
  },
  {
    path: 'PendingInstallDrillDownsupplier',
    redirectTo: 'reports/pending-install-drill-down',
    pathMatch: 'full',
  },
  { path: 'Registration', component: Registration },
  { path: 'otp', loadComponent: () => import('./component/auth/otp/otp.component').then(m => m.OtpComponent) },
  // {path:'GenerationFileNonasti',component:GenerationFileNonastiComponent},//
  // {path:'FileMRCDashbord',component:FileMRCDashbordComponent},//
  {
    path: 'InstallationDetails',
    loadComponent: () => import('./component/installation-details/installation-details.component').then(m => m.InstallationDetailsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUGMF','AU','DME','AUPO','TPOT','BME','AD'], variant: 'bme' },
  },
  {
    path: 'InstallationDetailsBME',
    loadComponent: () => import('./component/installation-details/installation-details.component').then(m => m.InstallationDetailsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUGMF','AU','DME','AUPO','TPOT','BME','AD'], variant: 'bme' },
  },
  {
    path: 'InstallationDetailsDEO',
    loadComponent: () => import('./component/installation-details/installation-details.component').then(m => m.InstallationDetailsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUGMF','AU','DME','AUPO','TPOT','BME','AD'], variant: 'deo' },
  },
  {
    path: 'InstallationDetailsDEONew',
    loadComponent: () => import('./component/installation-details/installation-details.component').then(m => m.InstallationDetailsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUGMF','AU','DME','AUPO','TPOT','BME','AD'], variant: 'deonew' },
  },
  {
    path: 'InstallationDetailsFINCTRL',
    loadComponent: () => import('./component/installation-details/installation-details.component').then(m => m.InstallationDetailsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUGMF','AU','DME','AUPO','TPOT','BME','AD'], variant: 'finctrl' },
  },
  {
    path: 'InstallationDetailsGMT',
    loadComponent: () => import('./component/installation-details/installation-details.component').then(m => m.InstallationDetailsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUGMF','AU','DME','AUPO','TPOT','BME','AD'], variant: 'gmt' },
  },
  // {path:'ExtensionHODetail',component:ExtensionHODetailComponent},//
  { path: 'ExtensionHOEntry', loadComponent: () => import('./component/extension-hoentry/extension-hoentry.component').then(m => m.ExtensionHOEntryComponent) },
  // {path:'ItemWiseDetailPOCell',component:ItemWiseDetailPOCellComponent},//
  {
    path: 'ItemWiseDetailPOCellByPOid',
    loadComponent: () => import('./component/item-wise-detail-pocell-by-poid/item-wise-detail-pocell-by-poid.component').then(m => m.ItemWiseDetailPOCellByPOidComponent),
  },
  // {path:'IndentPOSummaryDirwise',component:IndentPOSummaryDirwiseComponent},//
  // {path:'DistrictWisePODetail',component:DistrictWisePODetailComponent},//
  {path:'TenderCoverAitems',loadComponent: () => import('./component/BME/tender-cover-aitems/tender-cover-aitems.component').then(m => m.TenderCoverAitemsComponent)},
  {
    path: 'POSummaryDrillDwnQtyPOWise',
    loadComponent: () => import('./component/posummary-drill-dwn-qty-powise/posummary-drill-dwn-qty-powise.component').then(m => m.POSummaryDrillDwnQtyPOWiseComponent),
  },
  { path: 'POSummaryDrillDwnQty', loadComponent: () => import('./component/posummary-drill-dwn-qty/posummary-drill-dwn-qty.component').then(m => m.POSummaryDrillDwnQtyComponent) },
  { path: 'EMSNEWPO', loadComponent: () => import('./component/PO-Cell/emsnewpo/emsnewpo.component').then(m => m.EMSNEWPOComponent) },
  {
    path: 'IndentEditDHSPO',
    loadComponent: () => import('./component/PO-Cell/indent-edit-dhs-po/indent-edit-dhs-po.component').then(m => m.IndentEditDHSPOComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUPO', 'TPOT', 'AD', 'AU'] },
  },
  { path: 'SupplierBankAccounts', loadComponent: () => import('./GM Finance/supplier-bank-accounts/supplier-bank-accounts.component').then(m => m.SupplierBankAccountsComponent) },
  { path: 'SupplierGSTentry', loadComponent: () => import('./GM Finance/supplier-gstentry/supplier-gstentry.component').then(m => m.SupplierGSTentryComponent) },
  { path: 'BudgetDetailsProvisional', loadComponent: () => import('./GM Finance/budget-details-provisional/budget-details-provisional.component').then(m => m.BudgetDetailsProvisionalComponent) },
  { path: 'Sanction', loadComponent: () => import('./GM Finance/sanction/sanction.component').then(m => m.SanctionComponent) },
  { path: 'CoverAitemsReports', loadComponent: () => import('./component/BME/cover-aitems-reports/cover-aitems-reports.component').then(m => m.CoverAitemsReportsComponent) },

  {
    path: 'TenderStatusUpdate',
    loadComponent: () => import('./component/BME/tender-status-update/tender-status-update.component').then(m => m.TenderStatusUpdateComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'AddRTenderItems',
    loadComponent: () => import('./component/BME/add-rtender-items/add-rtender-items.component').then(m => m.AddRTenderItemsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  // Plan a Tender row actions (legacy tender_details_1.aspx)
  {
    path: 'AddExcel',
    loadComponent: () => import('./component/add-excel/add-excel.component').then(m => m.AddExcelComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'CovAaddRemuvie',
    loadComponent: () => import('./component/cov-aadd-remuvie/cov-aadd-remuvie.component').then(m => m.CovAaddRemuvieComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'CovAItemsEntry',
    loadComponent: () => import('./component/BME/cov-aitems-entry/cov-aitems-entry.component').then(m => m.CovAItemsEntryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'AddLeavy',
    loadComponent: () => import('./component/BME/add-leavy/add-leavy.component').then(m => m.AddLeavyComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'AddTenderCon',
    loadComponent: () => import('./component/BME/add-tender-con/add-tender-con.component').then(m => m.AddTenderConComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'TenderStatusRemark',
    loadComponent: () => import('./component/BME/tender-status-remark/tender-status-remark.component').then(m => m.TenderStatusRemarkComponent),
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
    loadComponent: () => import('./component/landing-page/landing-page.component').then(m => m.LandingPageComponent),
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
        'TPOT',
      ],
    },
  },
  {
    path: 'home',
    loadComponent: () => import('./component/home/home.component').then(m => m.HomeComponent),
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
        'TPOT',
      ],
    },
  },
  // { path: 'welcome', component: HomeComponent, canActivate: [RouteGuardService],data: { allowedRoles: ['Suppliers','SEC1','DHS','CME','DME1','Collector','Warehouse','SE','HO_Infra','Division','DM PO','SSO','Logi Cell']} },
  {
    path: 'GenerationFileNonasti',
    loadComponent: () => import('./component/generation-file-nonasti/generation-file-nonasti.component').then(m => m.GenerationFileNonastiComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO'] },
  },
  {
    path: 'MasterSupplierDash',
    loadComponent: () => import('./component/Tender Cell/master-supplier-dash/master-supplier-dash.component').then(m => m.MasterSupplierDashComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPOT'] },
  },
  {
    path: 'FileMRCDashbord',
    loadComponent: () => import('./component/file-mrcdashbord/file-mrcdashbord.component').then(m => m.FileMRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO'], variant: 'dm' },
  },
  {
    path: 'FileMRCDashboardFIN',
    loadComponent: () => import('./component/file-mrcdashbord/file-mrcdashbord.component').then(m => m.FileMRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD','FIN'], variant: 'fin' },
  },
  {
    path: 'FileMRCDashboardGM',
    loadComponent: () => import('./component/file-mrcdashbord/file-mrcdashbord.component').then(m => m.FileMRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['GM','AD'], variant: 'gm' },
  },
  {
    path: 'FileMRCDashboardIGM',
    loadComponent: () => import('./component/file-mrcdashbord/file-mrcdashbord.component').then(m => m.FileMRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['IGM','AD'], variant: 'igm' },
  },
  {
    path: 'FileMRCDashboardFINFile',
    loadComponent: () => import('./component/file-mrcdashbord/file-mrcdashbord.component').then(m => m.FileMRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['FIN','AD'], variant: 'fin-file' },
  },
  {
    path: 'FileMRCDashboardFINFile_Ver1',
    loadComponent: () => import('./component/file-mrcdashbord/file-mrcdashbord.component').then(m => m.FileMRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['FIN','AD'], variant: 'fin-file-v1' },
  },
  {
    path: 'FileMRCDashboardGMNew',
    loadComponent: () => import('./component/file-mrcdashbord/file-mrcdashbord.component').then(m => m.FileMRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['GM','AD'], variant: 'gm-new' },
  },
  {
    path: 'FileMRCDashboardIGMMov',
    loadComponent: () => import('./component/file-mrcdashbord/file-mrcdashbord.component').then(m => m.FileMRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['IGM','AD'], variant: 'igm-mov' },
  },
  {
    path: 'FileMRCDashboardIGMMovAudit',
    loadComponent: () => import('./component/file-mrcdashbord/file-mrcdashbord.component').then(m => m.FileMRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['IGM','AD'], variant: 'igm-mov-audit' },
  },
  {
    path: 'FileMRCDashboardIGMMovBME',
    loadComponent: () => import('./component/file-mrcdashbord/file-mrcdashbord.component').then(m => m.FileMRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['BME','AD'], variant: 'igm-mov-bme' },
  },

  {
    // path: 'ExtensionHODetail',
    path: 'POSupplyHO',
    loadComponent: () => import('./component/extension-hodetail/extension-hodetail.component').then(m => m.ExtensionHODetailComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUPO'] },
  },

  {
    path: 'ItemWiseDetailPOCell',
    loadComponent: () => import('./component/item-wise-detail-pocell/item-wise-detail-pocell.component').then(m => m.ItemWiseDetailPOCellComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO'] },
  },

  {
    path: 'IndentPOSummaryDirwise',
    loadComponent: () => import('./component/indent-posummary-dirwise/indent-posummary-dirwise.component').then(m => m.IndentPOSummaryDirwiseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO'] },
  },

  {
    path: 'DistrictWisePODetail',
    loadComponent: () => import('./component/district-wise-podetail/district-wise-podetail.component').then(m => m.DistrictWisePODetailComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUGMF'] },
  },
  // BME
  {
    path: 'MastterSupplierDash',
    loadComponent: () => import('./component/BME/mastter-supplier-dash/mastter-supplier-dash.component').then(m => m.MastterSupplierDashComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'ItemsBME',
    loadComponent: () => import('./component/BME/items-bme/items-bme.component').then(m => m.ItemsBMEComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME', 'AUPO'] },
  },
  {
    path: 'MapitemsEithType',
    loadComponent: () => import('./component/BME/mapitems-eith-type/mapitems-eith-type.component').then(m => m.MapitemsEithTypeComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'MapitemswithTypeUpdate',
    loadComponent: () => import('./component/BME/mapitemswith-type-update/mapitemswith-type-update.component').then(m => m.MapitemswithTypeUpdateComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'MapitemswithMainitemTypeRepo',
    loadComponent: () => import('./component/BME/mapitemswith-mainitem-type-repo/mapitemswith-mainitem-type-repo.component').then(m => m.MapitemswithMainitemTypeRepoComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'EMSRCDashbord',
    loadComponent: () => import('./component/BME/emsrcdashbord/emsrcdashbord.component').then(m => m.EMSRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'EMSNEWRC',
    loadComponent: () => import('./component/BME/emsnewrc/emsnewrc.component').then(m => m.EMSNEWRCComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'PlanaTenderD',
    loadComponent: () => import('./component/BME/plana-tender-d/plana-tender-d.component').then(m => m.PlanaTenderDComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME', 'AUPO', 'TPOT', 'Facility', 'HealthFacility', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'TenderCoverAObClaimAfter',
    loadComponent: () => import('./component/Tender Cell/tender-cover-aob-claim-after/tender-cover-aob-claim-after.component').then(m => m.TenderCoverAObClaimAfterComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPOT'] },
  },
  {
    path: 'TenderCoverA',
    loadComponent: () => import('./component/BME/tender-cover-a/tender-cover-a.component').then(m => m.TenderCoverAComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU','TPOT'] },
  },
  {
    path: 'TenderCoverAObClaimAfterB',
    loadComponent: () => import('./component/Tender Cell/tender-cover-aob-claim-after-b/tender-cover-aob-claim-after-b.component').then(m => m.TenderCoverAObClaimAfterBComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPOT', 'TPO', 'AU', 'DME'] },
  },
  {
    path: 'TenderCoverAObClaim',
    loadComponent: () => import('./tender-cover-aob-claim/tender-cover-aob-claim.component').then(m => m.TenderCoverAObClaimComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU','TPOT'] },
  },
  {
    path: 'TenderItemsPriceAR',
    loadComponent: () => import('./component/BME/tender-items-price-gem/tender-items-price-gem.component').then(m => m.TenderItemsPriceGEMComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'TPOT', 'AUPO'], mode: 'AR' },
  },
  {
    path: 'TenderItemsPriceGEM',
    loadComponent: () => import('./component/BME/tender-items-price-gem/tender-items-price-gem.component').then(m => m.TenderItemsPriceGEMComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU'] },
  },
  {
    path: 'TenderDetailsPriceEntryGEM',
    loadComponent: () => import('./component/BME/tender-details-price-entry-gem/tender-details-price-entry-gem.component').then(m => m.TenderDetailsPriceEntryGEMComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU'] },
  },
  {
    path: 'ConsolidatedIndentPOCell',
    loadComponent: () => import('./component/BME/consolidated-indent-pocell/consolidated-indent-pocell.component').then(m => m.ConsolidatedIndentPOCellComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU','AUPO','TPOT'] },
  },
  // POCell
  // {path:'MasFacilityUsers',component:MasFacilityUsersComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AU'] }},
  {
    path: 'MasFacilityUsers',
    loadComponent: () => import('./component/PO-Cell/mas-facility-users/mas-facility-users.component').then(m => m.MasFacilityUsersComponent),
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'DHSindentAddBulkConsigneePO',
    loadComponent: () => import('./component/PO-Cell/dhsindent-add-bulk-consignee-po/dhsindent-add-bulk-consignee-po.component').then(m => m.DHSindentAddBulkConsigneePOComponent),
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'Termsconditions',
    loadComponent: () => import('./component/PO-Cell/termsconditions/termsconditions.component').then(m => m.TermsconditionsComponent),
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'RDLCTenderSummary',
    loadComponent: () => import('./component/PO-Cell/rdlctender-summary/rdlctender-summary.component').then(m => m.RDLCTenderSummaryComponent),
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'ProgramMaster',
    loadComponent: () => import('./component/PO-Cell/program-master/program-master.component').then(m => m.ProgramMasterComponent),
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'RCExtend',
    loadComponent: () => import('./component/PO-Cell/rcextend/rcextend.component').then(m => m.RCExtendComponent),
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'AppliedPoExtension',
    loadComponent: () => import('./component/PO-Cell/applied-po-extension/applied-po-extension.component').then(m => m.AppliedPoExtensionComponent),
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'EMSPODashboard',
    loadComponent: () => import('./component/PO-Cell/emspodashboard/emspodashboard.component').then(m => m.EMSPODashboardComponent),
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'ConsolidatedIndentDHSPO',
    loadComponent: () => import('./component/PO-Cell/consolidated-indent-dhs-po/consolidated-indent-dhs-po.component').then(m => m.ConsolidatedIndentDHSPOComponent),
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['AUPO','TPOT'],
      // allowedUsersid: [2307]
      // allowedUsers: ['rahul_au', 'amit_au']
    },
  },
  {
    path: 'ConsolidatedIndentCGMSC',
    loadComponent: () => import('./component/Tender Cell/consolidated-indent-cgmsc/consolidated-indent-cgmsc.component').then(m => m.ConsolidatedIndentCGMSCComponent),
    canActivate: [RouteGuardService],
    data: {
      allowedRoles: ['TPOT'],
    },
  },
  {
    path: 'IndentWiseItemRemarks',
    loadComponent: () => import('./component/PO-Cell/indent-wise-item-remarks/indent-wise-item-remarks.component').then(m => m.IndentWiseItemRemarksComponent),
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
    loadComponent: () => import('./component/rcdetail-report/rcdetail-report.component').then(m => m.RCDetailReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AUPO'] },
  },
  {
    path: 'AcceptedReort',
    loadComponent: () => import('./component/accepted-reort/accepted-reort.component').then(m => m.AcceptedReortComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD','AUPO'] },
  },
  {
    path: 'IndentFromFacilities',
    loadComponent: () => import('./component/indent-from-facilities/indent-from-facilities.component').then(m => m.IndentFromFacilitiesComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'ComplainReportBME',
    loadComponent: () => import('./component/complain-report-bme/complain-report-bme.component').then(m => m.ComplainReportBMEComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'POPaidReport',
    loadComponent: () => import('./component/popaid-report/popaid-report.component').then(m => m.POPaidReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'FPOPaidReport',
    loadComponent: () => import('./component/popaid-report/popaid-report.component').then(m => m.POPaidReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'ChequeWisePaymentReport',
    loadComponent: () => import('./component/cheque-wise-payment-r/cheque-wise-payment-r.component').then(m => m.ChequeWisePaymentRComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'POSummaryReport',
    loadComponent: () => import('./component/posummary-report/posummary-report.component').then(m => m.POSummaryReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'TendersStatus',
    loadComponent: () => import('./component/tenders-status/tenders-status.component').then(m => m.TendersStatusComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'PORecdsummary',
    loadComponent: () => import('./component/porecdsummary/porecdsummary.component').then(m => m.PORecdsummaryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'TenterStatusItemWise',
    loadComponent: () => import('./component/tenter-status-item-wise/tenter-status-item-wise.component').then(m => m.TenterStatusItemWiseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'POSummaryDrillDwnQtyReagent',
    loadComponent: () => import('./component/posummary-drill-dwn-qty-reagent/posummary-drill-dwn-qty-reagent.component').then(m => m.POSummaryDrillDwnQtyReagentComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },

  // EMS sidebar-aligned routes (Masters / Stock / Orders / …)
  {
    path: 'masters/store-home',
    loadComponent: () => import('./component/Master/store-home/store-home.component').then(m => m.StoreHomeComponent),
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
        'PRINCIPAL',
        'SCI',
        'SUP',
        'TPO',
        'TPOT',
        'BME',
      ],
    },
  },
  {
    path: 'masters/consignee-information',
    loadComponent: () => import('./component/DME/consigee-information/consigee-information.component').then(m => m.ConsigeeInformationComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'masters/report-specification',
    loadComponent: () => import('./component/DME/masters/report-specification/report-specification.component').then(m => m.ReportSpecificationComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'masters/cme-eel-suggestion',
    loadComponent: () => import('./component/DME/masters/cme-eel-suggestion/cme-eel-suggestion.component').then(m => m.CmeEelSuggestionComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'masters/supplier',
    loadComponent: () => import('./component/BME/mastter-supplier-dash/mastter-supplier-dash.component').then(m => m.MastterSupplierDashComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME','TPOT'] },
  },
  {
    path: 'masters/items',
    loadComponent: () => import('./component/BME/items-bme/items-bme.component').then(m => m.ItemsBMEComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME','TPOT'] },
  },
  {
    path: 'masters/map-items',
    loadComponent: () => import('./component/BME/mapitems-eith-type/mapitems-eith-type.component').then(m => m.MapitemsEithTypeComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME','TPOT'] },
  },
  {
    path: 'masters/map-items-update',
    loadComponent: () => import('./component/BME/mapitemswith-type-update/mapitemswith-type-update.component').then(m => m.MapitemswithTypeUpdateComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME','TPOT'] },
  },
  {
    path: 'masters/map-items-report',
    loadComponent: () => import('./component/BME/mapitemswith-mainitem-type-repo/mapitemswith-mainitem-type-repo.component').then(m => m.MapitemswithMainitemTypeRepoComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME','TPOT'] },
  },
  {
    path: 'stock/covid-stock-report',
    loadComponent: () => import('./component/DME/stock/stock-report/stock-report.component').then(m => m.StockReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'stock/opening-stock-entry',
    loadComponent: () => import('./component/DME/stock/opening-stock-entry/opening-stock-entry.component').then(m => m.OpeningStockEntryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'stock/new-opening-stock-entry',
    loadComponent: () => import('./component/DME/stock/new-opening-stock-entry/new-opening-stock-entry.component').then(m => m.NewOpeningStockEntryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'stock/progress-category',
    loadComponent: () => import('./component/DME/stock/progress-category/progress-category.component').then(m => m.ProgressCategoryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'stock/facility-receipts',
    loadComponent: () => import('./component/DME/stock/facility-receipts/facility-receipts.component').then(m => m.FacilityReceiptsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'stock/nodal-information',
    loadComponent: () => import('./component/DME/stock/nodal-information/nodal-information.component').then(m => m.NodalInformationComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'orders/mas-file-no',
    loadComponent: () => import('./component/DME/orders/mas-file-no/mas-file-no.component').then(m => m.MasFileNoComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'orders/po-reallocation',
    loadComponent: () => import('./component/DME/orders/po-reallocation/po-reallocation.component').then(m => m.PoReallocationComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'orders/po-amendment',
    loadComponent: () => import('./component/DME/orders/po-amendment/po-amendment.component').then(m => m.PoAmendmentComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'orders/withheld-release',
    loadComponent: () => import('./component/DME/orders/withheld-release/withheld-release.component').then(m => m.WithheldReleaseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'payment-letter',
    loadComponent: () => import('./component/DME/orders/payment-letter/payment-letter.component').then(m => m.PaymentLetterComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'stock/nodal-progress',
    loadComponent: () => import('./component/DME/stock/nodal-progress/nodal-progress.component').then(m => m.NodalProgressComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'reports/eligible-report',
    loadComponent: () => import('./Reports/eligible-report/eligible-report.component').then(m => m.EligibleReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/main-equipment-mapped',
    loadComponent: () => import('./Reports/main-equipment-mapped-report/main-equipment-mapped-report.component').then(m => m.MainEquipmentMappedReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'orders/purchase-order-dashboard',
    loadComponent: () => import('./component/DME/orders/purchase-order-dashboard/purchase-order-dashboard.component').then(m => m.PurchaseOrderDashboardComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'AUPO'] },
  },
  {
    path: 'orders/purchase-order-receipts',
    loadComponent: () => import('./component/DME/orders/purchase-order-receipts/purchase-order-receipts.component').then(m => m.PurchaseOrderReceiptsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'orders/po-receipt-entry',
    loadComponent: () => import('./component/DME/orders/po-receipt-entry/po-receipt-entry.component').then(m => m.PoReceiptEntryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'orders/po-installation-report',
    loadComponent: () => import('./component/DME/orders/po-installation-report/po-installation-report.component').then(m => m.PoInstallationReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'orders/po-print',
    loadComponent: () => import('./component/DME/orders/po-print/po-print.component').then(m => m.PoPrintComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'AUPO'] },
  },
  {
    path: 'contracts/dashboard',
    loadComponent: () => import('./component/BME/emsrcdashbord/emsrcdashbord.component').then(m => m.EMSRCDashbordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME','AUPO'] },
  },
  {
    path: 'contracts/new-rc',
    loadComponent: () => import('./component/BME/emsnewrc/emsnewrc.component').then(m => m.EMSNEWRCComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME','AUPO'] },
  },
  {
    path: 'contracts/rc-detail-report',
    loadComponent: () => import('./component/rcdetail-report/rcdetail-report.component').then(m => m.RCDetailReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AU', 'TPO', 'CMHO', 'Store', 'FU', 'Facility', 'HealthFacility', 'DHS', 'AYUSH'] },
  },
  {
    path: 'tender/plan',
    loadComponent: () => import('./component/BME/plana-tender-d/plana-tender-d.component').then(m => m.PlanaTenderDComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME', 'AUPO', 'TPOT', 'Facility', 'HealthFacility', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'tender/evaluation',
    loadComponent: () => import('./component/BME/tender-status-update/tender-status-update.component').then(m => m.TenderStatusUpdateComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'tender/claim-object',
    loadComponent: () => import('./component/BME/add-rtender-items/add-rtender-items.component').then(m => m.AddRTenderItemsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AU', 'DME'] },
  },
  {
    path: 'tender/gem-price-acceptance',
    loadComponent: () => import('./component/tenders-status/tenders-status.component').then(m => m.TendersStatusComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'indents/budget-heads',
    loadComponent: () => import('./component/DME/indent/dme-fac-heads/dme-fac-heads.component').then(m => m.DmeFacHeadsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'indents/annual-indent',
    loadComponent: () => import('./component/DME/indent/consolidated-indent-dme/consolidated-indent-dme.component').then(m => m.ConsolidatedIndentDmeComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'indents/annual-indent-items',
    loadComponent: () => import('./component/DME/indent/dme-fac-add-indent/dme-fac-add-indent.component').then(m => m.DmeFacAddIndentComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'indents/annual-indent-report',
    loadComponent: () => import('./component/DME/indent/dme-fac-indent-report/dme-fac-indent-report.component').then(m => m.DmeFacIndentReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'DMEFACADDIndent',
    redirectTo: 'indents/annual-indent-items',
    pathMatch: 'full',
  },
  {
    path: 'Indent_ReportDME_MCwise',
    redirectTo: 'indents/annual-indent-report',
    pathMatch: 'full',
  },
  {
    path: 'rdlDMEAIReport',
    redirectTo: 'indents/annual-indent-report',
    pathMatch: 'full',
  },
  {
    path: 'indents/from-facilities',
    loadComponent: () => import('./component/indent-from-facilities/indent-from-facilities.component').then(m => m.IndentFromFacilitiesComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'finance/year-wise-po-abstract',
    loadComponent: () => import('./component/facility-auth-povalue-pocell/facility-auth-povalue-pocell.component').then(m => m.FacilityAuthPOValuePOCellComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AUPO','AUGMF'] },
  },
  {
    path: 'finance/po-wise-payment',
    loadComponent: () => import('./component/popaid-report/popaid-report.component').then(m => m.POPaidReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AUPO','AUGMF'] },
  },
  {
    path: 'finance/cheque-wise-payment',
    loadComponent: () => import('./component/cheque-wise-payment-r/cheque-wise-payment-r.component').then(m => m.ChequeWisePaymentRComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AUGMF'] },
  },
  {
    path: 'complain/facility-store',
    loadComponent: () => import('./component/DME/complain/facility-complain-store/facility-complain-store.component').then(m => m.FacilityComplainStoreComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'complain/complaint-status',
    loadComponent: () => import('./component/DME/complain/complaint-status/complaint-status.component').then(m => m.ComplaintStatusComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'complain/complaint-status-edit/:compId',
    loadComponent: () => import('./component/DME/complain/complaint-status-edit/complaint-status-edit.component').then(m => m.ComplaintStatusEditComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'complain/complaint-status-facility',
    loadComponent: () => import('./component/DME/complain/complaint-status-facility/complaint-status-facility.component').then(m => m.ComplaintStatusFacilityComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'complain/complaint-status-facility-edit/:compId',
    loadComponent: () => import('./component/DME/complain/complaint-status-facility-edit/complaint-status-facility-edit.component').then(m => m.ComplaintStatusFacilityEditComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'complain/complain-cmho',
    loadComponent: () => import('./component/DME/complain/complain-cmho/complain-cmho.component').then(m => m.ComplainCmhoComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'FU', 'PRINCIPAL', 'FDA'] },
  },
  {
    path: 'change-password',
    loadComponent: () => import('./component/DME/orders/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME', 'AUGMF', 'AU', 'TPO', 'AUPO', 'FU', 'PRINCIPAL', 'FDA', 'SUP'] },
  },
  {
    path: 'ChangePasswordForcefully',
    redirectTo: 'change-password',
  },
  {
    path: 'ForceChangePWD',
    redirectTo: 'change-password',
  },
  {
    path: 'complain/status',
    redirectTo: 'complain/complaint-status',
  },
  {
    path: 'ComplaintStatus',
    redirectTo: 'complain/complaint-status',
  },
  {
    path: 'ComplaintStatusFacility',
    redirectTo: 'complain/complaint-status-facility',
  },
  {
    path: 'ComplainCMHO',
    redirectTo: 'complain/complain-cmho',
  },
  {
    path: 'complain/report',
    loadComponent: () => import('./component/complain-report-bme/complain-report-bme.component').then(m => m.ComplainReportBMEComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/cmc-detail',
    loadComponent: () => import('./component/DME/reports/cmc-detail/cmc-detail.component').then(m => m.CmcDetailComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'reports/eel-specification',
    loadComponent: () => import('./component/DME/masters/report-specification/report-specification.component').then(m => m.ReportSpecificationComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME'] },
  },
  {
    path: 'reports/po-summary',
    loadComponent: () => import('./component/posummary-report/posummary-report.component').then(m => m.POSummaryReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/po-wise-payment',
    loadComponent: () => import('./component/popaid-report/popaid-report.component').then(m => m.POPaidReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/tenders-status',
    loadComponent: () => import('./component/tenders-status/tenders-status.component').then(m => m.TendersStatusComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME','AUGMF'] },
  },
  {
    path: 'reports/po-receipts-summary',
    loadComponent: () => import('./component/porecdsummary/porecdsummary.component').then(m => m.PORecdsummaryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/tender-item-status',
    loadComponent: () => import('./component/tenter-status-item-wise/tenter-status-item-wise.component').then(m => m.TenterStatusItemWiseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/reagent-po',
    loadComponent: () => import('./component/posummary-drill-dwn-qty-reagent/posummary-drill-dwn-qty-reagent.component').then(m => m.POSummaryDrillDwnQtyReagentComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME'] },
  },
  {
    path: 'reports/cmho-po-summary',
    loadComponent: () => import('./Reports/cmho-po-summary/cmho-po-summary.component').then(m => m.CmhoPoSummaryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME', 'CMHO', 'Store', 'FU', 'Facility', 'HealthFacility', 'DHS', 'AYUSH'] },
  },
  {
    path: 'reports/cmho-po-summary-drilldown',
    loadComponent: () => import('./Reports/cmho-po-summary-drilldown/cmho-po-summary-drilldown.component').then(m => m.CmhoPoSummaryDrilldownComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME', 'CMHO', 'Store', 'FU', 'Facility', 'HealthFacility', 'DHS', 'AYUSH'] },
  },
  {
    path: 'reports/po-summary-directorate',
    loadComponent: () => import('./Reports/po-summary-directorate/po-summary-directorate.component').then(m => m.PoSummaryDirectorateComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/po-summary-directorate-drilldown',
    loadComponent: () => import('./Reports/po-summary-directorate-drilldown/po-summary-directorate-drilldown.component').then(m => m.PoSummaryDirectorateDrilldownComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/po-summary-consignee-ho',
    loadComponent: () => import('./Reports/po-summary-consignee-ho/po-summary-consignee-ho.component').then(m => m.PoSummaryConsigneeHoComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/tender-live-status',
    loadComponent: () => import('./Reports/tender-live-status/tender-live-status.component').then(m => m.TenderLiveStatusComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/tender-live-status-drilldown',
    loadComponent: () => import('./Reports/tender-live-status-drilldown/tender-live-status-drilldown.component').then(m => m.TenderLiveStatusDrilldownComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/balance-status-dhs',
    loadComponent: () => import('./Reports/balance-status-dhs/balance-status-dhs.component').then(m => m.BalanceStatusDhsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME', 'DHS', 'AYUSH'] },
  },
  {
    path: 'reports/balance-status-pocell',
    loadComponent: () => import('./Reports/balance-status-pocell/balance-status-pocell.component').then(m => m.BalanceStatusPocellComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/opening-stock-summary',
    loadComponent: () => import('./Reports/opening-stock-summary/opening-stock-summary.component').then(m => m.OpeningStockSummaryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/opening-stock-drilldown',
    loadComponent: () => import('./Reports/opening-stock-drilldown/opening-stock-drilldown.component').then(m => m.OpeningStockDrilldownComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/payments-cpreport-igm',
    loadComponent: () => import('./Reports/payments-cpreport-igm/payments-cpreport-igm.component').then(m => m.PaymentsCpreportIgmComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/popaid-report-igm',
    loadComponent: () => import('./Reports/popaid-report-igm/popaid-report-igm.component').then(m => m.PopaidReportIgmComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/emd-deposite-report',
    loadComponent: () => import('./Reports/emd-deposite-report/emd-deposite-report.component').then(m => m.EmdDepositeReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/equipment-tag-report',
    loadComponent: () => import('./Reports/equipment-tag-report/equipment-tag-report.component').then(m => m.EquipmentTagReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME', 'CMHO', 'Store', 'FU', 'Facility', 'HealthFacility', 'DHS', 'AYUSH'] },
  },
  {
    path: 'reports/tender-wise-po-details',
    loadComponent: () => import('./Reports/tender-wise-po-details/tender-wise-po-details.component').then(m => m.TenderWisePoDetailsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/tender-status-item-wise',
    loadComponent: () => import('./Reports/tender-status-item-wise/tender-status-item-wise.component').then(m => m.TenderStatusItemWiseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/dispatch-detail',
    loadComponent: () => import('./Reports/dispatch-detail/dispatch-detail.component').then(m => m.DispatchDetailComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/pending-po-supplier-wise',
    loadComponent: () => import('./Reports/pending-po-supplier-wise/pending-po-supplier-wise.component').then(m => m.PendingPoSupplierWiseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/receipt-pending-cmho',
    loadComponent: () => import('./Reports/receipt-pending-cmho/receipt-pending-cmho.component').then(m => m.ReceiptPendingCmhoComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME', 'CMHO', 'Store', 'FU', 'Facility', 'HealthFacility', 'DHS', 'AYUSH'] },
  },
  {
    path: 'reports/report-indent-po-details',
    loadComponent: () => import('./Reports/report-indent-po-details/report-indent-po-details.component').then(m => m.ReportIndentPoDetailsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/eel-suggestion-report',
    loadComponent: () => import('./Reports/eel-suggestion-report/eel-suggestion-report.component').then(m => m.EelSuggestionReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/fac-stock-covid-items-bme',
    loadComponent: () => import('./Reports/fac-stock-covid-items-bme/fac-stock-covid-items-bme.component').then(m => m.FacStockCovidItemsBmeComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/balance-supplierwise',
    loadComponent: () => import('./Reports/balance-supplierwise/balance-supplierwise.component').then(m => m.BalanceSupplierwiseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/indent-report-pocell',
    loadComponent: () => import('./Reports/indent-report-pocell/indent-report-pocell.component').then(m => m.IndentReportPocellComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/pending-install-drilldown-dhs',
    loadComponent: () => import('./Reports/pending-install-drilldown-dhs/pending-install-drilldown-dhs.component').then(m => m.PendingInstallDrilldownDhsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME', 'DHS', 'AYUSH'] },
  },
  {
    path: 'reports/pending-install-drilldown-pocell',
    loadComponent: () => import('./Reports/pending-install-drilldown-pocell/pending-install-drilldown-pocell.component').then(m => m.PendingInstallDrilldownPocellComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/rdlc-dhs-pending',
    loadComponent: () => import('./Reports/rdlc-dhs-pending/rdlc-dhs-pending.component').then(m => m.RdlcDhsPendingComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME', 'DHS', 'AYUSH'] },
  },
  {
    path: 'reports/cover-a-items-reports',
    loadComponent: () => import('./Reports/cover-a-items-reports/cover-a-items-reports.component').then(m => m.CoverAItemsReportsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/item-wise-detail',
    loadComponent: () => import('./Reports/item-wise-detail/item-wise-detail.component').then(m => m.ItemWiseDetailComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/item-wise-detail-pocell',
    loadComponent: () => import('./Reports/item-wise-detail-pocell/item-wise-detail-pocell.component').then(m => m.ItemWiseDetailPOCellComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/item-wise-detail-poqty',
    loadComponent: () => import('./Reports/item-wise-detail-poqty/item-wise-detail-poqty.component').then(m => m.ItemWiseDetailPOQtyComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/item-wise-detail-poqty-pocell',
    loadComponent: () => import('./Reports/item-wise-detail-poqty-pocell/item-wise-detail-poqty-pocell.component').then(m => m.ItemWiseDetailPOQtyPOCellComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/complain-report-bme',
    loadComponent: () => import('./Reports/complain-report-bme/complain-report-bme.component').then(m => m.ComplainReportBmeComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/district-wise-po-detail',
    loadComponent: () => import('./Reports/district-wise-po-detail/district-wise-po-detail.component').then(m => m.DistrictWisePoDetailComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME', 'CMHO', 'Store', 'FU', 'Facility', 'HealthFacility', 'DHS', 'AYUSH'] },
  },
  {
    path: 'reports/emd-refund-report',
    loadComponent: () => import('./Reports/emd-refund-report/emd-refund-report.component').then(m => m.EmdRefundReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/po-paid-report',
    loadComponent: () => import('./Reports/po-paid-report/po-paid-report.component').then(m => m.PoPaidReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/payment-report',
    loadComponent: () => import('./Reports/payment-report/payment-report.component').then(m => m.PaymentReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/tender-status',
    loadComponent: () => import('./Reports/tender-status/tender-status.component').then(m => m.TenderStatusComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/po-summary',
    loadComponent: () => import('./Reports/po-summary/po-summary.component').then(m => m.PoSummaryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME', 'CMHO', 'Store', 'FU', 'Facility', 'HealthFacility', 'DHS', 'AYUSH'] },
  },
  {
    path: 'reports/po-summary-drilldown-qty',
    loadComponent: () => import('./Reports/po-summary-drilldown-qty/po-summary-drilldown-qty.component').then(m => m.PoSummaryDrilldownQtyComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/po-summary-drilldown-qty-powise',
    loadComponent: () => import('./Reports/po-summary-drilldown-qty-powise/po-summary-drilldown-qty-powise.component').then(m => m.PoSummaryDrilldownQtyPowiseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/po-summary-drilldown-qty-reagent',
    loadComponent: () => import('./Reports/po-summary-drilldown-qty-reagent/po-summary-drilldown-qty-reagent.component').then(m => m.PoSummaryDrilldownQtyReagentComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/indent-po-summary-dirwise',
    loadComponent: () => import('./Reports/indent-po-summary-dirwise/indent-po-summary-dirwise.component').then(m => m.IndentPoSummaryDirwiseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/cover-a-items-reports',
    loadComponent: () => import('./Reports/cover-a-items-reports/cover-a-items-reports.component').then(m => m.CoverAItemsReportsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/payments-cpreport',
    loadComponent: () => import('./Reports/payments-cpreport/payments-cpreport.component').then(m => m.PaymentsCpreportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/po-receipt-summary',
    loadComponent: () => import('./Reports/po-receipt-summary/po-receipt-summary.component').then(m => m.PoReceiptSummaryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/sanctions-rdlc',
    loadComponent: () => import('./Reports/sanctions-rdlc/sanctions-rdlc.component').then(m => m.SanctionsRdlcComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'reports/balance-status-supplier',
    loadComponent: () => import('./Reports/balance-status-supplier/balance-status-supplier.component').then(m => m.BalanceStatusSupplierComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },

  { path: 'EMISPerf20_RDLC', redirectTo: 'performance/emis-perf20-rdlc', pathMatch: 'full' },
  { path: 'Payment20CheequPrep', redirectTo: 'performance/payment20-cheque-prep', pathMatch: 'full' },
  { path: 'SanctionNotesheet', redirectTo: 'performance/sanction-notesheet', pathMatch: 'full' },

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
    path: 'report_specification',
    redirectTo: 'reports/eel-specification',
    pathMatch: 'full',
  },
  {
    path: 'Itemspecification',
    redirectTo: 'reports/eel-specification',
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
    path: 'FACStockCMHO',
    redirectTo: 'stock/covid-stock-report',
    pathMatch: 'full',
  },
  {
    path: 'FACStockCOVIDItemsMC',
    redirectTo: 'stock/covid-stock-report',
    pathMatch: 'full',
  },
  {
    path: 'Facility_Home',
    redirectTo: 'masters/store-home',
    pathMatch: 'full',
  },
  {
    path: 'FACProgress4Cat',
    redirectTo: 'stock/progress-category',
    pathMatch: 'full',
  },
  {
    path: 'Facilityequipmentreceipt',
    redirectTo: 'stock/facility-receipts',
    pathMatch: 'full',
  },
  {
    path: 'NodleInformationNew',
    redirectTo: 'stock/nodal-information',
    pathMatch: 'full',
  },
  {
    path: 'MasFileNo',
    redirectTo: 'orders/mas-file-no',
    pathMatch: 'full',
  },
  {
    path: 'ReportPOEligible',
    redirectTo: 'reports/eligible-report',
    pathMatch: 'full',
  },
  {
    path: 'PORealloaction',
    redirectTo: 'orders/po-reallocation',
    pathMatch: 'full',
  },
  {
    path: 'EMSPOAmmendment',
    redirectTo: 'orders/po-amendment',
    pathMatch: 'full',
  },
  {
    path: 'Payment20Per',
    redirectTo: 'orders/withheld-release',
    pathMatch: 'full',
  },
  {
    path: 'PaymentLetter',
    redirectTo: 'payment-letter',
    pathMatch: 'full',
  },
  {
    path: 'MainEquipmentMappedReport',
    redirectTo: 'reports/main-equipment-mapped',
    pathMatch: 'full',
  },
  {
    path: 'ProgressDetail',
    redirectTo: 'stock/nodal-progress',
    pathMatch: 'full',
  },
  {
    path: 'ProgressDetailDME',
    redirectTo: 'stock/nodal-progress?dme=true',
    pathMatch: 'full',
  },
  {
    path: 'po_supextapproval',
    redirectTo: 'ExtensionHODetail?onlyExtensionRequests=true',
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
    path: 'FacilityPO_ReceiptDME',
    redirectTo: 'orders/po-receipt-entry',
    pathMatch: 'full',
  },
  {
    path: 'Facility_InstallationReportDME',
    redirectTo: 'orders/po-installation-report',
    pathMatch: 'full',
  },
  {
    path: 'EMSRCDashbord',
    redirectTo: 'contracts/dashboard',
    pathMatch: 'full',
  },
  { path: 'EMSNEWRC', redirectTo: 'contracts/new-rc', pathMatch: 'full' },
  // {
  //   path: 'RCDetailReport',
  //   redirectTo: 'contracts/rc-detail-report',
  //   pathMatch: 'full',
  // },
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
    path: 'EMDRefundTenderwise',
    loadComponent: () => import('./component/Finance/emd-refund-tenderwise/emd-refund-tenderwise.component').then(m => m.EmdRefundTenderwiseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'CGMSC', 'AD'] },
  },
  {
    path: 'emd-refund/tenderwise',
    loadComponent: () => import('./component/Finance/emd-refund-tenderwise/emd-refund-tenderwise.component').then(m => m.EmdRefundTenderwiseComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'CGMSC', 'AD'] },
  },
  {
    path: 'SDReleaseFInance',
    loadComponent: () => import('./component/Finance/sd-release-finance/sd-release-finance.component').then(m => m.SdReleaseFinanceComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'CGMSC', 'AD'] },
  },
  {
    path: 'SDReleaseFinance',
    redirectTo: 'SDReleaseFInance',
    pathMatch: 'full',
  },
  {
    path: 'emd-refund/sd-release-finance',
    loadComponent: () => import('./component/Finance/sd-release-finance/sd-release-finance.component').then(m => m.SdReleaseFinanceComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'CGMSC', 'AD'] },
  },
  {
    path: 'EditReceivedAndInstallationDate',
    loadComponent: () => import('./GM Finance/edit-received-and-installation-date/edit-received-and-installation-date.component').then(m => m.EditReceivedAndInstallationDateComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'Supplier',
    loadComponent: () => import('./GM Finance/suppliers/suppliers.component').then(m => m.SuppliersComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'CgmscBankAccounts',
    loadComponent: () => import('./GM Finance/cgmsc-bank-accounts/cgmsc-bank-accounts.component').then(m => m.CgmscBankAccountsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'NewFundMaster',
    loadComponent: () => import('./GM Finance/new-fund-master/new-fund-master.component').then(m => m.NewFundMasterComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'FundMap',
    loadComponent: () => import('./GM Finance/fund-map/fund-map.component').then(m => m.FundMapComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'BudgentEntry',
    loadComponent: () => import('./GM Finance/budgent-entry/budgent-entry.component').then(m => m.BudgentEntryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'MainFundHead',
    loadComponent: () => import('./component/Finance/main-fund-head-en/main-fund-head-en.component').then(m => m.MainFundHeadEnComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'GM FINANCE', 'GM Finance', 'GMF'] },
  },
  {
    path: 'mainfundhead',
    redirectTo: 'MainFundHead',
    pathMatch: 'full',
  },
  {
    path: 'OpeningBalance',
    loadComponent: () => import('./GM Finance/opening-balance/opening-balance.component').then(m => m.OpeningBalanceComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'GM FINANCE', 'GM Finance', 'GMF'] },
  },
  {
    path: 'openingbalance',
    redirectTo: 'OpeningBalance',
    pathMatch: 'full',
  },
  {
    path: 'IndentRCPOTenderStatus',
    loadComponent: () => import('./Reports/indent-rc-po-tender-status/indent-rc-po-tender-status.component').then(m => m.IndentRCPOTenderStatusComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'UnpaidPOS',
    loadComponent: () => import('./Reports/unpaid-pos/unpaid-pos.component').then(m => m.UnpaidPOSComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'POReportGMF',
    loadComponent: () => import('./Reports/poreport-gmf/poreport-gmf.component').then(m => m.POReportGMFComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'InvoiceDetail',
    loadComponent: () => import('./Reports/invoice-detail/invoice-detail.component').then(m => m.InvoiceDetailComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME', 'AUGMF', 'AUPO', 'AU'] },
  },
  {
    path: 'TDSdataReport',
    loadComponent: () => import('./Reports/tdsdata-report/tdsdata-report.component').then(m => m.TDSdataReportComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME', 'AUGMF', 'AUPO', 'AU'] },
  },
  {
    path: 'PaymentsCPReport20per',
    loadComponent: () => import('./Reports/payments-cpreport20per/payments-cpreport20per.component').then(m => m.PaymentsCPReport20perComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME', 'AUGMF', 'AUPO', 'AU'] },
  },
  {
    path: 'reports/payments-cpreport20per',
    loadComponent: () => import('./Reports/payments-cpreport20per/payments-cpreport20per.component').then(m => m.PaymentsCPReport20perComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME', 'AUGMF', 'AUPO', 'AU'] },
  },
  {
    path: 'FileMRCDashboardFINFile',
    loadComponent: () => import('./GM Finance/file-mrcdashboard-finfile/file-mrcdashboard-finfile.component').then(m => m.FileMRCDashboardFINFileComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'AU'] },
  },
  {
    path: 'PerformanceCertificate',
    loadComponent: () => import('./Performance/performance-certificate/performance-certificate.component').then(m => m.PerformanceCertificateComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'performance/emis-perf20-rdlc',
    loadComponent: () => import('./Performance/emis-perf20-rdlc/emis-perf20-rdlc.component').then(m => m.EmisPerf20RdlcComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'performance/payment20-cheque-prep',
    loadComponent: () => import('./Performance/payment20-cheque-prep/payment20-cheque-prep.component').then(m => m.Payment20ChequePrepComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'performance/sanction-notesheet',
    loadComponent: () => import('./Performance/sanction-notesheet/sanction-notesheet.component').then(m => m.SanctionNotesheetComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
//#endregion

//#region Master Module
  {
    path: 'masters/dhs-facility-users-locations',
    loadComponent: () => import('./component/Master/dhs-facility-users-locations/dhs-facility-users-locations.component').then(m => m.DhsFacilityUsersLocationsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME', 'DHS', 'FU', 'Facility', 'CMHO', 'Store', 'AYUSH', 'AU', 'AUPO', 'AUGMF'] },
  },
  {
    path: 'DHSFacilityUsersLocations',
    redirectTo: 'masters/dhs-facility-users-locations',
    pathMatch: 'full',
  },
  {
    path: 'masters/dhs-add-facility',
    loadComponent: () => import('./component/Master/dhs-add-facility/dhs-add-facility.component').then(m => m.DhsAddFacilityComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME', 'DHS', 'FU', 'Facility', 'CMHO', 'Store', 'AYUSH', 'AU', 'AUPO', 'AUGMF'] },
  },
  {
    path: 'DHSAddFacility',
    redirectTo: 'masters/dhs-add-facility',
    pathMatch: 'full',
  },
  {
    path: 'masters/health-facility-details',
    loadComponent: () => import('./component/Master/health-facility-details/health-facility-details.component').then(m => m.HealthFacilityDetailsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'DME', 'DHS', 'FU', 'Facility', 'CMHO', 'Store', 'AYUSH', 'AU', 'AUPO', 'AUGMF'] },
  },
  {
    path: 'HealthFacilityDetails',
    redirectTo: 'masters/health-facility-details',
    pathMatch: 'full',
  },
  {
    path: 'masters/item-specification',
    loadComponent: () => import('./component/Master/item-specification/item-specification.component').then(m => m.ItemSpecificationComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['DME', 'AD', 'DHS', 'FU', 'Facility', 'CMHO', 'Store', 'AYUSH', 'AU', 'AUPO', 'AUGMF'] },
  },
  {
    path: 'Itemspecification',
    redirectTo: 'masters/item-specification',
    pathMatch: 'full',
  },
  {
    path: 'masters/mas-facility-users-locations',
    loadComponent: () => import('./component/Master/mas-facility-users-locations/mas-facility-users-locations.component').then(m => m.MasFacilityUsersLocationsComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUPO', 'AD', 'DME', 'DHS', 'FU', 'Facility', 'CMHO', 'Store', 'AYUSH', 'AU', 'AUGMF'] },
  },
  {
    path: 'MasFacilityUsersLocations',
    redirectTo: 'masters/mas-facility-users-locations',
    pathMatch: 'full',
  },
  {
    path: 'masters/master-supplier-add',
    loadComponent: () => import('./component/Master/master-supplier-add/master-supplier-add.component').then(m => m.MasterSupplierAddComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO', 'AD', 'DME', 'DHS', 'FU', 'Facility', 'CMHO', 'Store', 'AYUSH', 'AU', 'AUPO', 'AUGMF'] },
  },
  {
    path: 'MasterSupplierAdd',
    redirectTo: 'masters/master-supplier-add',
    pathMatch: 'full',
  },
  {
    path: 'reports/equipment-tag',
    redirectTo: 'reports/equipment-tag-report',
    pathMatch: 'full',
  },
  {
    path: 'PerformanceCertificate',
    loadComponent: () => import('./Performance/performance-certificate/performance-certificate.component').then(m => m.PerformanceCertificateComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF'] },
  },
  {
    path: 'performance/performace20-consignee',
    loadComponent: () => import('./Performance/performace20-consignee/performace20-consignee.component').then(m => m.Performace20ConsigneeComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'Performace20Consignee',
    redirectTo: 'performance/performace20-consignee',
    pathMatch: 'full',
  },
  {
    path: 'performance/performance-certificate-fin',
    loadComponent: () => import('./Performance/performance-certificate-fin/performance-certificate-fin.component').then(m => m.PerformanceCertificateFinComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AD', 'AUGMF', 'AU', 'TPO', 'AUPO', 'DME'] },
  },
  {
    path: 'PerformanceCertificateFIN',
    redirectTo: 'performance/performance-certificate-fin',
    pathMatch: 'full',
  },
//#endregion

  //#region IT Module
  {
    path: 'IT/add-sub-menu',
    loadComponent: () => import('./component/IT/add-sub-menu/add-sub-menu.component').then(m => m.AddSubMenuComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SEC1', 'AD'] },
  },
  {
    path: 'IT/add-role-in-screen',
    loadComponent: () => import('./component/IT/add-role-in-screen/add-role-in-screen.component').then(m => m.AddRoleInScreenComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SEC1', 'AD'] },
  },
  {
    path: 'IT/delete-menu',
    loadComponent: () => import('./component/IT/delete-menu/delete-menu.component').then(m => m.DeleteMenuComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['SEC1', 'AD'] },
  },
  //#endregion

  //#region File Movement — EMD File Approval (5 variants)
  {
    path: 'EMDFileApprovalBME',
    loadComponent: () => import('./component/emd-file-approval/emd-file-approval.component').then(m => m.EmdFileApprovalComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['BME','AD'], variant: 'bme' },
  },
  {
    path: 'EMDFileApprovalBankletter',
    loadComponent: () => import('./component/emd-file-approval/emd-file-approval.component').then(m => m.EmdFileApprovalComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF','AD'], variant: 'bankletter' },
  },
  {
    path: 'EMDFileApprovalGMF',
    loadComponent: () => import('./component/emd-file-approval/emd-file-approval.component').then(m => m.EmdFileApprovalComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF','AD'], variant: 'gmf' },
  },
  {
    path: 'EMDFileApprovalGMFsanction',
    loadComponent: () => import('./component/emd-file-approval/emd-file-approval.component').then(m => m.EmdFileApprovalComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF','AD'], variant: 'gmfsanction' },
  },
  {
    path: 'EMDFileApprovalGMT',
    loadComponent: () => import('./component/emd-file-approval/emd-file-approval.component').then(m => m.EmdFileApprovalComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUPO','AD'], variant: 'gmt' },
  },
  // {
  //   path: 'POSupplyHO',
  //   component: POSupplyHOComponent,
  //   canActivate: [RouteGuardService],
  //   data: { allowedRoles: ['AUPO','AD'] },
  // },
  //#endregion
  //#region File Movement — Others
  {
    path: 'LogoVerifiedHO',
    loadComponent: () => import('./component/logo-verified-ho/logo-verified-ho.component').then(m => m.LogoVerifiedHoComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF','AU','AD'] },
  },
  {
    path: 'SiteNotReadyDocUpload',
    loadComponent: () => import('./component/site-not-ready-upload/site-not-ready-upload.component').then(m => m.SiteNotReadyUploadComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF','AU','AD'] },
  },
  {
    path: 'InvoicesBySO',
    loadComponent: () => import('./component/invoices-by-so/invoices-by-so.component').then(m => m.InvoicesBySoComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF','AU','AD'] },
  },
  {
    path: 'PoReportNew',
    loadComponent: () => import('./component/po-report-new/po-report-new.component').then(m => m.PoReportNewComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF','AU','AD'] },
  },
  //#region File Movement — Remaining 2 pages
  {
    path: 'PODetailsRDLC',
    loadComponent: () => import('./component/po-details-rdlc/po-details-rdlc.component').then(m => m.PoDetailsRdlcComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUGMF','AU','DME','AUPO','BME','AD'] },
  },
  {
    path: 'PendingInstallDrillDown',
    loadComponent: () => import('./component/pending-install-drilldown/pending-install-drilldown.component').then(m => m.PendingInstallDrilldownComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['TPO','AUGMF','AU','DME','AUPO','BME','AD'] },
  },
  //#endregion

  //#region Reports — Indent/PO/Tender Status (5 pages)
  {
    path: 'reports/indent-po-tender-status',
    loadComponent: () => import('./Reports/indent-po-tender-status/indent-po-tender-status.component').then(m => m.IndentPoTenderStatusComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'AU', 'TPO', 'AUPO', 'AD', 'DME'] },
  },
  {
    path: 'reports/indent-po-tender-status-summary',
    loadComponent: () => import('./Reports/indent-po-tender-status-summary/indent-po-tender-status-summary.component').then(m => m.IndentPoTenderStatusSummaryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'AU', 'TPO', 'AUPO', 'AD', 'DME'] },
  },
  {
    path: 'reports/indent-po-tender-status-drilldown',
    loadComponent: () => import('./Reports/indent-po-tender-status-drilldown/indent-po-tender-status-drilldown.component').then(m => m.IndentPoTenderStatusDrilldownComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'AU', 'TPO', 'AUPO', 'AD', 'DME'] },
  },
  {
    path: 'reports/indent-po-tender-summary',
    loadComponent: () => import('./Reports/indent-po-tender-summary/indent-po-tender-summary.component').then(m => m.IndentPoTenderSummaryComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'AU', 'TPO', 'AUPO', 'AD', 'DME'] },
  },
  {
    path: 'reports/indent-po-tender-summary-drilldown',
    loadComponent: () => import('./Reports/indent-po-tender-summary-drilldown/indent-po-tender-summary-drilldown.component').then(m => m.IndentPoTenderSummaryDrilldownComponent),
    canActivate: [RouteGuardService],
    data: { allowedRoles: ['AUGMF', 'AU', 'TPO', 'AUPO', 'AD', 'DME'] },
  },
  // Legacy flat path redirects
  { path: 'IndentPoTenderStatus', redirectTo: 'reports/indent-po-tender-status', pathMatch: 'full' },
  { path: 'IndentPoTenderStatusSummary', redirectTo: 'reports/indent-po-tender-status-summary', pathMatch: 'full' },
  { path: 'IndentPOtenderstatusSummaryDrlDwnItems', redirectTo: 'reports/indent-po-tender-status-drilldown', pathMatch: 'full' },
  { path: 'IndentPOtenderSummary', redirectTo: 'reports/indent-po-tender-summary', pathMatch: 'full' },
  { path: 'IndentPOtenderSummaryDrlDwnItems', redirectTo: 'reports/indent-po-tender-summary-drilldown', pathMatch: 'full' },
  //#endregion

  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
