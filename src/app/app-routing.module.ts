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





const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:'login',component:LoginComponent},
  {path:'Registration',component:Registration},
  {path:'otp',component:OtpComponent},
  {path:'GenerationFileNonasti',component:GenerationFileNonastiComponent},
  {path:'FileMRCDashbordComponent',component:FileMRCDashbordComponent},

  {path:'logout',component:LogoutComponent,canActivate:[RouteGuardService]}, 
// { path: 'welcome', component: HomeComponent },
{ path: 'welcome', component: HomeComponent, canActivate: [RouteGuardService],data: { allowedRoles: ['AD','AU','AAO','AYUSH','CGMSC','CON','DHS','DKS','DME','DMT','FDA','FU','GMF','IT','Principal','SCI','SUP','TPO']} },
// { path: 'welcome', component: HomeComponent, canActivate: [RouteGuardService],data: { allowedRoles: ['Suppliers','SEC1','DHS','CME','DME1','Collector','Warehouse','SE','HO_Infra','Division','DM PO','SSO','Logi Cell']} },


// {path:'generate-registration',component:GenerateRegistrationComponent,canActivate:[RouteGuardService],data: { allowedRoles: ['Suppliers']}},


{ path: '**', redirectTo: 'login' }


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
