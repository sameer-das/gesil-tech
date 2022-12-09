import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { WalletService } from '../wallet.service';
@Component({
  selector: 'app-initiate-payment',
  templateUrl: './initiate-payment.component.html',
  styleUrls: ['./initiate-payment.component.scss']
})
export class InitiatePaymentComponent implements OnInit {

  constructor(private _router: Router, private _walletService: WalletService) { }
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

    this._walletService.getPaymentTransactionId({
      "exchangeRate": "",
      "transactionAmount": amount,
      "userId": userId,
      "orderId": orderId,
      "serviceId": 0,
      "categoryId": 0
    }).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.code === 200 && resp.status === 'Success' && resp?.resultDt?.body?.txnToken) {
          this._router.navigate(['payment'],
            { queryParams: { orderId, userId, amount, txnToken: resp?.resultDt?.body?.txnToken } })
        } else {
        }
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }

}
