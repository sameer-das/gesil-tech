import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSenderComponent } from './add-sender/add-sender.component';
import { AddRecipientComponent } from './add-recipient/add-recipient.component';
import { SendMoneyComponent } from './send-money/send-money.component';
import { DmtHomeComponent } from './dmt-home/dmt-home.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { DmtService } from './dmt-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DmtAuthGuardService } from './dmt-auth-guard.service';



@NgModule({
  declarations: [
    AddSenderComponent,
    AddRecipientComponent,
    SendMoneyComponent,
    DmtHomeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '', component: DmtHomeComponent,
        children: [
          { path: 'send', component: SendMoneyComponent, },
          { path: 'addrecipient', component: AddRecipientComponent, },
          { path: 'addsender', component: AddSenderComponent, },
          { path: '', pathMatch: 'full', redirectTo: 'send' },
        ]
      }])
  ],
  providers: [DmtService, DmtAuthGuardService]
})
export class DmtModule { }
