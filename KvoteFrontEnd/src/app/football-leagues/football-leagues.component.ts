import { Component } from '@angular/core';
import { SharedDataService } from '../all-sports/services/shared-data.service';
import { SimpleMatch } from '../all-sports/DTOs/simple-dto';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SportLeaguePair } from './SportLeaguePair';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-football-leagues',
  templateUrl: './football-leagues.component.html',
  styleUrls: ['./football-leagues.component.css']
})
export class FootballLeaguesComponent {
  leagueMatches: {[sport: string]: { [league: string]: SimpleMatch[] }} = {};
  displayLeagues: { [sport: string]: boolean } = {};
  private subscription!: Subscription;
  private displayLeaguesSubscription!: Subscription;
  private apiBaseUrl = environment.apiUrl;
  
  currentSelections !: SportLeaguePair[];

  sportNameMapping: { [key: string]: string } = {
    'Football': 'Fudbal',
    'Basketball': 'Košarka',
    'Tennis': 'Tenis',
    'NFL': 'Američki Fudbal',
    'Handball': 'Rukomet',
    'BasketballPlayers': 'Košarka Igrači'
  };

  showOrder: string[] = ['Football', 'Basketball', 'Tennis', 'BasketballPlayers', 'NFL', 'Handball']

  highestPrioDict: Record<string, string[]> = {
    'Football' : ['Liga Šampiona ', 'Afrički kup nacija', 'Liga Evrope', 'Liga konferencije', 'Engleska 1', 'Španija 1', 'Italija 1', 'Nemačka 1', 'Francuska 1', 'Liga nacija - grupa A', 'Liga nacija - grupa B', 'Liga nacija - grupa C ', 'Liga nacija - grupa D'],
    'Basketball' : ['NBA', 'Evroliga', 'FIBA Evro kup', 'ABA  LIGA  1', 'Španija 1', 'TURSKA  1', 'Nemačka 1'],
    'Tennis' : [],
    'NFL' : ['NFL']
  }


  constructor(private sharedDataService : SharedDataService, private router: Router, private httpClient: HttpClient) {}

  ngOnInit() {
    this.subscription = this.sharedDataService.leagueMatches$.subscribe(
      data => {
        if (data && Object.keys(data).length > 0) {
          this.leagueMatches = data;
        }else{
          const url = `${this.apiBaseUrl}/api/v1/all-sports/matches`;
          this.sharedDataService.fetchMatches(this.httpClient, url);
        }
      }
    );
      
    this.subscription.add(
      this.sharedDataService.currentLeagueSelections$.subscribe(selections => {
        this.currentSelections = selections;
      })
    );

    this.displayLeaguesSubscription = this.sharedDataService.displayLeagues$.subscribe(
      leagues => this.displayLeagues = leagues
    );
  }

  toggleLeaguesDisplay(sport: string): void {
    this.sharedDataService.toggleLeagueDisplay(sport);
  }

  getTranslatedSportName(sportKey: string): string {
    return this.sportNameMapping[sportKey] || sportKey;
  }

  navigateToLeague(sport: string, league: string): void {
    this.sharedDataService.addLeagueSelection(sport, league);
    this.sharedDataService.setSideBarBoolean(true);
    this.router.navigate(['/league', 'odabrane-lige']);
  }
  
  transform(value: string): string {
    return value
      .toLowerCase()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, ''); // Removes leading/trailing hyphens
  }

  displayLeague(sport: string, orderedLeague: string): boolean {
    if (this.leagueMatches && this.leagueMatches[sport] && this.leagueMatches[sport][orderedLeague]) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  
    if (this.displayLeaguesSubscription) {
      this.displayLeaguesSubscription.unsubscribe();
    }
  }
  
  isSelectedLeague(sport: string, league: string): boolean {
    return this.currentSelections.some(selection => selection.sport === sport && selection.league === league);
  }
  
  
}
