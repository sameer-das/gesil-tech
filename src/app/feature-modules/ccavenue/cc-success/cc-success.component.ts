import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cc-success',
  templateUrl: './cc-success.component.html',
  styleUrls: ['./cc-success.component.scss']
})
export class CcSuccessComponent implements OnInit {

  constructor(private _route:ActivatedRoute, private _router:Router) { }

  tableData: any;
  ngOnInit(): void {
    this._route.queryParams.subscribe(x => {
      console.log(x)
      this.tableData =  x;
    })
  }

  goToWallet() {
    this._router.navigate(['wallet']);
  }
  /**
   * https://esebakendra.com/esk/paymentcc/ccsuccess?OrderInfo=order_id%3D36dd9431-bb58-4523-ba4a-ab79d6&tracking_id=112970700854&bank_ref_no=010799&order_status=Success&failure_message=&payment_mode=Debit%20Card&card_name=Visa%20Debit%20Card&status_code=null&status_message=SUCCESS&currency=INR&amount=10.00&billing_name=Sameer%20Kumar%20Das&billing_address=Plot%20No%20-%2059,%20Jagamara,%20Khandagiri&billing_city=Bhubaneswar&billing_state=Odisha&billing_zip=751030&billing_country=India&billing_tel=9658646979&billing_email=playsameer979@gmail.com&delivery_name=Sameer%20Kumar%20Das&delivery_address=Plot%20No%20-%2059,%20Jagamara,%20Khandagiri&delivery_city=Bhubaneswar&delivery_state=Odisha&delivery_zip=751030&delivery_country=India&delivery_tel=9658646979&merchant_param1=&merchant_param2=&merchant_param3=&merchant_param4=&merchant_param5=&vault=N&offer_type=null&offer_code=null&discount_value=0.0&mer_amount=10.00&eci_value=null&retry=N&response_code=0&billing_notes=&trans_date=12%2F08%2F2023%2014:01:35&bin_country=INDIA
   */


}
