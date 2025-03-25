import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/admin-pannel/services/user.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent {
  errorMessage : string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.userService.verifyToken(token).subscribe({
          next: (response) => {
            // console.log("Response: ", response);
            // console.log("Status: ", response.status);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            // console.log("Error: ", error);
            this.errorMessage = error.error;
          }
        });        
      }
    });
  }
  
}
