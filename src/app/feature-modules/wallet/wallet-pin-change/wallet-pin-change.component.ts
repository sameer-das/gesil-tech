import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PinPopupComponent } from 'src/app/popups/pin-popup/pin-popup.component';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-wallet-pin-change',
  templateUrl: './wallet-pin-change.component.html',
  styleUrls: ['./wallet-pin-change.component.scss']
})
export class WalletPinChangeComponent implements OnInit {

  constructor(private _popupService: PopupService, private _matDialog: MatDialog, private _walletService: WalletService) { }

  ngOnInit(): void {
  }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');

  pinChangeFormGroup: FormGroup = new FormGroup({
    new: new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirm: new FormControl('', [Validators.required, Validators.minLength(4)]),
  })

  getPinChangeFormGroupErrorMessage(field: string) {
    const control: AbstractControl | null =
      this.pinChangeFormGroup.get(field);
    // console.log(control)
    if (control?.invalid) {
      if (control.hasError('required')) {
        if (field === 'new') return 'Please enter your new wallet PIN!';
        if (field === 'confirm') return 'Please confirm your new wallet PIN!!';
      }

      if (control.hasError('minlength')) {
        return 'Please enter a 4 digit PIN!';
      }
    }

    return null;
  }

  onSubmit() {

    if (this.pinChangeFormGroup.value.new !== this.pinChangeFormGroup.value.confirm) {
      return this._popupService.openAlert({
        header: 'Alert',
        message: 'PINs did not match!'
      })
    }

    this.openPinDialog()

    console.log(this.pinChangeFormGroup.value)

  }

  openPinDialog() {
    const dialogRef = this._matDialog.open(PinPopupComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Pin Dialog closed ${result}`);
      if (result) {
        this._walletService.updateWalletPin(this.currentUser.user.user_ID, this.pinChangeFormGroup.value.new).subscribe({
          next: (resp: any) => {
            if (resp.status === "Success" && resp.code === 200 && resp.data) {
              this._popupService.openAlert({
                header: 'Success',
                message: 'Your wallet PIN has been updated successfully!'
              })
              this.pinChangeFormGroup.reset();
            } else {
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Error while changing your wallet PIN, Please contact Support.'
              })
            }
          }, error: (error: any) => {
            console.log(`error while updating pin`);
            console.log(error);
            this._popupService.openAlert({
              header: 'Fail',
              message: 'Error while changing your wallet PIN, Please contact Support.'
            })
          }
        })
      }
    });
  }

}
