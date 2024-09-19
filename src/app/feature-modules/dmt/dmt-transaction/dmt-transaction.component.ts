import { Component, OnDestroy, OnInit } from '@angular/core';
import { DmtService } from '../dmt-service.service';
import { MatSelectChange } from '@angular/material/select';
import { LoaderService } from 'src/app/services/loader.service';
import { finalize, first, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
	selector: 'app-dmt-transaction',
	templateUrl: './dmt-transaction.component.html',
	styleUrls: ['./dmt-transaction.component.scss']
})
export class DmtTransactionComponent implements OnInit, OnDestroy {


	currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
	transStatusFilterValue: string = "1";
	dmtTransactions: any[] = [];
	templateBoundTransactions: any[] = [];
	$destroy: Subject<boolean> = new Subject();



	constructor(private _dmtService: DmtService, 
		private _loaderService: LoaderService,
		private _router:Router
	) { }



	ngOnInit(): void {
		this.getTransactions()
	}



	ngOnDestroy(): void {
		this.$destroy.next(true);
	}





	getTransactions() {
		this._loaderService.showLoader()
		this._dmtService.getTransactionHistory(this.currentUser.user.user_EmailID)
			.pipe(takeUntil(this.$destroy), finalize(() => this._loaderService.hideLoader()))
			.subscribe({
				next: (resp: any) => {
					// console.log(resp)
					if (resp.status === 'Success' && resp.code === 200) {
						this.dmtTransactions = resp.data.filter((trans: any) => trans.wallet_transaction_recall === "BBPS Fund Transfer")
						console.log(this.dmtTransactions);
						this.templateBoundTransactions = this.dmtTransactions;
					}
				}, error: (err: any) => {
					console.log(err);
					this.dmtTransactions = [];
					this.templateBoundTransactions = [];
				}
			})
	}



	getStatusClass(transStatus: string) {
		return {
			success: transStatus === 'TXN_SUCCES',
			fail: transStatus === 'TXN_FAIL'
		}
	}



	onTransStatusFilterValueChange(e: MatSelectChange) {
		if (e.value === '1') {
			this.templateBoundTransactions = this.dmtTransactions;
		} else if (e.value === '2') {
			this.templateBoundTransactions = this.dmtTransactions.filter((trans: any) => trans.wallet_transaction_Status === 'TXN_SUCCES')
		} else if (e.value === '3') {
			this.templateBoundTransactions = this.dmtTransactions.filter((trans: any) => trans.wallet_transaction_Status === 'TXN_FAIL')
		}

	}



	initiateTransaction(trans: any) {
		console.log(trans);
		const payload = {
			"agentId": environment.BBPS_AGENT_ID,
			"initChannel": "AGT",
			"requestType": "TxnRefund",
			"txnId": trans.asdf
		};

		const userId = this.currentUser.user.user_EmailID;
		const current_service_details = JSON.parse(sessionStorage.getItem('current_service') || '{}');
		const serviceCatId = current_service_details.services_Cat_ID;
		const serviceId = current_service_details.services_ID;
		this._router.navigate(['dmtransfer', 'dmttransactions',trans.wallet_transaction_ID])
		// return;
		// this._loaderService.showLoader();

		// this._dmtService.dmtFundTransfer(payload, serviceId, serviceCatId, userId)
		// 	.pipe(
		// 		takeUntil(this.$destroy),
		// 		finalize(() => this._loaderService.hideLoader())
		// 	)
		// 	.subscribe({
		// 		next: (resp: any) => {
		// 			if (resp.code === 200 && resp.status === 'Success') {

		// 			} else {

		// 			}


		// 		},
		// 		error: (err: any) => {
		// 			console.log(err);

		// 		}
		// 	})
	}
}
