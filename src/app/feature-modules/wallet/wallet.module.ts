import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet/wallet.component';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { WalletService } from './wallet.service';
import { InitiatePaymentComponent } from './initiate-payment/initiate-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WalletPinChangeComponent } from './wallet-pin-change/wallet-pin-change.component';



@NgModule({
  declarations: [
    WalletComponent,
    InitiatePaymentComponent,
    WalletPinChangeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: WalletComponent },
      { path: 'initiate', component: InitiatePaymentComponent },
      { path: 'pinchange', component: WalletPinChangeComponent },
    ])
  ],
  providers: [WalletService]
})
export class WalletModule { }
