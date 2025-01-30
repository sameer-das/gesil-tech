import { HttpClient, HttpHeaders } from '@angular/common/http';
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


    initiateTransactionRefund(payload: any, serviceId: string, categoryId: string, userId: string) {
        return this._httpClient.post(`https://api.esebakendra.com/api/DMT/eReFundTransactionserviceId=${serviceId}&categoryId=${categoryId}&userId=${userId}`, payload)
    }


    getFingerPrint() {
        const header = new HttpHeaders({ 'Access-Control-Allow-Origin': 'null' });
        return this._httpClient.post('http://127.0.0.1:11100/capture', null, { responseType: 'text' })


    }


    DeviceInfo() {
        const url = "http://127.0.0.1:11100/getDeviceInfo";
        const xhr = new XMLHttpRequest();

        xhr.open('DEVICEINFO', url, true);

        xhr.onreadystatechange = function () {
            // if(xhr.readyState == 1 && count == 0){
            //	fakeCall();
            //}
            if (xhr.readyState == 4) {
                var status = xhr.status;

                if (status == 200) {
                    alert(xhr.responseText);
                    console.log(xhr.response);
                } else {
                    console.log(xhr.response);
                }
            }
        };
        xhr.send();
    }


    Capture() {
        console.log('CApturing')
        function getPosition(string: string, subString: string, index: number) {
            return string.split(subString, index).join(subString).length;
        }
        
        const url = "http://127.0.0.1:11100/capture";

        const PIDOPTS = '<PidOptions ver=\"1.0\">' + '<Opts fCount=\"1\" fType=\"0\" iCount=\"\" iType=\"\" pCount=\"\" pType=\"\" format=\"0\" pidVer=\"2.0\" timeout=\"10000\" otp=\"\" wadh=\"\" posh=\"\"/>' + '</PidOptions>';

        return new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('CAPTURE', url, true);
            xhr.setRequestHeader("Content-Type", "text/xml");
            xhr.setRequestHeader("Accept", "text/xml");
    
            xhr.onreadystatechange = function () {
                //if(xhr.readyState == 1 && count == 0){
                //	fakeCall();
                //}
                // console.log(xhr.responseText);
                if (xhr.readyState == 4) {
                    var status = xhr.status;
                    //parser = new DOMParser();
                    if (status == 200) {
                        var test1 = xhr.responseText;
                        var test2 = test1.search("errCode");
                        var test6 = getPosition(test1, '"', 2);
                        var test4 = test2 + 9;
                        var test5 = +test1.slice(test4, test6);
                        console.log(test5)
                        if (test5 > 0) {
                            reject(xhr.responseText);
                        }
                        else {
                            resolve(xhr.responseText);
                        }
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.send(PIDOPTS);
        })
        
    }
}