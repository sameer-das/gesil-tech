import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllServicesComponent } from './all-services/all-services.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/dynamic-form/shared.module';
import { BillPaymentComponent } from './bill-payment/bill-payment.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AllServicesComponent,
    BillPaymentComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '', component: AllServicesComponent,
    },
    { path: 'payment/:transid', component: BillPaymentComponent, },
    { path: 'service/:servicename', component: AllServicesComponent, }
    ])
  ]
})
export class BbpsServicesModule { }
