import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-paytm-payment',
  templateUrl: './paytm-payment.component.html',
  styleUrls: ['./paytm-payment.component.scss']
})
export class PaytmPaymentComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _router: Router) { }
  _window: any = window as any;
  ngOnInit(): void {
    this._route.queryParams.subscribe((param) => {
      console.log(param)
      if (Object.keys(param)?.length === 0) {
        this._router.navigate(['wallet/initiate'])
        return;
      }

      this.showPaytm(param);

    })
  }


  showPaytm(transDetails: any) {
    console.log(transDetails)
    const config = {
      "root": "",
      "flow": "DEFAULT",
      "data": {
        "orderId": transDetails.orderId /* update order id */,
        "token": transDetails.txnToken /* update token value */,
        "tokenType": "TXN_TOKEN",
        "amount": transDetails.amount /* update amount */
      },
      "handler": {
        "notifyMerchant": function (eventName: any, data: any) {
          console.log("notifyMerchant handler function called");
          console.log("eventName => ", eventName);
          console.log("data => ", data);
        }
      }
    };

    if (this._window.Paytm && this._window.Paytm.CheckoutJS) {
      // initialze configuration using init method 
      this._window.Paytm.CheckoutJS.init(config).then(() => {
        // after successfully update configuration invoke checkoutjs
        this._window.Paytm.CheckoutJS.invoke();
      }).catch((error: any) => {
        console.log("error => ", error);
      });

    }
  }

}
