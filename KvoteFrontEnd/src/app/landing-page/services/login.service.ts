import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiBaseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/v1/auth/authenticate`;
    const body = { username, password };
    // console.log(body);
    return this.httpClient.post(url, body).pipe(
      tap((response: any) => {
        // Store the JWT token
        const token = response.token; // Adjust this based on your response structure
        localStorage.setItem('authToken', token);
      }),
      catchError((error) => {
        // Handle errors
        console.error('Authentication failed:', error);
        return throwError(() => new Error('test'));
      })
    );
  }

  dummyFunction(): Observable<any>{
    const url = `${this.apiBaseUrl}/api/v1/auth/dummy`;
    const body = null;
    return this.httpClient.get(url);
  }

  register(username: string, password: string): Observable<any> {
    const url = `${this.apiBaseUrl}/api/v1/auth/register`;
    const body = { username, password };
    // console.log(body);
    return this.httpClient.post(url, body).pipe(
      tap((response: any) => {
      }),
      catchError((error) => {
        if (error.status === 409) {
          // User already exists
          return throwError(() => new Error('UserAlreadyExists'));
        } else {
          // Other errors
          console.error('Registration failed:', error);
          return throwError(() => new Error('RegistrationError'));
        }
      })
    );
  }
}
