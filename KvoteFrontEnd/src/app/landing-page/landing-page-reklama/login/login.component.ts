import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { of } from 'rxjs';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  loginError : string = '';

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(){
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required])
    });
  }

  onSubmit(){
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.controls['email'].value;
    const password = this.loginForm.controls['password'].value;

    this.loginService.login(email, password).subscribe(data=> { 
      this.router.navigate(['/home']);
    },
    
    error => {
      this.loginError = 'Incorrect email or password. Please try again.';
    }
    );

    // this.loginService.dummyFunction().subscribe(data => {
    //   console.log(data);
    // });
  }

}