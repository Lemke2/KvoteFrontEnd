import { Component } from '@angular/core';
import { MultiHouseOdds } from './Odds';
import { BettingServiceService } from './betting-service.service';
import { Router } from '@angular/router';
import { SimpleMatch } from '../all-sports/DTOs/simple-dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-betting-ticket',
  templateUrl: './betting-ticket.component.html',
  styleUrls: ['./betting-ticket.component.css']
})
export class BettingTicketComponent {
  showBettingTicket = false;
  animationActive = false;
  private showTicketSubscription!: Subscription;
  selectedOdds : MultiHouseOdds[] = [];
  cumulativeOddsByHouse: Record<string, number> = {};
  betAmount!: number;
  selectedHouse : string = "";
  
  bettingHouseImages : Record<string, string> = {
    'MaxBet': "assets/images/kladionice/MAXB_T.png",
    'Mozzart': "assets/images/kladionice/MOZZ_T.png",
    'Admiral': "assets/images/kladionice/MILL_ADM_T.png",
    'Meridian': "assets/images/kladionice/MERI_T.png",
    'BalkanBet': "assets/images/kladionice/BALK_T.png",
    'BetOle': "assets/images/kladionice/BTOL_T.png",
    'BrazilBet': "assets/images/kladionice/BRAZIL_T.png",
    'Merkur': "assets/images/kladionice/MRKR_T.png",
    'OktagonBet': "assets/images/kladionice/OKTG_T.png",
    'PinnBet': "assets/images/kladionice/PINN_T.png",
    'PlanetWin': "assets/images/kladionice/P365_T.png",
    'SoccerBet': "assets/images/kladionice/SOCC_T.png",
    'SuperBet': "assets/images/kladionice/SUPB_T.png",
  };

  
  constructor(private bettingService: BettingServiceService, private router: Router){}
  
  ngOnInit() {
    this.showTicketSubscription = this.bettingService.getShowTicket().subscribe(value => {
      this.showBettingTicket = value;
    });

    this.bettingService.getSelectedOddsWithCumulative().subscribe(({ odds, cumulative }) => {
      this.selectedOdds = odds;
      this.cumulativeOddsByHouse = cumulative;
    });

    this.bettingService.getBetAmmount().subscribe(ammount => {
      this.betAmount = ammount;
    });

    this.bettingService.getAnimationActive().subscribe(value => {
      this.animationActive = value;
    });
  }

  ngOnDestroy() {
    if (this.showTicketSubscription) {
      this.showTicketSubscription.unsubscribe();
    }
  }

  toggleBettingTicket(): void {
    this.bettingService.setShowTicket(!this.showBettingTicket);
  }

  isInvalidOdds(house: string): boolean {
    return this.selectedOdds.some(oddsItem => {
      const oddsValue = oddsItem.oddsByHouse[house];
      return oddsValue <= 0 || isNaN(oddsValue);
    });
  }
  
  clearTicket(): void {
    this.bettingService.clearTicket();
  }

  navigateToMatch(slugifiedName: string, match: SimpleMatch): void {
    this.router.navigate([slugifiedName], { state: { match } });
  }

  getSortedCumulativeOdds(): [string, number][] {
    return Object.entries(this.cumulativeOddsByHouse)
      .sort((a, b) => b[1] - a[1]); // Sort in descending order
  }

  getSortedSingleOdds(oddsByHouse: Record<string, number>): number {
    if(this.selectedHouse === ""){
      const values = Object.values(oddsByHouse).filter(val => !isNaN(val));
      return Math.max(...values);
    }
    
    return oddsByHouse[this.selectedHouse];
  }

  deleteOneBet(oddsToDelete: MultiHouseOdds): void{
    this.bettingService.removeOddsFromTicket(oddsToDelete);
  }

  increaseAmount(): void {
    this.bettingService.increaseAmount();
  }

  decreaseAmount(): void {
    if (this.betAmount > 0) {
      this.bettingService.decreaseAmount();
    }
  }

  displayBettingHouse(bettingHouse : string) : void{
    this.selectedHouse = bettingHouse;
  }

  oddsAreNaN(input : Record<string, number>) : boolean{
    if(this.selectedHouse === ""){
      return false;
    }

    return isNaN(input[this.selectedHouse])
  }

  calculateModifiedOdds(bettingHouse: string, profit: number): number {
    let counter : number = 0;
    
    const bonusRules : Record<string, Record<number, number>> = {
      'Meridian': {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 2,
        6: 2,
        7: 7,
        8: 10,
        9: 12,
        10: 15,
        11: 17,
        12: 20,
        13: 22,
        14: 25,
        15: 27,
        16: 30,
        17: 32,
        18: 33,
        19: 34,
        20: 35,
      },

      'MaxBet': { 
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 3,
        12: 5,
        13: 10,
        14: 15,
        15: 20,
        16: 25,
        17: 30,
        18: 35,
        19: 40,
        20: 45
      },

      'SoccerBet': { 
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 3,
        6: 5,
        7: 10,
        8: 15,
        9: 20,
        10: 25,
        11: 30,
        12: 35,
        13: 40,
        14: 45,
        15: 50,
        16: 50,
        17: 60,
        18: 60,
        19: 60,
        20: 60
      },

      'BalkanBet':{
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 3,
        6: 5,
        7: 10,
        8: 15,
        9: 20,
        10: 25,
        11: 30,
        12: 35,
        13: 40,
        14: 45,
        15: 50,
        16: 50,
        17: 50,
        18: 50,
        19: 50,
        20: 50
      },

      'Admiral': {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 3,
        6: 5,
        7: 10,
        8: 15,
        9: 20,
        10: 25,
        11: 30,
        12: 35,
        13: 40,
        14: 45,
        15: 50,
        16: 60,
        17: 70,
        18: 80,
        19: 90,
        20: 100
      },

      'BetOle': {
        1: 0,
        2: 0,
        3: 0,
        4: 1,
        5: 3,
        6: 5,
        7: 10,
        8: 15,
        9: 20,
        10: 25,
        11: 30,
        12: 35,
        13: 40,
        14: 45,
        15: 50,
        16: 55,
        17: 60,
        18: 70,
        19: 80,
        20: 0
      },

      'Merkur': {
        1: 0,
        2: 0,
        3: 0,
        4: 1,
        5: 3,
        6: 5,
        7: 10,
        8: 15,
        9: 20,
        10: 25,
        11: 30,
        12: 35,
        13: 40,
        14: 45,
        15: 50,
        16: 50,
        17: 50,
        18: 50,
        19: 50,
        20: 100
      },

      'OktagonBet': {
        1: 0,
        2: 0,
        3: 0,
        4: 1,
        5: 5,
        6: 7,
        7: 10,
        8: 15,
        9: 20,
        10: 25,
        11: 30,
        12: 35,
        13: 40,
        14: 48,
        15: 58,
        16: 68,
        17: 78,
        18: 88,
        19: 98,
        20: 108
      },

      'PinnBet': {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 3,
        6: 5,
        7: 10,
        8: 15,
        9: 20,
        10: 25,
        11: 30,
        12: 35,
        13: 40,
        14: 45,
        15: 50,
        16: 55,
        17: 60,
        18: 65,
        19: 70,
        20: 75
      },

      'PlanetWin': {
        1: 0,
        2: 0,
        3: 0,
        4: 5,
        5: 10,
        6: 15,
        7: 20,
        8: 25,
        9: 30,
        10: 35,
        11: 40,
        12: 50,
        13: 60,
        14: 70,
        15: 80,
        16: 90,
        17: 100,
        18: 115,
        19: 130,
        20: 145
      },

      'Mozzart': {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 2,
        6: 5,
        7: 7,
        8: 10,
        9: 12,
        10: 15,
        11: 20,
        12: 25,
        13: 30,
        14: 30,
        15: 35,
        16: 35,
        17: 40,
        18: 40,
        19: 40,
        20: 50
      }
    };

    
    if(bettingHouse === "MaxBet"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.35).length;
    }

    if(bettingHouse === "Mozzart"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.35).length;
    }

    if(bettingHouse === "Admiral"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.30).length;
    }

    if(bettingHouse === "Meridian"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.35).length;
    }

    if(bettingHouse === "BalkanBet"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.35).length;
    }

    if(bettingHouse === "BetOle"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.30).length;
    }

    if(bettingHouse === "BrazilBet"){
      return profit;
    }

    if(bettingHouse === "Merkur"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.35).length;
    }

    if(bettingHouse === "OktagonBet"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.35).length;
    }

    if(bettingHouse === "PinnBet"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.25).length;
    }

    if(bettingHouse === "PlanetWin"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.25).length;
    }

    if(bettingHouse === "SoccerBet"){
      counter = this.selectedOdds.filter(element => element.oddsByHouse[bettingHouse] > 1.35).length;
    }

    if(bettingHouse === "SuperBet"){
      return profit;
    }

    // console.log(counter);
    // console.log(bonusRules[bettingHouse][counter]);
    // console.log(profit + 0.01 * bonusRules[bettingHouse][counter]);
    // console.log("AAAA");
    return profit * (1 + bonusRules[bettingHouse][counter] / 100);
  }
}
