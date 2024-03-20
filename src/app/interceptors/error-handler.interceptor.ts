import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppComponent } from '../app.component';
import { inject } from '@angular/core';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        console.log(err);
        if (err.status === 401) {
          throw new Error('Unauthorized');
        }
        if (err.status === 404 && err.error.message === 'OTP is not correct') {
          throw new Error('OTP is not correct');
        }
        if (err.status === 404 && err.error.message === 'No user found') {
          throw new Error('No user found');
        }
        if (
          err.status === 404 &&
          err.error.message === 'Password is incorrect'
        ) {
          throw new Error('Incorrect password');
        }
        if (
          err.status === 400 &&
          err.error.message === 'The current password is incorrect'
        ) {
          throw new Error('Incorrect current password');
        }
      }
      return throwError(() => new Error(err));
    })
  );
};
