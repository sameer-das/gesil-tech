import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  constructor(private _walletService:WalletService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  currentBalance: string = 'XXXXXX'
  ngOnInit(): void {
    this._walletService.getWalletBalance(this.currentUser.user.user_EmailID).subscribe({
      next: (resp:any) => {
        console.log(resp);
        if(resp.status === 'Success' && resp.code === 200){
          this.currentBalance = resp.data
        } else {
          this.currentBalance = 'Error'
        }
      
      },
      error: (err:any) => {
        console.log(err);
        this.currentBalance = 'Error fetching the balance'
      }
    })
  }

}


@Component({
  selector: 'app-wallet2',
  template: 'Wallet 2 works',
  // styleUrls: ['./wallet.component.scss']
})
export class Wallet2Component implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
