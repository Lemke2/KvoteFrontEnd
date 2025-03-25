import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/admin-pannel/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  errorMessage : string = '';
  token : string = '';
  
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(){
    this.resetPasswordForm = new FormGroup({
      password: new FormControl("", [Validators.required])
    });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }
    

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.password;
  
      this.userService.verifyPasswordToken(this.token, newPassword).subscribe({
        next: (response) => {
          // console.log(response);
          this.errorMessage = "Vaša šifra je resetovana, probajte da se ulogujete";
        },
        error: (error) => {
          // console.log("Error: ", error);
          this.errorMessage = error.error;
        }
      });
    }
  }

}
