import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof document !== 'undefined') {
    const token = localStorage.getItem('user');
    const tokenReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(tokenReq);
  }
  return next(req);
};
