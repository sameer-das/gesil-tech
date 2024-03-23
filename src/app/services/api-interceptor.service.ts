import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const API_KEY = 'api_key_sameer';
    const colnedRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('jwt'))
    });
    console.dir(`Interceptor URL : ${colnedRequest.url}`);

    return next.handle(colnedRequest).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          //   console.log('Http Response');
        }
        return event;
      })
    );



  }
}
