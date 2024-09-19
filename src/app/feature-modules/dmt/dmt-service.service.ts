import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export class DmtService {
    constructor(private _httpClient: HttpClient) { }

    convertToPaisa(amount: any) {
        const amt = Number(amount);
        if (isNaN(amt))
            return null;

        return amt * 100;
    }
    recipentAdd: Subject<boolean> = new Subject();
    
    DMT_FUND_TRANSACTION_STATUS: any = {
        "C": "Success",
        "P": "Initiated state",
        "Q": "Pending",
        "F": "Failed",
        "R": "Refund",
        "T": "Refund Pending",
        "S": "Pending- (Auto Reversal)",
      }


    convertToRupees(amount: number) {
        return (amount / 100);
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

    private readonly URL_GET_WALLET_TRANSACTION_HISTORY = `${environment.service_base_url}/api/GSKRecharge/GetTransactions`;
    getTransactionHistory(emailid: string) {
        return this._httpClient.post(`${this.URL_GET_WALLET_TRANSACTION_HISTORY}?emailid=${emailid}`, {})
    }


    initiateTransactionRefund (payload: any, serviceId: string, categoryId: string, userId: string) {
        return this._httpClient.post(`https://api.esebakendra.com/api/DMT/eReFundTransactionserviceId=${serviceId}&categoryId=${categoryId}&userId=${userId}`, payload)
    }
}