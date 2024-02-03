import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllServicesComponent } from './all-services/all-services.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/dynamic-form/shared.module';
import { BillPaymentComponent } from './bill-payment/bill-payment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RaiseComplaintComponent } from './raise-complaint/raise-complaint.component';
import { TrackComplaintComponent } from './track-complaint/track-complaint.component';
import { WalletService } from '../wallet/wallet.service';
import { BbpsService } from './bbps.service';



@NgModule({
  declarations: [
    AllServicesComponent,
    BillPaymentComponent,
    RaiseComplaintComponent,
    TrackComplaintComponent
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
    { path: 'service/:servicename', component: AllServicesComponent, },
    { path: 'raise-complaint', component: RaiseComplaintComponent, },
    { path: 'track-complaint', component: TrackComplaintComponent, }
    ])
  ],
  providers: [BbpsService, WalletService]
})
export class BbpsServicesModule { }
