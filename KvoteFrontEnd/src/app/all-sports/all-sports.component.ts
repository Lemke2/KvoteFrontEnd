import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SimpleMatch } from './DTOs/simple-dto';
import { SharedDataService } from './services/shared-data.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Subscription } from 'rxjs';
import { BettingServiceService } from '../betting-ticket/betting-service.service';
import { MultiHouseOdds } from '../betting-ticket/Odds';
import { MatchDetailService } from '../match-detail/Services/match-detail.service';

@Component({
  selector: 'app-all-sports',
  templateUrl: './all-sports.component.html',
  styleUrls: ['./all-sports.component.css']
})
export class AllSportsComponent {
  leagueMatches: {[sport: string]: { [league: string]: SimpleMatch[] }} = {};
  sportNameMapping: { [key: string]: string } = {
    'Football': 'Fudbal',
    'Basketball': 'Košarka',
    'Tennis': 'Tenis',
    'NFL': 'Američki Fudbal',
    'Handball': 'Rukomet',
    'BasketballPlayers': 'Košarka Igrači'
  };

  displaySidebar: boolean = false;
  displayProfile : boolean = false;
  isMobile: boolean = false;

  orderedSports = ['Football', 'Basketball', 'Tennis', 'NFL', 'Handball'];
  displayFootball = ['Liga Šampiona ', 'Afrički kup nacija', 'Liga Evrope', 'Liga konferencije', 'Engleska 1', 'Španija 1', 'Italija 1', 'Nemačka 1', 'Francuska 1', 'Liga nacija - grupa A', 'Liga nacija - grupa B', 'Liga nacija - grupa C ', 'Liga nacija - grupa D'];
  displayBasketball = ['NBA', 'Evroliga', 'FIBA Evro kup', 'ABA  LIGA  1', 'Španija 1', 'TURSKA  1', 'Nemačka 1'];
  displayTennis = ['GSM  VIMBLDON  TRAVA', 'GSM  AUSTRALIJAN  OPEN  TVRDA', 'GSM  ROLAND  GAROS  ZEMLJA'] //update as tournaments happen
  displayNFL = [''];

  countFootball = 0;
  countBaskeball = 0;
  private apiBaseUrl = environment.apiUrl;
  private subscriptions = new Subscription();

  constructor(
    private router: Router, 
    private sharedDataService: SharedDataService, 
    private httpClient: HttpClient, 
    private bettingService: BettingServiceService, 
    private matchDetailService : MatchDetailService) {}

  ngOnInit() {
    this.updateDeviceType();
    window.addEventListener('resize', this.updateDeviceType.bind(this));

    this.sharedDataService.leagueMatches$.subscribe((data) => {
      if (!data || Object.keys(data).length === 0) {
        const url = `${this.apiBaseUrl}/api/v1/all-sports/matches`;
        this.sharedDataService.fetchMatches(this.httpClient, url);
      } else {
        this.leagueMatches = data;
        // console.log(this.leagueMatches)
      }
    });
    this.sharedDataService.clearLeagueSelections();
    this.sharedDataService.turnOffLeagueDisplay();
    this.subscriptions.add(
      this.sharedDataService.sideBarBoolean$.subscribe(shown => {
        this.displaySidebar = shown;
      })
    );
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    window.removeEventListener('resize', this.updateDeviceType.bind(this));
  }

  updateDeviceType() {
    this.isMobile = window.innerWidth < 768; // Set your own mobile breakpoint
  }

  navigateToMatch(match: any, event: MouseEvent): void {
    event.preventDefault();
    if (this.isMobile && this.displaySidebar) {
      this.hideSideBar();
      return;
    }

    var showTicket = false;
    this.bettingService.getShowTicket().subscribe((value: boolean) => {showTicket = value});

    if (this.isMobile && showTicket) {
      this.hideSideBar();
      return;
    }

    // console.log(match);
    this.router.navigate(['/match', match.id], { state: { match } });
  }

  getTranslatedSportName(sportKey: string): string {
    return this.sportNameMapping[sportKey] || sportKey;
  }

  displaySpecificLeague(sport : string, leaguename : string) : boolean{
    let currLeague;

    if (leaguename in this.leagueMatches[sport]){
      currLeague = this.leagueMatches[sport][leaguename];
    }
    else{
      return false;
    }

    if (currLeague.length > 0){
      return true;
    }
    return false;
  }

  displaySport(sportname : string) : boolean{
    if(sportname === 'NFL')
      return false

    if(sportname === 'Handball')
      return false

    return true;
  }

  GetLeagues(sport: string): string[] {
    let ret: string[] = [];
    this.countBaskeball = 0;
    this.countFootball = 0;
  
    let priorityLeagues: string[] = [];
    let allLeagues: string[] = Object.keys(this.leagueMatches[sport] || {}).sort();
  
    if (sport === 'Football') {
      priorityLeagues = this.displayFootball;
      for (const league of priorityLeagues) {
        if (this.countFootball < 3 && allLeagues.includes(league)) {
          if (this.displaySpecificLeague(sport, league)) {
            this.countFootball += 1;
            ret.push(league);
          }
        }
      }
      // Fill remaining spots with other leagues alphabetically
      for (const league of allLeagues) {
        if (this.countFootball >= 3) break;
        if (!ret.includes(league) && this.displaySpecificLeague(sport, league)) {
          this.countFootball += 1;
          ret.push(league);
        }
      }
    }
  
    if (sport === 'Basketball') {
      priorityLeagues = this.displayBasketball;
      for (const league of priorityLeagues) {
        if (this.countBaskeball < 2 && allLeagues.includes(league)) {
          if (this.displaySpecificLeague(sport, league)) {
            this.countBaskeball += 1;
            ret.push(league);
          }
        }
      }
      // Fill remaining spots with other leagues alphabetically
      for (const league of allLeagues) {
        if (this.countBaskeball >= 2) break;
        if (!ret.includes(league) && this.displaySpecificLeague(sport, league)) {
          this.countBaskeball += 1;
          ret.push(league);
        }
      }
    }
  
    if (sport === 'Tennis') {
      priorityLeagues = this.displayTennis;
      for (const league of priorityLeagues) {
        if (allLeagues.includes(league)) {
          if (this.displaySpecificLeague(sport, league)) {
            ret.push(league);
          }
        }
      }
    }
  
    return ret;
  }
  

  GetOdds(match : any, bettingHouse: string, oddsName: string) : string{
    let ret = match?.[bettingHouse]?.[oddsName] ?? "/";
    return ret
  }

  addOddsToTicket(match : any, bettingGame: string): void {
    if (this.isMobile && this.displaySidebar) {
      this.hideSideBar();
      return;
    }
    var fullMatch : any;

    this.matchDetailService.getMatchSpecificFields(match, bettingGame).subscribe(data => {
      fullMatch = data;
      const matchUrl = "match/" + match.id;
      const thisMatch = match;

      const oddsByHouse : Record<string, number> ={
        'MaxBet': parseFloat(this.GetOdds(fullMatch, 'MaxBet', bettingGame)),
        'Mozzart': parseFloat(this.GetOdds(fullMatch, 'Mozzart', bettingGame)),
        'Admiral': parseFloat(this.GetOdds(fullMatch, 'Admiral', bettingGame)),
        'Meridian': parseFloat(this.GetOdds(fullMatch, 'Meridian', bettingGame)),
        'BalkanBet': parseFloat(this.GetOdds(fullMatch, 'BalkanBet', bettingGame)),
        'BetOle': parseFloat(this.GetOdds(fullMatch, 'BetOle', bettingGame)),
        'BrazilBet': parseFloat(this.GetOdds(fullMatch, 'BrazilBet', bettingGame)),
        'Merkur': parseFloat(this.GetOdds(fullMatch, 'Merkur', bettingGame)),
        'OktagonBet': parseFloat(this.GetOdds(fullMatch, 'OktagonBet', bettingGame)),
        'PinnBet': parseFloat(this.GetOdds(fullMatch, 'PinnBet', bettingGame)),
        'PlanetWin': parseFloat(this.GetOdds(fullMatch, 'PlanetWin', bettingGame)),
        'SoccerBet' : parseFloat(this.GetOdds(fullMatch, 'SoccerBet', bettingGame)),
        'SuperBet' : parseFloat(this.GetOdds(fullMatch, 'SuperBet', bettingGame))
      };

      // console.log(oddsByHouse);

      const newOdds: MultiHouseOdds = {
        matchUrl,
        thisMatch,
        bettingGame,
        limit : "a",
        oddsByHouse
      };

      // console.log(newOdds);
      this.bettingService.addOddsToTicket(newOdds);
     });

     this.bettingService.setAnimationActive(true);
     setTimeout(() => this.bettingService.setAnimationActive(false), 1000);
  }

  isSelected(match : any, bettingGame : string) : boolean{
    return this.bettingService.isSelected(match.id, bettingGame);
  }
  
  showSideBar(): void {
    this.displaySidebar = true;
  }

  hideSideBar(): void{
    if(this.isMobile){
    this.sharedDataService.setSideBarBoolean(false);
    this.bettingService.setShowTicket(false);
    }
  }

  sortMatchesByStartTime(matches: any[]): any[] {
    return matches.sort((a, b) => {
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();
      return dateA - dateB;
    });
  }

  generateUrl(match : any, sportName: string) : string{

    return "match/" + sportName + "_" + match.id;
  }

  
}
