
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { HardcodedAuthenticationService } from './hardcoded-authentication.service';
import { BasicAuthenticationService } from './basic-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(
    private loginService: BasicAuthenticationService,
    private router: Router
  ) {}
//   canActivate(route: ActivatedRouteSnapshot): boolean {

//   // 🔹 localStorage se login data lo
//   const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
//   const userRole = loginData?.user_type;
//   const userid = loginData?.user_id; 
//   // const username = loginData?.username; 

//   // 🔹 route se allowed roles aur allowed users lo
//   const allowedRoles = route.data['allowedRoles'] as string[];
//   const allowedUsersid = route.data['allowedUsers'] as string[]; 

//   // 🔥 STEP 1: Pehle Role check karo
//   const isRoleAllowed = userRole && allowedRoles.includes(userRole);

//   // 🔥 STEP 2: Username check karo (Agar route data mein allowedUsers diya hai toh)
//   let isUserAllowed = true; 
//   if (allowedUsersid && allowedUsersid.length > 0) {
//     isUserAllowed = allowedUsersid && allowedUsersid.includes(userid);
//   }

//   // 🚀 Final Check: Dono conditions satisfy honi chahiye
//   if (isRoleAllowed && isUserAllowed) {
//     return true;
//   }

//   // ❌ Unauthorized: Agar dono me se ek bhi fail hua toh login ya unauthorized page pr bhej do
//   this.router.navigate(['/login']);
//   return false;
// }
 canActivate(route: ActivatedRouteSnapshot): boolean {

    // 🔹 localStorage se login data lo
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    const userRole = loginData?.user_type;
    // const username = loginData?.username;

    // 🔹 route se allowed roles lo
    const allowedRoles = route.data['allowedRoles'] as string[];

    // console.log('User Role:', userRole);
    // console.log('Allowed Roles:', allowedRoles);

    // 🔥 check karo
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // ❌ unauthorized
    this.router.navigate(['/login']);
    return false;
  }
  
}