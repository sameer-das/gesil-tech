import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CCAvenueService } from '../ccavenue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { PopupService } from 'src/app/popups/popup.service';

@Component({
  selector: 'app-cc-main-page',
  templateUrl: './cc-main-page.component.html',
  styleUrls: ['./cc-main-page.component.scss']
})
export class CcMainPageComponent implements OnInit {

  constructor(private _ccService: CCAvenueService, 
    private _route: ActivatedRoute,
     private _router: Router,
     private _loaderService:LoaderService,
     private _popupService:PopupService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');

  amount: number = 0;
  redirect_url: string = `https://api.esebakendra.com/api/GSKRecharge/CCAvenueCallBack`;

  orderID!: string;

  encRequest: string = '';
  accessCode: string = 'AVDS96KH43AN04SDNA';
  // accessCode: string = 'AVAT91KG78BY05TAYB';

  ngOnInit(): void {
    this.orderID = uuidv4().slice(0, 30);
    this._route.queryParams.subscribe((param: any) => {
      console.log(param)

      // anything wrong in amount param go back
      if (!param || !('amount' in param) || param.amount === null || param.amount === undefined || param.amount.trim() === '' || +param.amount === 0) {
        this._router.navigate(['wallet/initiate']);
      }

      if (!new RegExp(/^[0-9]*(\.[0-9]{0,2})?$/).test(param.amount)) {
        this._router.navigate(['wallet/initiate']);
      }

      this.amount = param.amount;
    })
  }

  @ViewChild('form') form!: ElementRef;

  
  onProceed() {
    const billingDetails= `&billing_email=${this.currentUser.user.user_EmailID}&billing_tel=${this.currentUser.user.mobile_Number}`
    const request = `merchant_id=2689736&order_id=${this.orderID}&currency=INR&amount=${this.amount}&redirect_url=${this.redirect_url}&cancel_url=${this.redirect_url}&language=EN`;


    console.log(request+billingDetails);
    this._loaderService.showLoader();
    this._ccService.getEncryptedResponse(request+billingDetails).subscribe((resp) => {
      console.log(resp);
      this.encRequest = resp;

      setTimeout(() => {
        this._loaderService.hideLoader();
        this.form.nativeElement.submit();
      }, 500);
    }, (err) => {
      console.log('Error while fetching encrypted response from server')
      console.log(err)
      this._loaderService.hideLoader();
      this._popupService.openAlert({
        header:'Fail',
        message:'Error while fetching data. Please try again later.'
      })
    })
  }



}
