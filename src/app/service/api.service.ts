import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashLoginDDL } from '../Model/DashLoginDDL';
// import { DelvieryDash } from '../Model/DelvieryDash';

import { BehaviorSubject } from 'rxjs';
import { masddlUser } from '../Model/masddlUser';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://cgmsc.gov.in/HIMIS_APIN/api';
  private CGMSCHO_API2 = 'https://dpdmis.in/CGMSCHO_API2/api';
  private VREGAPI = 'https://dpdmis.in/VREGAPI/api';
  private himis_apin = 'https://www.cgmsc.gov.in/himis_apin/api';
  private API = 'https://cgmsc.gov.in/EMIS_API';
  private apiUrll = `${environment.apiUrl}/Auth`;
  private apiUrls = `${environment.apiUrl}/`;

  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}
//#region 
  getUsers(id: number) {
    return this.http.get(`${this.apiUrll}/${id}`);
  }
  GetUserEmail(userId: number) {
    return this.http.get<{ Email?: string; UserName?: string }>(
      `${this.apiUrll}/GetUserEmail/${userId}`,
    );
  }
  // https://localhost:7036/api/GenerateNasti/Getyear
  // public get(url: string, data?: FormData, options?: any){
  //    return this.http.get(this.apiUrll + url, data, options);

  // }

  public get(url: string, options?: any) {
    // debugger

  return this.http.get(this.apiUrls + url, options);
}
  
    public post(url: string, data: FormData, options?: any) {
    return this.http.post(this.API + url, data, options);
  }
  public post1(url: string, data: any, options?: any) {
  return this.http.post(this.apiUrls + url, data, options);
}
public post2(url: string, data: any) {
  return this.http.post(this.apiUrls + url, data);
}
//     public put(url: string, data: FormData, options?: any) {
// debugger;

//     return this.http.put(this.apiUrls  + url, data, options);
//   }
// public put(url: string, data: any) {
//   return this.http.put(this.apiUrls  + url, data);
// }
public put(url: string, data: any) {
  return this.http.put(this.apiUrls + url, data, { responseType: 'text' });
}
//#endregion







  masddlUser(Usertype: any): Observable<any> {

    return this.http.get<masddlUser[]>(`${this.CGMSCHO_API2}/Master/masddlUser?Usertype=${Usertype}`);

  }
 
  VerifyOTPLogin(otp: any, userid: any) {
    return this.http.get(
      `${this.CGMSCHO_API2}/Login/VerifyOTPLogin?otp=${otp}&userid=${userid}`,
      { responseType: 'text' }
    );
  }
  getDashLoginDDL() {

    return this.http.get<DashLoginDDL[]>(`https://cgmsc.gov.in/HIMIS_APIN/api/Work/getDashLoginDDL`);
  }
  getOTPSaved(userid: any, ipAddress: any) {
    const url = `${
      this.CGMSCHO_API2
    }/Login/getOTPSaved?userid=${userid}&ipAddress=${encodeURIComponent(
      ipAddress
    )}`;
    return this.http.post(url, null, { responseType: 'text' });
  }
  InsertUserLoginLogPOST(values: any) {
    return this.http.post(
      `${this.CGMSCHO_API2}/LogAudit/InsertUserLoginLog`,
      values,
      {
        responseType: 'text',
      }
    );
  
  }

  InsertUserPageViewLogPOST(values: any) {
    return this.http.post(
      `${this.CGMSCHO_API2}/LogAudit/InsertUserPageViewLog`,
      values,
      {
        responseType: 'text',
      }
    );
  }

  //#endregion
  getVendorDetailsID(supplierId: any) {
    return this.http.get(
      `${this.VREGAPI}/Registration/registeredVendors?vregid=${supplierId}`
    );
  }


 




  









 


 




 





 


  





  



 
  









}
