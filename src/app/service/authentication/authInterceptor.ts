import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // 1. LocalStorage Token get 
//   const token = localStorage.getItem('token');
  const token = sessionStorage.getItem('token');
// console.log('token=',token)
  let clonedRequest = req;

  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        
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
//   return next(clonedRequest).pipe(
      
//       catchError((error: HttpErrorResponse) => {
//       if (error.status === 401) {
//         localStorage.clear(); 
//         alert('Session expired. Please login again.');
//         router.navigate(['/login']);
//       }
//       return throwError(() => error);
//     })
//   );
// };