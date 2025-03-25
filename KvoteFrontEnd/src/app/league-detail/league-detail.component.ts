import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { SimpleMatch } from '../all-sports/DTOs/simple-dto';
import { SharedDataService } from '../all-sports/services/shared-data.service';
import { Subscription  } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MultiHouseOdds } from '../betting-ticket/Odds';
import { MatchDetailService } from '../match-detail/Services/match-detail.service';
import { BettingServiceService } from '../betting-ticket/betting-service.service';

@Component({
  selector: 'app-league-detail',
  templateUrl: './league-detail.component.html',
  styleUrls: ['./league-detail.component.css']
})
export class LeagueDetailComponent {
  private subscriptions = new Subscription();
  selectedLeaguesDetails: any[] = [];

  
  displaySidebar : boolean = false;
  isMobile: boolean = false;
  constructor( 
    private router: Router, 
    private sharedDataService: SharedDataService, 
    private httpClient : HttpClient, 
    private matchDetailService : MatchDetailService,
    private bettingService: BettingServiceService) {}

  ngOnInit() {
    this.updateDeviceType();
    window.addEventListener('resize', this.updateDeviceType.bind(this));

    const apiBaseUrl = environment.apiUrl;

    this.sharedDataService.leagueMatches$.subscribe((data) => {
      if (!data || Object.keys(data).length === 0) {
        const url = `${apiBaseUrl}/api/v1/all-sports/matches`;
        this.sharedDataService.fetchMatches(this.httpClient, url);
      }
    });
    
    this.subscriptions.add(
      this.sharedDataService.sideBarBoolean$.subscribe(shown => {
        this.displaySidebar = shown;
      })
    );

    // Ovo je za selected leagues
    this.subscriptions.add(
      this.sharedDataService.currentLeagueSelections$.subscribe(selectedLeagues => {
        this.selectedLeaguesDetails = []; // Reset or initialize the array
        selectedLeagues.forEach(({ sport, league }) => {
          this.loadAndDisplayLeagueDetails(sport, league);
        });
      })
    );
      
    this.subscriptions.add(
      this.sharedDataService.leagueMatches$.subscribe(filter => {
        this.sharedDataService.currentLeagueSelections$.subscribe(selectedLeagues => {
          this.selectedLeaguesDetails = []; // Reset or initialize the array
          selectedLeagues.forEach(({ sport, league }) => {
            this.loadAndDisplayLeagueDetails(sport, league);
          });
        })
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

  // grupisem svaku ligu po datumima
  loadAndDisplayLeagueDetails(sport: string, league: string) {
    const leagueDetails = this.sharedDataService.getLeagueDetails(sport, league);
    if (leagueDetails) {
      const groupedMatches = this.groupMatchesByDate(leagueDetails);
      this.selectedLeaguesDetails.push({
        sport,
        league,
        groupedMatches
      });
    }


  }
  

  groupMatchesByDate(matches: SimpleMatch[]): {[date: string]: SimpleMatch[]} {
    return matches.reduce((acc, match) => {
      const date = new Date(match.startTime).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(match);
      return acc;
    }, {} as {[date: string]: SimpleMatch[]});
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

  GetSport(sport : string) : string{
    if (sport === 'Football'){
      return 'Fudbal';
    }
    if (sport === 'Basketball'){
      return 'Košarka';
    }
    if (sport === 'Tennis'){
      return 'Tenis';
    }
    if (sport === 'NFL'){
      return 'Američki Fudbal';
    }
    if (sport === 'Handball'){
      return 'Rukomet';
    }

    if (sport === 'BasketballPlayers'){
      return 'Košarka Igrači';
    }
    return '';
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

  getObjectKeys(obj: object): string[] {
    return Object.keys(obj); // Sort if you want the dates in order
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

  
}
