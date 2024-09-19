import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { AddRecipientComponent } from './add-recipient/add-recipient.component';
import { AddSenderComponent } from './add-sender/add-sender.component';
import { DmtHomeComponent } from './dmt-home/dmt-home.component';
import { DmtService } from './dmt-service.service';
import { DmtTransactionComponent } from './dmt-transaction/dmt-transaction.component';
import { SendMoneyComponent } from './send-money/send-money.component';
import { DmtTransactionDetailsComponent } from './dmt-transaction-details/dmt-transaction-details.component';



@NgModule({
	declarations: [
		AddSenderComponent,
		AddRecipientComponent,
		SendMoneyComponent,
		DmtHomeComponent,
		DmtTransactionComponent,
		DmtTransactionDetailsComponent
	],
	imports: [
		CommonModule,
		MaterialModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule.forChild([
			{
				path: '', component: DmtHomeComponent,
				children: [
					{ path: 'dmttransactions', component: DmtTransactionComponent, },
					{ path: 'dmttransactions/:transid', component: DmtTransactionDetailsComponent, },
					{ path: 'send', component: SendMoneyComponent, },
					{ path: 'addrecipient', component: AddRecipientComponent, },
					{ path: 'addsender', component: AddSenderComponent, },
					// { path: '', pathMatch: 'full', redirectTo: 'dmttransactions' },
				],
				canActivate: []
			},
			// { path: 'dmttransactions/:transid', component: DmtTransactionDetailsComponent, }
		]),
	],
	providers: [DmtService]
})
export class DmtModule { }
