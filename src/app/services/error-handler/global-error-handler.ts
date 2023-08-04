import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private errorService: ErrorService,
  ) { }

  handleError(error: any) {
    let message;
    if (error instanceof HttpErrorResponse) {
      // Server error
      message = this.errorService.getServerErrorMessage(error);
      console.log(message)
    } else if (error instanceof Error) {
      // Client Error
      message = this.errorService.getClientErrorMessage(error);
      console.log(message)
    } else if (error instanceof ReferenceError) {
      // Reference error
      message = this.errorService.getGeneralErrorMessage();
      console.log(message)
    } else if (error instanceof TypeError) {
      message = this.errorService.getGeneralErrorMessage();
      console.log(message)
    }
    // Always log errors
    console.log(error);
  }
}
