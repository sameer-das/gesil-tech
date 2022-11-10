import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'any' })
export class MobileRechargeService {
  constructor(private _http: HttpClient) {}

  mobileNumber: string = '';
  currentBillerId: string = '';
  currentCircle: string = '';

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
}
