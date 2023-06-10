import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { WalletService } from '../wallet.service';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { LoaderService } from 'src/app/services/loader.service';
import { PopupService } from 'src/app/popups/popup.service';
import { first } from 'rxjs';
@Component({
  selector: 'app-initiate-payment',
  templateUrl: './initiate-payment.component.html',
  styleUrls: ['./initiate-payment.component.scss']
})
export class InitiatePaymentComponent implements OnInit {

  constructor(private _router: Router, private _walletService: WalletService, 
    private _loaderService: LoaderService, private _popupService: PopupService) { }
  amount: string = '';
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  ngOnInit(): void {
  }

  onFormSubmit() {
    // 

    this.getPaymentTransactionId();
  }


  getPaymentTransactionId() {
    const orderId = uuidv4();
    const userId = this.currentUser.user.user_EmailID;
    const amount = this.amount;

    console.log(orderId, userId, amount)
    this._loaderService.showLoader();
    this._walletService.getPaymentTransactionId({
      "exchangeRate": "",
      "transactionAmount": amount,
      "userId": userId,
      "orderId": orderId,
      "serviceId": 0,
      "categoryId": 0
    })
    .pipe(first())
    .subscribe({
      next: (resp: any) => {
        console.log(resp);
        this._loaderService.hideLoader();
        if (resp.code === 200 && resp.status === 'Success' && resp?.resultDt?.body?.txnToken) {
          this._router.navigate(['payment'],
            { queryParams: { orderId, userId, amount, txnToken: resp?.resultDt?.body?.txnToken } })
        } else {
          this._popupService.openAlert({
            header: 'Fail',
            message:'Something went wrong while initiating the transaction. Please contact support!',
          })
        }
      },
      error: (err: any) => {
        this._loaderService.hideLoader();
        console.log(err);
        this._popupService.openAlert({
          header: 'Fail',
          message:'Something went wrong while initiating the transaction. Please contact support!',
        })
      }
    })
  }

}
