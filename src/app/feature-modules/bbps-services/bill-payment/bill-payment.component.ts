import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bill-payment',
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.scss']
})
export class BillPaymentComponent implements OnInit {
  state: any;
  billerDetails: any;
  resp: any;
  paymentDetails: any;
  now = new Date().toLocaleString();
  transid!: string;
  constructor(private _router: Router, private _route: ActivatedRoute) {
    console.log(this._router.getCurrentNavigation()?.extras.state);
    this._route.params.subscribe((params: any) => {
      console.log(params);
      this.transid = params.transid;
      console.log(this.transid)
      this.state = this._router.getCurrentNavigation()?.extras?.state || JSON.parse(sessionStorage.getItem(`TRANS_${params.transid}`) || '{}');
      console.log(this.state)
    })

  }
  ngOnInit(): void {
    this.billerDetails = this.state.billerDetails;
    this.paymentDetails = this.state.payBill;
    this.resp = this.state.resp;
  }

  goBack():void {
    this._router.navigate([this.state.currentServiceUrl]);
    sessionStorage.removeItem(`TRANS_${this.transid}`);
  }
}
