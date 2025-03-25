import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { MultiHouseOdds } from './Odds';
import { SharedDataService } from '../all-sports/services/shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class BettingServiceService {
  private selectedOdds = new BehaviorSubject<MultiHouseOdds[]>([]);
  private showTicket = new BehaviorSubject<boolean>(false);
  private animationActive = new BehaviorSubject<boolean>(false);
  private bettingAmmount = new BehaviorSubject<number>(500);

  constructor(private sharedDataService: SharedDataService) { }

  addOddsToTicket(odds: MultiHouseOdds) : void {
    const currentOdds = this.selectedOdds.getValue();
    const existingIndex = currentOdds.findIndex((o) => o.thisMatch.id === odds.thisMatch.id);

    if (existingIndex !== -1) {
        // If the odds already exist and match the betting game, remove them
        if (currentOdds[existingIndex].bettingGame === odds.bettingGame) {
            currentOdds.splice(existingIndex, 1);
        } else {
            // If the odds exist but for a different betting game, replace them
            currentOdds.splice(existingIndex, 1, odds);
        }
    } else {
        // If the odds don't exist, add them
        currentOdds.push(odds);
    }

    // Update the BehaviorSubject to trigger the UI update
    this.selectedOdds.next([...currentOdds]);
}


  getSelectedOddsWithCumulative(): Observable<{ odds: MultiHouseOdds[], cumulative: Record<string, number> }> {
    return this.selectedOdds.pipe(
      map(odds => {
        const cumulative: Record<string, number> = {};
        // Perform cumulative odds calculation
        odds.forEach(oddsItem => {
          Object.keys(oddsItem.oddsByHouse).forEach(house => {
            const oddsValue = oddsItem.oddsByHouse[house];
            if (oddsValue > 0 && !isNaN(oddsValue)) {
              cumulative[house] = (cumulative[house] || 1) * oddsValue;
            }
          });
        });
        return { odds, cumulative };
      })
    );
  }

  clearTicket(): void {
    this.selectedOdds.next([]);
    this.sharedDataService.clearTicket();
  }

  setShowTicket(value: boolean): void {
    this.showTicket.next(value);
  }

  getShowTicket(): Observable<boolean> {
    return this.showTicket.asObservable();
  }

  setAnimationActive(value: boolean): void {
    this.animationActive.next(value);
  }

  getAnimationActive(): Observable<boolean> {
    return this.animationActive.asObservable();
  }

  removeOddsFromTicket(oddsToRemove: MultiHouseOdds): void {
    const currentOdds = this.selectedOdds.getValue();
    const newOdds = currentOdds.filter(odds => odds.thisMatch.id !== oddsToRemove.thisMatch.id);
    this.selectedOdds.next(newOdds);
  }

  getBetAmmount() : Observable<number>{
    return this.bettingAmmount.asObservable();
  }

  increaseAmount() : void{
    const amount = this.bettingAmmount.getValue();

    this.bettingAmmount.next(amount + 500);
  }

  decreaseAmount() : void{
    const amount = this.bettingAmmount.getValue();

    this.bettingAmmount.next(amount - 500);
  }

  isSelected(matchId: string, bettingGame: string): boolean {
    const currentOdds = this.selectedOdds.getValue();
    return currentOdds.some(o => o.thisMatch.id === matchId && o.bettingGame === bettingGame);
  }
}
