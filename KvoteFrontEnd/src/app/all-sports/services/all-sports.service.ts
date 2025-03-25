import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimpleMatch } from '../DTOs/simple-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllSportsService {
  private apiBaseUrl = environment.apiUrl;
  private url = `${this.apiBaseUrl}/api/v1/all-sports/football`;

  constructor(private httpClient: HttpClient) {}

  fetchMatches(): Observable<{ [key: string]: SimpleMatch[] }> {
    return this.httpClient.get<{ [key: string]: SimpleMatch[] }>(this.url);
  }
}
