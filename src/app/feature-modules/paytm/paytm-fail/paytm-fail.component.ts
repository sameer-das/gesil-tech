import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paytm-fail',
  templateUrl: './paytm-fail.component.html',
  styleUrls: ['./paytm-fail.component.scss']
})
export class PaytmFailComponent implements OnInit {

  constructor(private _router:Router) { }

  ngOnInit(): void {
  }

  goToWallet(){
    this._router.navigate(['wallet']);
  }

}
