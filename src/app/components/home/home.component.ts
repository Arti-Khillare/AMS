import { Component, Input, OnInit } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { CommonModule, DatePipe } from '@angular/common'; 
import { AppService } from '../../services/app.service'
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [DatePipe]
})
export class HomeComponent implements OnInit{

  events : any[] = []
  showDeleteModal: boolean = false;
  showEditModal: boolean = false;
  selectedEvent: any = null;
  selectedEventId: string | undefined = undefined;
  userRole : any

  constructor(private appService: AppService, private datePipe: DatePipe, private authService: AuthService) {}

  ngOnInit() {
    this.events = this.appService.getEvents();
    console.log(this.events)

    this.userRole = this.authService.getUserRole();
    console.log(this.userRole)

  }

  editEvent(event: EventInput) {
    this.selectedEvent = JSON.parse(JSON.stringify(event));
    console.log(this.selectedEvent);
    

    if (this.selectedEvent.start) {
      this.selectedEvent.startDate = this.datePipe.transform(this.selectedEvent.start, 'yyyy-MM-dd');
      this.selectedEvent.startTime = this.datePipe.transform(this.selectedEvent.start, 'HH:mm');
    }

    if (this.selectedEvent.end) {
      this.selectedEvent.endTime = this.datePipe.transform(this.selectedEvent.end, 'HH:mm');
      console.log(this.selectedEvent.endTime);
    }

    this.showEditModal = true;
  }

  confirmDelete(event: any) {
    this.selectedEvent = event;
    this.showDeleteModal = true;
  }

  // Close the delete modal without deleting
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedEvent = null;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedEvent = null;
  }

  deleteEvent() {
    if (this.selectedEvent) {
      this.events = this.events.filter(event => event.id !== this.selectedEvent.id);
      sessionStorage.setItem('calenderEvents', JSON.stringify(this.events));
      this.closeDeleteModal();
    }
  }

  saveEditedEvent() {
    const index = this.events.findIndex(event => event.id === this.selectedEvent.id);
    console.log(index)
    if (index !== -1) {
        this.events[index] = { ...this.selectedEvent } ; 
        console.log(this.events[index])
        // sessionStorage.setItem('calenderEvents', JSON.stringify(this.events));
        this.closeEditModal();
    }
    console.log('Event updated successfully!', this.events);
  }
  
}
