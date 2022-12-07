import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  constructor(private _walletService:WalletService, private _router: Router) { }
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

  addMoney(){
    this._router.navigate(['wallet/initiate']);
  }

}
