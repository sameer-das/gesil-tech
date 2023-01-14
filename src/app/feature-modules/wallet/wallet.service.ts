import { HttpClient } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable()
export class WalletService {
    constructor(private _http: HttpClient){}
    private readonly URL_POST_GET_WALLET_BAL:string = `${environment.service_base_url}/api/GSKRecharge/GetWalletBalance`
    getWalletBalance(email: string) {
        return this._http.post(`${this.URL_POST_GET_WALLET_BAL}?emailid=${email}`,{})
    }
    
    
    private readonly URL_POST_GET_PAYMENT_TRANSACTION_ID:string = `${environment.service_base_url}/api/GSKRecharge/eInitiatePaytmTransaction`
    getPaymentTransactionId(body: any){
        return this._http.post(this.URL_POST_GET_PAYMENT_TRANSACTION_ID, body);
    }

    private readonly URL_GET_WALLET_TRANSACTION_HISTORY = `${environment.service_base_url}/api/GSKRecharge/GetTransactions`;
    getTransactionHistory(emailid: string) {
        return this._http.post(`${this.URL_GET_WALLET_TRANSACTION_HISTORY}?emailid=${emailid}`, {})
    }
}