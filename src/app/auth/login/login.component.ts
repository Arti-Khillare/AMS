import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  signinForm: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Google login
  googleLogin() {
    this.authService.googleLogin()
      .catch((error) => {
        this.errorMessage = 'Google login failed. Please try again.';
      });
  }

  //login using email, password
  login(){
    if (this.signinForm.valid) {
      const { email, password } = this.signinForm.value;
      this.authService.login(email, password).subscribe(
        user => {
          console.log('Login successful:', user);
        },
        error => {
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
          console.error('Login error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
  
  redirectToSignup() {
    this.router.navigate(['signup'])
  }
}
