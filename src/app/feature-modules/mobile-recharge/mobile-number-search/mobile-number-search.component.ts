import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { MobileRechargeService } from '../mobile-recharge.service';

@Component({
  selector: 'app-mobile-number-search',
  templateUrl: './mobile-number-search.component.html',
  styleUrls: ['./mobile-number-search.component.scss'],
})
export class MobileNumberSearchComponent implements OnInit {
  constructor(
    private _router: Router,
    private _mobileService: MobileRechargeService
  ) {}
  showCta: boolean = false;
  isFetching: boolean = false;
  mobileNo: string = '';

  currentLocation: string = '';
  currentOperator: string = '';

  isInputInvalid: boolean = false;
  inputInvalidMessage: string = `Don't add +91 or 0 before your mobile number!`;
  ngOnInit(): void {}

  onInput(f: NgForm) {
    if (f.value.mobile_no.length == 10 && f.form.status === 'INVALID') {
      this.isInputInvalid = true;
      this.inputInvalidMessage = 'Please enter a valid mobile number!';
      return;
    }

    this.isInputInvalid = false;
    this.inputInvalidMessage = `Don't add +91 or 0 before your mobile number!`;
    this.showCta = false;
    sessionStorage.removeItem('mobile_search');
    // console.log(f.value.mobile_no)
    if (f.value.mobile_no.length === 10) {
      console.log('trigger call');
      this.isFetching = true;
      // implement SwitchMap here
      this._mobileService.getMobileNumberDetails(f.value.mobile_no).subscribe({
        next: (res: any) => {
          if (
            res.code === 200 &&
            res.status === 'Success' &&
            res?.resultDt?.data
          ) {
            this.showCta = true;
            this.isFetching = false;
            this.currentLocation = res?.resultDt?.data.currentLocation;
            this.currentOperator = res?.resultDt?.data.currentOperator;
            sessionStorage.setItem(
              'mobile_search',
              JSON.stringify({
                currentCircle: res?.resultDt?.data.currentLocation,
                currentBillerId: res?.resultDt?.data.currentOptBillerId,
              })
            );
          } else {
            console.log(res);
            this.showCta = false;
            this.isFetching = false;
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
  }

  onFormSubmit() {
    this._router.navigate(['mobile-recharge/plans']);
  }
}
