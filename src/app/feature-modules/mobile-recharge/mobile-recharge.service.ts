import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'any' })
export class MobileRechargeService {
  constructor(private _http: HttpClient) {}

  getMobileNumberDetails(mobileNo: string) {
    return this._http.post(
      `${environment.service_base_url}/api/GSKRecharge/eBBPSMNP`,
      {
        agentId: '',
        mobileNo: mobileNo,
      }
    );
  }

  getPlanForMobileNo(billerId: string, circle: string) {
    return this._http.post(
      `${environment.service_base_url}/api/GSKRecharge/eBBPSRechargePlanInfo`,
      {
        billerId: billerId,
        circle: circle,
      }
    );
  }


  prepaidRecharge(recharge: any) {
    return this._http.post(`${environment.service_base_url}/api/GSKRecharge/eGSKMobileRecharge`, recharge);
  }


  getRecentPrepaidRechargeTransactions (userEmail:string, serviceId: number, serviceCatId: number) {
    return this._http.get(`${environment.service_base_url}/api/GSKRecharge/GetPreviousTransactions?emailid=${userEmail}&serviceId=${serviceId}&categoryId=${serviceCatId}`);
  }
  
}
