import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './userDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-pannel',
  templateUrl: './admin-pannel.component.html',
  styleUrls: ['./admin-pannel.component.css']
})
export class AdminPannelComponent {
  
  users : User[] | undefined;
  overlappingThreshold : number = 0;

  constructor(private userService: UserService, private router: Router) {}
  
  ngOnInit(){
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        // console.log(this.users);
      },

      error: (error) => {
        // console.error(error);
      }
    })

    this.userService.getOverlapping().subscribe({
      next: (data) => {
        this.overlappingThreshold = data;
      }
    })
  }

  navigateToUser(user: User){
    this.router.navigate(['/user', user.userName]);
  }

  setThreshold(threshold : number){
    this.userService.setThreshold(threshold).subscribe({
      next: (data) => {
        console.log(data);
      }
    });
  }

  navigateToMapping(){
    this.router.navigate(['/mapping']);
  }
}
