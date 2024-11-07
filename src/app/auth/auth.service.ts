import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'user_data';
  private loggedIn = new BehaviorSubject<boolean>(this.hasValidUser());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router, private auth: Auth) {}

  // Checks if user data exists in localStorage
  private hasValidUser(): boolean {
    const user = localStorage.getItem(this.USER_KEY);
    return !!user;
  }

  // Google login
  googleLogin(): Promise<void> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        const user = result.user;
        this.saveUserData(user);
        this.loggedIn.next(true); // Mark as logged in
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Google login failed', error);
      });
  }

  // Save user info to localStorage
  private saveUserData(user: any): void {
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.USER_KEY); // Remove user data from localStorage
    this.loggedIn.next(false); // Set logged-in state to false
    this.router.navigate(['/login']); // Navigate to login page
  }
}
