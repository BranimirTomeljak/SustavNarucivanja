import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { IDoctorNurseData } from 'src/app/interfaces/doctor_nurse-data';
import { catchError, map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IRegisterData } from 'src/app/interfaces/register-data';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnDestroy {
  @Input() public type?: string;

  private readonly subscription = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  public form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    repeatedPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
    ]),
  });

  public onFormSubmit(): void {
    const data: IDoctorNurseData = {
      mail: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      name: this.form.get('name')?.value,
      surname: this.form.get('surname')?.value,
      sex: this.form.get('sex')?.value,
      dateOfBirth: this.form.get('dateOfBirth')?.value,
      phoneNumber: this.form.get('phoneNumber')?.value,
    };
    //console.log(this.form.value);

    if (
      this.form.get('password')?.value !==
      this.form.get('repeatedPassword')?.value
    ) {
      this.snackBar.open('Lozinke se moraju podudarati', 'Zatvori', {
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

    const createSubscription =
      this.type == 'doctor'
        ? this.authService
            .createDoctor(data)
            .pipe(
              catchError(() => {
                this.snackBar.open('Unesite sve potrbene podatke', 'Zatvori', {
                  duration: 2000,
                });
                return EMPTY;
              })
            )
            .subscribe(() => {
              this.router.navigate(['/admin']);
            })
        : this.authService
            .createNurse(data)
            .pipe(
              catchError(() => {
                this.snackBar.open('Unesite sve potrbene podatke', 'Zatvori', {
                  duration: 2000,
                });
                return EMPTY;
              })
            )
            .subscribe(() => {
              this.router.navigate(['/admin']);
            });
    this.subscription.add(createSubscription);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
