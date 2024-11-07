import { AfterViewInit, Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core';
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
  private calendarApi: Calendar | undefined
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
    {
      title: 'MAKARA SANKRANTI',
      start: '2024-01-15',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'REPUBLIC DAY',
      start: '2024-01-26',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'UGADI',
      start: '2024-04-09',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'MAY DAY',
      start: '2024-05-01',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'BAKRI EID',
      start: '2024-06-17',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'INDEPENDENCE DAY',
      start: '2024-08-15',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'VINAYAKA CHATURTHI',
      start: '2024-09-07',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'GANDHI JAYANTI',
      start: '2024-10-02',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'VIJAYADASHMI',
      start: '2024-10-12',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'DEEPVALI',
      start: '2024-10-31',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'KANNADA RAJYOTSAVA',
      start: '2024-11-01',
      allDay: true,
      backgroundColor: 'green'
    },
    {
      title: 'CHRISTMAS',
      start: '2024-12-25',
      allDay: true,
      backgroundColor: 'green'
    }
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
    dateClick: (arg) => this.handleDateClick(arg),
    eventClick: (arg: any) => this.handleEventClick(arg),
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log(this.events, "events")
  }

  ngAfterViewInit() {
    this.calendarApi = this.calendarComponent.getApi();
    let currentDate = this.calendarApi.view.currentStart;
    console.log(currentDate);
    this.checkScreenWidth();
    window.addEventListener('resize', this.checkScreenWidth.bind(this));
  }
  eventsPromise!: Promise<EventInput[]>;

  fetchAvailableSlots(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/events')
      .pipe(
        catchError((err) => {
          console.error('Error:', err);
          return of([]); 
        })
      );
  }

  handleDateClick(arg: any) {
    const clickedDate = new Date(arg.date);
    const currentDate = new Date();

    if (clickedDate.getDay() === 0 || clickedDate.getDay() === 6) {
      alert('Event creation is not allowed on weekends.');
      return;
    }

    currentDate.setHours(0, 0, 0, 0);
    // Check if the selected date is in the past
    if (clickedDate < currentDate) {
      alert('You can only create events for today or future dates.');
      return;
    }

    if (arg.view.type === 'timeGridWeek' || arg.view.type === 'timeGridDay') {
      console.log("check view")
    }
    this.modalData = {
      title: '',
      startTime: '',
      endTime: '',
      selectedDate: arg.dateStr,
      email: ''
    };
    this.showModal = true;
  }

  handleEventClick(arg: any) {
    this.modalData = {
      title: arg.event.title,
      startTime: arg.event.startStr.split('T')[1].substring(0, 5),
      endTime: arg.event.endStr.split('T')[1].substring(0, 5),
      selectedDate: arg.event.startStr.split('T')[0],
      email: arg.event.extendedProps.email
    };
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
    this.showModal = false;
  }

  createEventInCalendar(event: any) {
    const newEvent: EventInput = {
      title: event.title,
      start: `${event.selectedDate}T${event.startTime}:00`,
      end: `${event.selectedDate}T${event.endTime}:00`,
      allDay: false,
      backgroundColor: 'blue',
      extendedProps: { email: event.email }
    };
    console.log(newEvent, "newEvent");


    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.addEvent(newEvent); 
      this.events.push(newEvent);      
      console.log('Event successfully added to the calendar:', newEvent);
    }
  }
  

  sendEventEmail(event: any) {
    console.log('Sending event email to:', event.email);
  }

  onSubmit(): void {
    const newEvent = {
      title: this.modalData.title,
      startTime: this.modalData.startTime,
      endTime: this.modalData.endTime,
      selectedDate: this.modalData.selectedDate,
      email: this.modalData.email
    };

    console.log(newEvent,"newEventsubmit"), 
    this.createEventInCalendar(newEvent);
    this.sendEventEmail(newEvent);
    console.log('Event created:', this.modalData);
    this.closeModal();
  }
  
}
