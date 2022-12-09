import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormControlName } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap, Subscription } from 'rxjs';
import { BbpsService } from 'src/app/services/bbps.service';

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.component.html',
  styleUrls: ['./all-services.component.scss']
})
export class AllServicesComponent implements OnInit, OnDestroy {

  serviceName!: string;
  serviceCatId!: string;
  serviceId!: string;
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  constructor(private _bbpsService: BbpsService, private _router: Router, private _route: ActivatedRoute) {
    this._route.params.subscribe((params: any) => {
      console.log(params);
      this.serviceName = params.servicename;
    });

    console.log(this._router.getCurrentNavigation()?.extras.state)
    if(this._router.getCurrentNavigation()?.extras.state) {
      sessionStorage.setItem('current_service', JSON.stringify(this._router.getCurrentNavigation()?.extras.state));
    }

    const current_service_details = JSON.parse(sessionStorage.getItem('current_service') || '{}');
    if(Object.keys(current_service_details).length === 0) {
      // If services_Cat_ID and services_ID not found go back to dashboard
      this._router.navigate(['dashboard']);
    } else {
      this.serviceCatId = current_service_details.services_Cat_ID;
      this.serviceId = current_service_details.services_ID;
    }

  }
  ngOnDestroy(): void {
    if(this.getBillerdByCategorySubscription)
      this.getBillerdByCategorySubscription.unsubscribe();
    if(this.getBillerInfoSubscription)
      this.getBillerInfoSubscription.unsubscribe()
  }

  // @ViewChild('servicesSelectBox', { static: true }) servicesSelectBox!: MatSelect;
  @ViewChild('billerSelectBox', { static: true }) billerSelectBox!: MatSelect;

  servicesSelectBox: FormControl = new FormControl();

  billers: any[] = [];
  billerId!: string;
  biller: any = {};
  params: any[] = [];

  billerResponse: any;
  additionalInfo: any;
  requestID!: string;
  inputParam!: any[];
  billerPaymentModes: string[] = [];
  paymentMode: string = '';


  isBillFetching: boolean = false;
  
  getBillerdByCategorySubscription!: Subscription;
  getBillerInfoSubscription!: Subscription;
  
  onServiceChange(e: MatSelectChange) {
    console.log(e)
  }

  ngOnInit(): void {

    if(!this.serviceName) {

      this.getBillerdByCategorySubscription = this.servicesSelectBox?.valueChanges.pipe(
          tap(() => this.billers = []),
          switchMap((x: string) => this._bbpsService.getBillerdByCategory(x))
        ).subscribe((resp: any) => {
          console.log(resp)
          if (resp.status === 'Success' && resp.code === 200) {
            this.billers = resp.resultDt;
            this.billers.push({ blr_id: 'OTME00005XXZ43', blr_name: 'OTME' })
          }
        })
    } else {
      const searchValue = this.allServices.filter((s:any) =>  s.path === this.serviceName);
      if(searchValue.length > 0) {

        console.log(searchValue);
        this.getBillerdByCategorySubscription = this._bbpsService.getBillerdByCategory(searchValue[0].searchValue)
        .subscribe((resp: any) => {
          console.log(resp)
          if (resp.status === 'Success' && resp.code === 200) {
            this.billers = resp.resultDt;
            this.billers.push({ blr_id: 'OTME00005XXZ43', blr_name: 'OTME' })
          }
        })
      } else {
        this._router.navigate(['dashboard'])
      }
    }


   this.getBillerInfoSubscription =  this.billerSelectBox?.selectionChange.pipe(
      tap(x => {
        this.billerId = x.value.blr_id;
        this.biller = x.value;
        this.billerResponse = undefined;
        console.log(this.biller);

      }),
      switchMap(x => this._bbpsService.getBillerInfo(x.value.blr_id))
    ).subscribe((billerDetailsResp: any) => {
      console.log(billerDetailsResp)
      if (billerDetailsResp.status === 'Success' && billerDetailsResp.code === 200 && billerDetailsResp?.resultDt?.biller.length > 0) {

        console.log(billerDetailsResp?.resultDt?.biller[0].billerInputParams.paramInfo);
        this.params = billerDetailsResp?.resultDt?.biller[0].billerInputParams.paramInfo;
        this.billerPaymentModes = billerDetailsResp?.resultDt?.biller[0].billerPaymentModes.split(',');

      } else {
        this.params = []
      }
    })
  }


  allServices: any[] = [    
    {path:'landline-postpaid',searchValue:'Landline Postpaid',},
    {path:'water',searchValue:'Water',},
    {path:'insurance',searchValue:'Insurance',},
    {path:'hospital',searchValue:'Hospital',},
    {path:'electricity',searchValue:'Electricity',},
    {path:'health-insurance',searchValue:'Health Insurance',},
    {path:'mobile-postpaid',searchValue:'Mobile Postpaid',},
    {path:'fasttag',searchValue:'Fastag',},
    {path:'gas',searchValue:'Gas',},
    {path:'subscription',searchValue:'Subscription',},
    {path:'housing-society',searchValue:'Housing Society',},
    {path:'cable-tv',searchValue:'Cable TV',},
    {path:'broadband-postpaid',searchValue:'Broadband Postpaid',},
    {path:'lpg-gas',searchValue:'LPG Gas',},
    {path:'municipal-services',searchValue:'Municipal Services',},
    {path:'loan-repayment',searchValue:'Loan Repayment',},
    {path:'life-insurance',searchValue:'Life Insurance',},
    {path:'credit-card',searchValue:'Credit Card',},
    {path:'municipal-taxes',searchValue:'Municipal Taxes',},
    {path:'dth',searchValue:'DTH',},
    {path:'education-fees',searchValue:'Education Fees',},
  ]


  billFetch(e: any) {
    console.log(e);
    const input = [];

    for (let k in e) {
      input.push({
        "paramName": k,
        "paramValue": e[k]
      });
    }

    this.inputParam = input;
    const fetchBill = {
      "agentId": "CC01CC01513515340681",
      "agentDeviceInfo": {
        "ip": "192.168.2.73",
        "initChannel": "AGT",
        "mac": "01-23-45-67-89-ab"
      },
      "customerInfo": {
        "customerMobile": "9898990084",
        "customerEmail": "rajiraju9279@gmail.com",
        "customerAdhaar": "",
        "customerPan": ""
      },
      "billerId": this.billerId,
      "inputParams": {
        "input": [...input]
      }
    }
    console.log(fetchBill);
    this.isBillFetching = true;
    this._bbpsService.fetchBill(fetchBill).subscribe({
      next: (resp: any) => {
        this.isBillFetching = false;
        console.log(resp)
        if (resp.status === 'Success' && resp.code === 200) {
          console.log(resp?.resultDt.requestID);
          console.log(resp?.resultDt.data);
          this.requestID = resp?.resultDt.requestID;
          this.billerResponse = resp?.resultDt.data?.billerResponse;
          this.additionalInfo = resp?.resultDt.data?.additionalInfo;
        }
      },
      error: (err) => {
        this.isBillFetching = false;
        console.log(err)
      }
    })
  }



  billPay() {
    const payBill = {
      "agentId": "CC01CC01513515340681",
      "billerAdhoc": true,
      "agentDeviceInfo": {
        "ip": "192.168.2.73",
        "initChannel": "AGT",
        "mac": "01-23-45-67-89-ab"
      },
      "customerInfo": {
        "customerMobile": "9898990084",
        "customerEmail": "rajiraju9279@gmail.com",
        "customerAdhaar": "",
        "customerPan": ""
      },
      "billerId": this.billerId,
      "inputParams": {
        "input": [
          ...this.inputParam
        ]
      },
      "billerResponse": this.billerResponse,
      "additionalInfo": this.additionalInfo,
      "amountInfo": {
        "amount": +this.billerResponse.billAmount,
        "currency": 356,
        "custConvFee": 0,
        "amountTags": [

        ]
      },
      "paymentMethod": {
        "paymentMode": "Cash",//this.paymentMode.trim(),
        "quickPay": "N",
        "splitPay": "N"
      },
      "paymentInfo": {
        "info": [
          {
            "infoName": "Remarks",
            "infoValue": "Received"
          }
        ]
      }
    }

    console.log(payBill);
    this._bbpsService.payBill(this.requestID, payBill, this.serviceCatId, this.serviceId,this.currentUser.user.user_EmailID).subscribe((resp: any) => {
      console.log(resp);
      sessionStorage.setItem(`TRANS_${resp.resultDt.txnRefId}`, JSON.stringify({ payBill: payBill, billerDetails: this.biller, resp }))
      this._router.navigate([`bbps/payment/${resp.resultDt.txnRefId}`], {
        state: { payBill: payBill, billerDetails: this.biller, resp }
      });
    })

  }


  onPaymentModeChange(e: MatSelectChange) {
    console.log(e.value)
    this.paymentMode = e.value;
  }
}
