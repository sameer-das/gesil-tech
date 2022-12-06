import { HttpClient } from '@angular/common/http'
import {Injectable } from '@angular/core'

@Injectable()
export class WalletService {
    constructor(private _http: HttpClient){}
    private readonly URL_POST_GET_WALLET_BAL:string = 'https://api.gesiltech.com/api/GSKRecharge/GetWalletBalance'
    getWalletBalance(email: string) {
        return this._http.post(`${this.URL_POST_GET_WALLET_BAL}?emailid=${email}`,{})
    }
}