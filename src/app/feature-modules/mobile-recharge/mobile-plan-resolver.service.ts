import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { MobileRechargeService } from "../dashboard/mobile-recharge.service";
@Injectable({providedIn:'any'})
export class MobilePlanResolverService implements Resolve<any> {
    constructor(private _mobileRechargeService: MobileRechargeService){}
    resolve():Observable<any> {
        const current_search = JSON.parse(sessionStorage.getItem('mobile_search') || '{}');
        return this._mobileRechargeService.getPlanForMobileNo(current_search?.currentBillerId, current_search?.currentCircle);
    }
}

@Injectable({providedIn:'any'})
export class MobilePlanGuard implements CanActivate {
    constructor(private _mobileRechargeService: MobileRechargeService,
        private _router:Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const current_search = JSON.parse(sessionStorage.getItem('mobile_search') || '{}');
        // console.log(current_search);
        if(current_search?.currentBillerId && current_search?.currentCircle){
            return true;
        } else {
            this._router.navigate(['mobile-recharge']);
            return false;
        }


    }
    
}