import { Component } from '@angular/core';
import { SearchService } from '../all-sports/services/search.service';
import { Game } from '../all-sports/DTOs/search-dto';
import { SlugifyPipe } from '../slugify.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})

export class SearchBarComponent {
encodeURIComponent(arg0: string) {
throw new Error('Method not implemented.');
}
  searchQuery: string = '';
  searchResults: Game[] = [];
  private slugifyPipe = new SlugifyPipe();
  showResults : boolean = true;

  constructor(private searchService: SearchService, private router : Router) {}

  onSearch(): void {
    if (!this.searchQuery || this.searchQuery.length < 3) {
      this.searchResults = [];
      return;
    }

    if (this.searchQuery) {
      this.searchService.searchGames(this.searchQuery).subscribe({
        next: (data) => {
          this.searchResults = data;
          // console.log(data);
        },
        error: (error) => {
          // console.error('Error fetching search results:', error);
        }
      });
    } else {
      this.searchResults = [];
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  onFocus(): void {
    if (this.searchQuery) {
      this.showResults = true;
    }
  }
  
  navigateToMatch(match : any){
    const slugifiedName = this.slugifyPipe.transform(match.home + "_" + match.away);
    this.router.navigate(['/match', slugifiedName], { state: { match } });
  }
  
}

