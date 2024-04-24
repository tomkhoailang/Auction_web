import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppComponent } from '../app.component';
import { inject } from '@angular/core';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          throw new Error('Unauthorized');
        }
        if (err.status === 404) {
          if (err.error.message === 'OTP is not correct')
            throw new Error('OTP is not correct');
          if (err.error.message === 'No user found')
            throw new Error('No user found');
          if (err.error.message === "The user with that email isn't existed")
            throw new Error('No user found');
        }
        if (err.status === 400) {
          if (err.error.message === 'Email is already in use')
            throw new Error('Email is already in use');
          if (err.error.message === 'The current password is incorrect')
            throw new Error('The current password is incorrect');
          if (err.error.message === 'Password is incorrect')
            throw new Error('Incorrect password');
        }
      }
      return throwError(() => new Error(err));
    })
  );
};
