import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { WalletService } from '../wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  constructor(private _walletService:WalletService, private _router: Router, private _loaderService:LoaderService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  currentBalance: string = 'XXXXXX'
  ngOnInit(): void {
    this._loaderService.showLoader();
    this._walletService.getWalletBalance(this.currentUser.user.user_EmailID).subscribe({
      next: (resp:any) => {
        this._loaderService.hideLoader();
        console.log(resp);
        if(resp.status === 'Success' && resp.code === 200){
          this.currentBalance = resp.data
        } else {
          this.currentBalance = 'Error'
        }
      
      },
      error: (err:any) => {
        this._loaderService.hideLoader();
        console.log(err);
        this.currentBalance = 'Error fetching the balance'
      }
    })
  }

  addMoney(){
    this._router.navigate(['wallet/initiate']);
  }

}
