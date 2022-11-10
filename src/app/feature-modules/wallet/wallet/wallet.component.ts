import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
