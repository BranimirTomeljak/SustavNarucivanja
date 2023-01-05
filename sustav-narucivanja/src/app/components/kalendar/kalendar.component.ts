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
import { catchError, switchMap } from 'rxjs/operators';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { Router } from '@angular/router';
import { IAppointmentData } from 'src/app/interfaces/appointment-data';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';


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
  private readonly _user$ = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user')!)
  : null

  private readonly subscription = new Subscription();
  private readonly trigger$ = new BehaviorSubject<any>(null);
 
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  //@Input() viewDate : Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  
  /*
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  */

  @Input() refresh = new Subject<void>();

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

  // dodajemo vremensku zonu u slucaju da koristimo funkciju addTimeZone()
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
    //this.refresh.next();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /* u patientComponentu
  fetchAppointments() : void {
   
  }
  */

  //@Input() handleEvent: ((action: string, event: CalendarEvent) => void) | undefined;
  @Input() events: CalendarEvent[] = [
  //@Input() events: CalendarEvent[] = [
    /*
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: { ...colors['red'] },
      //actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      //start: startOfDay(new Date()),
      //start: new Date(this.starts[1]),
      //start : new Date('2023-01-10T22:00:14.000Z'),
      start: new Date(this.starts[0]),
      end : new Date(this.ends[0]),
      title: 'An event with no end date',
      color: { ...colors['yellow'] },
      //actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: { ...colors['blue'] },
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: { ...colors['yellow'] },
      //actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    */
  ];

  activeDayIsOpen: boolean = false;

  constructor(
    private modal: NgbModal,
    private readonly appointmentsService: AppointmentsService,
    public dialog : MatDialog
    ) {
    this.trigger$.next(null);
  }

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
  
  handleEvent(action: string, event: CalendarEvent): void {
    if(this._user$.type == 'patient'){
      this.handlePatient(event);
    } else if(this._user$.type == 'doctor'){
      this.handleDoctor(event);
    } else if(this._user$.type == 'nurse'){
      this.handleNurse(event);
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

  /* u patientComponent
  public reserveAppointment() : void{
    
  }
  */

  handlePatient(event: CalendarEvent) : void {
    const data : IAppointmentData = {
      id: event.id,
      patientid : this._user$.id,
      doctorid : this._user$.doctorid,
      nurseid : undefined,
      time : event.start.toISOString(), // ako koristimo addAppointment(data) => this.addTimeZone(event.start).toISOString()
      duration : this.getDuration(this.addTimeZone(event.start), event.end),
      created_on : new Date(),
      pending_accept : false,
      type : null,
      patient_came : false,
    }
    if(event.color?.primary == colors['yellow'].primary){
      const dialogRef = this.dialog.open(ReserveAppointmentDialog, {
        data : { appointment : event.title.toLocaleLowerCase(),
                date : event.start.toLocaleDateString()}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          console.log('insertam')
        console.log(data);
        // ako baci konflikt napisati neku poruku
        const appointmentSubscription = this.appointmentsService
          .reserveAppointment(data)
          .subscribe(() => {
            //this.router.navigate(['/patient'])
            this.refresh.next()
          });
          this.subscription.add(appointmentSubscription);
          this.refresh.next()
        }
      })
    }
    if(event.color?.primary == colors['red'].primary || event.color?.primary == colors['blue'].primary){
      const dialogRef = this.dialog.open(CancelAppointmentDialog, {
        data : { appointment : event.title.toLocaleLowerCase(),
                date : event.start.toLocaleDateString()}
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if(result){
          console.log('deletam')
          console.log(data);
          // ako baci konflikt napisati neku poruku
          const appointmentSubscription = this.appointmentsService
          .cancelAppointment(data)
          .subscribe(() => {
            //this.router.navigate(['/patient'])
            this.refresh.next()
          });
          this.subscription.add(appointmentSubscription);
        }
      })
    }
  }

  handleDoctor(event : CalendarEvent) : void {
    console.log('Sad je doktor');
  }

  handleNurse(event : CalendarEvent) : void {
    console.log('Sad je medicinska sestra');
  }
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
