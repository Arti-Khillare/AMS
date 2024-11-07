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

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [HttpClientModule, FullCalendarModule],
  template: `
    <div class="calendar-container">
      <full-calendar
        #calendar
        [options]="calendarOptions">
      </full-calendar>
    </div>
  `,
  styles: [`
    .calendar-container {
      margin: 20px;
      height: calc(100vh - 40px);
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddEventComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  isMobile = false;
  
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
    const clickedDate = new Date(arg.date);
    if (clickedDate.getDay() === 0 || clickedDate.getDay() === 6) {
      alert('Event creation is not allowed on weekends.');
      return;
    }

    const title = prompt('Enter event title:');
    if (title) {
      const startTime = prompt('Enter start time (HH:mm):');
      const endTime = prompt('Enter end time (HH:mm):');
      if (startTime && endTime && this.isValidTimeFormat(startTime) && this.isValidTimeFormat(endTime)) {
        const startDateTime = `${arg.dateStr}T${startTime}:00`;
        const endDateTime = `${arg.dateStr}T${endTime}:00`;
        const newEvent: EventInput = { title, start: startDateTime, end: endDateTime };
        this.events = [...this.events, newEvent];
        if (this.calendarComponent) {
          this.calendarComponent.getApi().addEvent(newEvent);
        }
        localStorage.setItem('events', JSON.stringify(this.events));
      } else {
        alert('Invalid input. Please enter both start and end times in HH:mm format');
      }
    }
  }

  handleEventClick(arg: any) {
    const eventId = arg.event.id;
    if (confirm('Do you want to edit this event?')) {
      const title = prompt('Enter event title:');
      if (title) {
        const startTime = prompt('Enter start time (HH:mm):');
        const endTime = prompt('Enter end time (HH:mm):');
        if (startTime && endTime && this.isValidTimeFormat(startTime) && this.isValidTimeFormat(endTime)) {
          const startDateTime = `${arg.event.startStr.split('T')[0]}T${startTime}:00`;
          const endDateTime = `${arg.event.startStr.split('T')[0]}T${endTime}:00`;
          const event = this.calendarComponent.getApi().getEventById(eventId);
          if (event) {
            event.setProp('title', title);
            event.setStart(startDateTime);
            event.setEnd(endDateTime);
            localStorage.setItem('events', JSON.stringify(this.events));
          }
        } else {
          alert('Invalid input. Please enter both start and end times in HH:mm format');
        }
      }
    }
  }

  isValidTimeFormat(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  }

  checkScreenWidth() {
    this.isMobile = window.innerWidth < 768;
  }
}