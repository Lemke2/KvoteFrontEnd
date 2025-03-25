import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiBaseUrl = environment.apiUrl;

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const excludeUrls = [
      `${this.apiBaseUrl}/api/v1/auth/register`,
      `${this.apiBaseUrl}/api/v1/auth/authenticate`,
      `${this.apiBaseUrl}/api/v1/auth/registration-token`,
      `${this.apiBaseUrl}/api/v1/auth/forgot-password`,
      `${this.apiBaseUrl}/api/v1/auth/password-token`,
    ]

    if (excludeUrls.includes(request.url)) {
      return next.handle(request);
    }

    const authToken = localStorage.getItem('authToken');
    // Clone the request and set the new header in one step.
    const authReq = request.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
        // console.log(error);
        if (error.status === 401) {
          // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBB");
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
        // Here we use throwError as a function that returns an Observable
        return throwError(() => new Error(error.message));
      })
    );
  }

}
