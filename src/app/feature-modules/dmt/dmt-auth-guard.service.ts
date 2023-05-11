import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, finalize, first } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { DmtService } from './dmt-service.service';


@Injectable()
export class DmtAuthGuardService implements CanActivate {
  constructor(private router: Router, private _loaderService: LoaderService, private _dmtService: DmtService) { }


  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');


  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const payload = {
      "requestType": "SenderDetails",
      "senderMobileNumber": this.currentUser.user.mobile_Number,
      "txnType": "IMPS"
    }

    this._loaderService.showLoader();
    return new Observable((observer) => {
      this._dmtService.getSenderInfo(payload)
        .pipe(first(), finalize(() => this._loaderService.hideLoader()))
        .subscribe({
          next: (resp: any) => {
            console.log(resp)
            if (resp.code === 200 && resp.status === 'Success' && (resp.resultDt.senderMobileNumber === 0 || resp.resultDt.responseCode != 0)) {
              this.router.navigate(['dmtransfer/addsender']);
              observer.next(false);
            } else {
              //sender exists
              observer.next(true);
            }
          },
          error: (err) => {
            console.log('error calling verify sender')
            console.log(err);
            observer.next(false)
          },
          complete: () => {
            this._loaderService.hideLoader();
            observer.complete();
          }
        })
    })

  }



}