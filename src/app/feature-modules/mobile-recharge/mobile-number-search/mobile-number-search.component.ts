import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { PopupService } from 'src/app/popups/popup.service';
import { MobileRechargeService } from '../mobile-recharge.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';

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
    private _route:ActivatedRoute
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


  ngOnInit(): void {
    this.getRecentTrans ()

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
    { operator: 'airtel', logo: 'airtel-logo.jpg' },
    { operator: 'jio', logo: 'jio.png' },
    { operator: 'bsnl', logo: 'bsnl-logo.svg' },
    { operator: 'voda', logo: 'vi-logo.svg' },
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
              currentMobileNumber: this.mobileNo.value
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
          // console.log(resp)
          if (resp.code === 200 && resp.status === "Success" && resp?.data?.length > 0) {
            this.previousTransactions = resp?.data?.map((curr: any) => {
              const req = curr.wallet_transaction_request && JSON.parse(curr.wallet_transaction_request);
              console.log(req)
              let operatorDetails: any;
              let foundOp: any;
              if (req) {
                operatorDetails = environment.PREPAID_RECHARGE_OPERATOR.find(curr => +curr.op === +req.op)
                // console.log(operatorDetails);
                foundOp = this.mobile_operator_to_logo.filter((op: any) => op.operator.includes(operatorDetails?.provider?.trim().toLowerCase()))
                // this.currentOperatorLogo = foundOp?.length > 0 ? `./assets/logo/${foundOp[0].logo}` : '';
      
              }
              return {...JSON.parse(curr.wallet_transaction_Logfile), 
                operatorLogo: foundOp?.length > 0 ? `./assets/logo/${foundOp[0].logo}` : '',
                operatorName: operatorDetails ? operatorDetails?.provider : '' }
            })
          }

          console.log(this.previousTransactions)
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

}
