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
import { BehaviorSubject, Observable, Subject, Subscription, switchMap, tap } from 'rxjs';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { IAppointmentData } from 'src/app/interfaces/appointment-data';
import { IChangeAppointmentData } from 'src/app/interfaces/change-appointment-data';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AcceptChangeDialogComponent } from 'src/app/components/accept-change-dialog/accept-change-dialog.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  public user$ = this.authService.user$;
  private doctorId?: number;
  private nurseId?: number;
  private numFutureAppointments?: number;
  private numFailedAppointments?: number;
  private id = this.authService.id || 0;
  
  private readonly subscription = new Subscription();
 
  private readonly trigger$ = new BehaviorSubject<any>(null);


  public appointments$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.appointmentsService.getNumFutureAppointments(); 
    }), tap((res) => this.numFutureAppointments = res),
    switchMap(() => {
      return this.appointmentsService.getAllApointments('patient', this.id);
    }
  ))

  public doctorAppointments$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.authService.getPatientNFailedAppointments(); 
    }), tap((res) => this.numFailedAppointments = res),
    switchMap(() => {
      return this.authService.getPatientDoctorId(); 
    }), tap((res) => this.doctorId = res),
    switchMap(() => {
      return this.appointmentsService.getAllApointments('doctor', this.doctorId as number); 
    })
  );

  public nurseAppointments$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.authService.getPatientNurseId(); 
    }), tap((res) => this.nurseId = res),
    switchMap(() => {
      return this.appointmentsService.getAllApointments('nurse', this.nurseId as number); 
    })
  );



  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly authService: AuthService,
    public dialog: MatDialog,
    private readonly router : Router,
    private readonly snackBar: MatSnackBar,
    ) {
    this.trigger$.next(null);
  }

  type : string = "";
  events : CalendarEvent[] = [];

  public ngOnInit() : void {
    this.fetchAppointments();
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
        //console.log(modelData);
        modelData.forEach((app) => {
          this.patientAppointments.push(app);
          this.pendingAppointments = this.patientAppointments.filter(app => app.changes_from !== null)
          this.badgeContent = this.pendingAppointments.length;
          var type : string = app.type != undefined ? ", vrsta usluge: " + app.type : "";
          this.events.push({
            id: app.id,
            start: new Date(app.time.slice(0, -1)),
            end: this.addDuration(new Date(app.time.slice(0, -1)), app.duration),
            title: app.nurseid !== null 
              ? 'Medicinska usluga ' +  new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                  + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3)
                  + type
              : 'Liječnički pregled ' +  new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3),
            color: app.nurseid !== null ? { ...colors['red'] } : { ...colors['blue'] },
          })
        });
        this.refresh.next();
        this.events.sort((a,b) => (a.title.split(' ')[2] < b.title.split(' ')[2]) ? -1 : 1);
      },
    );
  }

  public reserveAppointment(type : string) : void{
    if(this.numFutureAppointments as number <= 5) {
      this.snackBar.open('Imate previše zakazanih termina, dođite izravno na dogovor', 'Zatvori', {
        duration: 5000,
      });
    } else if(this.numFailedAppointments as number >= 5){
      this.snackBar.open('Imate previše propuštenih termina, dođite izravno na dogovor', 'Zatvori', {
        duration: 5000,
      });
    } else {
    this.type = type;
    this.events = [];
    this.fetchAppointments();
    if(type == 'doctor'){
      this.doctorAppointments$.subscribe(
        (modelData : IAppointmentData[]) => {
          //console.log(modelData);
          modelData.filter((app) => app.patientid === null)
          .filter((app) => !this.patientAppointments.find((a) => a.time == app.time))
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
          this.refresh.next();
          this.events.sort((a,b) => (a.title.split(' ')[2] < b.title.split(' ')[2]) ? -1 : 1);
        },
      )
    } else if(type == 'tech') {
      this.nurseAppointments$.subscribe(
        (modelData : IAppointmentData[]) => {
          console.log(modelData);
          console.log(this.patientAppointments);

          modelData.filter((app) => app.patientid === null)
          .filter(app => new Date(app.time.slice(0, -1)).getTime() > new Date().getTime())
          .filter((app) => !this.patientAppointments.find(a => a.time == app.time))
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
          this.refresh.next();
          this.events.sort((a,b) => (a.title.split(' ')[2] < b.title.split(' ')[2]) ? -1 : 1);
        },
      )
    }
    
  }
}

  badgeContent : number = 0;
  
  private patientAppointments : IAppointmentData[] = [];
  private pendingAppointments : IAppointmentData[] = [];

  acceptChange() : void{
    var apps : AppForChange[] = [];
    this.pendingAppointments.forEach(app => apps.push({
                date : new Date(app.time.slice(0, -1)).toLocaleDateString(),
                id_to : app.id ,
                id_from: this.patientAppointments.find(a => a.id == app.changes_from)?.id,
                title_to : new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                    + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3),
                title_from : new Date(this.patientAppointments.find(a => a.id == app.changes_from)!.time.slice(0, -1))
                .toLocaleTimeString().slice(0, -3) + ' - ' +
                this.addDuration(new Date(this.patientAppointments.find(a => a.id == app.changes_from)!.time.slice(0, -1)), app.duration)
                .toLocaleTimeString().slice(0, -3),
                selected : undefined}));
    //console.log(apps)
              
    const dialogRef = this.dialog.open(AcceptChangeDialogComponent, {
      data : {
        appointments : apps,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        apps.forEach(app => {
          //console.log(app)
          const data : IChangeAppointmentData = {
            from_id : app.id_from,
            to_id : app.id_to
          }
          
          if(app.selected == true) {
            const appointmentSubscription = this.appointmentsService
                  .acceptChangeAppointment(data)
                  .subscribe(() => {
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                    this.router.navigate(['/patient']));
                  });
            this.subscription.add(appointmentSubscription);
          } else if(app.selected == false) {
            const appointmentSubscription = this.appointmentsService
                  .rejectChangeAppointment(data)
                  .subscribe(() => {
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                    this.router.navigate(['/patient']));
                  });
            this.subscription.add(appointmentSubscription);
          }
        })
      }
    })
    
  }

  test(){
    console.log('nurse' , this.nurseId);
    console.log('doctor', this.doctorId as number);
    console.log('failed', this.numFailedAppointments);
    console.log('future',this.numFutureAppointments);
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