import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) { }

  userDetails: any = {};
  profilePicUpdate$: Subject<void> = new Subject();
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
  getBlocks(stateId: number, districtId: number) {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_BLOCK}?stateId=${stateId}&distId=${districtId}`
    );
  }
  private URL_GET_KYC_DETAILS: string = '/api/User/GetUserKycDetail';
  getKycDetails(userId: number) {
    return this._http.get(
      `${environment.service_base_url}${this.URL_GET_KYC_DETAILS}?userId=${userId}`
    );
  }


  private URL_POST_UPDATE_PASSWORD: string = '/api/User/UpdateUserPWD';
  updatePassword(passwords: any) {
    return this._http.post(
      `${environment.service_base_url}${this.URL_POST_UPDATE_PASSWORD}`,
      passwords
    );
  }


  private URL_GET_USER_LOCATION_TYPE = `/api/User/GetUserLocations`
  getUserLocationType() {
    return this._http.get(`${environment.service_base_url}${this.URL_GET_USER_LOCATION_TYPE}`);
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
    console.log(kycDetials)
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


  private URL_GET_PAN_URL: string= '/api/User/ExecutePanService';
  getPANUrl(user_id: number) {
    return this._http.get(`${environment.service_base_url}${this.URL_GET_PAN_URL}?uId=${user_id}`);
  }


  private URL_GET_ADHAR_DETAILS:string = '/api/User/GetAdharaDetails';
  getAdharDetails(adhar: any) {
    return this._http.post(`${environment.service_base_url}${this.URL_GET_ADHAR_DETAILS}`, adhar);
  }

  private URL_GET_ESEBA_NEWS:string = '/api/User/GetEsebaNews';
  getEsebaNews() {
    return this._http.get(`${environment.service_base_url}${this.URL_GET_ESEBA_NEWS}`)
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
      `${environment.service_base_url}${this.URL_GET_USER_INFOS}?uId=${user_id}`);
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
  getUserKycDetail(userId: string) {
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

  private URL_VALIDATE_TPIN = `/api/User/ValidateUserTPin`;
  validateTPin(userid: number, pin: string) {
    return this._http.post(`${environment.service_base_url}${this.URL_VALIDATE_TPIN}`, {
      "userId": userid,
      "tpin": pin
    })
  }


  private URL_DOWNLOAD = `/api/User/Download`;
  getPic(fileName: string) {
    return this._http.get(`${environment.service_base_url}${this.URL_DOWNLOAD}?fileName=${fileName}`, {
      responseType: 'blob',
      observe:'response'
    })
  }


  private URL_PMFBY_SUBMIT = `/api/POSP/POSPRegistration`;
  pmfbyRegistration (pmfby:any) {
    return this._http.post(`${environment.service_base_url}${this.URL_PMFBY_SUBMIT}`, pmfby)
  }

  private URL_GET_PMFBY_STATUS = `/api/POSP/POSPRegistrationStatusCheck`;
  getPmfbyStatus (mobileNo:number) {
    return this._http.get(`${environment.service_base_url}${this.URL_GET_PMFBY_STATUS}?mobile_no=${mobileNo}`)
  }

  private URL_PMFBY_DOC_UPLOAD = `/api/POSP/POSPDocumnetUpload`;
  pmfbyDocUpload (payload:any) {
    return this._http.post(`${environment.service_base_url}${this.URL_PMFBY_DOC_UPLOAD}`, payload)
  }




  private URL_ADHAR_OTP_GENERATE = `/api/User/GenerateOTPForAadharaValidation`;
  generateOtpForAdharValidate (payload:any) {
    return this._http.post(`${environment.service_base_url}${this.URL_ADHAR_OTP_GENERATE}`, payload)
  }

  private URL_ADHAR_OTP_VERIFY = '/api/User/AadharaOTPSubmit?uId=';
  verifyOtpForAdhar (userId:number, payload:any) {
    return this._http.post(`${environment.service_base_url}${this.URL_ADHAR_OTP_VERIFY}${userId}`, payload)
  }


  private URL_GET_PAN_DETAILS = '/api/User/GetPanDetails?uId=';
  verifyPanDetails (userId:number, payload:any) {
    return this._http.post(`${environment.service_base_url}${this.URL_GET_PAN_DETAILS}${userId}`, payload)
  }

  private URL_GET_USER_VERIFIED_PAN_DETAILS = `/api/User/GetPanDetail`;
  getUserVerifiedPanDetail (userId:number) {
    return this._http.get(`${environment.service_base_url}${this.URL_GET_USER_VERIFIED_PAN_DETAILS}?userId=${userId}`)
  }
  
  private URL_GET_USER_VERIFIED_ADHAR_DETAILS = `/api/User/GetAadharaDetail`;
  getUserVerifiedAdharDetail (userId:number) {
    return this._http.get(`${environment.service_base_url}${this.URL_GET_USER_VERIFIED_ADHAR_DETAILS}?userId=${userId}`)
  }
}


