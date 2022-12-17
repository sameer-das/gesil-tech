import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { switchMap, tap } from 'rxjs';
import { BbpsService } from 'src/app/feature-modules/bbps-services/bbps.service';


@Component({
  selector: 'app-dth-list',
  templateUrl: './dth-list.component.html',
  styleUrls: ['./dth-list.component.scss']
})
export class DthListComponent implements OnInit {

  constructor(private _bbpsService: BbpsService) { }
  @ViewChild('operator', { static: true }) operator!: MatSelect;
  operators: any[] = [];
  params!: any[];
  billerId!: string;

  ngOnInit(): void {
    this.operator.selectionChange.pipe(
      tap(x => this.billerId = x.value),
      switchMap(x => this._bbpsService.getBillerInfo(x.value))
    ).subscribe((billerDetailsResp: any) => {
      console.log(billerDetailsResp)
      if (billerDetailsResp.status === 'Success' && billerDetailsResp.code === 200 && billerDetailsResp?.resultDt?.biller.length > 0) {

        console.log(billerDetailsResp?.resultDt?.biller[0].billerInputParams.paramInfo);
        this.params = billerDetailsResp?.resultDt?.biller[0].billerInputParams.paramInfo;
      } else {
        this.params = []
      }
    })

    this._bbpsService.getBillerdByCategory('dth').subscribe({
      next: (resp: any) => {
        // console.log(resp)
        if (resp.status === 'Success' && resp.code === 200) {
          this.operators = resp.resultDt;
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }


  onFromSubmit(e: any) {
    console.log(e);
    const input = [];

    for (let k in e) {
      input.push({
        "paramName": k,
        "paramValue": e[k]
      });
    }

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

    this._bbpsService.fetchBill(fetchBill).subscribe({
      next: (resp) => {
        console.log(resp)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }




}
