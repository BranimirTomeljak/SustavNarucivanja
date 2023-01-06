import { 
  Component, OnInit,
} from '@angular/core';
import { addDays, addHours, endOfMonth, startOfDay, subDays } from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { BehaviorSubject, Observable, Subject, Subscription, switchMap } from 'rxjs';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { IAppointmentData } from 'src/app/interfaces/appointment-data';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-doctor-page',
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.scss']
})
export class DoctorPageComponent implements OnInit {
  private readonly _user$ = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null
  

  private rezervacija : boolean = false;
  private readonly subscription = new Subscription();
  // dohvacanje appointmenta
  private readonly trigger$ = new BehaviorSubject<any>(null);
  public appointments$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.appointmentsService.getAllApointments('doctor', 8);
    })
  );
  public doctorAppointments$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.appointmentsService.getAllDoctorApointments(8);
    })
  );

  constructor(
    private readonly appointmentsService: AppointmentsService,
  ) {
    this.trigger$.next(null);
   }

  ngOnInit(): void {
    this.fetchAppointments();
  }

  events : CalendarEvent[] = [];

  private addDuration = (date: Date, obj: object): Date => {
    const result = new Date(date);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    Object.entries(obj).find(([key, value]) => {
      if(key === 'hours') {
        hours = value;
      } else if (key === 'minutes') {
        minutes = value;
      } else if (key === 'seconds') {
        seconds = value;
      }
    })

    result.setHours(result.getHours() + hours);
    result.setMinutes(result.getMinutes() + minutes);
    result.setSeconds(result.getSeconds() + seconds);
    return result;
  };

  private getDuration = (start: Date, end?: Date) : string => {
    var endDefined = new Date(0);
    if(end !== undefined){
      endDefined = end;
    }
    var diff = new Date(endDefined.getTime() - start.getTime()).toISOString().slice(0, -1)
    return new Date(diff).toLocaleTimeString();
  }

  private addTimeZone = (date: Date) : Date => {
    date.setHours(date.getHours() + 1);
    return date;
  }

  
  refresh = new Subject<void>();

  fetchAppointments() : void {
    this.events = [];
    this.appointments$.subscribe(
      (modelData : IAppointmentData[]) => {
        console.log(modelData);
        modelData.forEach((app) => {
          this.events.push({
            id: app.id,
            start: new Date(app.time.slice(0, -1)),
            end: this.addDuration(new Date(app.time.slice(0, -1)), app.duration),
            title: app.patientid !== null 
              ? 'Rezerviran termin ' + new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                  + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3)
              : 'Slobodan termin ' +  new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3),
            color: app.patientid !== null ? { ...colors['blue'] } : { ...colors['yellow'] },
            //actions: this.actions
          })
        });
        //this.viewDate = new Date();
        this.refresh.next();
      },
      // za error
      /*
      error => {
            const res = this.dialogService.ErrorDialog('Server Error', 'Sorry, the system is unavailable at the moment.', 'Close', 'Try again');
            res.afterClosed().subscribe(dialogResult => {
              if (dialogResult) {
                //this.callNext(200);
              }
            });
          }
      */
    );
  }

  odrediVlastitaPravila(){
    console.log('Odredujem vlastita pravila...')
  }
}
