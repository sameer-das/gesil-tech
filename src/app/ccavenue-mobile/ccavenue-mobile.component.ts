import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { CCAvenueService } from '../feature-modules/ccavenue/ccavenue.service';
@Component({
  selector: 'app-ccavenue-mobile',
  templateUrl: './ccavenue-mobile.component.html',
  styleUrls: ['./ccavenue-mobile.component.scss']
})
export class CcavenueMobileComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private _ccService: CCAvenueService) { }

  paramData!: any;
  message: string = 'Dont press back or close the application!';
  showOnError: boolean = false;
  ngOnInit(): void {
    this._route.queryParams.subscribe((param: any) => {
      this.paramData = param;

      if (!param || !('amount' in param) || param.amount === null || param.amount === undefined || param.amount.trim() === '' || +param.amount === 0) {
        this.onGoBack();
        return;
      }

      if (!new RegExp(/^[0-9]*(\.[0-9]{0,2})?$/).test(param.amount)) {
        this.onGoBack()
        return;
      }

      if(!param.email || !param.amount || !param.amount || !param.redirectUrl || !param.mobile) {
        this.showOnError = true;
        this.message = 'One or more Parameters are not found - ' + JSON.stringify(param);
        return;
      }

      this.onProceed();
    })
  }

  encRequest: string = '';
  accessCode: string = 'AVDS96KH43AN04SDNA';
  // accessCode: string = 'AVAT91KG78BY05TAYB';

  @ViewChild('form') form!: ElementRef;
  onProceed() {
    const billingDetails = `&billing_email=${this.paramData.email}&billing_tel=${this.paramData.mobile}`
    const request = `merchant_id=2689736&order_id=${uuidv4().slice(0, 30)}&currency=INR&amount=${this.paramData.amount}&redirect_url=${this.paramData.redirectUrl}&cancel_url=${this.paramData.redirectUrl}&language=EN&merchant_param1=mob`;

    this.message = 'Encrypting your data ...'
    const data = request + billingDetails;
    console.log(data)
    this._ccService.getEncryptedResponse(data).subscribe((resp) => {
      this.encRequest = resp;
      console.log(resp)
      setTimeout(() => {
        this.form.nativeElement.submit();
      }, 500);
    }, (err) => {
      console.log(err)
      this.showOnError = true;
      this.message = JSON.stringify(err);
    })
  }

  onGoBack() {
    (window as any).ReactNativeWebView.postMessage('go_back_from_start_page');
  }
}
