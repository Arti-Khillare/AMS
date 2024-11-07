import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  // Google login
  googleLogin(): void {
    this.authService.googleLogin()
      .catch((error) => {
        this.errorMessage = 'Google login failed. Please try again.';
      });
  }
}
