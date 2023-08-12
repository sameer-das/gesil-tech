import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cc-fail',
  templateUrl: './cc-fail.component.html',
  styleUrls: ['./cc-fail.component.scss']
})
export class CcFailComponent implements OnInit {

  constructor(private _route:ActivatedRoute, private _router: Router) { }

  tableData: any;
  ngOnInit(): void {
    this._route.queryParams.subscribe(x => {
      console.log(x)
      this.tableData = x
    })
  }
  goToWallet() {
    this._router.navigate(['wallet']);
  }

  /**
   * https://esebakendra.com/esk/paymentcc/ccfail?OrderInfo=order_id%3D1bc85876-d890-444f-8b37-000a2e&tracking_id=112970905501&bank_ref_no=null&order_status=Aborted&failure_message=&payment_mode=null&card_name=null&status_code=&status_message=I%20wish%20to%20pay%20through%20another%20payment%20option.&currency=INR&amount=50.00&billing_name=&billing_address=&billing_city=&billing_state=&billing_zip=&billing_country=&billing_tel=&billing_email=&delivery_name=&delivery_address=&delivery_city=&delivery_state=&delivery_zip=&delivery_country=&delivery_tel=&merchant_param1=&merchant_param2=&merchant_param3=&merchant_param4=&merchant_param5=&vault=N&offer_type=null&offer_code=null&discount_value=0.0&mer_amount=50.00&eci_value=&retry=null&response_code=&billing_notes=&trans_date=null&bin_country=
   */

}
