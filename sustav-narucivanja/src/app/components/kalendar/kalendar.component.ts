import { 
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  OnDestroy,
  Input,
  Inject,
  ViewEncapsulation
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  parseISO
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { BehaviorSubject, EMPTY, Observable, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { AuthService } from 'src/app/services/auth/auth.service';

import { Router } from '@angular/router';
import { IAppointmentData } from 'src/app/interfaces/appointment-data';
import { IChangeAppointmentData } from 'src/app/interfaces/change-appointment-data';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatCheckbox } from '@angular/material/checkbox';
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
  selector: 'app-kalendar',
  templateUrl: './kalendar.component.html',
  styleUrls: ['./kalendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KalendarComponent implements OnInit ,OnDestroy {
  public user$ = this.authService.user$;
  private doctorId?: number;
  private readonly subscription = new Subscription();
  private readonly trigger$ = new BehaviorSubject<any>(null);

  public doctorAppointments$: Observable<any> = this.trigger$.pipe(
    switchMap(() => {
      return this.authService.getPatientDoctorId(); 
    }), tap((res) => this.doctorId = res),
  );

  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly authService: AuthService,
    private readonly router : Router,
    public dialog : MatDialog,
    private readonly snackBar : MatSnackBar
    ) {
    this.trigger$.next(null);
  }

  @Input() refresh = new Subject<void>();
  @Input() typeInput : string = '';
  @Input() events: CalendarEvent[] = [];
 
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };



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
    var diff = new Date(endDefined.getTime() - start.getTime()).toISOString()
    return new Date(diff).toLocaleTimeString();
  }

  // dodajemo vremensku zonu u slucaju da koristimo funkciju /add
  private addTimeZone = (date?: Date) : Date => {
    var endDefined = new Date(0);
    if(date !== undefined){
      endDefined = date;
    }
    var newDate  = new Date(endDefined);

    newDate.setHours(newDate.getHours() + 1);
    return newDate;
  }
  
  ngOnInit(): void {
    this.events.forEach(e => this.refresh.next());
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  medicalServices : MedicalService[] = [
    {title : 'vađenje krvi', selected : undefined},
    {title : 'testiranje na COVID' , selected : undefined},
    {title : 'mjerenje tlaka',  selected : undefined},
    {title : 'mjerenje šećera', selected : undefined},
    {title : 'previjanje' , selected : undefined},
  ];

  activeDayIsOpen: boolean = false;

  
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }
  
  handleEvent(type: string, event: CalendarEvent): void {
    switch (type) {
      case 'patient':
        this.handlePatient(event);
        break;
      case 'doctor':
        this.handleDoctor(event);
      break;
      case 'nurse':
        this.handleNurse(event);
        break;
      default:
        break;
    }
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  handlePatient(event: CalendarEvent) : void {
    const data : IAppointmentData = {
      id: event.id,
      patientid : this.authService.id,
      doctorid : this.doctorId,
      nurseid : undefined,
      time : event.start.toISOString(), // ako koristimo addAppointment(data) => this.addTimeZone(event.start).toISOString()
      duration : this.getDuration(this.addTimeZone(event.start), event.end),
      created_on : new Date(),
      pending_accept : false,
      type : null,
      patient_came : false,
    }
    if(event.color?.primary == colors['yellow'].primary){
      if(this.typeInput == 'doctor'){
        const dialogRef = this.dialog.open(ReserveAppointmentDialog, {
          data : { appointment : event.title.toLocaleLowerCase(),
                  date : event.start.toLocaleDateString()}
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            const appointmentSubscription = this.appointmentsService
              .reserveAppointment(data)
              .subscribe(() => {
                this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                this.router.navigate(['/patient']));
              });
              this.subscription.add(appointmentSubscription);
          }
        }
        )
      } else if(this.typeInput == 'tech'){
        const dialogRef = this.dialog.open(ReserveAppointmentDialog, {
          data : { appointment : event.title.toLocaleLowerCase(),
                  date : event.start.toLocaleDateString()}
        });
        dialogRef.afterClosed().subscribe(result => {
          
          if(result){
            console.log(this.medicalServices)
            const dialogRef = this.dialog.open(MedicalServiceDialog, {
              data : { services: this.medicalServices}
            });
            dialogRef.afterClosed().subscribe(result => {
              if(result){
                var appType = this.medicalServices.find(s => s.selected == true)?.title;
                if(appType !== undefined){
                  const data : IAppointmentData = {
                    id: event.id,
                    patientid : this.authService.id,
                    doctorid : this.doctorId, 
                    nurseid : 16, // kako dobit nurseId
                    time : event.start.toISOString(),
                    duration : this.getDuration(this.addTimeZone(event.start), event.end),
                    created_on : new Date(),
                    pending_accept : false,
                    type : appType,
                    patient_came : false,
                  }
                  const appointmentSubscription = this.appointmentsService
                  .reserveAppointment(data)
                  .subscribe(() => {
                    //this.router.navigate(['/patient'])
                    //this.refresh.next()
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                    this.router.navigate(['/patient']));
                  });
                  this.subscription.add(appointmentSubscription);
                }
              }
            })
          }
        })
      }
    }
    if(event.color?.primary == colors['red'].primary || event.color?.primary == colors['blue'].primary){
      const dialogRef = this.dialog.open(CancelAppointmentDialog, {
        data : { appointment : event.title.toLocaleLowerCase(),
                date : event.start.toLocaleDateString()}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if(result){
          const appointmentSubscription = this.appointmentsService
          .cancelAppointment(data)
          .subscribe(() => {
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
            this.router.navigate(['/patient']));
          });
          this.subscription.add(appointmentSubscription);
        }
      })
    }
  }

  handleDoctor(event : CalendarEvent) : void {
    if(event.color?.primary == colors['blue'].primary && event.start.getTime() > new Date().getTime()){
      const dialogRef = this.dialog.open(ChangeAppointmentDialog, {
        data : { appointment : event.title.toLocaleLowerCase(),
                date : event.start.toLocaleDateString()}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          var appointments : string[] = [];
          var evs : CalendarEvent[] = [];
          evs = this.events.filter(e => e.color?.primary == colors['yellow'].primary
          && e.start.toLocaleDateString() == event.start.toLocaleDateString()); 
          this.events.filter(e => e.color?.primary == colors['yellow'].primary
                          && e.start.toLocaleDateString() == event.start.toLocaleDateString())
                          .forEach(e => {
                            appointments.push(
                              e.title
                            )
                          })
          const dialogRef = this.dialog.open(FreeAppointmentDialog, {
            data : {apps : appointments}
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if(result != false && result != undefined){ 
              var newEvent = evs.find(e => e.title == result);
            const data : IChangeAppointmentData = {
              from_id : event.id,
              to_id : newEvent?.id
            }
            const appointmentSubscription = this.appointmentsService
            .changeAppointment(data)
            .pipe(
              catchError(() => {
                this.snackBar.open('Termin možete pomicati samo do 24 sata nakon rezervacije', 'Zatvori', { duration: 5000 });
                return EMPTY;
              })
            )
            .subscribe(() => {
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
              this.router.navigate(['/doctor']));
            });
            this.subscription.add(appointmentSubscription);
          }
        })
        }
      })
    }
  }

  handleNurse(event : CalendarEvent) : void {
    if(event.color?.primary == colors['red'].primary && event.start.getTime() > new Date().getTime()){
      const dialogRef = this.dialog.open(ChangeAppointmentDialog, {
        data : { appointment : event.title.toLocaleLowerCase(),
                date : event.start.toLocaleDateString()}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
        var appointments : string[] = [];
        var evs : CalendarEvent[] = [];
        evs = this.events.filter(e => e.color?.primary == colors['yellow'].primary
        && e.start.toLocaleDateString() == event.start.toLocaleDateString()); 
        this.events.filter(e => e.color?.primary == colors['yellow'].primary
                        && e.start.toLocaleDateString() == event.start.toLocaleDateString())
                        .forEach(e => {
                          appointments.push(
                            e.title
                          )
                        })
        const dialogRef = this.dialog.open(FreeAppointmentDialog, {
          data : {apps : appointments}
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          if(result != false && result != undefined){ 
            var newEvent = evs.find(e => e.title == result);
          const data : IChangeAppointmentData = {
            from_id : event.id,
            to_id : newEvent?.id
          }
          const appointmentSubscription = this.appointmentsService
          .changeAppointment(data)
          .subscribe(() => {
            //this.router.navigate(['/nurse'])
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
            this.router.navigate(['/nurse']));
          });
          this.subscription.add(appointmentSubscription);
          }
        })
        }
      })
    }
  }
}

interface MedicalService {
  title : string,
  selected ?: boolean
}

@Component({
  selector: 'cancel-appointment-dialog',
  templateUrl: 'dialogs/cancel-appointment-dialog.html',
})
export class CancelAppointmentDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data : {appointment : string, date : string}) {}
}

@Component({
  selector: 'reserve-appointment-dialog',
  templateUrl: 'dialogs/reserve-appointment-dialog.html',
})
export class ReserveAppointmentDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data : {appointment : string, date: string}) {}
}

@Component({
  selector: 'change-appointment-dialog',
  templateUrl: 'dialogs/change-appointment-dialog.html',
})
export class ChangeAppointmentDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data : {appointment : string, date: string}) {}
}

@Component({
  selector: 'free-appointment-dialog',
  templateUrl: 'dialogs/free-appointment-dialog.html',
})
export class FreeAppointmentDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data : {apps : string[], events : CalendarEvent[]}) {}
  event : string = '';
}

@Component({
  selector: 'medical-service-dialog',
  templateUrl: 'dialogs/medical-service-dialog.html',
})
export class MedicalServiceDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data : {services : MedicalService[]}) {}

  onChange(service : MedicalService, isChecked : boolean){
    var ser = this.data.services.find(s => s == service);
    if(ser != undefined){
      ser.selected = isChecked;
    }
  }
}