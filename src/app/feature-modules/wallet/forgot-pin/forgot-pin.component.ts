import { Component, OnInit } from '@angular/core';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-forgot-pin',
  templateUrl: './forgot-pin.component.html',
  styleUrls: ['./forgot-pin.component.scss']
})
export class ForgotPinComponent implements OnInit {

  constructor(private _popupService: PopupService, private _walletService: WalletService, private _authService: AuthService) { }

  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  otpSent: boolean = false;
  otp: string = '';
  isValidating: boolean = false;
  otpValidated: boolean = false;

  pin: string = '';
  cpin: string = '';
  ngOnInit(): void {
    console.log(this.currentUser)
  }


  generateOtpAndSend() {
    this._walletService.generateOtp(this.currentUser.user.user_ID).subscribe({
      next: (resp: any) => {
        console.log(resp)
        if (resp.status === 'Success' && resp.code === 200 && resp.data === "OTP send to the user") {
          this._popupService.openAlert({
            header: 'Success',
            message: 'Otp has been sent to your registered mobile number!'
          })
          this.otpSent = true;
        } else {
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while sending OTP! Please try after some time.'
          });
          this.otpSent = false;
        }
      }, error: (error: any) => {
        console.log(error)
        this._popupService.openAlert({
          header: 'Fail',
          message: 'Error while sending OTP! Please try after some time.'
        });
        this.otpSent = false;
      }
    })

  }

  validateOtp() {
    console.log('validate otp', this.otp)
    this.isValidating = true;
    this._authService.validateTPin(this.currentUser.user.user_ID, String(this.otp)).subscribe({
      next: (resp: any) => {
        console.log(resp)
        if (resp.status === 'Success' && resp.code === 200 && resp.data) {
          this.otpValidated = true;
          this.isValidating = false;
        } else if (resp.status === 'Success' && resp.code === 200 && !resp.data) {
          // show invalid Pin message
          this.otpValidated = false;
          this._popupService.openAlert({
            header: 'Alert',
            message: 'Invalid OTP! Please enter correct OTP.'
          });
          this.isValidating = false;
        } else {
          this.otpValidated = false;
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Unknown error occured, please contact support!'
          });
          this.isValidating = false;
        }
      },
      error: (err: any) => {
        console.log(err)
        this.otpValidated = false;
        this._popupService.openAlert({
          header: 'Fail',
          message: 'OTP validation failed. Please gry after some time.'
        });
      }

    })

  }

  generateNewPin() {
    if (this.pin !== this.cpin)
      return this._popupService.openAlert({
        header: 'Alert',
        message: 'New pin does not match with confirm pin field! Please try again.'
      })
    else if (!/^[0-9]*$/.test(this.pin) || !/^[0-9]*$/.test(this.pin))
      return this._popupService.openAlert({
        header: 'Alert',
        message: 'Please enter only digits in PIN field!'
      })

    this._walletService.updateWalletPin(this.currentUser.user.user_ID, this.pin, this.otp).subscribe({
      next: (resp: any) => {
        if (resp.status === "Success" && resp.code === 200 && resp.data) {
          this._popupService.openAlert({
            header: 'Success',
            message: 'Your wallet PIN has been set successfully!'
          });
          this.otpValidated = false;
          this.otpSent = false;

        } else {
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while setting your wallet PIN, Please contact Support.'
          })
        }
      }, error: (error: any) => {
        console.log(`error while updating pin`);
        console.log(error);
        this._popupService.openAlert({
          header: 'Fail',
          message: 'Error while setting your wallet PIN, Please contact Support.'
        })
      }
    })
  }

}
