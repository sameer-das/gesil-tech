import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { DmtService } from '../dmt-service.service';
import { finalize, first, pipe, tap } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';
import { WalletService } from '../../wallet/wallet.service';
import { MatDialog } from '@angular/material/dialog';
import { OtpPopupComponent, OtpPopupData } from 'src/app/popups/otp-popup/otp-popup.component';
import { AuthService } from 'src/app/services/auth.service';
import { DmtTransactionDetailsComponent } from '../dmt-transaction-details/dmt-transaction-details.component';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent implements OnInit {

  constructor(private _laoderService: LoaderService, private _dmtService: DmtService,
    private _popupService: PopupService, private _walletService: WalletService,
    private _dialog: MatDialog, private _authService: AuthService

  ) { }

  recipients: any[] = [];
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  convFee: any = ''
  ngOnInit(): void {
    this.getAllRecipients()
  }

  sendMoneyForm: FormGroup = new FormGroup({
    recipient: new FormControl('', Validators.required),
    transactionType: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*(\.[0-9]{0,2})?$'), this.customAmountValidator])
  })

  get f(): { [key: string]: AbstractControl } {
    return this.sendMoneyForm.controls;
  }

  sendMoneyPayload: any = {};

  onSubmit() {
    // console.log(this.sendMoneyForm)
    this.sendMoneyPayload = {
      "requestType": "TXNSENDOTP",
      "agentId": "",
      "initChannel": "AGT",
      "senderMobileNo": String(this.currentUser.user.mobile_Number),
      "recipientId": this.sendMoneyForm.value.recipient.recipientId,
      "txnAmount": String(this._dmtService.convertToPaisa(this.sendMoneyForm.value.amount) as number),
      "convFee": "0",
      "txnType": this.sendMoneyForm.value.transactionType,
      "bankId": "FINO"
    }

    const convPayload = {
      "requestType": "GetCCFFee",
      "agentId": "",
      "txnAmount": "" + this._dmtService.convertToPaisa(+this.sendMoneyForm.value.amount), // convert to paisa 
    }

    this._laoderService.showLoader();
    this._dmtService.getConveyanceFee(convPayload)
      .pipe(first(), tap(resp => console.log(resp)))
      .subscribe({
        next: (resp: any) => {
          this._laoderService.hideLoader()
          if (resp.code === 200 && resp.status === 'Success') {
            if (resp.resultDt.responseCode == 0) {
              this.convFee = this._dmtService.convertToRupees(resp.resultDt.custConvFee);
              // show confirm
              this._popupService.openConfirm({
                header: 'Transaction Details',
                message: `Please verify the details below. Click OK to proceed.`,
                tableType: 'transactionDetail',
                tableData: {
                  bankAccountNumber: this.sendMoneyForm.value.recipient.bankAccountNumber,
                  bankName: this.sendMoneyForm.value.recipient.bankName,
                  ifsc: this.sendMoneyForm.value.recipient.ifsc,
                  recipientName: this.sendMoneyForm.value.recipient.recipientName,
                  amount: +this.sendMoneyForm.value.amount, // in rupees
                  convFee: +this.convFee // in rupees
                },
                showCancelButton: true,
                modalMinWidth: 550
              }).afterClosed().subscribe((isOk: boolean) => {
                if (!isOk) return;

                this.sendMoneyPayload.convFee = String(this._dmtService.convertToPaisa(this.convFee) as number);

                // call fund transfer API 💲
                this.verifyWalletBalance();
              })
            } else {
              // conveyance fee fetch failed
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Error while processing request. Please try after sometime.'
              })
            }
          } else {
            this._popupService.openAlert({
              header: 'Fail',
              message: 'Error while processing request. Please try after sometime.'
            })
          }
        }, error: (err: any) => {
          this._laoderService.hideLoader()
          console.log('error while fetching conv fee');
          console.log(err);
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while processing request. Please try after sometime.'
          })
        }
      })
  }

  getAllRecipients() {
    const payload = {
      "requestType": "AllRecipient",
      "senderMobileNumber": this.currentUser.user.mobile_Number,
      "txnType": "IMPS"
    }
    this._laoderService.showLoader();
    this._dmtService.getAllRecipients(payload)
      .pipe(first(), finalize(() => this._laoderService.hideLoader()))
      .subscribe({
        next: (resp: any) => {
          if (resp.code === 200 && resp.status === 'Success') {
            if (resp.resultDt && resp.resultDt?.responseCode == 0) {
              this.recipients = resp.resultDt?.recipientList?.dmtRecipient;
            } else {
              this.recipients = [];
            }
            // console.log(this.recipients)
          }
        }, error: (err: any) => {
          console.log(err);
        }
      })
  }

  fundTransfer(paylaod: any) {
    const userId = this.currentUser.user.user_EmailID;
    const current_service_details = JSON.parse(sessionStorage.getItem('current_service') || '{}');
    const serviceCatId = current_service_details.services_Cat_ID;
    const serviceId = current_service_details.services_ID;
    // console.log(serviceId, serviceCatId, userId);

    this._laoderService.showLoader();
    this._dmtService.dmtFundTransfer(paylaod)
      .pipe(first(), finalize(() => this._laoderService.hideLoader()), tap(resp => console.log(resp)))
      .subscribe({
        next: (resp: any) => {
          // console.log(resp)
          if (resp.code === 200 && resp.status === 'Successful' && resp.resultDt?.responseCode === '000') {
            // Open the OTP Popup
              this._dialog.open(OtpPopupComponent, {
                disableClose: true,
                data: { 
                  title: 'Please enter the OTP received on your mobile!', otpLength: 4 }
              }).afterClosed().subscribe((otpData: any) => {
                console.log(otpData); 
                if(otpData.otpAvailable) {
                  const verifyOtpPayload = {...this.sendMoneyPayload, "otp": otpData.value, "requestType": "TXNVERIFYOTP"}
                  this._laoderService.showLoader();
                  this._dmtService.dmtFundTransferVerifyOtp(verifyOtpPayload, serviceId, serviceCatId, userId)
                  .pipe(first(), finalize(() => this._laoderService.hideLoader()))
                  .subscribe({
                    next: (resp:any) => {
                      // console.log(resp);
                      this._dialog.open(DmtTransactionDetailsComponent, {
                        data: resp.resultDt
                      })
                      this.convFee = 0;
                    },
                    error: (err) => {
                      console.log(err)
                      this._popupService.openAlert({
                        header:'Fail',
                        message: 'Server error occured, Please try after sometime.'
                      })
                    }
                  })
                } else {
                  this._popupService.openAlert({
                    header:'Fail',
                    message: 'Otp not found or user cancelled the transaction!'
                  })
                }
              });                  
            
          } else {
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Error while initiating transaction. Please try after sometime.'
              });
            }
        }, error: (err: any) => {
          console.log(err);
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while initiating transaction. Please try after sometime.'
          });
        }
      })
  }


  verifyWalletBalance() {
    const { txnAmount, convFee } = this.sendMoneyPayload;
    const totalInPaisa = +txnAmount + +convFee;

    console.log('Checking wallet balance against : ' + totalInPaisa / 100);

    this._laoderService.showLoader()
    this._walletService.getWalletBalance(this.currentUser.user.user_EmailID)
      .pipe(first(), tap((resp) => console.log(resp)))
      .subscribe({
        next: (resp: any) => {
          this._laoderService.hideLoader()
          console.log(resp);
          if (resp.status === 'Success' && resp.code === 200 && resp.data) {
            console.log(resp.data)
            const [walletBal, commissionBal] = resp.data.split(',');
            if ((+walletBal < +totalInPaisa / 100)) {
              // if (false) {
              // show less wallet popup
              this._popupService.openAlert({
                header: 'Alert',
                message: 'You do not have sufficient balance in your wallet! Please recharge to proceed.'
              });
            } else {
              console.log(`Wallet Validated, wallet balance : ${+resp.data} and trans amount ${totalInPaisa / 100}`);
              // Show PIN Popup

              const otpPopupData: OtpPopupData = {
                title: 'Please enter your PIN!',
                inputType: 'password',
                otpLength: 4
              }
              this._dialog.open(OtpPopupComponent, 
                {disableClose: true, data: otpPopupData})
                .afterClosed().subscribe(({otpAvailable, value}) => {
                  console.log(otpAvailable, value);
                  if(!otpAvailable)
                   return; // do nothing
                  // call validate pin service
                  this.validateUserPin(value)
                })

            }
          } else {
            this._popupService.openAlert({
              header: 'Fail',
              message: 'Error while initiating transaction. Please try after sometime.'
            });
            console.log('Error while getting wallet balance');
            return;
          }

        },
        error: (err: any) => {
          this._laoderService.hideLoader()
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while initiating transaction. Please try after sometime.'
          })
          console.log(err);
        }
      })
  }

  customAmountValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const amount = control.value ? +control.value : null;
    console.log(amount);
    if (amount !== null) {
      if (amount < 100)
        return {
          invalidAmount: true
        }
    }
    return null
  }


  validateUserPin(pin: string): void {
    this._laoderService.showLoader()
    this._authService.validateTPin(this.currentUser.user.user_ID, String(pin.trim()))
    .subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this._laoderService.hideLoader();
        if (resp.status === 'Success' && resp.code === 200 && resp.data) {
          console.log('Pin validation success!')
          this.fundTransfer(this.sendMoneyPayload);
        } else if (resp.status === 'Success' && resp.code === 200 && !resp.data) {
          // show invalid Pin message
          this._popupService.openAlert({
            header:'Fail',
            message: 'You have entered an invalid PIN! Please try again'
          })
        }
      },
      error: (err: any) => {
        this._laoderService.hideLoader();
        console.log(err);
        this._popupService.openAlert({
          header:'Fail',
          message: 'Errpr while validating PIN! Please try again'
        })
      }

    })
  }




}
