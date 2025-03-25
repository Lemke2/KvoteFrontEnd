import { Component } from '@angular/core';
import { User } from '../userDTO';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  user!: User
  updateForm!: FormGroup;
  
  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(){
    const userName = this.route.snapshot.params['userName']

    this.userService.getSingleUser(userName).subscribe({
      next: (data) => {
        this.user = data;
        // console.log(this.user);
        this.updateForm = new FormGroup({
          packageType: new FormControl(this.user.packageType),
          packageDuration: new FormControl(this.user.expirationDate),
          surebetType: new FormControl(this.user.surebetType),
          surebetExpirationDate: new FormControl(this.user.surebetExpirationDate),
          telegram: new FormControl(this.user.telegram),
          bettingHouse : new FormControl(this.user.bettingHouse)
        });

      },

      error: (error) => {
        console.error(error);
      }
    })

    
  }


  onSubmit(){
    if (this.updateForm.invalid) {
      return;
    }

    const packageType = this.updateForm.controls['packageType'].value;
    const packageDuration = this.updateForm.controls['packageDuration'].value;
    const surebetType = this.updateForm.controls['surebetType'].value;
    const surebetExpirationDate = this.updateForm.controls['surebetExpirationDate'].value;
    const telegram = this.updateForm.controls['telegram'].value;
    const bettingHouse = this.updateForm.controls['bettingHouse'].value;

    this.userService.updateTypeAndDurationOfPackage(this.user.userName, packageType, packageDuration, surebetType, surebetExpirationDate, telegram, bettingHouse).subscribe(data=> { 
      // console.log(data);
      this.user = data;
      this.updateForm.patchValue({
        packageType: this.user.packageType,
        packageDuration: this.user.expirationDate,
        surebetType: this.user.surebetType,
        surebetExpirationDate: this.user.surebetExpirationDate,
        telegram: this.user.telegram,
        bettingHouse: this.user.bettingHouse
      });
    });

    this.userService.refreshToken().subscribe(newToken  => {
      // console.log(newToken);
      localStorage.setItem('authToken', newToken['token']);
    });
  }
}
