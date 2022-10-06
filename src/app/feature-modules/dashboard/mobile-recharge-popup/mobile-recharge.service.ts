import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class MobileRechargeService {
  constructor(private _http: HttpClient) {}
  private GET_MOBILE_OPERATORS: string = '/api/GSKRecharge/GetMobileOperators';

  getMobileOperators() {
    return this._http.get(
      `${environment.service_base_url}${this.GET_MOBILE_OPERATORS}`
    );
  }

  private MOBILE_RECHARGE: string = `/api/GSKRecharge/eGSKMobileRecharge`;
  rechargeMobile(recharge: any) {
    return this._http.post(
      `${environment.service_base_url}${this.MOBILE_RECHARGE}`,
      recharge
    );
  }
}
