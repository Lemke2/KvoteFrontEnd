import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/admin-pannel/services/user.service';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent{
  forgottenPasswordForm!: FormGroup;
  registerMessage: string = '';

  constructor(private userService: UserService){};

  ngOnInit(){
    this.forgottenPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email])
    });
  }

  onSubmit(){
    if (this.forgottenPasswordForm.valid){
      const email = this.forgottenPasswordForm.value.email;
      this.userService.sendForgotPasswordEmail(email).subscribe((value : any) => {
        // console.log(value);
      });
      
      this.registerMessage = "Da bi ste restartovali vasu sifru proverite vas email i kliknite link";
    }
  }
}
