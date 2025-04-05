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
    verifySender(payload: any) {
        return this._httpClient.post('https://api.esebakendra.com/api/DMT/eVerifySender', payload)
    }
    resendOtpForSenderRegistration(payload: any) {
        return this._httpClient.post('https://api.esebakendra.com/api/DMT/eResendOTPForVerifySender', payload)
    }

    registerRecipient(payload: any) {
        return this._httpClient.post('https://api.esebakendra.com/api/DMT/eRegisterRecipient', payload)
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
    dmtFundTransfer(payload: any) {
        return this._httpClient.post(`https://api.esebakendra.com/api/DMT/eTransactionWithOTP`, payload);
    }
    dmtFundTransferVerifyOtp(payload: any, serviceId: string, categoryId: string, userId: string) {
        return this._httpClient.post(`https://api.esebakendra.com/api/DMT/eTransactionVarifyOTP?serviceId=${serviceId}&categoryId=${categoryId}&userId=${userId}`, payload);
    }

    private readonly URL_GET_WALLET_TRANSACTION_HISTORY = `${environment.service_base_url}/api/GSKRecharge/GetTransactions`;
    getTransactionHistory(emailid: string) {
        return this._httpClient.post(`${this.URL_GET_WALLET_TRANSACTION_HISTORY}?emailid=${emailid}`, {})
    }


    initiateTransactionRefund(payload: any, serviceId: string, categoryId: string, userId: string) {
        return this._httpClient.post(`https://api.esebakendra.com/api/DMT/eReFundTransaction&serviceId=${serviceId}&categoryId=${categoryId}&userId=${userId}`, payload)
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


    DeviceInfoMantra() {
        const url = "https://127.0.0.1:11100/rd/info";
        const xhr = new XMLHttpRequest();

        xhr.open('DEVICEINFO', url, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log(xhr.responseText);
                } else {
                    console.log(xhr.statusText);
                }
            }
        };
        xhr.send();
    }


    Capture() {
        console.log('Capturing')
        function getPosition(string: string, subString: string, index: number) {
            return string.split(subString, index).join(subString).length;
        }

        const url = "http://127.0.0.1:11100/capture";

        // const PIDOPTS = '<PidOptions ver=\"1.0\">' + '<Opts fCount=\"1\" fType=\"0\" iCount=\"\" iType=\"\" pCount=\"\" pType=\"\" format=\"0\" pidVer=\"2.0\" timeout=\"10000\" otp=\"\" wadh=\"\" posh=\"\"/>' + '</PidOptions>';
        const PIDOPTS = environment.PIDOPTION_FOR_BBPS_DMT;
        // console.log(PIDOPTS);
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


    CaptureMantra(success: Function, error: Function) {
        console.log('Capturing for Mantra Device');

        const url = "https://127.0.0.1:11100/rd/capture";

        const PIDOPTS = environment.PIDOPTION_FOR_BBPS_DMT;;
        // console.log(PIDOPTS);
        const xhr = new XMLHttpRequest();

        xhr.open('CAPTURE', url, true);
        xhr.setRequestHeader("Content-Type", "text/xml");
        xhr.setRequestHeader("Accept", "text/xml");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // console.log(xhr.responseText);
                if (xhr.status === 200) {
                    success(xhr.responseText);
                }
                else {
                    error(xhr.statusText)
                }
            }
        };

        xhr.send(PIDOPTS);
    }


    DiscoverRdService (){
        const url = 'http://127.0.0.1:11100/';

        const xhr = new XMLHttpRequest();

        xhr.open('RDSERVICE', url, true);
        xhr.setRequestHeader("Content-Type", "text/xml");
        xhr.setRequestHeader("Accept", "text/xml");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('if')
                    console.log(xhr.responseText);
                }
                else {
                    console.log('else')
                    console.log(xhr.statusText)
                }
            }
        };

        xhr.send();
    }

}