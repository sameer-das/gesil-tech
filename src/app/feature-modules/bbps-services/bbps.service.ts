import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class BbpsService {
    constructor(private _http: HttpClient) { }

    private readonly URL_POST_GET_BILLER_BY_CATEGORY: string = `${environment.service_base_url}/api/GSKRecharge/eBBPSBillerInfoByCategory`;
    private readonly URL_POST_GET_BILLER_INFO: string = `${environment.service_base_url}/api/GSKRecharge/eBBPSBillerInfo`;
    private readonly URL_POST_GET_BILLER_INFO_BY_BILLER_ID: string = `${environment.service_base_url}/api/GSKRecharge/eBBPSBillerInfoByBillerID`;
    private readonly URL_POST_FETCH_BILL: string = `${environment.service_base_url}/api/GSKRecharge/eBBPSBillFetch`;
    private readonly URL_POST_PAY_BILL: string = `${environment.service_base_url}/api/GSKRecharge/eBBPSBillPay`;

    getBillerdByCategory(categorName: string) {
        return this._http.post(`${this.URL_POST_GET_BILLER_BY_CATEGORY}?category=${categorName.toLowerCase()}`, {})
    }

    // getBillerInfo(billerId: string) {
    //     return this._http.post(this.URL_POST_GET_BILLER_INFO, {
    //         "billerId": [billerId]
    //     })
    // }
    getBillerInfo(billerId: string) {
        return this._http.post(`${this.URL_POST_GET_BILLER_INFO_BY_BILLER_ID}?billerid=${billerId}`,{})
    }

    fetchBill(fetchBillDetails: any) {
        return this._http.post(this.URL_POST_FETCH_BILL, fetchBillDetails);
    }


    payBill(requestId: string, payBill: any, serviceCatId: string, serviceId: string, user_EmailID: string) {
        return this._http.post(`${this.URL_POST_PAY_BILL}?requestid=${requestId}&serviceId=${serviceId}&categoryId=${serviceCatId}&userId=${user_EmailID}`, payBill)
    }
}