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
    var hours = Number(time.split(':')[0]) - 1;
    var minutes = Number(time.split(':')[1]);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate.toISOString();
  }

  private type : string = 'doctor';
    
    switchDoctor(){
      this.type = 'doctor';
      console.log('doctoro');
    }
    switchNurse(){
      this.type = 'tech';
      console.log('techo')
    }

  public onFormSubmit(): void {

    if(this.form.get('date')?.value.getTime() < new Date().getTime()) {
      this.snackBar.open('Radno vrijeme određujete se za buduće dane', 'Zatvori', {
        duration: 2000,
      });
      return;
    }

    if(this.form.get('start')?.value > this.form.get('end')?.value) {
      this.snackBar.open('Kraj radnog vremena mora biti nakon početka radnog vremena.', 'Zatvori', {
        duration: 2000,
      });
      return;
    }
   
    if (this.form.invalid) {
      this.snackBar.open('Unesite sve potrebne podatke', 'Zatvori', {
        duration: 2000,
      });
      return;
    }

    var date : Date = this.form.get('date')?.value;
    var startTime = this.form.get('start')?.value;
    var endTime = this.form.get('end')?.value;
    
    

    const data: IRangeData = {
      //doctorid: this._user$.type == 'doctor' ? this._user$.id : undefined,
      doctorid: this.type == 'doctor' ? 8 : undefined,
      //nurseid: this._user$.type == 'nurse' ? this._user$.id : undefined,
      nurseid: this.type == 'tech' ? 12 : undefined, // 16 je u timu s doktorom 8
      time_start: this.addHoursAndMinutes((date), startTime),
      time_end: this.addHoursAndMinutes((date), endTime)
    };

    console.log(data);
    
    
    const appointmentSubscription = this.appointmentService
      .addRangeAppointment(data)
      .subscribe(() => {
        this.router.navigate(['/doctor']);
      });
    this.subscription.add(appointmentSubscription);
    //this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    //this.router.navigate(['/nurse']));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public test() {
    console.log(this.form.value);
  }

  public return(){
    switch (this.type) {
      case 'doctor':
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/doctor']));
        break;
      case 'tech':
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate(['/nurse']));
        break;
    }
    
  }
}
