import { Component } from '@angular/core';
import { MatchDetailService } from './Services/match-detail.service';
import { SharedDataService } from '../all-sports/services/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { SimpleMatch } from '../all-sports/DTOs/simple-dto';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BettingServiceService } from '../betting-ticket/betting-service.service';
import { MultiHouseOdds } from '../betting-ticket/Odds';
import {Location} from '@angular/common';
import { debounceTime, distinctUntilChanged, filter, Subscription, switchMap } from 'rxjs';
import { UserService } from '../admin-pannel/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.css']
})
export class MatchDetailComponent {
  private apiBaseUrl = environment.apiUrl;
  match : any
  simpleMatch !: SimpleMatch
  searchTerm : string = '';
  searchBettingHouse : string = '';
  searchResults: SimpleMatch[] = [];
  bettingHouses = [
    'MaxBet', 'Mozzart', 'Admiral', 'Meridian', 'BalkanBet',
    'BetOle', 'BrazilBet', 'Merkur', 'OktagonBet', 'PinnBet',
    'PlanetWin', 'SoccerBet', 'SuperBet'
  ];
  footballGroupings : any
  toggleGroupings : {[key: string] : boolean} = {
    "Konacan Ishod": false,
    "GG/NG": false, 
    "Ukupno Golova": false, 
    "Tacan Rezultat": false, 
    "Mix Igre": false, 
    "Domacin Golovi": false, 
    "Gost Golovi": false, 
    "Sve" : true
  }
  orderedGroupings = ['Sve', 'Konacan Ishod', 'Ukupno Golova', 'GG/NG', 'Mix Igre', 'Tacan Rezultat', 'Domacin Golovi', 'Gost Golovi']
  toggleGames : any;
  selectedLimit: string | null = null;
  leagueMatches: {[sport: string]: { [league: string]: SimpleMatch[] }} = {};

  counter = 0;
  displaySidebar: boolean = false;
  displayTicket : boolean = false;
  isMobile: boolean = false;
  private subscriptions = new Subscription();

  constructor(private matchDetailService : MatchDetailService, 
              private sharedDataService: SharedDataService, 
              public userService : UserService,
              private httpClient: HttpClient, 
              private bettingService: BettingServiceService, 
              private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              ) {}

  ngOnInit(): void {
    this.updateDeviceType();
    window.addEventListener('resize', this.updateDeviceType.bind(this));

    this.subscriptions.add(
      this.sharedDataService.sideBarBoolean$.subscribe((shown) => {
        this.displaySidebar = shown;
      })
    );

    this.subscriptions.add(
      this.bettingService.getShowTicket().subscribe((shown) => {
        this.displayTicket = shown;
      })
    );

    this.InitializeMatch();

    this.subscriptions.add(
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          switchMap(() => this.route.paramMap)
        )
        .subscribe((params) => {
          this.InitializeMatch();
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
  
  toggleSingleBettingGame(selectedGrouping : string, selectedGame : string): void {
    if (this.isMobile && this.displaySidebar) {
      this.hideSideBar();
      return;
    }
    if (this.isMobile && this.displayTicket) {
      this.hideSideBar();
      return;
    }
    this.toggleGames[selectedGrouping][selectedGame] = !this.toggleGames[selectedGrouping][selectedGame];
    // console.log(this.toggleGames)
  }

  toggleSingleGrouping(toggledGrouping : string) : void{
    if (this.isMobile && this.displaySidebar) {
      this.hideSideBar();
      return;
    }
    if (this.isMobile && this.displayTicket) {
      this.hideSideBar();
      return;
    }
    this.toggleGroupings[toggledGrouping] = !this.toggleGroupings[toggledGrouping];
  }

  initializeToggleGroupings(groupings: any, counter : number, limit : number): any {
    const result: any = {};
    for (const key in groupings) {
      if (groupings.hasOwnProperty(key)) {
        if (typeof groupings[key] === 'object' && counter<limit) {
          result[key] = this.initializeToggleGroupings(groupings[key], counter+1, limit);
        } else {
          // Initialize with a boolean flag (true to show, false to hide)
          result[key] = false;
        }
      }
    }

    return result;
  }

  getObjectKeys(groupingname: string): string[] {
    return Object.keys(this.footballGroupings[groupingname]);
  }

  getOdds(groupingname : string, gamename : string) : string[] {
    return Object.keys(this.footballGroupings[groupingname][gamename]);
  }

  GetOdds(bettingHouse: string, oddsName: string) : string{
    let ret = this.match?.[bettingHouse]?.[oddsName] ?? "/";
    return ret
  }

  GetComplexOdds(bettingHouse: string, oddsName: string, limit : string) : string{
    let ret = this.match?.[bettingHouse]?.[oddsName]?.[limit] ?? "/";
    return ret
  }

  isComplexBetType(odds: any): boolean {
    const bettingHouses = ['MaxBet', 'Mozzart', 'Admiral', 'Meridian', 'BalkanBet', 'BetOle', 'BrazilBet', 'Merkur', 'OktagonBet', 'PinnBet', 'PlanetWin', 'SoccerBet', 'SuperBet'];

    return bettingHouses.some(bettingHouse => 
        typeof this.match[bettingHouse]?.[odds] === 'object' && this.match[bettingHouse]?.[odds] !== null
    );
  }

  getHandicapValues(odds: any): {key: string, values: (number|string)[]}[] {
    const bettingHouses = ['MaxBet', 'Mozzart', 'Admiral', 'Meridian', 'BalkanBet', 'BetOle', 'BrazilBet', 'Merkur', 'OktagonBet', 'PinnBet', 'PlanetWin', 'SoccerBet', 'SuperBet'];
    let betValues: Record<number, (number|string)[]> = {};

    // Collect all handicap values
    bettingHouses.forEach(bettingHouse => {
        const houseOdds = this.match[bettingHouse]?.[odds];
        if (typeof houseOdds === 'object' && houseOdds !== null) {
            for (let sbv in houseOdds) {
                betValues[Number(sbv)] = [];
            }
        }
    });

    // Get all handicap values and sort them by absolute value
    const sortedEntries = Object.keys(betValues)
        .map(Number)
        .sort((a, b) => {
            const absA = Math.abs(a);
            const absB = Math.abs(b);
            if (absA !== absB) return absA - absB;
            return a - b;
        });

    // Populate the values in sorted order
    sortedEntries.forEach(sbv => {
        betValues[sbv] = [];
        bettingHouses.forEach(bettingHouse => {
            if (this.match[bettingHouse] && odds in this.match[bettingHouse]) {
                if (sbv in this.match[bettingHouse][odds]) {
                    betValues[sbv].push(Number(this.match[bettingHouse][odds][sbv]));
                } else {
                    betValues[sbv].push('/');
                }
            } else {
                betValues[sbv].push('/');
            }
        });
    });
    
    // Convert to array of objects to preserve order
    return sortedEntries.map(key => ({
        key: key.toString(),
        values: betValues[key]
    }));
  }

  getHighestOddsComplexBetType(input: (string | number)[]): number | null {
    let maxIndex = -1;
    let maxValue = Number.MIN_SAFE_INTEGER;
    input.forEach((value, index) => {
        if (typeof value === 'number' && value > maxValue) {
            maxValue = value;
            maxIndex = index;
        }
    });

    return maxIndex >= 0 ? maxIndex : null;
  }


  getHighestOddsBettingHouse(odds: any): string {
    const oddsValues : Record<string, string> ={
      'MaxBet': this.GetOdds('MaxBet', odds),
      'Mozzart': this.GetOdds('Mozzart', odds),
      'Admiral': this.GetOdds('Admiral', odds),
      'Meridian': this.GetOdds('Meridian', odds),
      'BalkanBet': this.GetOdds('BalkanBet', odds),
      'BetOle': this.GetOdds('BetOle', odds),
      'BrazilBet': this.GetOdds('BrazilBet', odds),
      'Merkur': this.GetOdds('Merkur', odds),
      'OktagonBet': this.GetOdds('OktagonBet', odds),
      'PinnBet': this.GetOdds('PinnBet', odds),
      'PlanetWin': this.GetOdds('PlanetWin', odds),
      'SoccerBet' : this.GetOdds('SoccerBet', odds),
      'SuperBet' : this.GetOdds('SuperBet', odds)
    };

    let highestOddsBettingHouse = '';
    let highestOddsValue = 0;

    Object.keys(oddsValues).forEach(bettingHouse => {
      const value = parseFloat(oddsValues[bettingHouse]);
      if (value > highestOddsValue) {
        highestOddsValue = value;
        highestOddsBettingHouse = bettingHouse;
      }
    });

    return highestOddsBettingHouse;
  }

  addOddsToTicket(bettingGame: string): void {
    if (this.isMobile && this.displaySidebar) {
      this.hideSideBar();
      return;
    }
    if (this.isMobile && this.displayTicket) {
      this.hideSideBar();
      return;
    }

    if(!this.isComplexBetType(bettingGame)){
      const matchUrl = this.router.url;
      const thisMatch = this.simpleMatch;

      const oddsByHouse : Record<string, number> ={
        'MaxBet': parseFloat(this.GetOdds('MaxBet', bettingGame)),
        'Mozzart': parseFloat(this.GetOdds('Mozzart', bettingGame)),
        'Admiral': parseFloat(this.GetOdds('Admiral', bettingGame)),
        'Meridian': parseFloat(this.GetOdds('Meridian', bettingGame)),
        'BalkanBet': parseFloat(this.GetOdds('BalkanBet', bettingGame)),
        'BetOle': parseFloat(this.GetOdds('BetOle', bettingGame)),
        'BrazilBet': parseFloat(this.GetOdds('BrazilBet', bettingGame)),
        'Merkur': parseFloat(this.GetOdds('Merkur', bettingGame)),
        'OktagonBet': parseFloat(this.GetOdds('OktagonBet', bettingGame)),
        'PinnBet': parseFloat(this.GetOdds('PinnBet', bettingGame)),
        'PlanetWin': parseFloat(this.GetOdds('PlanetWin', bettingGame)),
        'SoccerBet' : parseFloat(this.GetOdds('SoccerBet', bettingGame)),
        'SuperBet' : parseFloat(this.GetOdds('SuperBet', bettingGame)),
      };

      const newOdds: MultiHouseOdds = {
        matchUrl,
        thisMatch,
        bettingGame,
        limit : "a",
        oddsByHouse
      };

      // console.log(newOdds);
      this.bettingService.addOddsToTicket(newOdds);

      this.bettingService.setAnimationActive(true);
      setTimeout(() => this.bettingService.setAnimationActive(false), 1000);
    }
  }

  addComplexOddsToTicket(bettingGame: string, limit : any): void {
    if (this.isMobile && this.displaySidebar) {
      this.hideSideBar();
      return;
    }

    if(this.isComplexBetType(bettingGame)){
      this.selectedLimit = this.sharedDataService.getSelectedLimit(this.match._id);

      if (this.selectedLimit === limit){
        this.sharedDataService.setSelectedLimit(this.match._id, "");
      }else{
        this.selectedLimit = limit;
        this.sharedDataService.setSelectedLimit(this.match._id, limit);
      }
      
      const matchUrl = this.router.url;
      const thisMatch = this.simpleMatch;

      const oddsByHouse : Record<string, number> ={
        'MaxBet': parseFloat(this.GetComplexOdds('MaxBet', bettingGame, limit)),
        'Mozzart': parseFloat(this.GetComplexOdds('Mozzart', bettingGame, limit)),
        'Admiral': parseFloat(this.GetComplexOdds('Admiral', bettingGame, limit)),
        'Meridian': parseFloat(this.GetComplexOdds('Meridian', bettingGame, limit)),
        'BalkanBet': parseFloat(this.GetComplexOdds('BalkanBet', bettingGame, limit)),
        'BetOle': parseFloat(this.GetComplexOdds('BetOle', bettingGame, limit)),
        'BrazilBet': parseFloat(this.GetComplexOdds('BrazilBet', bettingGame, limit)),
        'Merkur': parseFloat(this.GetComplexOdds('Merkur', bettingGame, limit)),
        'OktagonBet': parseFloat(this.GetComplexOdds('OktagonBet', bettingGame, limit)),
        'PinnBet': parseFloat(this.GetComplexOdds('PinnBet', bettingGame, limit)),
        'PlanetWin': parseFloat(this.GetComplexOdds('PlanetWin', bettingGame, limit)),
        'SoccerBet' : parseFloat(this.GetComplexOdds('SoccerBet', bettingGame, limit)),
        'SuperBet' : parseFloat(this.GetComplexOdds('SuperBet', bettingGame, limit)),
      };

      const newOdds: MultiHouseOdds = {
        matchUrl,
        thisMatch,
        bettingGame,
        limit,
        oddsByHouse
      };

      // console.log(newOdds);
      this.bettingService.addOddsToTicket(newOdds);

      this.bettingService.setAnimationActive(true);
     setTimeout(() => this.bettingService.setAnimationActive(false), 1000);
    }
  }

  InitializeMatch() : void{
    this.simpleMatch = history.state.match;

    if (this.simpleMatch) {
      // console.log("a ovde je oov");
      // console.log(history.state.match);
      this.matchDetailService.getFullMatch(this.simpleMatch).subscribe(data => {
        this.match = data;
        // console.log(this.match);
        this.selectedLimit = this.sharedDataService.getSelectedLimit(this.match._id);
      });

      let loadParam : string = 'assets/football_groupings.json';
    let flag = false;

    if(this.simpleMatch.sport === 'Basketball'){
      loadParam = 'assets/basketball_groupings.json';
      flag = true;
    }
    if(this.simpleMatch.sport === 'Tennis'){
      loadParam = 'assets/tennis_groupings.json';
      flag = true;
    }
    
    if(this.simpleMatch.sport === 'NFL'){
      loadParam = 'assets/nfl_groupings.json';
      flag = true;
    }
    
    if(this.simpleMatch.sport === 'Handball'){
      loadParam = 'assets/handball_groupings.json';
      flag = true;
    }
    
    if(this.simpleMatch.sport === 'BasketballPlayers'){
      loadParam = 'assets/players_groupings.json';
      flag = true;
    }

    if (flag){
      this.orderedGroupings = ['Sve'];
      this.toggleGroupings = {
        "Sve" : true
      };
    }
    
    this.httpClient.get(loadParam).subscribe((data) => {
      this.footballGroupings = data;
      this.toggleGames = this.initializeToggleGroupings(this.footballGroupings, 0, 1);
      this.toggleGames['Sve']['Konacan ishod'] = true;

      if(this.simpleMatch.sport === 'BasketballPlayers'){
        this.toggleGames['Sve']['Ukupno Poena'] = true;
      }
      if(this.simpleMatch.sport === 'NFL'){
        this.toggleGames['Sve']['Konacan ishod uklj. produzetke'] = true;
      }
    });

    }
    else{
    const url = this.router.url.substring(7);
    // console.log(url);
    const sport = url.split("_")[0];
    // console.log(sport);
    const id = url.split("_")[1];
    // console.log(id);
    this.matchDetailService.getFullMatchViaID(id, sport).subscribe(data => {
      this.match = data;
      // console.log(this.match);
      this.selectedLimit = this.sharedDataService.getSelectedLimit(this.match._id);
    });

    let loadParam : string = 'assets/football_groupings.json';
    let flag = false;

    if(sport === 'Basketball'){
      loadParam = 'assets/basketball_groupings.json';
      flag = true;
    }
    if(sport === 'Tennis'){
      loadParam = 'assets/tennis_groupings.json';
      flag = true;
    }
    
    if(sport === 'NFL'){
      loadParam = 'assets/nfl_groupings.json';
      flag = true;
    }
    
    if(sport === 'Handball'){
      loadParam = 'assets/handball_groupings.json';
      flag = true;
    }
    
    if(sport === 'BasketballPlayers'){
      loadParam = 'assets/players_groupings.json';
      flag = true;
    }

    if (flag){
      this.orderedGroupings = ['Sve'];
      this.toggleGroupings = {
        "Sve" : true
      };
    }
    
    this.httpClient.get(loadParam).subscribe((data) => {
      this.footballGroupings = data;
      this.toggleGames = this.initializeToggleGroupings(this.footballGroupings, 0, 1);
      this.toggleGames['Sve']['Konacan ishod'] = true;

      if(sport === 'BasketballPlayers'){
        this.toggleGames['Sve']['Ukupno Poena'] = true;
      }
      if(sport === 'NFL'){
        this.toggleGames['Sve']['Konacan ishod uklj. produzetke'] = true;
      }
    }); 
    }

       
  }


  isSelected(match : any, bettingGame : string) : boolean{
    return this.bettingService.isSelected(match.id, bettingGame);
  }


  formatOdds(odds: number | string): string {
    if (typeof odds === 'number') {
      return odds.toFixed(2);
    }
    return odds;
  }

  
  navigateBack() {
    this.location.back();
  }


  // Sidebar stuff:
  hideSideBar(): void{
    this.sharedDataService.setSideBarBoolean(false);

    if(this.isMobile){
    this.bettingService.setShowTicket(false);
    }
  }

  search(bettingHouse: string, searchTerm : string) {
    if (bettingHouse !in this.bettingHouses){
      return;
    }

    if (searchTerm.length < 3){
      return;
    }
    const url = `${this.apiBaseUrl}/api/v1/full/specificBettingHouseMatchList?bettingHouse=${bettingHouse}&sport=${this.match.sport}&query=${searchTerm}`;
    

    this.httpClient.get<SimpleMatch[]>(url)
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(results => {
        this.searchResults = results;
      }, error => {
        console.error(`Search error for ${bettingHouse}:`, error);
        this.searchResults = [];
      });
  }

  onResultSelect(bettingHouse: string, result: SimpleMatch) {
    const pinnHomeId = this.match.PinnBet.homeId;
    const pinnAwayId = this.match.PinnBet.awayId;
    const url = `${this.apiBaseUrl}/api/v1/full/updateMatchingForBettingHouse`;

    this.httpClient.put(url, { sport : this.match.sport, 
                              pinnbetId : this.match.id,
                              pinnbetHomeId : pinnHomeId, 
                              pinnbetAwayId : pinnAwayId, 
                              bettingHouse : bettingHouse, 
                              homeId: result.homeId,  
                              awayId : result.awayId,
                              bettingHouseId : result.id})
      .subscribe(response => {
        console.log(`Action response for ${bettingHouse}:`, response);
        this.searchResults = [];
        this.searchTerm = '';
      }, error => {
        console.error(`Action error for ${bettingHouse}:`, error);
      });
  }

  RemoveMappingForBettingHouse(bettingHouse: string) {
    const pinnHomeId = this.match.PinnBet.homeId;
    const pinnAwayId = this.match.PinnBet.awayId;
    const url = `${this.apiBaseUrl}/api/v1/full/updateMatchingForBettingHouse`;

    this.httpClient.put(url, { sport : this.match.sport, 
                              pinnbetId : this.match.id,
                              pinnbetHomeId : pinnHomeId, 
                              pinnbetAwayId : pinnAwayId, 
                              bettingHouse : bettingHouse, 
                              homeId: -1,  
                              awayId : -1,
                              bettingHouseId : null})
      .subscribe(response => {
        console.log(`Action response for ${bettingHouse}:`, response);
        this.searchResults = [];
        this.searchTerm = '';
        location.reload();
      }, error => {
        console.error(`Action error for ${bettingHouse}:`, error);
      });
  }
}
