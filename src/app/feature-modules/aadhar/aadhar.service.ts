import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class AadharService {

  constructor(private _http: HttpClient) { }

  private readonly URL_GET_AADHAR_INFO: string = `${environment.service_base_url}/api/Master/AadharInfo`;
  private readonly URL_REGISTER_AADHAR_INFO: string = `${environment.service_base_url}/api/Master/RegisterAadharInfoStep1`;
  private readonly URL_REGISTER_AADHAR_INFO_NSEIT_DETAILS: string = `${environment.service_base_url}/api/Master/RegisterAadharInfoNseitDetails`;
  private readonly URL_REGISTER_AADHAR_INFO_AADHAR_DETAILS: string = `${environment.service_base_url}/api/Master/RegisterAadharInfoAadharDetails`;
  private readonly URL_REGISTER_AADHAR_INFO_PAN_DETAILS: string = `${environment.service_base_url}/api/Master/RegisterAadharInfoPanDetails`;
  private readonly URL_REGISTER_AADHAR_INFO_AADHARCENTERADDRESS_DETAILS: string = `${environment.service_base_url}/api/Master/RegisterAadharInfoAadharCenterDetails`;
  private readonly URL_REGISTER_AADHAR_INFO_EDUCATION_DETAILS: string = `${environment.service_base_url}/api/Master/RegisterAadharInfoEducationDetails`;
  private readonly URL_REGISTER_AADHAR_INFO_PHOTO_DETAILS: string = `${environment.service_base_url}/api/Master/RegisterAadharInfoPhotoDetails`;
  private readonly URL_UPLOAD_AADHAR_DOCS: string = `${environment.service_base_url}/api/Master/RegisterAadharInfoUploadDocuments`;

  getAadharInfo(userid: number) {
    return this._http.get(`${this.URL_GET_AADHAR_INFO}?userId=${userid}`);
  }

  saveAadharEnrollment(payload: any) {
    return this._http.post(`${this.URL_REGISTER_AADHAR_INFO}`, payload);
  }

  saveNseitDetails(payload: any) {
    return this._http.post(`${this.URL_REGISTER_AADHAR_INFO_NSEIT_DETAILS}`, payload);
  }
  saveAadharDetails(payload: any) {
    return this._http.post(`${this.URL_REGISTER_AADHAR_INFO_AADHAR_DETAILS}`, payload);
  }
  savePanDetails(payload: any) {
    return this._http.post(`${this.URL_REGISTER_AADHAR_INFO_PAN_DETAILS}`, payload);
  }
  saveAadharCenterAddressDetails(payload: any) {
    return this._http.post(`${this.URL_REGISTER_AADHAR_INFO_AADHARCENTERADDRESS_DETAILS}`, payload);
  }


  uploadAadharDocument(payload:any) {
    return this._http.post(`${this.URL_UPLOAD_AADHAR_DOCS}`, payload);
  }

}
