import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SimpleMatch } from 'src/app/all-sports/DTOs/simple-dto';
import { SportLeagueMatch } from 'src/app/all-sports/DTOs/sport-league-match';
import { SharedDataService } from 'src/app/all-sports/services/shared-data.service';
import { MultiHouseOdds } from 'src/app/betting-ticket/Odds';
import { BettingServiceService } from 'src/app/betting-ticket/betting-service.service';
import { MatchDetailService } from 'src/app/match-detail/Services/match-detail.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nfl-component',
  templateUrl: './nfl-component.component.html',
  styleUrls: ['./nfl-component.component.css']
})
export class NflComponentComponent {
  private apiBaseUrl = environment.apiUrl;
  leagueMatches: {[sport: string]: { [league: string]: SimpleMatch[] }} = {};
  private subscriptions = new Subscription();
  
  displaySidebar: boolean = false;
  isMobile: boolean = false;
  sortMode: boolean = false;
  sortedMatches : SportLeagueMatch[] = [];
  
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
        this.sortedMatches = this.getFlattenedAndSortedMatches();
      }
    });
    this.sharedDataService.clearLeagueSelections();
    this.sharedDataService.turnOffLeagueDisplay();
    this.sharedDataService.toggleLeagueDisplay("NFL");
    this.subscriptions.add(
      this.sharedDataService.sideBarBoolean$.subscribe(shown => {
        this.displaySidebar = shown;
      })
    );

    this.subscriptions.add(
      this.sharedDataService.sortedMatchBoolean$.subscribe(show => {
        this.sortMode = show;
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

  getFlattenedAndSortedMatches() {
    let allMatches : SportLeagueMatch[] = [];
    const sport : string = "NFL";
    Object.keys(this.leagueMatches[sport]).forEach(league => {
      this.leagueMatches[sport][league].forEach(match => {
        allMatches.push({sport,league, match});
      });
    });
  
    // Sort the flattened array by start time
    allMatches.sort((a, b) => new Date(a.match.startTime).getTime() - new Date(b.match.startTime).getTime());
  
    return allMatches;
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

    this.router.navigate(['/match', match.id], { state: { match } });
  }

  generateUrl(match : any, sportName: string) : string{

    return "match/" + sportName + "_" + match.id;
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
        'BrazilBet': parseFloat(this.GetOdds(fullMatch, 'BrazilBet', bettingGame)),
        'BetOle': parseFloat(this.GetOdds(fullMatch, 'BetOle', bettingGame)),
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

  setSortModeByLeague() : void{
    this.sharedDataService.setSortedMatchBoolean(false);
  }
  
  setSortModeByStartTime() : void{
    this.sharedDataService.setSelectedDateFilter("halfday");
    const longFilter = 12 * 3600 * 1000;
    const url = `${this.apiBaseUrl}/api/v1/all-sports/matches`;
    this.sharedDataService.fetchMatches(this.httpClient, url);
    this.sharedDataService.setSortedMatchBoolean(true);
  }
}
