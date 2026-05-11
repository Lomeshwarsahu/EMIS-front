import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/auth/login/login.component';
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
import { AddExcelComponent } from './component/add-excel/add-excel.component';
import { CovAaddRemuvieComponent } from './component/cov-aadd-remuvie/cov-aadd-remuvie.component';
import { CovAItemsEntryComponent } from './component/BME/cov-aitems-entry/cov-aitems-entry.component';
import { AddLeavyComponent } from './component/BME/add-leavy/add-leavy.component';
import { TenderCoverAitemsComponent } from './component/BME/tender-cover-aitems/tender-cover-aitems.component';
import { CoverAitemsReportsComponent } from './component/BME/cover-aitems-reports/cover-aitems-reports.component';
import { AddTenderConComponent } from './component/BME/add-tender-con/add-tender-con.component';





const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:'login',component:LoginComponent},
  {path:'Registration',component:Registration},
  {path:'otp',component:OtpComponent},
  // {path:'GenerationFileNonasti',component:GenerationFileNonastiComponent},
  // {path:'FileMRCDashbord',component:FileMRCDashbordComponent},
  {path:'InstallationDetails',component:InstallationDetailsComponent},
  // {path:'ExtensionHODetail',component:ExtensionHODetailComponent},
  {path:'ExtensionHOEntry',component:ExtensionHOEntryComponent},
  // {path:'ItemWiseDetailPOCell',component:ItemWiseDetailPOCellComponent},
  {path:'ItemWiseDetailPOCellByPOid',component:ItemWiseDetailPOCellByPOidComponent},
  // {path:'IndentPOSummaryDirwise',component:IndentPOSummaryDirwiseComponent},
  // {path:'DistrictWisePODetail',component:DistrictWisePODetailComponent},
  {path:'POSummaryDrillDwnQtyPOWise',component:POSummaryDrillDwnQtyPOWiseComponent},
  {path:'POSummaryDrillDwnQty',component:POSummaryDrillDwnQtyComponent},
  {path:'TenderStatusUpdate',component:TenderStatusUpdateComponent},
  {path:'AddRTenderItems',component:AddRTenderItemsComponent},
  {path:'AddExcel',component:AddExcelComponent},
  {path:'CovAaddRemuvie',component:CovAaddRemuvieComponent},
  {path:'CovAItemsEntry',component:CovAItemsEntryComponent},
  {path:'AddLeavy',component:AddLeavyComponent},
  {path:'TenderCoverAitems',component:TenderCoverAitemsComponent},
  {path:'CoverAitemsReports',component:CoverAitemsReportsComponent},
  {path:'AddTenderCon',component:AddTenderConComponent},

  {path:'logout',component:LogoutComponent,canActivate:[RouteGuardService]}, 
// { path: 'welcome', component: HomeComponent },
{ path: 'welcome', component: LandingPageComponent, canActivate: [RouteGuardService],data: { allowedRoles: ['AD','AU','AAO','AYUSH','CGMSC','CON','DHS','DKS','DME','DMT','FDA','FU','GMF','IT','Principal','SCI','SUP','TPO']} },
{ path: 'home', component: HomeComponent, canActivate: [RouteGuardService],data: { allowedRoles: ['AD','AU','AAO','AYUSH','CGMSC','CON','DHS','DKS','DME','DMT','FDA','FU','GMF','IT','Principal','SCI','SUP','TPO']} },
// { path: 'welcome', component: HomeComponent, canActivate: [RouteGuardService],data: { allowedRoles: ['Suppliers','SEC1','DHS','CME','DME1','Collector','Warehouse','SE','HO_Infra','Division','DM PO','SSO','Logi Cell']} },
{path:'GenerationFileNonasti',component:GenerationFileNonastiComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['TPO'] }},
{path:'FileMRCDashbord',component:FileMRCDashbordComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['TPO'] }},

{path:'ExtensionHODetail',component:ExtensionHODetailComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['TPO'] }},

{path:'ItemWiseDetailPOCell',component:ItemWiseDetailPOCellComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['TPO'] }},

{path:'IndentPOSummaryDirwise',component:IndentPOSummaryDirwiseComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['TPO'] }},

{path:'DistrictWisePODetail',component:DistrictWisePODetailComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['TPO'] }},
// BME
{path:'MastterSupplierDash',component:MastterSupplierDashComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AU'] }},
{path:'ItemsBME',component:ItemsBMEComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AU'] }},
{path:'MapitemsEithType',component:MapitemsEithTypeComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AU'] }},
{path:'MapitemswithTypeUpdate',component:MapitemswithTypeUpdateComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AU'] }},
{path:'MapitemswithMainitemTypeRepo',component:MapitemswithMainitemTypeRepoComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AU'] }},
{path:'EMSRCDashbord',component:EMSRCDashbordComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AU'] }},
{path:'EMSNEWRC',component:EMSNEWRCComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AU'] }},
{path:'PlanaTenderD',component:PlanaTenderDComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AU','DME'] }},
// MD logins 
{path:'RCDetailReport',component:RCDetailReportComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'AcceptedReort',component:AcceptedReortComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'IndentFromFacilities',component:IndentFromFacilitiesComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'ComplainReportBME',component:ComplainReportBMEComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'FacilityAuthPOValuePOCell',component:FacilityAuthPOValuePOCellComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'POPaidReport',component:POPaidReportComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'FPOPaidReport',component:POPaidReportComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'ChequeWisePaymentReport',component:ChequeWisePaymentRComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'POSummaryReport',component:POSummaryReportComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'TendersStatus',component:TendersStatusComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'PORecdsummary',component:PORecdsummaryComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'TenterStatusItemWise',component:TenterStatusItemWiseComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},
{path:'POSummaryDrillDwnQtyReagent',component:POSummaryDrillDwnQtyReagentComponent, canActivate:[RouteGuardService], data:{ allowedRoles:['AD'] }},


// {path:'generate-GenerationFileNonasti',component:GenerationFileNonastiComponent,canActivate:[RouteGuardService],data: { allowedRoles: ['TPO']}},

{ path: '**', redirectTo: 'login' }


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
