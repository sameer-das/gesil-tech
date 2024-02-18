import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ccavenue-mobile-status',
  templateUrl: './ccavenue-mobile-status.component.html',
  styleUrls: ['./ccavenue-mobile-status.component.scss']
})
export class CcavenueMobileStatusComponent implements OnInit {

  constructor(private _route:ActivatedRoute) { }
  tableData: any;
  ngOnInit(): void {
    this._route.queryParams.subscribe(x => {
      console.log(x)
      this.tableData =  x;
    })
  }


  goToWallet() {
    // (window as any).ReactNativeWebView.postMessage('go_back_to_wallet') 
    // console.log('Calling Android -> processHTML');
    (window as any).Android.processHTML('go_back_to_wallet');
  }

}
