import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  Router, UrlSegment
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanLoad {
  constructor(private _authService: AuthService, private _router: Router) {}
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (this._authService.isLoggedIn()) return true;
    else {
      this._router.navigate(['login']);
      return false;
    }
  }
}
