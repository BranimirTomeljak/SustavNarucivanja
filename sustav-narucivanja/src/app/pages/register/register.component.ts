import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { IRegisterData } from 'src/app/interfaces/register-data';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy, OnInit {
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
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(10),
    ]),
    doctor: new FormControl('', [Validators.required]),
  });

  public onFormSubmit(): void {
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

    const data: IRegisterData = {
      mail: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      name: this.form.get('name')?.value,
      surname: this.form.get('surname')?.value,
      sex: this.form.get('sex')?.value,
      phoneNumber: this.form.get('phoneNumber')?.value,
      dateOfBirth: new Date(),
      doctorId: 1,
    };

    console.log(data);

    const registerSubscription = this.authService
      .register(data)
      .pipe(
        catchError(() => {
          this.snackBar.open('Unesite sve potrbene podatke', 'Zatvori', {
            duration: 2000,
          });
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
    this.subscription.add(registerSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  myControl = new FormControl('');

  // TO DO
  // napuniti options imenima doktora iz baze
  options: string[] = [
    'Dr. One',
    'Dr. Two',
    'Dr. Three',
    'Dr. Four',
  ];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}
