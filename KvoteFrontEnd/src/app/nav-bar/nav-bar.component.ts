import { Component } from '@angular/core';
import { UserInfo } from '../admin-pannel/userDTO';
import { Router } from '@angular/router';
import { SharedDataService } from '../all-sports/services/shared-data.service';
import { UserService } from '../admin-pannel/services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  dropdownOpen : boolean = false;
  user!: UserInfo 
  constructor(private router: Router, private sharedDataService : SharedDataService, private userService : UserService) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe({
      next: (userData) => {
        this.user = userData;
        // console.log(this.user);
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });
  }
  
  toggleDropdown() : void{
    this.dropdownOpen = !this.dropdownOpen;
  }

  displayDate() : Boolean{
    if(this.user.packageType === "kvoteFree" || this.user.packageType === "KvoteFree"){
      return false;
    }

    return true;
  }
  
  logOut(){
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }

  openSideBar() : void{
    this.sharedDataService.setSideBarBoolean(true);
  }
}
