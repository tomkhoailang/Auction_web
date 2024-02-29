import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  debugger;
  return next(req).pipe(
    catchError((err) => {
      console.log(err);
      return throwError(() => new Error(err));
    })
  );
};
