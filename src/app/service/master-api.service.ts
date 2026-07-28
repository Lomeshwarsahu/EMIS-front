import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  DistrictDto,
  FacilityTypeDto,
  DHSFacilityGridDto,
  NodleMasterGridDto,
  EqpCategoryDto,
  ItemSpecGridDto,
  MedicalCollegeUserDto,
  MedFacilityGridDto,
  SupplierDetailDto,
  StoreHomeDto,
} from '../Model/models';

@Injectable({ providedIn: 'root' })
export class MasterApiService {
  private readonly base = `${environment.apiUrl}/Master`;

  constructor(private readonly http: HttpClient) {}

  getDistricts(): Observable<DistrictDto[]> {
    return this.http.get<DistrictDto[]>(`${this.base}/districts`);
  }

  getFacilityTypes(authority: number): Observable<FacilityTypeDto[]> {
    return this.http.get<FacilityTypeDto[]>(
      `${this.base}/facility-types?authority=${authority}`,
    );
  }

  getDHSFacilityGrid(
    facilityTypeId: number,
    districtId: number,
  ): Observable<DHSFacilityGridDto[]> {
    return this.http.post<DHSFacilityGridDto[]>(
      `${this.base}/dhs-facility-grid`,
      { FacilityTypeId: facilityTypeId, DistrictId: districtId },
    );
  }

  addFacilityUser(locationId: number, emailId: string): Observable<any> {
    return this.http.post(`${this.base}/dhs-add-facility-user`, {
      LocationId: locationId,
      EmailId: emailId,
    });
  }

  getNodleMasterGrid(userId: number): Observable<NodleMasterGridDto[]> {
    return this.http.get<NodleMasterGridDto[]>(
      `${this.base}/nodle-master-grid?userId=${userId}`,
    );
  }

  saveNodleMaster(data: {
    UserId: number;
    Name: string;
    Designation: string;
    EmailId: string;
    MobileNo: string;
  }): Observable<any> {
    return this.http.post(`${this.base}/nodle-master-save`, data);
  }

  deleteNodleMaster(id: number): Observable<any> {
    return this.http.post(`${this.base}/nodle-master-delete`, { Id: id });
  }

  getEqpCategories(): Observable<EqpCategoryDto[]> {
    return this.http.get<EqpCategoryDto[]>(`${this.base}/eqp-categories`);
  }

  getItemSpecGrid(
    categoryId?: number,
    search?: string,
  ): Observable<ItemSpecGridDto[]> {
    let url = `${this.base}/item-spec-grid?`;
    if (categoryId) url += `categoryId=${categoryId}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    return this.http.get<ItemSpecGridDto[]>(url);
  }

  getItemSpecDownloadInfo(
    itemId: number,
  ): Observable<{ UploadFolderName: string; FileName: string }> {
    return this.http.get<{ UploadFolderName: string; FileName: string }>(
      `${this.base}/item-spec-download/${itemId}`,
    );
  }

  uploadItemSpec(itemId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(
      `${this.base}/item-spec-upload/${itemId}`,
      formData,
    );
  }

  getMedicalCollegeUsers(): Observable<MedicalCollegeUserDto[]> {
    return this.http.get<MedicalCollegeUserDto[]>(
      `${this.base}/medical-college-users`,
    );
  }

  getMedFacilityGrid(
    facilityTypeId: number,
    authorityId: number,
    districtId: number,
    userId: number,
  ): Observable<MedFacilityGridDto[]> {
    return this.http.post<MedFacilityGridDto[]>(
      `${this.base}/med-facility-grid`,
      {
        FacilityTypeId: facilityTypeId,
        AuthorityId: authorityId,
        DistrictId: districtId,
        UserId: userId,
      },
    );
  }

  addMedFacility(data: {
    LocationName: string;
    DistrictId: number;
    FacilityTypeId: number;
    Authority: number;
    UserId: number;
    Address1: string;
    Address2: string;
    Address3: string;
    MobileNo: string;
    ContactPerson: string;
    EmailId: string;
  }): Observable<any> {
    return this.http.post(`${this.base}/med-facility-add`, data);
  }

  getSupplierDetail(supplierId: number): Observable<SupplierDetailDto> {
    return this.http.get<SupplierDetailDto>(
      `${this.base}/supplier-detail/${supplierId}`,
    );
  }

  addSupplier(data: any): Observable<any> {
    return this.http.post(`${this.base}/supplier-add`, data);
  }

  updateSupplier(data: any): Observable<any> {
    return this.http.post(`${this.base}/supplier-update`, data);
  }

  getStoreHome(userId: number): Observable<StoreHomeDto> {
    return this.http.get<StoreHomeDto>(`${this.base}/store-home/${userId}`);
  }

  updateStoreHome(userId: number, data: any): Observable<any> {
    return this.http.post(
      `${this.base}/store-home-update/${userId}`,
      data,
    );
  }
}
