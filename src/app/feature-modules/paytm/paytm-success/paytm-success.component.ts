import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paytm-success',
  templateUrl: './paytm-success.component.html',
  styleUrls: ['./paytm-success.component.scss']
})
export class PaytmSuccessComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit(): void {
  }

  goToWallet(){
    this._router.navigate(['wallet']);
  }

}
