import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/dynamic-form/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { WalletService } from '../wallet/wallet.service';
import { AllServicesComponent } from './all-services/all-services.component';
import { BbpsService } from './bbps.service';
import { BillPaymentComponent } from './bill-payment/bill-payment.component';



@NgModule({
  declarations: [
    AllServicesComponent,
    BillPaymentComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '', component: AllServicesComponent,
    },
    { path: 'payment/:transid', component: BillPaymentComponent, },
    { path: 'service/:servicename', component: AllServicesComponent, canActivate:[] },
    ])
  ],
  providers: [BbpsService, WalletService]
})
export class BbpsServicesModule { }
