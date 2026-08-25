import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  const token = sessionStorage.getItem('token');
  let clonedRequest = req;

  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  const urlLower = req.url.toLowerCase();
  const isAuthRequest =
    urlLower.includes('/auth/login') ||
    urlLower.includes('/auth/login1') ||
    urlLower.includes('/supplierauth') ||
    urlLower.includes('/api/login') ||
    urlLower.endsWith('/login');

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isAuthRequest) {
        sessionStorage.clear();
        localStorage.clear(); 
        
        Swal.fire({
          icon: 'warning',
          title: 'Session Expired!',
          text: 'Your session has expired. Please login again.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
          allowOutsideClick: false 
        }).then((result) => {
          if (result.isConfirmed) {
            router.navigate(['/login']); 
          }
        });
      }
      return throwError(() => error);
    })
  );
};