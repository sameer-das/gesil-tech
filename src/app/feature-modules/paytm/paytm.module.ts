import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaytmPaymentComponent } from './paytm-payment/paytm-payment.component';
import { RouterModule } from '@angular/router';
import { PaytmSuccessComponent } from './paytm-success/paytm-success.component';
import { PaytmFailComponent } from './paytm-fail/paytm-fail.component';



@NgModule({
  declarations: [
    PaytmPaymentComponent,
    PaytmSuccessComponent,
    PaytmFailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: PaytmPaymentComponent },
      { path: 'success', component: PaytmSuccessComponent },
      { path: 'fail', component: PaytmFailComponent },
    ])
  ]
})
export class PaytmModule { }
