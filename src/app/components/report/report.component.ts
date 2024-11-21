import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit{
  events: any[] = []; 

  constructor(private appService: AppService) {}
  
  ngOnInit() {
    this.events = this.appService.getEvents();
    console.log(this.events)
  }

  updateStatus(eventToUpdate: any) {
    const updatedEvents = this.events.map(event => {
      if (event.id === eventToUpdate.id) {
        return { ...event, status: eventToUpdate.status };
      }
      return event;
    });
    sessionStorage.setItem('calenderEvents', JSON.stringify(updatedEvents));
  }
}
