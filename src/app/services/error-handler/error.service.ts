import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationError } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router) {
    this.router
      .events
      .subscribe((event) => {
        // Redirect to the ErrorComponent
        if (event instanceof NavigationError) {
          if (!navigator.onLine) {
            throw new Error('No Internet Connection');
          }
          // Redirect to the ErrorComponent
          this.router.navigate(['/error']);
        }
      });
  }

  getClientErrorMessage(error: Error): string {
    return error.message ?
      error.message :
      error.toString();
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    return navigator.onLine ?
      error.message :
      'No Internet Connection';
  }

  getStackTrace(error: Error) {
    return error.stack;
  }

  getGeneralErrorMessage() {
    return 'We encountered a problem with your request, please try again later';
  }
}
