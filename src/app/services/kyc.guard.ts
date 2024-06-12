import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PopupService } from '../popups/popup.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class KycGuard implements CanActivate, CanActivateChild {

  constructor(private _authService: AuthService, private _popupService:PopupService, private _router: Router) {

  }  


  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // console.log(JSON.parse(localStorage.getItem('auth') || '{}').user.user_ID)
    return new Promise((resolve, reject) => {
      this._authService.getUserVerifiedAdharDetail(JSON.parse(localStorage.getItem('auth') || '{}').user.user_ID).subscribe({
        next: (resp:any) => {
          if(resp.status === 'Success' && resp.code === 200) {
            if(resp.data && JSON.parse(resp.data).data.aadhaar_number) {
              resolve(true)
            } else {
              resolve(false);
              this.showPopup();    
              this._router.navigate(['dashboard']);        
            }
          } else {
            resolve(false);
            this.showPopup();
            this._router.navigate(['dashboard']);   
          }
        }, error: (err) => {
          resolve(false);
          this.showPopup();
          this._router.navigate(['dashboard']);   
        }
      })

    })
  }


  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log('canActivate KYCGUARD')
    // console.log(JSON.parse(localStorage.getItem('auth') || '{}').user.user_ID)
    return new Promise((resolve, reject) => {
      this._authService.getUserVerifiedAdharDetail(JSON.parse(localStorage.getItem('auth') || '{}').user.user_ID).subscribe({
        next: (resp:any) => {
          if(resp.status === 'Success' && resp.code === 200) {
            if(resp.data && JSON.parse(resp.data).data.aadhaar_number) {
              resolve(true)
            } else {
              resolve(false);
              this.showPopup();    
              // this._router.navigate(['dashboard']);        
            }
          } else {
            resolve(false);
            this.showPopup();
            // this._router.navigate(['dashboard']);   
          }
        }, error: (err) => {
          resolve(false);
          this.showPopup();
          // this._router.navigate(['dashboard']);   
        }
      })

    })
  }
  

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // console.log(JSON.parse(localStorage.getItem('auth') || '{}').user.user_ID)
    const currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
    console.log(`canLoad KYCGUARD :: path ${route.path}, user ${currentUser.user.user_Type_ID}, type ${typeof currentUser.user.user_Type_ID}` )

    if([1,2].includes(currentUser.user.user_Type_ID)) {
      console.log('1,2')
      return this.checkKyc ();
    } else if ([3,4].includes(currentUser.user.user_Type_ID) && route.path === 'dmtransfer') {
      console.log('3,4')
      return this.checkKyc ();
    } else {
      this.showUserTypePopup (currentUser.user.user_Type_ID);
      return false;
    }


    
  }


  checkKyc (): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._authService.getUserVerifiedAdharDetail(JSON.parse(localStorage.getItem('auth') || '{}').user.user_ID).subscribe({
        next: (resp:any) => {
          if(resp.status === 'Success' && resp.code === 200) {
            if(resp.data && JSON.parse(resp.data).data.aadhaar_number) {
              resolve(true)
            } else {
              resolve(false);
              this.showPopup();    
              // this._router.navigate(['dashboard']);        
            }
          } else {
            resolve(false);
            this.showPopup();
            // this._router.navigate(['dashboard']);   
          }
        }, error: (err) => {
          resolve(false);
          this.showPopup();
          // this._router.navigate(['dashboard']);   
        }
      })

    })
  }


  showPopup () {
    this._popupService.openAlert({
      header:'Alert',
      message: 'Please update your e-KYC to proceed! To update the e-KYC please navigate to Update Profile tab under Account Menu'
    })
  }

  showUserTypePopup (userType:number) {
    this._popupService.openAlert({
      header:'Alert',
      message: `As a ${environment.USER_TYPE[userType]}, you are not authorized to use the service.`
    })
  }
 
  
}
