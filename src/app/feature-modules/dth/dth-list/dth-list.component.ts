import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { switchMap, tap } from 'rxjs';
import { BbpsService } from 'src/app/services/bbps.service';

@Component({
  selector: 'app-dth-list',
  templateUrl: './dth-list.component.html',
  styleUrls: ['./dth-list.component.scss']
})
export class DthListComponent implements OnInit {

  constructor(private _bbpsService: BbpsService) { }
  @ViewChild('operator', { static: true }) operator!: MatSelect;
  operators: any[] = [];


  ngOnInit(): void {
    this.operator.selectionChange.pipe(
      switchMap(x => this._bbpsService.getBillerInfo(x.value))
    ).subscribe((billerDetailsResp: any) => {
      console.log(billerDetailsResp)
      if(billerDetailsResp.status === 'Success' && billerDetailsResp.code === 200 && billerDetailsResp?.resultDt?.biller.length > 0) {
          console.log(billerDetailsResp?.resultDt?.biller[0].billerInputParams.paramInfo);
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


}
