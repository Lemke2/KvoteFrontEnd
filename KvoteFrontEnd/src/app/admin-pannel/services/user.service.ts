import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserInfo } from '../userDTO';
import { jwtDecode } from "jwt-decode";
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiBaseUrl = environment.apiUrl;
  private apiUrl = `${this.apiBaseUrl}/api/v1/adminpannel/allusers`;
  private apiUrl2 = `${this.apiBaseUrl}/api/v1/adminpannel/getuser`;
  private apiUrl22 = `${this.apiBaseUrl}/api/v1/adminpannel/getuserinfo`;
  private apiUrl3 = `${this.apiBaseUrl}/api/v1/adminpannel/updateuser`;
  private apiUrl4 = `${this.apiBaseUrl}/api/v1/auth/refresh-token`;
  private apiUrl5 = `${this.apiBaseUrl}/api/v1/auth/registration-token`;
  private apiUrl6 = `${this.apiBaseUrl}/api/v1/auth/forgot-password`;
  private apiUrl7 = `${this.apiBaseUrl}/api/v1/auth/password-token`;
  private apiUrl8 = `${this.apiBaseUrl}/api/v1/adminpannel/getpairingthreshold`;
  private apiUrl9 = `${this.apiBaseUrl}/api/v1/adminpannel/setpairingthreshold`;
  private apiUrl10 = `${this.apiBaseUrl}/api/v1/adminpannel/getPairingFile`;

  constructor(private httpClient: HttpClient) {}

  getAllUsers() : Observable<User[]>{
    return this.httpClient.get<User[]>(`${this.apiUrl}`);
  }

  getSingleUser(username : String) : Observable<User>{
    return this.httpClient.get<User>(`${this.apiUrl2}?userName=${username}`);
  }

  getUserInfo() : Observable<UserInfo>{
    return this.httpClient.get<UserInfo>(`${this.apiUrl22}`);
  }

  getCurrentUser() : string{
    const token = localStorage.getItem('authToken');
    if (!token) return "";

    try {
      const decodedToken = jwtDecode(token);
      return String(decodedToken.sub); // now I need to extract the userName from the token
    } catch (error) {
      console.error('Token decoding failed', error);
      return "";
    }
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
  
    const decodedToken = jwtDecode(token) as { roles: string[] };
    return decodedToken.roles[0].includes('ADMIN') ?? false;
  }

  updateTypeAndDurationOfPackage(
    username: string, 
    packageType : string, 
    packageDuration : string, 
    surebetType : string, 
    surebetExpirationDate : string, 
    telegram : string,
    bettingHouse: string) : Observable<any>{

    const body = {
      userName: username,
      packageType: packageType,
      packageDuration: packageDuration,
      surebetType : surebetType,
      surebetDuration : surebetExpirationDate,
      telegram : telegram,
      bettingHouse: bettingHouse
    };

    return this.httpClient.put<any>(this.apiUrl3, body);
  }

  refreshToken() : Observable<any>{
    const headers = { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') };
    return this.httpClient.post<any>(this.apiUrl4, {}, {headers: headers});
  }

  // email-verification
  verifyToken(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.httpClient.post<any>(this.apiUrl5, token, { headers: headers });
}

  // forgot-password-email
  sendForgotPasswordEmail(email : string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
      return this.httpClient.post<any>(this.apiUrl6, email, { headers: headers });
  }

  // reset-password token auth
  verifyPasswordToken(token: string, password: string): Observable<any> {
    const payload = { token: token, newPassword: password };
    return this.httpClient.post<any>(this.apiUrl7, payload);
  }

  getOverlapping() : Observable<number>{
    return this.httpClient.get<number>(this.apiUrl8);
  }

  setThreshold(threshold: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.apiUrl9}?target=${threshold}`, null);
  }

  getMappings(sport: string, date : string) : Observable<any>{
    return this.httpClient.get<any>(`${this.apiUrl10}?sport=${sport}&date=${date}`)
  }
}
