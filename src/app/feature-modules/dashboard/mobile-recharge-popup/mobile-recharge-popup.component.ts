import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PopupService } from 'src/app/popups/popup.service';
import { MobileRechargeService } from './mobile-recharge.service';

@Component({
  selector: 'app-mobile-recharge-popup',
  templateUrl: './mobile-recharge-popup.component.html',
  styleUrls: ['./mobile-recharge-popup.component.scss'],
})
export class MobileRechargePopupComponent implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<MobileRechargePopupComponent>,
    private _mobileRechargeService: MobileRechargeService,
    private _popupService: PopupService
  ) {
    this._dialogRef.disableClose = true;
  }

  mobileOperators: any[] = [];

  mobileRechargeFormGroup = new FormGroup({
    op: new FormControl('', Validators.required),
    mn: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),
    amt: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$')
    ]),
  });

  ngOnInit(): void {
    this._mobileRechargeService.getMobileOperators().subscribe({
      next: (resp: any) => {
        if (resp.status === 'Success' && resp.code === 200) {
          this.mobileOperators = resp.data;
        } else {
          console.log('error while fetching mobile operators');
          console.log(resp);
        }
      },
      error: (err) => {
        console.log('error while fetching mobile operators');
        console.error(err);
      },
    });
  }

  closeDialog() {
    this._dialogRef.close();
  }

  onRecharge() {
    const recharge_id = this.create_UUID();
    console.log(recharge_id);
    const rechargePayload = {
      "apiToken": "",
      "mn": String(this.mobileRechargeFormGroup.value.mn),
      "op": String(this.mobileRechargeFormGroup.value.op),
      "amt": String(this.mobileRechargeFormGroup.value.amt),
      "reqid": recharge_id,
      "field1": "",
      "field2": ""
    }
    console.log(rechargePayload);

    this._mobileRechargeService.rechargeMobile(rechargePayload).subscribe({
      next: (resp: any ) => {
        console.log(resp)
        if(resp.status==='Success' && resp.code === 200) {
          this._popupService.openAlert({
            header: 'Success',
            message: JSON.stringify(resp.data)
          })
        } else {
          this._popupService.openAlert({
            header: 'Failed',
            message: JSON.stringify(resp.data)
          })
        }
      },
      error: (err) => {
        console.log('error while recharge');
        console.error(err);
        this._popupService.openAlert({
          header: 'Failed',
          message: 'Unknown Error'
        })
      }
    })
  }

  create_UUID():string {
    let dt = new Date().getTime();
    const uuid : string= 'xyyxxyyxxxxyyxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  getMobileRechargeFormError(field:string): string | null {
    const control: AbstractControl | null =
    this.mobileRechargeFormGroup.get(field);
    if (control?.invalid) {
      if (control.hasError('required')) {
        if (field === 'op') return 'Please choose operator!';
        if (field === 'mn') return 'Please enter mobile number!';
        if (field === 'amt') return 'Please enter amount!';
      }
      if (control.hasError('pattern')) {
        if (field === 'mn') return 'Please enter valid 10 digit mobile number!';
        if (field === 'amt') return 'Please enter a valid amount!';
      }
    }
    return null;
  }
}
