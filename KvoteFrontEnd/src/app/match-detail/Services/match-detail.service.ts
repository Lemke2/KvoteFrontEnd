import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SimpleMatch } from 'src/app/all-sports/DTOs/simple-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatchDetailService {
  private apiBaseUrl = environment.apiUrl;
  private url = `${this.apiBaseUrl}/api/v1/full/match`;
  private url2 = `${this.apiBaseUrl}/api/v1/surebet/get/`;
  private url3 = `${this.apiBaseUrl}/api/v1/surebet/specificOdds`;

  constructor(private httpClient: HttpClient) { }

  getFullMatch(simpleMatch : SimpleMatch): Observable<any> {
    let params = new HttpParams()
    .set('sport', simpleMatch.sport)
    .set('id', simpleMatch.id)

    return this.httpClient.get<any>(this.url, { params });
  }

  getFullMatchViaID(matchId : string, sport : string): Observable<any> {
    let params = new HttpParams()
    .set('sport', sport)
    .set('id', matchId)

    return this.httpClient.get<any>(this.url, { params });
  }

  getSurebet(reqparams : string): Observable<any>{
    let params = new HttpParams().set('params', reqparams);

    return this.httpClient.get<any>(this.url2, { params });
  }

  getMatchSpecificFields(match : any, field : string) : Observable<any>{
    let body = {
      sport: match.sport,
      id: match.id,
      specificField: field
  };

    return this.httpClient.post<any>(this.url3, body);
  }
}
