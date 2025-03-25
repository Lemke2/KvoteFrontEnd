import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

function passwordMatch(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { mismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  loginError : string = '';
  registerMessage: string = '';
  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: passwordMatch });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
  
    const email = this.registerForm.controls['email'].value;
    const password = this.registerForm.controls['password'].value;
  
    this.loginService.register(email, password).subscribe({
      next: (data) => {
        this.registerMessage = "Zahtev za registraciju poslat, proverite vas email da bi ste potvrdili registraciju!"
        this.loginError = '';
      },
      error: (error) => {
        // console.log(error);
        if (error.message === 'UserAlreadyExists') {
          this.loginError = 'User already exists';
          this.registerMessage = '';
        } else {
          this.loginError = error;
          this.registerMessage = '';
        }
      }
    });
  }
  
}
