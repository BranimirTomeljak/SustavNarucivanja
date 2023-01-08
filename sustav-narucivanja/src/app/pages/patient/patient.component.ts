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
import { IChangeAppointmentData } from 'src/app/interfaces/change-appointment-data';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AcceptChangeDialogComponent } from 'src/app/components/accept-change-dialog/accept-change-dialog.component';

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
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit{
  private readonly _user$ = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null
  

  private rezervacija : boolean = false;
  private readonly subscription = new Subscription();
  // dohvacanje appointmenta
  private readonly trigger$ = new BehaviorSubject<any>(null);
  public appointments$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.appointmentsService.getAllApointments(this._user$.type, this._user$.id);
    })
  );
  public doctorAppointments$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.appointmentsService.getAllDoctorApointments(8);
    })
  );

  constructor(
    private readonly appointmentsService: AppointmentsService,
    public dialog: MatDialog,
    private readonly router : Router
    ) {
    this.trigger$.next(null);
  }

  events : CalendarEvent[] = [];
  viewDate : Date = new Date();

  public ngOnInit() : void {
    this.fetchAppointments();
    //this.reserveAppointment();
  }

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
          this.allAppointments.push(app);
          this.pendingAppointments = this.allAppointments.filter(app => app.changes_from !== null)
          this.badgeContent = this.pendingAppointments.length;
          this.events.push({
            id: app.id,
            start: new Date(app.time.slice(0, -1)),
            end: this.addDuration(new Date(app.time.slice(0, -1)), app.duration),
            title: app.nurseid !== null 
              ? 'Usluga kod medicinske sestre ' +  new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                  + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3)
              : 'Liječnički pregled ' +  new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3),
            color: app.nurseid !== null ? { ...colors['red'] } : { ...colors['blue'] },
            //actions: this.actions
          })
        });
        this.viewDate = new Date();
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

  public reserveAppointment() : void{
    this.events = [];
    this.fetchAppointments();
    this.doctorAppointments$.subscribe(
      (modelData : IAppointmentData[]) => {
        //console.log(modelData);
        modelData.filter((app) => app.patientid === null)
        .filter(app => new Date(app.time.slice(0, -1)).getTime() > new Date().getTime())
        .forEach((app) => {
          this.events.push({
            id: app.id,
            start: new Date(app.time.slice(0, -1)),
            end: this.addDuration(new Date(app.time.slice(0, -1)), app.duration),
            title: 'Slobodan termin ' + new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
            + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3),
            color: colors['yellow'] ,
            //actions: this.actions
          })
        });
        //this.viewDate = new Date();
        this.refresh.next();
      },
    )
  }

  badgeContent : number = 0;
  
  private allAppointments : IAppointmentData[] = [];
  private pendingAppointments : IAppointmentData[] = [];

  acceptChange() : void{
    
    
    var apps : AppForChange[] = [];
    this.pendingAppointments.forEach(app => apps.push({
                date : new Date(app.time.slice(0, -1)).toLocaleDateString(),
                id_to : app.id ,
                id_from: this.allAppointments.find(a => a.id == app.changes_from)?.id,
                title_to : new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                    + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3),
                title_from : new Date(this.allAppointments.find(a => a.id == app.changes_from)!.time.slice(0, -1))
                .toLocaleTimeString().slice(0, -3) + ' - ' +
                this.addDuration(new Date(this.allAppointments.find(a => a.id == app.changes_from)!.time.slice(0, -1)), app.duration)
                .toLocaleTimeString().slice(0, -3),
                selected : undefined}));
    console.log(apps)
              
    const dialogRef = this.dialog.open(AcceptChangeDialogComponent, {
      data : {
        appointments : apps,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        apps.forEach(app => {
          console.log(app)
          const data : IChangeAppointmentData = {
            from_id : app.id_from,
            to_id : app.id_to
          }
          
          if(app.selected == true) {
            const appointmentSubscription = this.appointmentsService
                  .acceptChangeAppointment(data)
                  .subscribe(() => {
                    this.router.navigate(['/patient'])
                  });
            this.subscription.add(appointmentSubscription);
          } else if(app.selected == false) {
            const appointmentSubscription = this.appointmentsService
                  .rejectChangeAppointment(data)
                  .subscribe(() => {
                    this.router.navigate(['/patient'])
                  });
            this.subscription.add(appointmentSubscription);
          }
          
        })
      }
    })
    
  }


}

type AppForChange = {
  date : string,
  id_from?: number | string,
  id_to?: number | string,
  title_from?: string,
  title_to: string,
  selected?: boolean
}