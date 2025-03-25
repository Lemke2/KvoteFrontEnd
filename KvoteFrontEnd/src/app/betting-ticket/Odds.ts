import { SimpleMatch } from "../all-sports/DTOs/simple-dto";

export interface MultiHouseOdds {
    matchUrl : string;
    thisMatch: SimpleMatch;
    bettingGame: string;
    limit: string;
    oddsByHouse: Record<string, number>;
  }
  