import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable()
export class CCAvenueService {
    constructor(private _http: HttpClient) { }

    private readonly URL_ENC: string = `${environment.service_base_url}/api/GSKRecharge/eEncryptRequest`;

    getEncryptedResponse(request: string) {
        return this._http.post(`${this.URL_ENC}`, {
            "data": request
        }, { responseType: 'text' });
    }
}