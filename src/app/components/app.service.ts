import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  fetchAvailableSlots(): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:3000/events`);
  }
}
