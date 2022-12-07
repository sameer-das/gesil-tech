import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class BbpsService {
    constructor(private _http: HttpClient) { }

    private readonly URL_POST_GET_BILLER_BY_CATEGORY: string = `https://api.gesiltech.com/api/GSKRecharge/eBBPSBillerInfoByCategory`;
    private readonly URL_POST_GET_BILLER_INFO: string = `https://api.gesiltech.com/api/GSKRecharge/eBBPSBillerInfo`;

    getBillerdByCategory(categorName: string) {
        return this._http.post(`${this.URL_POST_GET_BILLER_BY_CATEGORY}?category=${categorName.toLowerCase()}`, {})
    }

    getBillerInfo(billerId: string) {
        return this._http.post(this.URL_POST_GET_BILLER_INFO, {
            "billerId": [billerId]
        })
    }
}