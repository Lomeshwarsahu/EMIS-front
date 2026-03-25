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


// {path:'generate-GenerationFileNonasti',component:GenerationFileNonastiComponent,canActivate:[RouteGuardService],data: { allowedRoles: ['TPO']}},

{ path: '**', redirectTo: 'login' }


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
