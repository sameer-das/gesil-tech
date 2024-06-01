import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PopupService } from '../popups/popup.service';
import { LoaderService } from './loader.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotImplementedGuard implements CanActivate {
  constructor(private _popupService: PopupService,
    private _loaderService: LoaderService,
    private _authService: AuthService,
    private _router: Router) { }

  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // console.log(state)
    // console.log(route)
    if (environment.NOT_IMPLEMENTED_MENU.includes(state.url)) {
      if (state.url === '/pan') {
        console.log('pan');
        // Redirect to PAN portal, URL comes from backend
        this._popupService.openConfirm({
          header: 'Redirect Alert!',
          message: 'You will be redirected to PAN portal for PAN related transactions.',
          showCancelButton: true
        }).afterClosed().subscribe((isOk: boolean) => {
          if (isOk) {
            console.log('Call API');
            this._loaderService.showLoader();
            this._authService.getPANUrl(this.currentUser.user.user_ID).subscribe({
              next: (response: any) => {
                this._loaderService.hideLoader();
                if (response.status === 'Success' && response.code === 200 && response.data !== '') {
                  window.open(response.data, '_blank');
                } else {
                  this._popupService.openAlert({
                    header: 'Alert',
                    message: 'Something went wrong while fetching details for PAN. Please contact support team!'
                  });
                }
              }, error: (error: any) => {
                this._loaderService.hideLoader();
                this._popupService.openAlert({
                  header: 'Fail',
                  message: 'Error while fetching details for PAN. Please contact support team!'
                });
              }
            })
          } else {
            console.log('Dont redirect')
          }
        });

      } else {
        this._popupService.openAlert({
          header: 'Coming Soon',
          message: 'This service is under development.'
        })
      }
    } else {
      // If the route not found then redirect to dashboard 
      this._router.navigate(['dashboard'])
    }

    return false;
  }

}
