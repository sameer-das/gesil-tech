import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DmtService } from '../dmt-service.service';
import { PopupService } from 'src/app/popups/popup.service';
import { LoaderService } from 'src/app/services/loader.service';
import { finalize, first, tap } from 'rxjs';
import { OtpPopupComponent } from 'src/app/popups/otp-popup/otp-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-sender',
  templateUrl: './add-sender.component.html',
  styleUrls: ['./add-sender.component.scss']
})
export class AddSenderComponent implements OnInit {

  constructor(private _dmtService: DmtService, 
    private _popupService: PopupService,
    private _loaderService: LoaderService, 
    private _modal: MatDialog,
    private _router: Router) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  addSenderForm: FormGroup = new FormGroup({
    senderName: new FormControl('', Validators.required),
    // senderMobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
    transactionType: new FormControl(null, Validators.required),
  })


  get f(): { [key: string]: AbstractControl } {
    return this.addSenderForm.controls;
  }

  ngOnInit(): void {
  }

  onFormSubmit() {
    console.log(this.addSenderForm)
    const payload = {
      "requestType": "SenderRegister",
      "senderMobileNumber": this.currentUser.user.mobile_Number,
      "txnType": this.addSenderForm.value.transactionType,
      "senderName": this.addSenderForm.value.senderName,
      "senderPin": this.currentUser.personalDetail.user_Pin
    }
    this._loaderService.showLoader();
    this._dmtService.registerSenderInfo(payload)
      .pipe(first(),
        tap(x => console.log(x)),
        finalize(() => { this._loaderService.hideLoader() }))
      .subscribe({
        next: (resp: any) => {
          if (resp.code === 200 && resp.status === 'Success') {
            if (resp.resultDt.responseReason === 'Successful' && resp.resultDt.senderMobileNumber && resp.resultDt.responseCode == 0) {
              // open modal
              this._popupService.openConfirm({
                header: 'Registration Success!',
                message: 'An OTP has been sent to your registered mobile number for verification. Please click OK to proceed for verification!',
                showCancelButton: true
              }).afterClosed().subscribe((isOk: boolean) => {
                if (isOk) {
                  this._modal.open(OtpPopupComponent, {
                    disableClose: true,
                    data: { title: 'Please enter the OTP received on your mobile!' }
                  }).afterClosed().subscribe((otpData: any) => {
                    console.log(otpData);

                    if (otpData.otpAvailable) {
                      // call Verify sender API
                      const verifySenderPayload = {
                        "requestType": "VerifySender",
                        "senderMobileNumber": this.currentUser.user.mobile_Number,
                        "txnType": this.addSenderForm.value.transactionType,
                        "otp": String(otpData.value),
                        "additionalRegData": String(resp.resultDt.additionalRegData)
                      }
                      this._loaderService.showLoader()
                      this._dmtService.verifySender(verifySenderPayload)
                      .pipe(first(), finalize(() => this._loaderService.hideLoader()))
                      .subscribe({
                        next: (verifySenderResp: any) => {
                          console.log(verifySenderResp);
                          if (verifySenderResp.status === 'Success' && verifySenderResp.code === 200) {
                            if (verifySenderResp.resultDt.responseReason === 'Successful' && verifySenderResp.resultDt.senderMobileNumber) {
                              this._popupService.openAlert({
                                message: 'Sender Registered Successfully!',
                                header: 'success'
                              });
                              this._dmtService.recipentAdd.next(true);
                              
                            } else {
                              this._popupService.openAlert({
                                message: 'Sender Registration Failed! Please try again or contact support team.',
                                header: 'fail'
                              })
                            }
                          }
                        },
                        error: (err:any) => {
                          console.log(err)
                          this._popupService.openAlert({
                            message: 'Sender Registration Failed! Please try again or contact support team.',
                            header: 'fail'
                          })
                        }
                        
                      })
                    }
                  })
                }

              })
            } else {
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Error while adding sender. Please try again or contact support team!'
              })
            }
          }
        },
        error: (err: any) => {
          console.log(err)
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while adding sender. Please try again or contact support team!'
          })
        }
      })
  }
}
