import { Component, OnInit } from '@angular/core';
import { DmtService } from '../dmt-service.service';
import { MatSelectChange } from '@angular/material/select';
import { LoaderService } from 'src/app/services/loader.service';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-dmt-transaction',
  templateUrl: './dmt-transaction.component.html',
  styleUrls: ['./dmt-transaction.component.scss']
})
export class DmtTransactionComponent implements OnInit {

  constructor(private _dmtService: DmtService, private _loaderService: LoaderService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  transStatusFilterValue: string = "1";
  ngOnInit(): void {
    this.getTransactions()
  }
  dmtTransactions: any[] = [];
  templateBoundTransactions: any[] = [];

  getTransactions() {
    this._loaderService.showLoader()
    this._dmtService.getTransactionHistory(this.currentUser.user.user_EmailID)
      .pipe(first(), finalize(() => this._loaderService.hideLoader()))
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
  }
}
