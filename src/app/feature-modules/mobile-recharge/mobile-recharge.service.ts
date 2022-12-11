import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'any' })
export class MobileRechargeService {
  constructor(private _http: HttpClient) {}

  getMobileNumberDetails(mobileNo: string) {
    return this._http.post(
      `https://api.gesiltech.com/api/GSKRecharge/eBBPSMNP`,
      {
        agentId: '',
        mobileNo: mobileNo,
      }
    );
  }

  getPlanForMobileNo(billerId: string, circle: string) {
    return this._http.post(
      `https://api.gesiltech.com/api/GSKRecharge/eBBPSRechargePlanInfo`,
      {
        billerId: billerId,
        circle: circle,
      }
    );
  }


  prepaidRecharge(recharge: any) {
    return this._http.post(`https://api.gesiltech.com/api/GSKRecharge/eGSKMobileRecharge`, recharge);
  }
  
}
