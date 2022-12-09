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
  constructor(private _bbpsService: BbpsService, private _router: Router, private _route: ActivatedRoute) {
    this._route.params.subscribe((params: any) => {
      console.log(params);
      this.serviceName = params.servicename;
    });
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
      this.getBillerdByCategorySubscription = this._bbpsService.getBillerdByCategory(this.serviceName)
      .subscribe((resp: any) => {
        console.log(resp)
        if (resp.status === 'Success' && resp.code === 200) {
          this.billers = resp.resultDt;
          this.billers.push({ blr_id: 'OTME00005XXZ43', blr_name: 'OTME' })
        }
      })
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


  allServices: string[] = [
    'Landline Postpaid',
    'Water',
    'Insurance',
    'Hospital',
    'Electricity',
    'Health Insurance',
    'Mobile Postpaid',
    'Fastag',
    'Gas',
    'Subscription',
    'Housing Society',
    'Cable TV',
    'Broadband Postpaid',
    'LPG Gas',
    'Municipal Services',
    'Loan Repayment',
    'Life Insurance',
    'Credit Card',
    'Municipal Taxes',
    'DTH',
    'Education Fees',
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
    this._bbpsService.payBill(this.requestID, payBill).subscribe((resp: any) => {
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
