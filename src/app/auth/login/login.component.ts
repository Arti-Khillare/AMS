import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  errorMessage: string = '';
  email: string = '';    
  password: string = ''; 
  constructor(private authService: AuthService) {}

  // Google login
  googleLogin(): void {
    this.authService.googleLogin()
      .catch((error) => {
        this.errorMessage = 'Google login failed. Please try again.';
      });
  }
}
