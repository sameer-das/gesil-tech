import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';
import { DmtService } from '../dmt-service.service';
import { finalize, first, tap } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent implements OnInit {

  constructor(private _laoderService: LoaderService, private _dmtService: DmtService,
    private _popupService: PopupService

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
    amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*(\.[0-9]{0,2})?$')])
  })

  get f(): { [key: string]: AbstractControl } {
    return this.sendMoneyForm.controls;
  }

  onSubmit() {
    console.log(this.sendMoneyForm)
    const sendMoneyPayload = {
      "requestType": "FundTransfer",
      "senderMobileNo": +this.currentUser.user.mobile_Number,
      "agentId": "",
      "initChannel": "AGT",
      "recipientId": +this.sendMoneyForm.value.recipient,
      "txnAmount": this._dmtService.convertToPaisa(this.sendMoneyForm.value.amount),
      "convFee": 0,
      "txnType": this.sendMoneyForm.value.transactionType
    }

    const convPayload = {
      "requestType": "GetCCFFee",
      "agentId": "",
      "txnAmount": "" + this._dmtService.convertToPaisa(+this.sendMoneyForm.value.amount), // convert to paisa 
    }

    this._laoderService.showLoader();
    this._dmtService.getConveyanceFee(convPayload)
      .pipe(first(), finalize(() => this._laoderService.hideLoader()), tap(resp => console.log(resp)))
      .subscribe({
        next: (resp: any) => {
          if (resp.code === 200 && resp.status === 'Success') {
            if (resp.resultDt.responseCode == 0) {
              this.convFee = this._dmtService.convertToRupees(resp.resultDt.custConvFee);
              // show confirm
              this._popupService.openConfirm({
                header: 'Transaction Details',
                message: `Please verify the details below. Click OK to proceed.`,
                showTable: true,
                tableData: {
                  bankAccountNumber: this.sendMoneyForm.value.recipient.bankAccountNumber,
                  bankName: this.sendMoneyForm.value.recipient.bankName,
                  ifsc: this.sendMoneyForm.value.recipient.ifsc,
                  recipientName: this.sendMoneyForm.value.recipient.recipientName,
                  amount: this.sendMoneyForm.value.amount,
                  convFee: this.convFee
                },
                showCancelButton: true,
              }).afterClosed().subscribe((isOk: boolean) => {
                if (!isOk) return;

                // call fund transfer API 💲
                sendMoneyPayload.convFee = this._dmtService.convertToPaisa(this.convFee) as number;
                this.fundTransfer(sendMoneyPayload);
              })
            } else {
              // conveyance fee fetch failed
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Error while processing request. Please try after sometime.'
              })
            }
          }
        }, error: (err: any) => {
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
            console.log(this.recipients)
          }
        }, error: (err: any) => {
          console.log(err);
        }
      })
  }

  fundTransfer(paylaod: any) {
    const userId = this.currentUser.user.user_ID;
    const current_service_details = JSON.parse(sessionStorage.getItem('current_service') || '{}');
    const serviceCatId = current_service_details.services_Cat_ID;
    const serviceId = current_service_details.services_ID;
    console.log(serviceId, serviceCatId, userId);

    this._laoderService.showLoader();
    this._dmtService.dmtFundTransfer(paylaod, serviceId, serviceCatId, userId)
      .pipe(first(), finalize(() => this._laoderService.hideLoader()), tap(resp => console.log(resp)))
      .subscribe({
        next: (resp: any) => {
          if (resp.code === 200 && resp.status === 'Success') {
            if (resp.resultDt && resp.resultDt?.responseCode == 0 && resp.resultDt.respDesc === 'Success') {
              this._popupService.openAlert({
                header: 'Success',
                message: 'Transaction Success!'
              });
              this.sendMoneyForm.reset({
                recipient: '',
                transactionType: '',
                amount: ''
              });
              this.convFee = 0;
            } else {
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Transaction Failed!'
              });
            }
            console.log(this.recipients)
          }
        }, error: (err: any) => {
          console.log(err);
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Transaction Failed!'
          });
        }
      })
  }
}
