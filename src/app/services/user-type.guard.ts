import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PopupService } from '../popups/popup.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserTypeGuard implements CanActivate, CanLoad {

  constructor(private _popupService: PopupService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): boolean {
    const currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
    if (currentUser.user.user_Type_ID in [1, 2]) {
      return true;
    } else if (currentUser.user.user_Type_ID in [3, 4] && route.path?.includes('dmtranfer')) {
      return true;
    } else {
      this.showPopup(currentUser.user.user_Type_ID);
      return false;
    }
  }


  showPopup(userType: number) {
    this._popupService.openAlert({
      header: 'Alert',
      message: `As a ${environment.USER_TYPE[userType]}, you are not authorized to use the service.`
    })
  }
}




@Injectable({
  providedIn: 'root'
})
export class ESathiGuard implements CanActivate, CanLoad {

  constructor(private router: Router, private _popupService: PopupService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');


  
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.currentUser.user.user_Type_ID !== 2) { 
      // cancel navigation for user other than E-Sathi
      this.router.navigate(['dashboard']);
      return false;
    } else {
      return true;
    }

  }


  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.currentUser.user.user_Type_ID !== 2) { 
      // cancel navigation for user other than E-Sathi
      this.showUserTypePopup (this.currentUser.user.user_Type_ID);
      this.router.navigate(['dashboard']);
      return false;
    } else {
      return true;
    }
  }


  showUserTypePopup (userType:number) {
    this._popupService.openAlert({
      header:'Alert',
      message: `As a ${environment.USER_TYPE[userType]}, you are not authorized to use the service.`
    })
  }



}