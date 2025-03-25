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
  }

  navigateToUser(user: User){
    this.router.navigate(['/user', user.userName]);
  }

}
