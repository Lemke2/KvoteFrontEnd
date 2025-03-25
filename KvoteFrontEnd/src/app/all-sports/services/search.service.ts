import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../DTOs/search-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiBaseUrl = environment.apiUrl;
  private apiUrl = `${this.apiBaseUrl}/api/v1/search/match`; // Adjust this to your API

  constructor(private httpClient: HttpClient) {}

  searchGames(query: string): Observable<Game[]> {
    return this.httpClient.get<Game[]>(`${this.apiUrl}?query=${query}`);
  }
}

