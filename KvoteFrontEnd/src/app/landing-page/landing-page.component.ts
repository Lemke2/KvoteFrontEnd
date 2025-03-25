import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit{
  listaKladionica : String[] = ["Admiralbet", "Balkanbet", "BetOle", "BrazilBet", "Maxbet", "Meridianbet", "MerkurXTip", "Mozzartbet",
  "Oktagonbet", "Pinnbet", "PlanetWin365", "Soccerbet"]
  
  plansPoredjenje = [
    { duration: '1 Mesec', price: 40.00 },
    { duration: '6 Meseci', price: 200.00 },
    { duration: '12 Meseci', price: 400.00 }
  ];

  plansSurebets999 = [
    { duration: '1 Mesec', price: 100.00 },
    { duration: '6 Meseci', price: 500.00 },
    { duration: '12 Meseci', price: 1000.00 }
  ];

  plansSurebets6 = [
    { duration: '1 Mesec', price: 70.00 },
    { duration: '6 Meseci', price: 350.00 },
    { duration: '12 Meseci', price: 700.00 }
  ];

  plansSurebets3 = [
    { duration: '1 Mesec', price: 40.00 },
    { duration: '6 Meseci', price: 200.00 },
    { duration: '12 Meseci', price: 400.00 }
  ];
  ngOnInit(): void {}

}
