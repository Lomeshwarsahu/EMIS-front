import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  // testing
  // private apiUrll = 'https://localhost:5001/api/Auth';
  private apiUrll = 'https://localhost:7036/api/Auth';

  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}
//#region 
  getUsers(id: number) {
    return this.http.get(`${this.apiUrll}/${id}`);
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
  public post(url: string, data: FormData, options?: any) {
    return this.http.post(this.API + url, data, options);
  }


 




  









 


 




 





 


  





  



 
  









}
