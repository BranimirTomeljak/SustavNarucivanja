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
import { BehaviorSubject, Observable, Subject, Subscription, switchMap, tap } from 'rxjs';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { IAppointmentData } from 'src/app/interfaces/appointment-data';
import { Router } from '@angular/router';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { RecordAttendanceDialogComponent } from 'src/app/components/record-attendance-dialog/record-attendance-dialog.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DoctorsService } from 'src/app/services/doctors/doctors.service';
import { IDoctorRule } from 'src/app/interfaces/doctor-rule-data';
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
  selector: 'app-doctor-page',
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.scss']
})
export class DoctorPageComponent implements OnInit {
  private id : number = this.authService.id || 0;
  private rule?: number;
  private readonly subscription = new Subscription();
  // dohvacanje appointmenta
  private readonly trigger$ = new BehaviorSubject<any>(null);
  public appointments$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.doctorsService.getDoctorRule(this.id);
    }), tap((res) => this.rule = res),
    switchMap(() => {
      return this.appointmentsService.getAllApointments('doctor', this.id);
    })
  );
  
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly doctorsService: DoctorsService,
    private readonly router: Router,
    public dialog : MatDialog,
    private readonly authService: AuthService
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
        this.badgeContent = this.pendingAppointments.length;
        modelData.forEach((app) => {
          this.allAppointments.push(app);
          this.pendingAppointments = this.allAppointments.filter(app => app.patientid != null)
              .filter(app => app.patient_came == null)
              .filter(app => new Date(app.time.slice(0,-1)).toLocaleDateString() == new Date().toLocaleDateString())
              .filter(app => this.addDuration(new Date(app.time.slice(0, -1)), app.duration).getTime() < new Date().getTime());
          this.badgeContent = this.pendingAppointments.length;
          var typeDoctor : string = app.type != undefined ? ", tip pregleda: " + app.type : "";
          this.events.push({
            id: app.id,
            start: new Date(app.time.slice(0, -1)),
            end: this.addDuration(new Date(app.time.slice(0, -1)), app.duration),
            title: app.patientid !== null 
              ? 'Rezerviran termin ' + new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                  + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3)
                  + typeDoctor
              : 'Slobodan termin ' +  new Date(app.time.slice(0, -1)).toLocaleTimeString().slice(0, -3) + ' - ' 
                + this.addDuration(new Date(app.time.slice(0, -1)), app.duration).toLocaleTimeString().slice(0, -3),
            color: app.patientid !== null ? { ...colors['blue'] } : { ...colors['yellow'] },
          })
        });
        this.refresh.next();
        this.events.sort((a,b) => (a.title.split(' ')[2] < b.title.split(' ')[2]) ? -1 : 1);
      },
      
    );
  }

  addWorkingHours(){
    this.router.navigate(['/doctor/working-hours'])
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
          if(app.selected != undefined) {
            var id = app.id;
            var toRecordApp = this.pendingAppointments.find(a => a.id == id);
            if(toRecordApp != undefined){
              toRecordApp.patient_came = app.selected;
              const appointmentSubscription = this.appointmentsService
                  .recordAttendance(toRecordApp)
                  .subscribe(() => {
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                    this.router.navigate(['/doctor']));
                  });
              this.subscription.add(appointmentSubscription);
            }
          }
        })
      }
    })
  }

  defineRules(){
    const dialogRef = this.dialog.open(DefineRulesDialog, { 
      data : {
        rule : this.rule,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const data : IDoctorRule = {
          id : this.id,
          hours : result.hour
        }
        const doctorSubscription = this.doctorsService
                  .setDoctorRule(data)
                  .subscribe(() => {
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                    this.router.navigate(['/doctor']));
                  });
        this.subscription.add(doctorSubscription);
      }
    })
  }
}

type App = {
  id?: number | string,
  title: string,
  selected?: boolean
}

@Component({
  selector: 'define-rules-dialog',
  templateUrl: 'dialogs/define-rules-dialog.html',
})
export class DefineRulesDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data : {rule : number},
    private readonly snackBar : MatSnackBar
  ) {}
  newRule : number = 0;

  public form: FormGroup = new FormGroup({
    hour: new FormControl(this.data.rule, [Validators.required]),
  });
}

