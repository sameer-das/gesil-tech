import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';
import { environment } from 'src/environments/environment';
import { MobileRechargeService } from '../mobile-recharge.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import * as convert from 'xml-js';


@Component({
    selector: 'app-mobile-number-search',
    templateUrl: './mobile-number-search.component.html',
    styleUrls: ['./mobile-number-search.component.scss'],
})
export class MobileNumberSearchComponent implements OnInit, OnDestroy {
    constructor(
        private _router: Router,
        private _mobileService: MobileRechargeService,
        private _popupService: PopupService,
        private _route: ActivatedRoute,
    ) { }

    showCta: boolean = false;
    isFetching: boolean = false;
    mobileNo: FormControl = new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'), Validators.minLength(10), Validators.maxLength(10)]);

    currentLocation: string = '';
    currentOperator: string = '';
    currentOperatorLogo: string = '';

    isInputInvalid: boolean = false;
    inputInvalidMessage: string = `Don't add +91 or 0 before your mobile number!`;
    currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
    $destory: Subject<boolean> = new Subject();
    commission: boolean = true;
    commissionTooltipMessage = "Disabling commission will not credit any commission to wallet."

    ngOnInit(): void {
        this.getRecentTrans()

        this.mobileNo.valueChanges.subscribe({
            next: (val) => {
                this.showCta = false;
                if (val?.length === 10 && this.mobileNo.valid) {
                    this.onInput()
                }
            }
        })
    }

    ngOnDestroy(): void {
        this.$destory.next(true)
    }

    mobile_operator_to_logo: any[] = [
        { operator: 'airtel', logo: 'airtel-logo.jpg', BBPSBillerID: 'BILAVAIRTEL001', BBPSBillerName: 'Airtel' },
        { operator: 'jio', logo: 'jio.png', BBPSBillerID: 'BILAVJIO000001', BBPSBillerName: 'Jio' },
        { operator: 'bsnl', logo: 'bsnl-logo.svg', BBPSBillerID: 'BILAVBSNL00001', BBPSBillerName: 'BSNL' },
        { operator: 'voda', logo: 'vi-logo.svg', BBPSBillerID: 'BILAVVI0000001', BBPSBillerName: 'VI' },
        { operator: 'vi', logo: 'vi-logo.svg', BBPSBillerID: 'BILAVVI0000001', BBPSBillerName: 'VI' },
    ]

    onInput() {
        this.isInputInvalid = false;
        this.inputInvalidMessage = `Don't add +91 or 0 before your mobile number!`;
        this.showCta = false;
        sessionStorage.removeItem('mobile_search');
        // console.log(f.value.mobile_no)

        // console.log('trigger call');
        this.isFetching = true;
        // implement SwitchMap here
        this._mobileService.getMobileNumberDetails(this.mobileNo.value).subscribe({
            next: (res: any) => {
                // console.log(res)
                if (
                    res.code === 200 &&
                    res.status === 'Success' &&
                    res?.resultDt?.data &&
                    !!res?.resultDt?.data.currentOptBillerId
                ) {
                    this.showCta = true;
                    this.isFetching = false;
                    this.currentLocation = res?.resultDt?.data.currentLocation;
                    this.currentOperator = res?.resultDt?.data.currentOperator;
                    const foundOp = this.mobile_operator_to_logo.filter((op: any) => op.operator.includes(this.currentOperator.trim().toLowerCase()))
                    this.currentOperatorLogo = foundOp.length > 0 ? `./assets/logo/${foundOp[0].logo}` : '';

                    sessionStorage.setItem(
                        'mobile_search',
                        JSON.stringify({
                            currentCircle: res?.resultDt?.data.currentLocation,
                            currentBillerId: res?.resultDt?.data.currentOptBillerId,
                            currentOperator: res?.resultDt?.data.currentOperator,
                            currentMobileNumber: this.mobileNo.value,
                            commission: this.commission
                        })
                    );
                } else {
                    console.log(res);
                    this.showCta = false;
                    this.isFetching = false;
                    this._popupService.openAlert({
                        header: 'Alert',
                        message: 'Problem occured while fetching operator details, Please try after sometime!'
                    })
                }
            },
            error: (err) => {
                console.log('Error fetching the mnp details');
                console.log(err);
                this.showCta = false;
                this.isFetching = false;
            },
        });

    }

    onFormSubmit() {
        if (this.mobileNo.invalid)
            return;
        this._router.navigate(['mobile-recharge/plans']);
    }

    previousTransactions: any[] = [];

    getRecentTrans() {

        this._mobileService.getRecentPrepaidRechargeTransactions(this.currentUser.user.user_EmailID, 1, 1)
            .pipe(
                finalize(() => { }),
                takeUntil(this.$destory)
            )
            .subscribe({
                next: (resp: any) => {
                    console.log(resp)
                    if (resp.code === 200 && resp.status === "Success" && resp?.data?.length > 0) {
                        this.previousTransactions = resp?.data?.map((curr: any) => {
                            console.log(curr)
                            

                            if (curr.wallet_transaction_recall === 'BBPS') {
                                // IF BBPS 
                                const req = this.getTransDetailsAsJSON(curr);
                                const found = this.mobile_operator_to_logo.find(curr => curr.BBPSBillerID === req.billerId)
                                return {
                                    ...req,
                                    operatorLogo: `./assets/logo/${found?.logo}`,
                                    operatorName: found.BBPSBillerName
                                }

                            } else {
                                // IF Munimulti
                                const req = curr.wallet_transaction_request && JSON.parse(curr.wallet_transaction_request);
                                let operatorDetails: any;
                                let foundOp: any;
                                if (req) {
                                    operatorDetails = environment.PREPAID_RECHARGE_OPERATOR.find(curr => +curr.op === +req.op)
                                    // console.log(operatorDetails);
                                    foundOp = this.mobile_operator_to_logo.filter((op: any) => op.operator.includes(operatorDetails?.provider?.trim().toLowerCase()))
                                    // this.currentOperatorLogo = foundOp?.length > 0 ? `./assets/logo/${foundOp[0].logo}` : '';

                                }

                                return {
                                    ...JSON.parse(curr.wallet_transaction_Logfile),
                                    operatorLogo: foundOp?.length > 0 ? `./assets/logo/${foundOp[0].logo}` : '',
                                    operatorName: operatorDetails ? operatorDetails?.provider : ''
                                }
                            }



                        })
                    }

                },
                error: (err) => {
                    console.log(err)
                }
            })
    }

    onRecentTransactionCardClick(trans: any) {
        // console.log(trans)
        this.mobileNo.setValue(trans.mn);
        // console.log(this.mobileForm)

    }

    goToDashboard() {
        this._router.navigate(['dashboard'])
    }


    onToggle(e: MatSlideToggleChange) {
        this.commission = e.checked;
        if (this.commission) {
            this.commissionTooltipMessage = "Disabling commission will not credit any commission to the wallet."
        } else {
            this.commissionTooltipMessage = "Enabling commission will credit appropriate commission to the wallet."
        }
    }


    getTransDetailsAsJSON(trans: any) {
        const j = convert.xml2json(trans['wallet_transaction_request'], { compact: true });
        const json = JSON.parse(j);
        return {
            billerId: json.billPaymentRequest.billerId['_text'],
            amt: json.billPaymentRequest.amountInfo.amount['_text'] / 100, // to convert to rupees
            mn: json.billPaymentRequest.inputParams.input.paramValue['_text']
        }
    }

}
