import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { IRangeData } from 'src/app/interfaces/range-data';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent{
  private readonly _user$ = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null

  private readonly subscription = new Subscription();
  private readonly trigger$ = new BehaviorSubject<any>(null);
  
  constructor(
    private readonly router: Router,
    private readonly appointmentService: AppointmentsService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.trigger$.next(null);
  }

  public form: FormGroup = new FormGroup({
    date: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
  });

  
  private addHoursAndMinutes(date : Date, time: string) : string {
    var newDate : Date = date;
    var hours = Number(time.split(':')[0]) + 1;
    var minutes = Number(time.split(':')[1]);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate.toISOString();
  }

  private subTimeZone = (date?: Date) : Date => {
    var endDefined = new Date(0);
    if(date !== undefined){
      endDefined = date;
    }
    var newDate  = new Date(endDefined);

    newDate.setHours(newDate.getHours() - 1);
    return newDate;
  }


  public onFormSubmit(): void {
   
    if (this.form.invalid) {
      this.snackBar.open('Unesite sve potrebne podatke', 'Zatvori', {
        duration: 2000,
      });
      return;
    }

    var date : Date = this.form.get('date')?.value;
    var startTime = this.form.get('start')?.value;
    var endTime = this.form.get('end')?.value;
    
    console.log(date);
    console.log(startTime)
    console.log(endTime)


    const data: IRangeData = {
      doctorid: this._user$.doctorid,
      nurseid: this._user$.nurseid,
      time_start: this.addHoursAndMinutes((date), startTime),
      time_end: this.addHoursAndMinutes((date), endTime)
    };

    console.log(data);
    
    const appointmentSubscription = this.appointmentService
      .addRangeAppointment(data)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
    this.subscription.add(appointmentSubscription);
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public test() {
    console.log(this.form.value);
  }
}
