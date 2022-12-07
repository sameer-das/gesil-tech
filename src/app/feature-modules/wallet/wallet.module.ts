import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet/wallet.component';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { WalletService } from './wallet.service';
import { InitiatePaymentComponent } from './initiate-payment/initiate-payment.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    WalletComponent,
    InitiatePaymentComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: WalletComponent },
      { path: 'initiate', component: InitiatePaymentComponent },
    ])
  ],
  providers: [WalletService]
})
export class WalletModule { }
