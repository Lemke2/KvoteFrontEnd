import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatchDetailService } from '../match-detail/Services/match-detail.service';
import { SharedDataService } from '../all-sports/services/shared-data.service';
import {Location} from '@angular/common';
import {SurebetDocument, SurebetField} from 'src/app/surebet/Surebet-Type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-surebet',
  templateUrl: './surebet.component.html',
  styleUrls: ['./surebet.component.css']
})
export class SurebetComponent {
  params !: string;
  match !: SurebetDocument;
  displaySidebar: boolean = false;
  totalStake : number = 1000;
  selectedSurebet !: SurebetField;
  showBettingTicket : boolean = false;
  isMobile: boolean = false;
  private subscriptions = new Subscription();
  
  constructor(
    private route: ActivatedRoute, 
    private matchDetailService : MatchDetailService, 
    private sharedDataService: SharedDataService,
    private location: Location
    ) {}

  ngOnInit() {
    this.updateDeviceType();
    window.addEventListener('resize', this.updateDeviceType.bind(this));

    this.subscriptions.add(
      this.sharedDataService.sideBarBoolean$.subscribe(shown => {
        this.displaySidebar = shown;
      })
    );

    this.route.paramMap.subscribe(params => {
      const allParams = params.get('params');

      if (allParams) {
        this.params = allParams

        this.matchDetailService.getSurebet(this.params).subscribe(data => {
          this.match = data;
          // console.log(this.match);
          this.sortBettingHouses();
          this.selectedSurebet = this.createSelectedSurebetInstance(0);
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    window.removeEventListener('resize', this.updateDeviceType.bind(this));
  }

  updateDeviceType() {
    this.isMobile = window.innerWidth < 768; // Set your own mobile breakpoint
    if(!this.isMobile){
      this.showBettingTicket = true;
    }
  }

  sortBettingHouses() {
    if (this.match && this.match.bettingHouses) {
      this.match.bettingHouses.sort((a, b) => b.profitMargin - a.profitMargin);
    }
  }

  selectSurebet(index: number, event: MouseEvent): void {
    if(this.isMobile){
      if(this.displaySidebar){
        this.sharedDataService.setSideBarBoolean(false);
      }

      else if(!this.showBettingTicket){
        event.stopPropagation();
        this.showBettingTicket = true;
      }
    }

    this.selectedSurebet = this.createSelectedSurebetInstance(index);
    this.totalStake = 1000;
  }

  createSelectedSurebetInstance(index: number): SurebetField {
    const odds = this.match['bettingHouses'][index]['odds'];
    const fieldNames = this.match['bettingHouses'][index]['fieldNames'];
    const editableOdds = this.parseMaxOdds(odds);
    const editableStakes = this.parseStakes(editableOdds);

    const ret: SurebetField = {
        odds: odds,
        requestedFields: fieldNames,
        editableOdds: editableOdds,
        editableStakes: editableStakes
    };

    return ret;
}


  isHighestOddsOfGroup(odds: number[], index: number): boolean {
    const valueAtIndex = odds[index];
    const maxValue = Math.max(...odds);
    return valueAtIndex === maxValue;
  }
  
  getHighestOddsForField(field: string): number{
    const odds : number[] = this.selectedSurebet.odds[field];


    const maxValue = Math.max(...odds);

    return maxValue;
  }

  getMaximumOdds(oddsArray: number[]): number {
    // Filter out zeros and find the maximum value
    return Math.max(...oddsArray.filter(od => od > 0));
  }

  parseMaxOdds(odds: { [key: string]: number[] }) {
    const maxOdds: { [key: string]: number } = {};

    for (const key in odds) {
        if (odds.hasOwnProperty(key)) {
            const max = Math.max(...odds[key]);
            maxOdds[key] = max;
        }
    }

    return maxOdds as { [key: string]: number }; // Asserting the type to TypeScript
  }

  parseStakes(maxOdds: { [key: string]: number }) {
    const sumOfInverses = Object.values(maxOdds).reduce((acc, odds) => acc + (1 / odds), 0);

    let stakes: {[key: string]: number} = {}; // Explicitly define the type of stakes

    for (let field in maxOdds) {
      stakes[field] = (1 / maxOdds[field]);
      stakes[field] = (stakes[field]/sumOfInverses) * this.totalStake;
    }

    return stakes as { [key: string]: number };
  }
  


  calculateProfitMargin(oddsObj: {[key: string]: number[]}): number {
    const totalStake = 100; // Define your total stake
    let maxOdds: {[key: string]: number} = {};
    Object.keys(oddsObj).forEach(key => {
      maxOdds[key] = Math.max(...oddsObj[key].filter(od => od > 0)); // Filter out zero odds
    });

    const sumOfInverses = Object.values(maxOdds).reduce((acc, odds) => acc + (1 / odds), 0);
    let stakes: {[key: string]: number} = {}; // Explicitly define the type of stakes

    for (let field in maxOdds) {
      stakes[field] = (1 / maxOdds[field]);
      stakes[field] = (stakes[field]/sumOfInverses) * totalStake;
    }
  
    let totalWinnings = 0;
    Object.keys(stakes).forEach(key => {
      const maxOdds = Math.max(...oddsObj[key].filter(od => od > 0));
      totalWinnings = stakes[key] * maxOdds;
    });
  
    const profit = totalWinnings - totalStake;
    const profitMargin = (profit / totalStake) * 100;
    return profitMargin;
  }

  CalculateWinnings(field: string): number {
    const winnings = this.selectedSurebet.editableOdds[field] * this.selectedSurebet.editableStakes[field] - this.totalStake;

    return winnings;
  }

  formatNumber(value: number): string {
    if (!value && value !== 0) return ''; // Handle empty value
    return value.toFixed(2);
  }

  updateTotalStake(): void {
    this.totalStake = Object.values(this.selectedSurebet.editableStakes)
                            .reduce((acc, stake) => acc + (stake || 0), 0);
  }

  getStake(field: string): string {
    // Use Math.round to convert the number to the nearest whole number
    return Math.round(this.selectedSurebet.editableStakes[field]).toString();
  }

  setOdds(field: string, value: string): void {
    this.selectedSurebet.editableOdds[field] = parseFloat(value);
    this.selectedSurebet.editableStakes = this.parseStakes(this.selectedSurebet.editableOdds);
  }

  setStake(field: string, value: string): void {
    this.selectedSurebet.editableStakes[field] = parseFloat(value);
    this.updateTotalStake();
  }

  //Called when total winnings are increased/decreased DIRECTLY
  setStakesAndWinnings(){
    this.selectedSurebet.editableStakes = this.parseStakes(this.selectedSurebet.editableOdds);
  }

  clearTicket(): void {
    this.totalStake = 0;
    this.selectedSurebet.editableOdds = {};
    this.selectedSurebet.editableStakes = {};
  }
  
  navigateBack() {
    this.location.back();
  }

  hideSideBar(): void{
    if(this.isMobile){
      this.sharedDataService.setSideBarBoolean(false);
      this.showBettingTicket = false;
    }
  }

  toggleBettingTicket(): void {
    this.showBettingTicket = !this.showBettingTicket;
  }
}
