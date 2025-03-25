import { Component } from '@angular/core';
import { SharedDataService } from '../all-sports/services/shared-data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-date-bar',
  templateUrl: './date-bar.component.html',
  styleUrls: ['./date-bar.component.css']
})
export class DateBarComponent {
  private apiBaseUrl = environment.apiUrl;
  selectedFilter: string = '3days';

  constructor(private sharedDataService: SharedDataService, private httpClient: HttpClient) {}


  setDateFilter(filter: string): void {
    this.selectedFilter = filter;
    const url = `${this.apiBaseUrl}/api/v1/all-sports/matches`;
    
    this.sharedDataService.setSelectedDateFilter(filter);
    this.sharedDataService.fetchMatches(this.httpClient, url)
  }

  ngOnInit(): void {
    this.sharedDataService.getSelectedDateFilter().subscribe(filter => {
      this.selectedFilter = filter;
    });
  }
  
}
