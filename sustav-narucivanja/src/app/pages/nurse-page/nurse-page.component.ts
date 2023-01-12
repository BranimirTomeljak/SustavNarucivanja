import { 
  Component, Inject, OnInit,
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
import { Router } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Form, FormBuilder} from '@angular/forms';
import { RecordAttendanceDialogComponent } from 'src/app/components/record-attendance-dialog/record-attendance-dialog.component';
import { AuthService } from 'src/app/services/auth/auth.service';

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
  selector: 'app-nurse-page',
  templateUrl: './nurse-page.component.html',
  styleUrls: ['./nurse-page.component.scss']
})
export class NursePageComponent implements OnInit {
  private id = this.authService.id || 0;

  private readonly subscription = new Subscription();
  // dohvacanje appointmenta
  private readonly trigger$ = new BehaviorSubject<any>(null);
  public appointments$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.appointmentsService.getAllApointments('nurse', this.id);
    })
  );
  

  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly authService: AuthService,
    private readonly router: Router,
    public dialog : MatDialog
  ) {
    this.trigger$.next(null);
   }

  ngOnInit(): void {
    this.fetchAppointments();
  }

  events : CalendarEvent[] = [];
  badgeContent : number = 0;

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


  private allAppointments : IAppointmentData[] = [];
  private pendingAppointments : IAppointmentData[] = [];

  fetchAppointments() : void {
    this.events = [];
    this.appointments$.subscribe(
      (modelData : IAppointmentData[]) => {
        console.log(modelData);
        modelData.forEach((app) => {
          this.allAppointments.push(app);
          this.pendingAppointments = this.allAppointments.filter(app => app.patientid != null)
              .filter(app => app.patient_came == null)
              .filter(app => new Date(app.time.slice(0,-1)).toLocaleDateString() == new Date().toLocaleDateString())
              .filter(app => this.addDuration(new Date(app.time.slice(0, -1)), app.duration).getTime() < new Date().getTime());
          var type : string = app.type != undefined ? ", vrsta usluge: " + app.type : "";
          this.badgeContent = this.pendingAppointments.length;
          this.events.push({
            id: app.id,
            start: new Date(app.time.slice(0, -1)),
            end: this.addDuration(new Date(app.time.slice(0, -1)), app.duration),
            title: app.patientid !== null 
              ? 'Rezerviran termin ' + new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                  + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3)
                  + type
              : 'Slobodan termin ' +  new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                  + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3)
                  + type,
            color: app.patientid !== null ? { ...colors['red'] } : { ...colors['yellow'] },
            //actions: this.actions
          })
        });
        //this.viewDate = new Date();
        this.refresh.next();
        this.events.sort((a,b) => (a.title.split(' ')[2] < b.title.split(' ')[2]) ? -1 : 1);
      },
    );
  }

  recordAttendance(){
    var apps : App[] = [];
    this.pendingAppointments.forEach(app => apps.push({
                id : app.id ,
                title : 'Rezerviran termin ' + new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                    + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3),
                selected : undefined}));
    const dialogRef = this.dialog.open(RecordAttendanceDialogComponent, {
      data : {
        appointments : apps,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        apps.forEach(app => {
          //console.log(app)
          if(app.selected != undefined) {
            var id = app.id;
            var toRecordApp = this.pendingAppointments.find(a => a.id == id);
            if(toRecordApp != undefined){
              toRecordApp.patient_came = app.selected;
              console.log(toRecordApp);
              const appointmentSubscription = this.appointmentsService
                  .recordAttendance(toRecordApp)
                  .subscribe(() => {
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                    this.router.navigate(['/nurse']));
                  });
              this.subscription.add(appointmentSubscription);
            }
          }
        })
      }
    })
  }
}

type App = {
  id?: number | string,
  title: string,
  selected?: boolean
}