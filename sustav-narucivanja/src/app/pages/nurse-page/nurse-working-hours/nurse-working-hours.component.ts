import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, Subscription } from 'rxjs';
import { IRangeData } from 'src/app/interfaces/range-data';
import { AppointmentsService } from 'src/app/services/appointments/appointments.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-nurse-working-hours',
  templateUrl: './nurse-working-hours.component.html',
  styleUrls: ['./nurse-working-hours.component.scss'],
})
export class NurseWorkingHoursComponent implements OnDestroy {
  private id = this.authService.id || 0;

  private readonly subscription = new Subscription();
  private readonly trigger$ = new BehaviorSubject<any>(null);
  public medicalServices = [
    'vađenje krvi',
    'testiranje na COVID',
    'mjerenje tlaka',
    'mjerenje šećera',
    'previjanje',
  ];

  constructor(
    private readonly router: Router,
    private readonly appointmentService: AppointmentsService,
    private readonly snackBar: MatSnackBar,
    private readonly authService: AuthService
  ) {
    this.trigger$.next(null);
  }

  public form: FormGroup = new FormGroup({
    date: new FormControl('', [Validators.required]),
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
  });

  private addHoursAndMinutes(date: Date, time: string): string {
    var newDate: Date = date;
    var hours = Number(time.split(':')[0]) - 1;
    var minutes = Number(time.split(':')[1]);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate.toISOString();
  }

  public onFormSubmit(): void {
    if (this.form.get('date')?.value.getTime() < new Date().getTime()) {
      this.snackBar.open(
        'Radno vrijeme određujete se za buduće dane',
        'Zatvori',
        {
          duration: 2000,
        }
      );
      return;
    }

    if (this.form.get('start')?.value > this.form.get('end')?.value) {
      this.snackBar.open(
        'Kraj radnog vremena mora biti nakon početka radnog vremena.',
        'Zatvori',
        {
          duration: 2000,
        }
      );
      return;
    }

    if (this.form.invalid) {
      this.snackBar.open('Unesite sve potrebne podatke', 'Zatvori', {
        duration: 2000,
      });
      return;
    }

    var date: Date = this.form.get('date')?.value;
    var startTime = this.form.get('start')?.value;
    var endTime = this.form.get('end')?.value;

    const data: IRangeData = {
      doctorid: this.id,
      nurseid: undefined,
      time_start: this.addHoursAndMinutes(date, startTime),
      time_end: this.addHoursAndMinutes(date, endTime),
      type: this.form.get('type')?.value,
    };

    //console.log(data);

    const appointmentSubscription = this.appointmentService
      .addRangeAppointment(data)
      .pipe(
        catchError(() => {
          this.snackBar.open('Morate definirati raspoloživost termina 10 dana unaprijed.', 'Zatvori', {
            duration: 2000,
          });
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.router.navigate(['/nurse']);
      });
    this.subscription.add(appointmentSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public test() {
    //console.log(this.form.value);
  }
}
