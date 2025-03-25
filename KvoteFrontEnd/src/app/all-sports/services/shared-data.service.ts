import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SimpleMatch } from '../DTOs/simple-dto';
import { HttpClient } from '@angular/common/http';
import {SportLeaguePair} from 'src/app/football-leagues/SportLeaguePair';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private leagueMatchesSubject = new BehaviorSubject<{[sport: string]: { [league: string]: SimpleMatch[] }}>({});
  public leagueMatches$ = this.leagueMatchesSubject.asObservable();

  private selectedDateFilter = new BehaviorSubject<string>('3days');

  private displayLeaguesSubject = new BehaviorSubject<{ [sport: string]: boolean }>({});
  displayLeagues$ = this.displayLeaguesSubject.asObservable();

  private selectedRows = new Map<string, string | null>();
  private selectedLimits = new Map<string, string| null>();

  private currentLeagueSelections = new BehaviorSubject<SportLeaguePair[]>(this.loadInitialLeagues());
  public currentLeagueSelections$ = this.currentLeagueSelections.asObservable();

  private sideBarBoolean = new BehaviorSubject<boolean>(false);
  public sideBarBoolean$ = this.sideBarBoolean.asObservable();

  private sortedMatchBoolean = new BehaviorSubject<boolean>(false);
  public sortedMatchBoolean$ = this.sortedMatchBoolean.asObservable();

  constructor() { }

  fetchMatches(httpClient: HttpClient, url: string): void {
    this.getSelectedDateFilter().subscribe(filter => {
      let longFilter : number = 0;
      
      if (filter === 'halfday') {
        longFilter = 12 * 3600 * 1000;
      } else if (filter === 'today') {
        longFilter = 24 * 3600 * 1000;
      } else if (filter === '3days') {
        longFilter = 72 * 3600 * 1000;
      } else{
        longFilter = 720 * 3600 * 1000;
      }

      const fullUrl = `${url}?timeFilter=${longFilter}`;
      httpClient.get<{[sport: string]: { [league: string]: SimpleMatch[] }}>(fullUrl).subscribe({
        next: (data) => {
          this.leagueMatchesSubject.next(data); // Assuming the data has a matches property
        },
        error: (error) => {
          console.error('Error fetching match data:', error);
        }
      });
    });
  }

  getLeagueMatches(): Observable<{[sport: string]: { [league: string]: SimpleMatch[] }}> {
    return this.leagueMatches$;
  }

  setSelectedDateFilter(filter: string): void {
    this.selectedDateFilter.next(filter);
  }

  getSelectedDateFilter(): Observable<string> {
    return this.selectedDateFilter.asObservable();
  }

  toggleLeagueDisplay(sport: string): void {
    const currentLeagues = this.displayLeaguesSubject.getValue();
    currentLeagues[sport] = !currentLeagues[sport];
    this.displayLeaguesSubject.next(currentLeagues);
  }

  turnOffLeagueDisplay(): void{
    const currentLeagues = this.displayLeaguesSubject.getValue();
    
    for (const sport in currentLeagues) {
      if (currentLeagues.hasOwnProperty(sport)) {
          currentLeagues[sport] = false;
      }
    }

    this.displayLeaguesSubject.next(currentLeagues); 
  }

  setSelectedRow(matchId: string, selectedRow: string | null): void {
    this.selectedRows.set(matchId, selectedRow);
  }

  getSelectedRow(matchId: string): string | null {
    return this.selectedRows.get(matchId) || null;
  }

  setSelectedLimit(matchId: string, selectedRow: string | null): void {
    this.selectedLimits.set(matchId, selectedRow);
  }

  getSelectedLimit(matchId: string): string | null {
    return this.selectedLimits.get(matchId) || null;
  }

  clearTicket() : void{
    this.selectedRows = new Map<string, string | null>();
    this.selectedLimits = new Map<string, string | null>();
  }



  // FOOTBALL LEAGUE - LEAGUE DETAILS -  SELECTING AND GETTING 
  private loadInitialLeagues(): Array<{sport: string, league: string}> {
    const savedLeagues = sessionStorage.getItem('selectedLeagues');
    return savedLeagues ? JSON.parse(savedLeagues) : [];
  }

  addLeagueSelection(sport: string, league: string) {
    const currentSelections = this.currentLeagueSelections.value;
    const index = currentSelections.findIndex(selection => selection.sport === sport && selection.league === league);
    
    let updatedSelections = [];
    if (index > -1) {
      updatedSelections = [...currentSelections.slice(0, index), ...currentSelections.slice(index + 1)];
    } else {
      updatedSelections = [...currentSelections, { sport, league }];
    }
    
    this.currentLeagueSelections.next(updatedSelections);
    sessionStorage.setItem('selectedLeagues', JSON.stringify(updatedSelections));
  }
  
  removeLeagueSelection(sport: string, league: string) {
    const currentSelections = this.currentLeagueSelections.value;
    const updatedSelections = currentSelections.filter(selection => !(selection.sport === sport && selection.league === league));
    this.currentLeagueSelections.next(updatedSelections);
  }

  clearLeagueSelections() {
    this.currentLeagueSelections.next([]);
  }

  getLeagueDetails(sport: string, league: string): SimpleMatch[] | undefined {
    const allLeagues = this.leagueMatchesSubject.value;
    return allLeagues[sport]?.[league];
  }

  setSideBarBoolean(value : boolean): void {
    this.sideBarBoolean.next(value);
  }

  setSortedMatchBoolean(value : boolean): void {
    this.sortedMatchBoolean.next(value);
  }

}
