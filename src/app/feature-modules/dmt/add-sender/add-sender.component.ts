import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DmtService } from '../dmt-service.service';
import { PopupService } from 'src/app/popups/popup.service';
import { LoaderService } from 'src/app/services/loader.service';
import { finalize, first, tap } from 'rxjs';

@Component({
  selector: 'app-add-sender',
  templateUrl: './add-sender.component.html',
  styleUrls: ['./add-sender.component.scss']
})
export class AddSenderComponent implements OnInit {

  constructor(private _dmtService: DmtService, private _popupService: PopupService, private _loaderService: LoaderService) { }

  addSenderForm: FormGroup = new FormGroup({
    senderName: new FormControl('', Validators.required),
    senderMobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
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
      "senderMobileNumber": this.addSenderForm.value.senderMobile,
      "txnType": this.addSenderForm.value.transactionType,
      "senderName": this.addSenderForm.value.senderName,
      "senderPin": "654321"
    }
    this._loaderService.showLoader();
    this._dmtService.registerSenderInfo(payload)
      .pipe(first(),
        tap(x => console.log(x)),
        finalize(() => { this._loaderService.hideLoader() }))
      .subscribe({
        next: (resp: any) => {
          if (resp.code === 200 && resp.status === 'Success') {
            if (resp.resultDt.respDesc === 'Success' && resp.resultDt.senderMobileNumber) {
              // open modal
              this._popupService.openAlert({
                header: 'Success',
                message: 'Sender Added Successfully!'
              })
            } else {
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Error while adding sender!'
              })
            }
          }
        },
        error: (err: any) => {
          console.log(err)
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while adding sender!'
          })
        }
      })
  }
}
