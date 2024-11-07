import { AfterViewInit, Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, FullCalendarModule,FormsModule],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
})
export class AddEventComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  isMobile = false;
  showModal: boolean = false;
  modalData = {
    title: '',
    startTime: '',
    endTime: '',
    selectedDate: '',
    email: ''
  };

  
  events: EventInput[] = [
    { title: 'MAKARA SANKRANTI', start: '2024-01-15', allDay: true, backgroundColor: 'green' },
    { title: 'REPUBLIC DAY', start: '2024-01-26', allDay: true, backgroundColor: 'green' },
  ];

  calendarOptions: CalendarOptions = {
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin,
      listPlugin,
      bootstrapPlugin
    ],
    initialView: 'dayGridMonth',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,list'
    },
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
      list: 'List'
    },
    nowIndicator: true,
    selectable: true,
    editable: true,
    navLinks: true,
    eventTextColor: 'white',
    themeSystem: 'bootstrap4',
    eventBackgroundColor: 'blue',
    events: this.events,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEventsFromServer();
  }

  ngAfterViewInit() {
    this.checkScreenWidth();
    window.addEventListener('resize', this.checkScreenWidth.bind(this));
  }

  loadEventsFromServer() {
    this.fetchAvailableSlots().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          const mappedEvents = data.map((event) => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end
          }));
          
          if (this.calendarComponent) {
            const calendarApi = this.calendarComponent.getApi();
            calendarApi.removeAllEvents();
            calendarApi.addEventSource(mappedEvents);
          }
        }
      },
      error: (err) => console.error('Error fetching events:', err)
    });
  }

  fetchAvailableSlots(): Observable<EventInput[]> {
    return this.http.get<EventInput[]>('http://localhost:3000/events')
      .pipe(
        catchError((err) => {
          console.error('Error:', err);
          return of([]); // Return empty array on error
        })
      );
  }

  handleDateClick(arg: any) {
    // const clickedDate = new Date(arg.date);
    // if (clickedDate.getDay() === 0 || clickedDate.getDay() === 6) {
    //   alert('Event creation is not allowed on weekends.');
    //   return;
    // }

    // const title = prompt('Enter event title:');
    // if (title) {
    //   const startTime = prompt('Enter start time (HH:mm):');
    //   const endTime = prompt('Enter end time (HH:mm):');
    //   if (startTime && endTime && this.isValidTimeFormat(startTime) && this.isValidTimeFormat(endTime)) {
    //     const startDateTime = `${arg.dateStr}T${startTime}:00`;
    //     const endDateTime = `${arg.dateStr}T${endTime}:00`;
    //     const newEvent: EventInput = { title, start: startDateTime, end: endDateTime };
    //     this.events = [...this.events, newEvent];
    //     if (this.calendarComponent) {
    //       this.calendarComponent.getApi().addEvent(newEvent);
    //     }
    //     localStorage.setItem('events', JSON.stringify(this.events));
    //   } else {
    //     alert('Invalid input. Please enter both start and end times in HH:mm format');
    //   }
    // }

 
      const clickedDate = new Date(arg.date);
    
      // Prevent event creation on weekends
      if (clickedDate.getDay() === 0 || clickedDate.getDay() === 6) {
        alert('Event creation is not allowed on weekends.');
        return;
      }
    
      // Open the modal with the clicked date for event creation
      this.modalData = {
        title: '',
        startTime: '',
        endTime: '',
        selectedDate: arg.dateStr,
        email : ''
      };
      this.showModal = true;
    
  }

  handleEventClick(arg: any) {
    // const eventId = arg.event.id;
    // if (confirm('Do you want to edit this event?')) {
    //   const title = prompt('Enter event title:');
    //   if (title) {
    //     const startTime = prompt('Enter start time (HH:mm):');
    //     const endTime = prompt('Enter end time (HH:mm):');
    //     if (startTime && endTime && this.isValidTimeFormat(startTime) && this.isValidTimeFormat(endTime)) {
    //       const startDateTime = `${arg.event.startStr.split('T')[0]}T${startTime}:00`;
    //       const endDateTime = `${arg.event.startStr.split('T')[0]}T${endTime}:00`;
    //       const event = this.calendarComponent.getApi().getEventById(eventId);
    //       if (event) {
    //         event.setProp('title', title);
    //         event.setStart(startDateTime);
    //         event.setEnd(endDateTime);
    //         localStorage.setItem('events', JSON.stringify(this.events));
    //       }
    //     } else {
    //       alert('Invalid input. Please enter both start and end times in HH:mm format');
    //     }
    //   }
    // }
    const eventId = arg.event.id;

    // Pre-fill modal data with the clicked event details
    this.modalData = {
      title: arg.event.title,
      startTime: arg.event.startStr.split('T')[1].substring(0, 5),  // Extract time from startStr
      endTime: arg.event.endStr.split('T')[1].substring(0, 5),      // Extract time from endStr
      selectedDate: arg.event.startStr.split('T')[0],  // Store the date part
      email: arg.event.email
    };

    // Open the modal with pre-filled event data for editing
    this.showModal = true;
  }

  isValidTimeFormat(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  }

  checkScreenWidth() {
    this.isMobile = window.innerWidth < 768;
  }


  closeModal(): void {
    this.showModal = false; // Close the modal by changing the visibility flag
  }

  createEventInCalendar(event: any) {
    // Ensure the event is created with the correct format
    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      const newEvent: EventInput = {
        title: event.title,
        start: `${event.selectedDate}T${event.startTime}:00`, 
        end: `${event.selectedDate}T${event.endTime}:00`,     
        email: event.email,                                    // Optional, if you need to store email
        backgroundColor: 'blue',                               // Optional: Set event background color
        textColor: 'white'                                     // Optional: Set text color for contrast
      };
  
      // Add the event to the calendar
      calendarApi.addEvent(newEvent);
  
      // Optionally, you can update your local event list if needed
      this.events = [...this.events, newEvent];
  
      // Optionally, save the event to localStorage or make an API call here to persist data
    }
  }
  

  sendEventEmail(event :any) {
    console.log('Sending event email to:', event.email);
  }

  onSubmit(): void {
    // Create the event object
    const newEvent = {
      title: this.modalData.title,
      startTime: this.modalData.startTime,
      endTime: this.modalData.endTime,
      email: this.modalData.email,
    };

    // Send the event to your calendar service
    this.createEventInCalendar(newEvent);

    // Send email notification to the provided email address
    this.sendEventEmail(newEvent);

    console.log('Event created:', this.modalData);
    // You can add logic here to save the event, e.g., make an API call
    this.closeModal(); // Close modal after submission
  }
  
}
