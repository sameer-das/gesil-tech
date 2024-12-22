import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, switchMap, takeUntil, tap } from 'rxjs';
import { BbpsService } from 'src/app/feature-modules/bbps-services/bbps.service';
import { PinPopupComponent } from 'src/app/popups/pin-popup/pin-popup.component';
import { PopupService } from 'src/app/popups/popup.service';
import { LoaderService } from 'src/app/services/loader.service';
import { environment } from 'src/environments/environment';
import { WalletService } from '../../wallet/wallet.service';


@Component({
    selector: 'app-all-services',
    templateUrl: './all-services.component.html',
    styleUrls: ['./all-services.component.scss']
})
export class AllServicesComponent implements OnInit, OnDestroy {

    serviceName!: string;
    serviceCatId!: string;
    serviceId!: string;
    currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');

    amountToBePaid: string = '';

    isBillFetchRequired: boolean = true;

    isBillValidationRequired: boolean = false;

    selectedFromRecentTrans: boolean = false;

    showLogoInRecentTransChips: boolean = false;

    constructor(private _bbpsService: BbpsService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _loaderService: LoaderService,
        private _walletService: WalletService,
        private _popupService: PopupService,
        private _matDialog: MatDialog,
        private _fb: FormBuilder) {
        this._route.params.subscribe((params: any) => {
            console.log(params);
            this.serviceName = params.servicename;
        });

        const current_service_details = JSON.parse(sessionStorage.getItem('current_service') || '{}');
        if (Object.keys(current_service_details).length === 0) {
            // If services_Cat_ID and services_ID not found go back to dashboard
            this._router.navigate(['dashboard']);
        } else {
            this.serviceCatId = current_service_details.services_Cat_ID;
            this.serviceId = current_service_details.services_ID;

            if ([2].indexOf(+this.serviceCatId) >= 0) {
                this.showLogoInRecentTransChips = true;
            } else {
                this.showLogoInRecentTransChips = false;
            }
        }

    }

    $destroy: Subject<boolean> = new Subject();
    ngOnDestroy(): void {
        if (this.getBillerdByCategorySubscription)
            this.getBillerdByCategorySubscription.unsubscribe();
        if (this.getBillerInfoSubscription)
            this.getBillerInfoSubscription.unsubscribe();

        this.$destroy.next(true);

    }

    // @ViewChild('servicesSelectBox', { static: true }) servicesSelectBox!: MatSelect;
    // @ViewChild('billerSelectBox', { static: true }) billerSelectBox!: MatSelect;
    billerSelectBoxFC: FormControl = new FormControl()

    servicesSelectBox: FormControl = new FormControl();

    billers: any[] = [];
    billerId!: string;
    biller: any = {};
    params: any[] = [];

    billerResponse: any;
    additionalInfo: any;
    requestID: string | null = '';
    inputParam!: any[];
    billerPaymentModes: string[] = [];
    paymentMode: string = '';


    isBillFetching: boolean = false;

    getBillerdByCategorySubscription!: Subscription;
    getBillerInfoSubscription!: Subscription;

    panDetails = this.currentUser.kycDetail.pancard_Number ? `${this.currentUser.kycDetail.pancard_Number} | ${this.currentUser.personalDetail.user_FName} ${this.currentUser.personalDetail.user_LName}` : "";

    onServiceChange(e: MatSelectChange) {
        console.log(e)
    }

    ngOnInit(): void {
        console.log(this._router.url);

        if (!this.serviceName) {

            this.getBillerdByCategorySubscription = this.servicesSelectBox?.valueChanges.pipe(
                tap(() => this.billers = []),
                switchMap((x: string) => this._bbpsService.getBillerdByCategory(x))
            ).subscribe((resp: any) => {
                console.log(resp)
                if (resp.status === 'Success' && resp.code === 200) {
                    this.billers = resp.resultDt;

                    // this.billers.push({ blr_id: 'OTME00005XXZ43', blr_name: 'OTME' })
                }
            })
        } else if (this.serviceName === 'DMT') {
            // If DMT then send it to DMT route
            // this._router.navigate(['dmtransfer/dmttransactions'], { state: { serviceCatId: this.serviceCatId, serviceId: this.serviceId } });
        } else if (this.serviceName === 'pmfby') {
            // this._router.navigate(['pmfby'], { state: { serviceCatId: this.serviceCatId, serviceId: this.serviceId } })
        } else {
            const searchValue = this.allServices.filter((s: any) => s.path === this.serviceName);
            if (searchValue.length > 0) {

                console.log(searchValue);
                this.getBillerdByCategorySubscription = this._bbpsService.getBillerdByCategory(searchValue[0].searchValue)
                    .subscribe((resp: any) => {
                        console.log(resp)
                        if (resp.status === 'Success' && resp.code === 200) {
                            this.billers = resp.resultDt;
                            this.getPrevTransactions();
                            // this.billers.push({ blr_id: 'OTME00005XXZ43', blr_name: 'OTME' })
                        }
                    })
            } else {
                this._router.navigate(['dashboard'])
            }
        }

        // this.billerSelectBoxFC.valueChanges.subscribe({
        //   next: (x) => {
        //     console.log(x)
        //   }
        // })
        this.getBillerInfoSubscription = this.billerSelectBoxFC.valueChanges.pipe(
            tap(x => {
                this.billerId = x.blr_id;
                this.biller = x;
                this.billerResponse = undefined;
                console.log(this.biller);
                this.params = [];
                this._loaderService.showLoader();
            }),
            switchMap(x => this._bbpsService.getBillerInfo(x.blr_id))
        ).subscribe((billerDetailsResp: any) => {
            this._loaderService.hideLoader();
            console.log(billerDetailsResp)
            if (billerDetailsResp.status === 'Success' && billerDetailsResp.code === 200 && billerDetailsResp?.resultDt?.resultDt?.billerId?.length > 0) {

                console.log(billerDetailsResp?.resultDt?.resultDt?.billerInputParams.paramInfo);
                this.params = billerDetailsResp?.resultDt?.resultDt?.billerInputParams.paramInfo;
                this.billerPaymentModes = billerDetailsResp?.resultDt?.resultDt?.billerPaymentModes.split(',');
                this.isBillFetchRequired = billerDetailsResp?.resultDt?.resultDt?.billerFetchRequiremet !== "NOT_SUPPORTED";
                this.isBillValidationRequired = billerDetailsResp?.resultDt?.resultDt?.billerSupportBillValidation === "MANDATORY"
                console.log(this.isBillFetchRequired);

            } else {
                this.params = []
            }
        });



    }


    allServices: any[] = [
        { path: 'landline-postpaid', searchValue: 'Landline Postpaid', },
        { path: 'water', searchValue: 'Water', },
        { path: 'insurance', searchValue: 'Insurance', },
        { path: 'hospital', searchValue: 'Hospital', },
        { path: 'electricity', searchValue: 'Electricity', },
        { path: 'health-insurance', searchValue: 'Health Insurance', },
        { path: 'mobile-postpaid', searchValue: 'Mobile Postpaid', },
        { path: 'fasttag', searchValue: 'Fastag', },
        { path: 'gas', searchValue: 'Gas', },
        { path: 'subscription', searchValue: 'Subscription', },
        { path: 'housing-society', searchValue: 'Housing Society', },
        { path: 'cable-tv', searchValue: 'Cable TV', },
        { path: 'broadband-postpaid', searchValue: 'Broadband Postpaid', },
        { path: 'lpg-gas', searchValue: 'LPG Gas', },
        { path: 'municipal-services', searchValue: 'Municipal Services', },
        { path: 'loan-repayment', searchValue: 'Loan Repayment', },
        { path: 'life-insurance', searchValue: 'Life Insurance', },
        { path: 'credit-card', searchValue: 'Credit Card', },
        { path: 'municipal-taxes', searchValue: 'Municipal Taxes', },
        { path: 'dth', searchValue: 'DTH', },
        { path: 'education-fees', searchValue: 'Education Fees', },
    ]


    billFetch(e: any) {

        // console.log(e);
        if (!this.isBillFetchRequired) {
            // directly go for payment
            this.billPayWithoutBillFetch(e);
            return;
        }

        const input = [];

        for (let k in e) {
            input.push({
                "paramName": k,
                "paramValue": e[k]
            });
        }

        this.inputParam = input;
        const fetchBill = {
            "agentId": "CC01BA48AGTU00000001",
            "agentDeviceInfo": {
                "ip": "192.168.2.73",
                "initChannel": "AGT",
                "mac": "01-23-45-67-89-ab"
            },
            "customerInfo": {
                "customerMobile": "9777117452",
                "customerEmail": "info.gskindiaorg@gmail.com",
                "customerAdhaar": "",
                "customerPan": ""
            },
            "billerId": this.billerId,
            "inputParams": {
                "input": [...input]
            }
        }
        console.log(fetchBill);
        this.isBillFetching = true;
        this._loaderService.showLoader();
        this._bbpsService.fetchBill(fetchBill).subscribe({
            next: (resp: any) => {
                this._loaderService.hideLoader();
                this.isBillFetching = false;
                console.log(resp)
                if (resp.status === 'Success' && resp.code === 200) {
                    console.log(resp?.resultDt.requestID);
                    console.log(resp?.resultDt.data);
                    this.requestID = resp?.resultDt.requestID;
                    this.billerResponse = resp?.resultDt.data?.billerResponse;
                    this.additionalInfo = resp?.resultDt.data?.additionalInfo;

                    this.amountToBePaid = String(+this.billerResponse?.billAmount / 100)


                    if (!this.billerResponse) {
                        this._popupService.openAlert({
                            header: 'Alert',
                            message: 'You dont have any outstanding amount to pay!'
                        })
                    }
                }
            },
            error: (err) => {
                this._loaderService.hideLoader();
                this.isBillFetching = false;
                console.log(err)
            }
        })
    }



    billPayWithBillFetch() {
        const payBill = {
            "agentId": environment.BBPS_AGENT_ID,
            "billerAdhoc": true,
            "agentDeviceInfo": environment.BBPS_AGENT_DEVICE_INFO,
            "customerInfo": {
                "customerMobile": "9777117452",
                "customerEmail": "info.gskindiaorg@gmail.com",
                "customerAdhaar": "",
                "customerPan": ""
            },
            "billerId": this.billerId,
            "inputParams": {
                "input": [
                    ...this.inputParam
                ]
            },
            "billerResponse": this.billerResponse,
            "additionalInfo": this.additionalInfo,
            "amountInfo": {
                "amount": +(+this.amountToBePaid * 100).toFixed(2),
                "currency": 356,
                "custConvFee": 0,
                "amountTags": [

                ]
            },
            "paymentMethod": {
                "paymentMode": 'Wallet',
                "quickPay": "N",
                "splitPay": "N"
            },
            "paymentInfo": {
                "info": [
                    {
                        "infoName": "WalletName",
                        "infoValue": "Paytm"
                    }, {
                        "infoName": "MobileNo",
                        "infoValue": this.currentUser.user.mobile_Number
                    }
                ]
            }
        }

        console.log(payBill);
        this.payBill(payBill);
    }



    billPayWithoutBillFetch(e: any) {

        this.amountToBePaid = e['Amount'];

        if (this.billerId != 'SUND00000NAT02') {
            // delete amount field if not sunTV
            delete e.Amount;
        }

        // console.log(e)
        const input = [];

        for (let k in e) {
            input.push({
                "paramName": k,
                "paramValue": e[k]
            });
        }

        this.inputParam = input;
        const payBill = {
            "agentId": environment.BBPS_AGENT_ID,
            "billerAdhoc": true,
            "agentDeviceInfo": environment.BBPS_AGENT_DEVICE_INFO,
            "customerInfo": {
                "customerMobile": "9777117452",
                "customerEmail": "info.gskindiaorg@gmail.com",
                "customerAdhaar": "",
                "customerPan": this.panDetails
            },
            "billerId": this.billerId,
            "inputParams": {
                "input": [
                    ...this.inputParam
                ]
            },
            "amountInfo": {
                "amount": +(+this.amountToBePaid * 100).toFixed(2),
                "currency": 356,
                "custConvFee": 0,
                "amountTags": []
            },
            "paymentMethod": {
                "paymentMode": 'Wallet',
                "quickPay": "Y",
                "splitPay": "N"
            },
            "paymentInfo": {
                "info": [
                    {
                        "infoName": "WalletName",
                        "infoValue": "Paytm"
                    }, {
                        "infoName": "MobileNo",
                        "infoValue": this.currentUser.user.mobile_Number
                    }
                ]
            }
        }


        // Bill Validation is required
        if (this.isBillValidationRequired) {
            const payload = {
                "agentId": environment.BBPS_AGENT_ID,
                "billerId": this.billerId,
                "inputParams": {
                    "input": [
                        ...this.inputParam
                    ]
                },
            }
            console.log('========= Calling BBPS Bill Validation API ===========')
            this._bbpsService.validateBill(payload).pipe(takeUntil(this.$destroy))
                .subscribe({
                    next: (resp: any) => {
                        console.log('========= Calling BBPS Bill Validation Response ===========')
                        console.log(resp)
                        if (resp.status === 'Success' && resp.code === 200 && resp?.resultDt?.data?.responseCode === 0) {
                            this.requestID = resp?.resultDt?.requestID;
                            // Call bill pay 
                            this.payBill(payBill)
                        } else {
                            this._popupService.openAlert({
                                header: 'alert',
                                message: "Bill validation failed. Please contact support team!"
                            })
                        }
                    },
                    error: (err) => {
                        console.log(err);
                        this._popupService.openAlert({
                            header: 'fail',
                            message: err.message
                        })
                    }
                })

        } else {
            // Bill Validation is not required 
            this.requestID = '';
            this.payBill(payBill);
        }
    }



    payBill(payBill: any) {
        console.log("=========== Calling BBPS Bill Pay API ============");
        console.log(this.requestID, this.serviceCatId, this.serviceId, this.currentUser.user.user_EmailID);
        console.log(payBill);
        this._loaderService.showLoader();
        this._walletService.getWalletBalance(this.currentUser.user.user_EmailID).subscribe({
            next: (resp: any) => {
                this._loaderService.hideLoader();
                console.log(resp);
                if (resp.status === 'Success' && resp.code === 200 && resp.data) {
                    console.log(resp.data)
                    const [walletBal, commissionBal] = resp.data.split(',');
                    if (this.isBillFetchRequired && +walletBal < (+this.billerResponse.billAmount / 100)) {
                        // if (false) {
                        // show less wallet popup
                        this._popupService.openAlert({
                            header: 'Alert',
                            message: 'You do not have sufficient balance in your wallet! Please recharge to proceed.'
                        });
                    } else if (!this.isBillFetchRequired && +walletBal < +this.amountToBePaid) {
                        this._popupService.openAlert({
                            header: 'Alert',
                            message: 'You do not have sufficient balance in your wallet! Please recharge to proceed.'
                        });
                    } else {
                        const dialogRef = this._matDialog.open(PinPopupComponent, { disableClose: true });

                        dialogRef.afterClosed().subscribe(result => {
                            console.log(`Pin Dialog closed ${result}`);
                            this._loaderService.showLoader();
                            if (result) {
                                this._bbpsService.payBill(this.requestID, payBill, this.serviceCatId, this.serviceId, this.currentUser.user.user_EmailID)
                                    .subscribe((resp: any) => {
                                        this._loaderService.hideLoader();
                                        console.log(resp);
                                        sessionStorage.setItem(`TRANS_${resp.resultDt.txnRefId}`, JSON.stringify({ payBill: payBill, billerDetails: this.biller, resp, currentServiceUrl: this._router.url }))
                                        this._router.navigate([`bbps/payment/${resp.resultDt.txnRefId}`], {
                                            state: { payBill: payBill, billerDetails: this.biller, resp, currentServiceUrl: this._router.url }
                                        });
                                    }, (err) => {
                                        console.log(err)
                                        this._loaderService.hideLoader();
                                    })
                            } else {
                                this._loaderService.hideLoader();
                            }

                        });


                    }
                } else {
                    console.log('Error while getting wallet balance');
                }

            },
            error: (err: any) => {
                this._loaderService.hideLoader();
                console.log(err);
            }
        })

    }



    onPaymentModeChange(e: MatSelectChange) {
        console.log(e.value)
        this.paymentMode = e.value;
    }



    goToDashboard() {
        this._router.navigate(['dashboard'])
    }



    previousTransactions: any[] = [];
    getPrevTransactions() {
        this._bbpsService
            .getPreviousTransaction(this.currentUser.user.user_EmailID, this.serviceCatId, this.serviceId
            ).subscribe({
                next: (resp: any) => {
                    console.log('Prev trans resp');
                    console.log(resp)
                    // if (resp.code === 200 && resp.data?.length > 0) {
                    this.previousTransactions = resp.data.map((trans: any) => {
                        const json = this.getTransDetailsAsJSON(trans);
                        return {
                            data: json,
                            amount: (json?.billPaymentRequest?.amountInfo?.amount / 100).toFixed(2),
                            billerId: json?.billPaymentRequest?.billerId,
                            biller: this.billers.find(curr => curr.blr_id === json?.billPaymentRequest?.billerId),
                            inputParam: this.getInputParams(json?.billPaymentRequest?.inputParams.input),
                            logo: environment.DTH_BILLER_LOGO.find(curr => curr.blr_id === json?.billPaymentRequest?.billerId)
                        }
                    });
                    console.log(this.previousTransactions);
                },
                error: (err) => {
                    console.log('Prev trans error');
                    console.log(err)
                }
            })
    }



    getTransDetails(trans: any) {
        let ret: string = '';
        if (trans.wallet_transaction_recall === 'ManiMulti') {
            const json = JSON.parse(trans.wallet_transaction_Logfile)
            ret = `Mobile No. : ${json.mn}`;
        }
        else if (trans.wallet_transaction_recall === 'BBPS') {
            const x = trans.wallet_transaction_Logfile;
            // Get the Input Params
            const str = x.slice(x.indexOf('<paramName>'), x.lastIndexOf('</paramValue>') + 13);
            const res: any = { 'inputs': [this.getInputParams(str)] };
            // Get the Customer Name
            res['RespCustomerName'] = this.getValueOfTag(x, 'RespCustomerName');
            // Get Amount
            res['Amount'] = this.getValueOfTag(x, 'RespAmount');
            ret = res;
        }
        return ret
    }



    getTransDetailsAsJSON(trans: any) {
        const removedSlash = trans['wallet_transaction_request']?.replace(new RegExp('/', 'g'), '');
        if (removedSlash) {
            return JSON.parse(removedSlash)
        } else {
            return undefined;
        }
    }



    getInputParams(str: any) {
        if (str) {
            if (Array.isArray(str)) {
                return str;
            } else if (typeof str === 'object') {
                return [str];
            }
        }

        return [];
    }



    getValueOfTag(sourceString: string, tagName: string) {
        return sourceString.slice(
            sourceString.indexOf(`<${tagName}>`) + tagName.length + 2,
            sourceString.indexOf(`</${tagName}>`)
        )
    }



    getValueFromKey(obj: any) {
        return Object.values(obj)[0]
    }



    recentTransDetails: any;
    prePopulateValue: any;
    prePopulateAmount: string = '';
    onRecentTransactionCardClick(trans: any) {
        console.log(trans);

        this.recentTransDetails = trans;
        this.selectedFromRecentTrans = trans;
        this.billerSelectBoxFC.setValue(trans.biller);

        this.prePopulateValue = trans.inputParam;
        this.prePopulateAmount = trans.amount
    }


}
// BBPS
// <RespCustomerName>
// <RespAmount>