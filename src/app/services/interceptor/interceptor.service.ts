import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');
    if (token) {
      const tokenizedReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token) });
      return next.handle(tokenizedReq);
    }
    return next.handle(req).pipe(catchError((err: HttpErrorResponse)=> {
      return throwError(err);
    }));
  }
}
