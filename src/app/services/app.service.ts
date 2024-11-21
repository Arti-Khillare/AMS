import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  events: EventInput[] = [];
  constructor(private http: HttpClient) { }

  fetchAvailableSlots(): Observable<string[]> {
    return this.http.get<string[]>(`http://localhost:3000/events`);
  }
  
  getEvents(): EventInput[] {
    const savedEvents = sessionStorage.getItem('calenderEvents');
    if (savedEvents) {
      this.events = JSON.parse(savedEvents);
    }
    return this.events;
  }
  
}
