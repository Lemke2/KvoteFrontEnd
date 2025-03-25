import { SimpleMatch } from "../all-sports/DTOs/simple-dto";

export interface SportLeagueArray{
    sport : string,
    league : string,
    matches : SimpleMatch[]
}