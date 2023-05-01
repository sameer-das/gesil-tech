import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'


@Injectable()
export class DmtService {
    constructor(private _httpClient: HttpClient){}

    getSenderInfo(payload: any){
        this._httpClient.post('https://api.esebakendra.com/api/DMT/eSenderDetails', payload)
    }
}