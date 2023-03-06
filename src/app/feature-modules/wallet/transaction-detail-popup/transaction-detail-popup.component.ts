import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-detail-popup',
  templateUrl: './transaction-detail-popup.component.html',
  styleUrls: ['./transaction-detail-popup.component.scss']
})
export class TransactionDetailPopupComponent implements OnInit {

  transdata : any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    // console.log(data)
    const trans = JSON.parse(data.wallet_transaction_Logfile);
    for(let k of Object.keys(trans)) {
      const obj:any = {};
      obj.key = k;
      obj.val = trans[k];
      this.transdata.push(obj)
    }


  }

  ngOnInit(): void {
    console.log(this.transdata)
  }

}
