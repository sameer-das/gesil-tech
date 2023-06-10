import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { TransactionDetailPopupComponent } from '../transaction-detail-popup/transaction-detail-popup.component';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  constructor(private _walletService: WalletService, 
    private _router: Router, 
    private _loaderService: LoaderService,
    private _matDialog: MatDialog) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  currentBalance: string = 'XXXXXX';
  commissionBalance: string = 'XXXXXX';

  ngOnInit(): void {
    this.getTransHistory();
    this._loaderService.showLoader();
    this._walletService.getWalletBalance(this.currentUser.user.user_EmailID).subscribe({
      next: (resp: any) => {
        this._loaderService.hideLoader();
        console.log(resp);
        if (resp.status === 'Success' && resp.code === 200) {
          const [walletBalance, commission] = resp.data.split(',');
          this.currentBalance = walletBalance;
          this.commissionBalance = commission;
        } else {
          this.currentBalance = 'Error'
        }

      },
      error: (err: any) => {
        this._loaderService.hideLoader();
        console.log(err);
        this.currentBalance = 'Error fetching the balance'
      }
    })
  }

  addMoney() {
    this._router.navigate(['wallet/initiate']);
  }

  lastTransaction: any[] = [];
  getTransHistory() {
    this._walletService.getTransactionHistory(this.currentUser.user.user_EmailID).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.status === 'Success' && resp.code === 200 && resp.data?.length > 0)
          this.lastTransaction = resp.data
          .map((trans: any) => {
            return { ...trans, wallet_transaction_Date: new Date(trans.wallet_transaction_Date) }
          });
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  openTransactionDetailPopup(trans: any) {
    // console.log(trans)
    this._matDialog.open(TransactionDetailPopupComponent, {data: trans})
  }

}
