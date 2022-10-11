import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  userDetails: any = {};

  // {userid: 'admin', password: 'admin'}
  private URL_VALIDATE_USER: string = '/api/User/ValidateUser';
  login(usercred: any): Observable<any> {
    return this._http.post(
      `${environment.service_base_url}${this.URL_VALIDATE_USER}`,
      {
        userId: usercred.userid,
        password: usercred.password,
      }
    );
  }

  private URL_GET_STATE: string = '/api/Master/GetStateMaster';
  getState(countryId: number): Observable<any> {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_STATE}?countryId=${countryId}`
    );
  }

  private URL_GET_DISTRICT: string = '/api/Master/GetDistrictMaster';
  getDistrict(stateId: number) {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_DISTRICT}?stateId=${stateId}`
    );
  }

  private URL_GET_BLOCK: string = '/api/Master/GetBlockMaster';
  getBlocks(districtId: number) {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_BLOCK}`
    );
  }

  private URL_SAVE_USER_REG: string = '/api/User/SaveUserMPInfo';
  saveUserRegistrationDetails(userRegDetails: any): Observable<any> {
    return this._http.post(
      `${environment.service_base_url}${this.URL_SAVE_USER_REG}`,
      userRegDetails
    );
  }

  private URL_UPDATE_USER_PERSONAL_INFO: string =
    '/api/User/UpdateUserPersonalDetail';
  updateUserPersonalInfo(userPersonalInfo: any): Observable<any> {
    return this._http.post(
      `${environment.service_base_url}${this.URL_UPDATE_USER_PERSONAL_INFO}`,
      userPersonalInfo
    );
  }
  private URL_UPDATE_USER_REG_INFO: string = '/api/User/UpdateUserRegistrationDetails';
  updateUserReglInfo(userPersonalInfo: any): Observable<any> {
    return this._http.post(
      `${environment.service_base_url}${this.URL_UPDATE_USER_REG_INFO}`,
      userPersonalInfo
    );
  }

  private URL_UPDATE_USER_BANK_DETAILS: string = `/api/User/UpdateUserBankDetail`;
  updateUserBankDetails(bankDetails: any) {
    return this._http.post(
      `${environment.service_base_url}${this.URL_UPDATE_USER_BANK_DETAILS}`,
      bankDetails
    );
  }
  private URL_UPDATE_USER_KYC_DETAILS: string = `/api/User/UpdateUserKycDetail`;
  updateUserKycDetails(kycDetials: any) {
    return this._http.post(
      `${environment.service_base_url}${this.URL_UPDATE_USER_KYC_DETAILS}`,
      kycDetials
    );
  }




  private URL_SAVE_USER_KYC_DETAILS: string = `/api/User/UpdateUserKycDetail`;
  saveUserKycDetails(kycDetials: any) {
    return this._http.post(
      `${environment.service_base_url}${this.URL_SAVE_USER_KYC_DETAILS}`,
      kycDetials
    );
  }


  private URL_SAVE_USER_BANK_DETAILS: string = `/api/User/SaveUserBankInfo`;
  saveUserBankDetails(bankDetails: any) {
    return this._http.post(
      `${environment.service_base_url}${this.URL_SAVE_USER_BANK_DETAILS}`,
      bankDetails
    );
  }













  
  isLoggedIn(): boolean {
    const token = localStorage.getItem('auth_token');
    // write validation logic here
    if (token) return true;
    return false;
  }

  private URL_GET_BANK_MASTER = '/api/Master/GetBankMaster';
  getBankMaster() {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_BANK_MASTER}`
    );
  }

  private URL_GET_USER_INFOS = `/api/User/GetUserInfos`;
  getUserInfos(user_id: number) {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_USER_INFOS}?uId=${user_id}`
    );
  }

  private URL_CHECK_REFERENCE_NO = `/api/User/CheckReferenceNumber`;
  checkRefId(refId: string) {
    return this._http.get(
      `${environment.service_base_url}${this.URL_CHECK_REFERENCE_NO}?rId=${refId}`
    );
  }

  private URL_GET_USER_REG_DETAIL = `/api/User/GetUserRegistrationDetails`;
  getUserRegistrationDetails(userId: string) {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_USER_REG_DETAIL}?userId=${userId}`
    );
  }

  private URL_GET_USER_PERSONAL_DETAIL = `/api/User/GetUserPersonalDetail`;
  getUserPersonalDetail(userId: string) {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_USER_PERSONAL_DETAIL}?userId=${userId}`
    );
  }


  private URL_GET_USER_BANK_DETAIL = `/api/User/GetUserBankDetail`;
  getUserBankDetail(userId: string) {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_USER_BANK_DETAIL}?userId=${userId}`
    );
  }

  private URL_GET_USER_KYC_DETAIL = `/api/User/GetUserKycDetail`;
  getUserKycDetail(userId: string){
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_USER_KYC_DETAIL}?userId=${userId}`
    );
  }

  private URL_GET_SEND_FORGOT_PSW_EMAIL = `/api/User/Forgotpwd`;
  sendForgotPasswordMail(email: string) {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_SEND_FORGOT_PSW_EMAIL}?emailid=${email}`
    );
  }

}
