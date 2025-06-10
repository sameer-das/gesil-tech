import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, map, Observable, switchMap, take, throwError } from 'rxjs';
import { RefreshTokenService } from './refresh-token.service';

@Injectable({
  providedIn: 'root',
})
export class APIInterceptor implements HttpInterceptor {
  constructor(private refreshTokenService: RefreshTokenService) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let JWT;
    // add as mobile device does not have localstorage
    if (!req.url.includes('eEncryptRequest')) {
      JWT = localStorage.getItem('jwt');
    }

    const colnedRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + JWT)
    });

    console.dir(`Interceptor URL : ${colnedRequest.url}`);

    return next.handle(colnedRequest)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !colnedRequest.url.includes('/api/User/ValidateUser')
          // && !colnedRequest.url.includes('/Auth/login')
        ) {
          return this.handle401Error(colnedRequest, next);
        } else {
          return throwError(() => error);
        }
      })
    );

  }


  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Inside Handle401Error');
    if (!this.refreshTokenService.refreshTokenInProgress) {
      this.refreshTokenService.refreshTokenInProgress = true;
      this.refreshTokenService.getRefreshTokenSubject().next(null);

      return this.refreshTokenService.refreshToken().pipe(
        switchMap((token) => {
          this.refreshTokenService.refreshTokenInProgress = false;
          this.refreshTokenService.getRefreshTokenSubject().next(token.accessToken);

          const colnedRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token.accessToken)
          });

          return next.handle(colnedRequest);
        }),
        catchError((err) => {
          this.refreshTokenService.refreshTokenInProgress = false;
          return throwError(() => err);
        })
      );
    } else {
      return this.refreshTokenService.getRefreshTokenSubject().pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          const colnedRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token)
          });
          return next.handle(colnedRequest);
        }
        )
      );
    }
  }



}
