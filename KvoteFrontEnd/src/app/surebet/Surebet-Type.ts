export interface SurebetDocument {
    id: string;
    bettingHouses: BettingHouse[];
    allFields: string[];
    home: string;
    away: string;
    league: string;
    startTime: number;
  }
  
export  interface BettingHouse {
    id: string;
    profitMargin: number;
    sport: string;
    odds: { [key: string]: number[] }; // Dictionary with string keys and array of numbers as values
    name: string;
    floats: number[];
    fieldNames: string[];
  }
  

export interface SurebetField {
    odds: { [key: string]: number[] };                 // The name of the field, like "1X", "K2", etc.
    requestedFields : string[];
    editableOdds: { [key: string]: number };        // Editable odds, initialized with default highest odds
    editableStakes: { [key: string]: number };  // Editable stakes, user can modify
  }
  