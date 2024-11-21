import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  users: any[] = []; 
  dataLoaded = false;

  constructor(private http: HttpClient) {}

  saveUser(user: any): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/users`, user).pipe(
      tap((newUser) => {
        this.users.push(newUser); 
      }),
      map(() => ({
        success: true,
        message: 'User registered successfully!',
      }))
    );
  }

  // Get all users
  getUsers(): Observable<any[]> {
    return this.loadInitialData().pipe(
      map(() => this.users)
    );
  }


  loadInitialData(): Observable<any> {
    return this.http.get<any[]>(`http://localhost:3000/users`).pipe(
      tap((data : any) => {
        if (!this.dataLoaded) {
          this.users = data.users;
          console.log(this.users)
          this.dataLoaded = true;
        }
      })
    );
  }
}
