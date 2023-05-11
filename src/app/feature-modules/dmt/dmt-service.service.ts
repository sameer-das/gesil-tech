import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'


@Injectable()
export class DmtService {
    constructor(private _httpClient: HttpClient) { }

    convertToPaisa(amount: any) {
        const amt = Number(amount);
        if (isNaN(amt))
            return null;

        return amt * 100;
    }

    convertToRupees(amount: any) {
        return (amount / 100).toFixed(2);
    }

    getSenderInfo(payload: any) {
        return this._httpClient.post('https://api.esebakendra.com/api/DMT/eSenderDetails', payload)
    }
    registerSenderInfo(payload: any) {
        return this._httpClient.post('https://api.esebakendra.com/api/DMT/eSenderRegistration', payload)
    }

    registerRecipient(payload: any) {
        return this._httpClient.post('https://api.esebakendra.com/api/DMT/eRegisterRecipient', payload)
    }

    verifySender(payload: any) {
        return this._httpClient.post('https://api.esebakendra.com/api/DMT/eVerifySender', payload)
    }

    getAllBank() {
        return this._httpClient.get('https://api.esebakendra.com/api/DMT/eGetAllDMTBanks')
    }

    getAllRecipients(payload: any) {
        return this._httpClient.post('https://api.esebakendra.com/api/DMT/eAllRecipients', payload);
    }
    getConveyanceFee(payload: any) {
        return this._httpClient.post('https://api.esebakendra.com/api/DMT/eCustomerConv', payload);
    }
    dmtFundTransfer(payload: any, serviceId: string, categoryId: string, userId: string) {
        return this._httpClient.post(`https://api.esebakendra.com/api/DMT/eFundTransfer?serviceId=${serviceId}&categoryId=${categoryId}&userId=${userId}`, payload);
    }
}