import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  USER_KEY = 'user_data';
  loggedIn = new BehaviorSubject<boolean>(this.hasValidUser());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router, private auth: Auth, private http: HttpClient,) {}

  // Checks if user data exists in localStorage
  hasValidUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return !!user;
  }

  // Google login
  googleLogin(){
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        const user = result.user;
        const role = this.getUserRoleFromGoogleUser(user);
        this.saveUserData(user, role);
        this.loggedIn.next(true); 
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Google login failed', error);
      });
  }

  // Save user info to localStorage
  saveUserData(user: any, role : any){
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      role: role || user.role
    };
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  login(email: string, password: string) {
    return this.http.get<any[]>(`http://localhost:3000/users?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          this.saveUserData(users[0], users[0].role);
          this.loggedIn.next(true);
          this.router.navigate(['/home']);
          return users[0];
        } else {
          throw new Error('Invalid email or password');
        }
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }
 
  getUserRole() {
    const user = JSON.parse(localStorage.getItem(this.USER_KEY) || '{}');
    console.log(user)
    return user.role;
  }

  getUserRoleFromGoogleUser(user: any) {
    if (user.email.includes('@admin.com')) {
      return 'admin';
    }
    return 'user';
  }
  
  // Logout
  logout(){
    localStorage.removeItem(this.USER_KEY); 
    this.loggedIn.next(false); 
    this.router.navigate(['/login']); 
  }
}
