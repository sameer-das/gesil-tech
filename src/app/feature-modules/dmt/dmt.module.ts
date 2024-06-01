import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSenderComponent } from './add-sender/add-sender.component';
import { AddRecipientComponent } from './add-recipient/add-recipient.component';
import { SendMoneyComponent } from './send-money/send-money.component';
import { DmtHomeComponent } from './dmt-home/dmt-home.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { DmtService } from './dmt-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WalletModule } from '../wallet/wallet.module';
import { DmtTransactionComponent } from './dmt-transaction/dmt-transaction.component';
import { KycGuard } from 'src/app/services/kyc.guard';



@NgModule({
  declarations: [
    AddSenderComponent,
    AddRecipientComponent,
    SendMoneyComponent,
    DmtHomeComponent,
    DmtTransactionComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    WalletModule,
    RouterModule.forChild([
      {
        path: '', component: DmtHomeComponent,
        children: [
          { path: 'dmttransactions', component: DmtTransactionComponent, },
          { path: 'send', component: SendMoneyComponent, },
          { path: 'addrecipient', component: AddRecipientComponent, },
          { path: 'addsender', component: AddSenderComponent, },
          { path: '', pathMatch: 'full', redirectTo: 'dmttransactions' },
        ],
        canActivateChild: []
      }])
  ],
  providers: [DmtService]
})
export class DmtModule { }
