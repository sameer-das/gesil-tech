import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, first, tap } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';
import { LoaderService } from 'src/app/services/loader.service';
import { DmtService } from '../dmt-service.service';


@Component({
  selector: 'app-add-recipient',
  templateUrl: './add-recipient.component.html',
  styleUrls: ['./add-recipient.component.scss']
})
export class AddRecipientComponent implements OnInit {

  constructor(private _dmtService: DmtService,
    private _loaderService: LoaderService, private _popupService: PopupService, private _router:Router) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  allBanks: any[] = [];
  ngOnInit(): void {
    this.getAllDMTBanks();

  }
  /**
   * confirmAccountNumber: new FormControl('', { validators: [Validators.required, Validators.pattern('^[0-9]*$')], updateOn: 'blur' }),
      ifsc: new FormControl('', { validators: [Validators.required, Validators.pattern('^[0-9a-zA-Z]+$')] }),
      amount: new FormControl('', { validators: [Validators.required, Validators.pattern('^[0-9]*(\.[0-9]{0,2})?$')] }),
   */
  addRecipientForm: FormGroup = new FormGroup({
    recipientFullName: new FormControl('', Validators.required),
    recipientMobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
    transactionType: new FormControl('', Validators.required),
    bank: new FormControl('', Validators.required),
    accountNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    confirmAccountNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    ifsc: new FormControl('', [Validators.required, Validators.pattern('^[0-9a-zA-Z]+$')]),
  })

  get f(): { [key: string]: AbstractControl } {
    return this.addRecipientForm.controls
  }

  onSubmitForm(): void {
    console.log(this.addRecipientForm)

    const payload = {
      "requestType": "RegRecipient",
      "senderMobileNumber": this.currentUser.user.mobile_Number,
      "txnType": this.addRecipientForm.value.transactionType,
      "recipientName": this.addRecipientForm.value.recipientFullName,
      "recipientMobileNumber": this.addRecipientForm.value.recipientMobile,
      "bankCode": this.addRecipientForm.value.bank,
      "bankAccountNumber": this.addRecipientForm.value.accountNumber,
      "ifsc": this.addRecipientForm.value.ifsc
    }
    this._loaderService.showLoader();
    this._dmtService.registerRecipient(payload)
      .pipe(first(),
        tap(x => console.log(x)),
        finalize(() => { this._loaderService.hideLoader() }))
      .subscribe({
        next: (resp: any) => {
          // code goes here
          if (resp.status === 'Success' && resp.code === 200) {
            if (resp.resultDt.responseReason === 'Successful' && resp.resultDt.responseCode == 0) {
              this._popupService.openAlert({
                header: 'Success',
                message: 'Recipient added successfully!'
              });
              this.addRecipientForm.reset({
                recipientFullName: '',
                recipientMobile: '',
                transactionType: '',
                bank: '',
                accountNumber: '',
                confirmAccountNumber: '',
                ifsc: ''
              });
              Object.keys(this.addRecipientForm.controls).forEach(key => {
                (this.addRecipientForm.get(key) as FormControl).setErrors(null);
              });

              
            } else {
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Error while adding recipient!'
              })
            }
          }
        },
        error: (err) => {
          console.log(err);
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while adding recipient!'
          })
        }
      })
  }

  getAllDMTBanks() {
    this._loaderService.showLoader();
    this._dmtService.getAllBank()
      .pipe(first(), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: any) => {
          if (resp.status === "Success" && resp.code === 200) {
            this.allBanks = resp?.data?.bankList?.bankInfoArray;
          }
        }, error: (err) => {
          console.log('error while fetching bank list');
          console.log(err);
        }
      })
  }
}
