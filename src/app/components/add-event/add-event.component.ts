import {  Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [FullCalendarModule, FormsModule],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
})
export class AddEventComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  isEditMode = false;
  showModal: boolean = false;
  selectedEventId: string | undefined = undefined;
  errorMessages: string[] = []; 
  events: EventInput[] = [];

  modalData = {
    title: '',
    startTime: '',
    endTime: '',
    selectedDate: '',
    email: '',
    status: "pending" 
  };

  calendarOptions: CalendarOptions = {
    plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin,listPlugin,bootstrapPlugin],
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
    eventClick: (arg: any) => this.handleEventClick(arg)
  };

  constructor() {}

  ngOnInit(): void {
    this.getAllEventsFromSessionStorage();
    emailjs.init(environment.emailjs.userId);
  }

  handleDateClick(arg: any) {
    const clickedDate = new Date(arg.date);
    const currentDate = new Date();

    if (clickedDate.getDay() === 0 || clickedDate.getDay() === 6) {
      console.log('Event creation is not allowed on weekends.');
      alert('Event creation is not allowed on weekends.');
      return;
    }

    currentDate.setHours(0, 0, 0, 0);
    if (clickedDate < currentDate) {
      console.log('You can only create events for today or future dates.');
      alert('You can only create events for today or future dates.');
      return;
    }

    this.modalData = {
      title: '',
      startTime: '',
      endTime: '',
      selectedDate: arg.dateStr,
      email: '',
      status: "pending" 
    };

    if (arg.view.type === 'timeGridWeek' || arg.view.type === 'timeGridDay') {
      this.modalData.selectedDate = arg.dateStr.split('T')[0]
      this.modalData.startTime = arg.dateStr.split('T')[1].substring(0, 5);
      console.log(this.modalData.startTime)
      console.log(this.modalData.selectedDate)
    }
    this.isEditMode = false;
    this.showModal = true;
  }

  handleEventClick(arg: any) {
    this.modalData = {
      title: arg.event.title,
      startTime: arg.event.startStr.split('T')[1].substring(0, 5),
      endTime: arg.event.endStr.split('T')[1].substring(0, 5),
      selectedDate: arg.event.startStr.split('T')[0],
      email: arg.event.extendedProps.email,
      status: "pending" 
    };
    this.selectedEventId = arg.event.id;
    this.isEditMode = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetModalData();
    this.errorMessages = []
  }

  resetModalData() {
    this.modalData = {
      title: '',
      startTime: '',
      endTime: '',
      selectedDate: '',
      email: '',
      status: "pending" 
    };
    this.selectedEventId = undefined;
    this.isEditMode = false;
  }

  sendEventEmail(event: any) {
    console.log('Sending event email to:', event.email);
    
    const templateParams = {
      to_email: event.email,
      to_name: event.email.split('@')[0],
      event_title: event.title,
      event_date: new Date(event.selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      event_time_start: event.startTime,
      event_time_end: event.endTime,
      from_name: 'Appointment System'
    };

    try {
      const response =  emailjs.send(
        environment.emailjs.serviceId,
        environment.emailjs.TemplateID,
        templateParams,
        environment.emailjs.userId
      );

      console.log('Email sent successfully:', response);
      console.log('Event notification email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      console.log('Failed to send event notification email.');
    }
  }

  saveEventsToSessionStorage() {
    sessionStorage.setItem('calenderEvents', JSON.stringify(this.events));
  }

  getAllEventsFromSessionStorage() {
    const savedEvents = sessionStorage.getItem('calenderEvents');
    if (savedEvents) {
      this.events = JSON.parse(savedEvents);
      this.calendarOptions.events = this.events;
    }
  }

  createEventInCalendar(event: any) {

    const newEvent: EventInput = {
      id: `${new Date().getTime()}`,
      title: event.title,
      start: `${event.selectedDate}T${event.startTime}:00`,
      end: `${event.selectedDate}T${event.endTime}:00`,
      allDay: false,
      backgroundColor: 'blue',
      extendedProps: { email: event.email },
      status: "pending" 
    };

    console.log("Selected Date:", event.selectedDate);
    console.log("Start Time:", event.startTime);
    console.log("End Time:", event.endTime);

    if (this.calendarComponent) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.addEvent(newEvent);
      this.events.push(newEvent);
      console.log('Event successfully added to the calendar:', newEvent);
      this.saveEventsToSessionStorage();
      console.log('Event created successfully!');
      return true;
    }
    return false;
  }

  updateExistingEvent(eventDetails: any) {
    const calendarApi = this.calendarComponent.getApi();
    const eventToUpdate = calendarApi.getEventById(this.selectedEventId!);

    if (eventToUpdate) {
      eventToUpdate.setProp('title', eventDetails.title);
      eventToUpdate.setExtendedProp('email', eventDetails.email);
      eventToUpdate.setDates(
        `${eventDetails.selectedDate}T${eventDetails.startTime}:00`,
        `${eventDetails.selectedDate}T${eventDetails.endTime}:00`
      );

      const index = this.events.findIndex(event => event.id === this.selectedEventId);
      if (index !== -1) {
        this.events[index] = {
          ...this.events[index],
          title: eventDetails.title,
          start: `${eventDetails.selectedDate}T${eventDetails.startTime}:00`,
          end: `${eventDetails.selectedDate}T${eventDetails.endTime}:00`,
          extendedProps: { email: eventDetails.email }
        };
      }

      this.saveEventsToSessionStorage();
      this.sendEventEmail(eventDetails);
      console.log('Event updated successfully!');
    }
  }

  onSubmit(){
    this.errorMessages = this.validateEventDetails();

    if (this.errorMessages.length === 0) {
      const eventDetails = {
            title: this.modalData.title,
            startTime: this.modalData.startTime,
            endTime: this.modalData.endTime,
            selectedDate: this.modalData.selectedDate,
            email: this.modalData.email,
            status: this.modalData.status
          };
      if (this.isEditMode && this.selectedEventId) {
        this.updateExistingEvent(eventDetails);
      } else {
        if(this.createEventInCalendar(eventDetails)) {
         this.sendEventEmail(eventDetails);
        }
      }
      this.closeModal();
    }
  }
  
  validateEventDetails(): string[]  {

    const errors: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.modalData.email)) {
      console.log('Please enter a valid email address');
      errors.push('Invalid email format.')
    }

    if (this.modalData.startTime && this.modalData.endTime) {
        const startTime = new Date(`${this.modalData.selectedDate}T${this.modalData.startTime}`);
        const endTime = new Date(`${this.modalData.selectedDate}T${this.modalData.endTime}`);
        if (endTime <= startTime) {
          console.log('End time must be after start time');
          errors.push('End time must be after start time.');
        }
    }

    // validation: If the selected date is today, check if the start time has already passed
    const selectedDate = new Date(this.modalData.selectedDate);
    const currentDate = new Date();

    if (selectedDate.toDateString() === currentDate.toDateString()) {
      const [startHours, startMinutes] = this.modalData.startTime.split(':').map(Number);
      const selectedStartTime = new Date();
      selectedStartTime.setHours(startHours, startMinutes, 0, 0);

      if (selectedStartTime < new Date()) {
        console.log('The selected start time has already passed. Please select a future time.');
        errors.push('The selected start time has already passed. Please select a future time.');
      }
    }
    return errors;
  }

}