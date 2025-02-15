import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DmtService } from '../dmt-service.service';
import { LoaderService } from 'src/app/services/loader.service';
import { finalize, first } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dmt-home',
  templateUrl: './dmt-home.component.html',
  styleUrls: ['./dmt-home.component.scss']
})
export class DmtHomeComponent implements OnInit  {
  constructor(private router:Router, private _dmtService:DmtService, 
    private _loaderService: LoaderService, private _location:Location,
    private _route:ActivatedRoute) { }

  // routes = [
  //   {route:'/dmtransfer/send', ind: 0},
  //   {route:'/dmtransfer/addrecipient', ind: 1},
  //   {route:'/dmtransfer/addsender', ind: 2},
  //   {route:'/dmtransfer/dmttransactions', ind: 3},
  // ]
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  ngOnInit(): void {
    console.log(this.router.url)
    // if(this.router.url === '/dmtransfer/addsender')
    //   this.showNav = false;

    this.getSenderinfo();
    this._dmtService.recipentAdd.subscribe((isAdded:boolean) => {
      if(isAdded){
        this.showAddSenderTab = false;
        this.router.navigate(['dmtransfer/addsender']);
      }
    }) 
  }
  activeIndex: number = 0;
  showAddSenderTab:boolean = false;



  getSenderinfo(){
    const payload = {
      "requestType": "SenderDetails",
      "senderMobileNumber": this.currentUser.user.mobile_Number,
      "txnType": "IMPS",
      "bankId": "FINO"
    }
    
    this._loaderService.showLoader()
    this._dmtService.getSenderInfo(payload)
    .pipe(first(), finalize(() => this._loaderService.hideLoader()))
    .subscribe({
      next: (resp:any) =>{
        console.log(resp)
        if(resp.code===200 && resp.status === 'Success' && (resp.resultDt.senderMobileNumber === 0 || !resp.resultDt.senderName)){
          this.router.navigate(['dmtransfer/addsender']);
          this.showAddSenderTab = true;
        } else {
          console.log(this._route)
          this.router.navigate(['dmtransfer/dmttransactions']);
        }
      }
    })
  }

  goBack() {
    this._location.back();
  }


  
}



